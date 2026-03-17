'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, Loader2, ChevronLeft } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { getColissimoCost, getMondialRelayCost, getMondialRelayInternationalCost } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, onSnapshot, DocumentData, doc, setDoc } from 'firebase/firestore';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { PayPalCheckoutButton } from '@/components/checkout/paypal-checkout-button';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const PERFUME_WEIGHT_G = 750;

interface CheckoutFormData {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  shippingMethod: 'colissimo' | 'mondial-relay';
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [formCountry, setFormCountry] = useState('FR');
  const [formShippingMethod, setFormShippingMethod] = useState<'colissimo' | 'mondial-relay'>('mondial-relay');
  const [mainStep, setMainStep] = useState<'review-cart' | 'checkout-form' | 'review-payment'>('review-cart');
  const [lastFormData, setLastFormData] = useState<CheckoutFormData | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems = getCartCount();
  const totalWeight = totalItems * PERFUME_WEIGHT_G;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    if (!user || !firestore) {
      router.push('/login?redirect=/cart');
      return;
    }

    // Save form data
    setLastFormData(formData);
    setSelectedPickupPoint(pickupPoint);
    setFormCountry(formData.country);
    setFormShippingMethod(formData.shippingMethod);

    // Save shipping address to user profile
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          shippingAddress: {
            email: formData.email,
            phone: formData.phone || '',
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            country: formData.country,
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error saving address:', error);
    }

    // Proceed directly to payment (no review step)
    await handleConfirmPayment(formData, pickupPoint);
  };

  const handleConfirmPayment = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    if (!user || !firestore) {
      router.push('/login?redirect=/cart');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Calculate shipping cost
      let shippingCost = 0;
      if (formData.shippingMethod === 'colissimo') {
        shippingCost = getColissimoCost(totalWeight);
      } else {
        // Use international rates for all countries
        shippingCost = getMondialRelayInternationalCost(formData.country, totalWeight);
      }

      // Calculate totals (products already TTC at 35€)
      const { vat, total, shipping } = calculateOrderTotal(subtotal, shippingCost);

      // GTM Tracking
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'begin_checkout',
          ecommerce: {
            value: total,
            currency: 'EUR',
            items: cart.map((item) => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        });
      }

      // Create Stripe line items
      const lineItems = cart.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: [item.image?.startsWith('http') ? item.image : `${appUrl}${item.image}`],
            metadata: {
              productId: item.id,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Create checkout session
      const checkoutPayload: DocumentData = {
        mode: 'payment',
        line_items: lineItems,
        allow_promotion_codes: true,
        shipping_address_collection: {
          allowed_countries: ['FR', 'BE', 'LU', 'NL', 'DE', 'CH'],
        },
        invoice_creation: {
          enabled: true,
        },
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&total=${total.toFixed(2)}`,
        cancel_url: `${appUrl}/cart`,
        metadata: {
          userId: user.uid,
          email: formData.email,
          shippingMethod: formData.shippingMethod,
          pickupPointId: pickupPoint?.id || '',
          pickupPointName: pickupPoint?.name || '',
          vat: vat.toFixed(2),
          subtotal: subtotal.toFixed(2),
        },
      };

      if (formData.shippingMethod === 'colissimo' && process.env.NEXT_PUBLIC_STRIPE_SHIPPING_RATE_ID) {
        checkoutPayload.shipping_options = [{ shipping_rate: process.env.NEXT_PUBLIC_STRIPE_SHIPPING_RATE_ID }];
      }

      const checkoutSessionRef = await addDoc(
        collection(firestore, 'customers', user.uid, 'checkout_sessions'),
        checkoutPayload
      );

      const unsubscribe = onSnapshot(checkoutSessionRef, (snap) => {
        const { error, url } = snap.data() as { error?: { message: string }; url?: string };
        if (error) {
          console.error(`Stripe error: ${error.message}`);
          toast({
            variant: 'destructive',
            title: 'Erreur de paiement',
            description: error.message || 'Une erreur est survenue.',
          });
          setIsCheckingOut(false);
          unsubscribe();
        }
        if (url) {
          window.location.assign(url);
        }
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la création de la session.',
      });
      setIsCheckingOut(false);
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center bg-card p-12 rounded-lg">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline">Votre panier est vide</h2>
          <p className="text-muted-foreground mt-2 max-w-md mb-6">
            On dirait que vous n'avez pas encore ajouté de trésors olfactifs.
          </p>
          <Button asChild>
            <Link href="/shop">Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate costs and totals based on form state
  let shippingCostHT = 0;
  if (formShippingMethod === 'colissimo') {
    shippingCostHT = getColissimoCost(totalWeight);
  } else {
    shippingCostHT = getMondialRelayInternationalCost(formCountry, totalWeight);
  }
  const { vat, total, shipping } = calculateOrderTotal(subtotal, shippingCostHT);
  const isFormValid = user !== null;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* STEP 1: Review Cart */}
      {mainStep === 'review-cart' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-8">
            <h1 className="text-4xl font-headline">Votre panier</h1>
            <p className="text-muted-foreground mt-2">
              {totalItems} article{totalItems > 1 ? 's' : ''} en attente
            </p>
          </div>

          <Card className="p-6 mb-6">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pb-3 border-b last:pb-0 last:border-0">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded bg-muted overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.price}€ × {item.quantity}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        −
                      </button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                    <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
            </div>

            <button onClick={clearCart} className="text-xs text-accent hover:underline mt-4">
              Vider le panier
            </button>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/shop">Continuer les achats</Link>
            </Button>
            {user ? (
              <Button onClick={() => setMainStep('checkout-form')} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                Continuer vers la livraison
              </Button>
            ) : (
              <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/login?redirect=/cart">Se connecter</Link>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Checkout Form */}
      {mainStep === 'checkout-form' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setMainStep('review-cart')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Button>
            <h1 className="text-4xl font-headline">Informations de livraison</h1>
            <p className="text-muted-foreground mt-2">Entrez vos détails de livraison</p>
          </div>

          {user ? (
            <CheckoutForm
              onSubmit={handleCheckout}
              initialEmail={user.email || ''}
              isLoading={isCheckingOut}
              onCountryChange={setFormCountry}
              onShippingMethodChange={setFormShippingMethod}
              onPickupPointChange={setSelectedPickupPoint}
            />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Veuillez d'abord vous connecter pour continuer</p>
              <Button asChild>
                <Link href={`/login?redirect=/cart`}>Se connecter</Link>
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* STEP 3: Review & Payment */}
      {mainStep === 'review-payment' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setMainStep('checkout-form')}
              className="mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Modifier les informations
            </Button>
            <h1 className="text-4xl font-headline">Vérifier et payer</h1>
            <p className="text-muted-foreground mt-2">Vérifiez vos informations avant de procéder</p>
          </div>

          <div className="grid gap-6">
            {/* Cart Summary */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">📦 Résumé du panier</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm pb-3 border-b last:pb-0 last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Totals */}
            <OrderSummary
              items={cart}
              subtotal={subtotal}
              vat={vat}
              shipping={shipping}
              total={total}
              shippingMethod={formShippingMethod}
              shippingCostHT={shippingCostHT}
              weightG={totalWeight}
              selectedPickupPoint={selectedPickupPoint}
              onSubmit={() => {
                // Dummy onSubmit since we'll handle payment separately
              }}
              isLoading={isCheckingOut}
              isFormValid={isFormValid}
            />

            {/* Payment Actions */}
            <div className="space-y-3 mt-8">
              {/* Bouton Stripe */}
              <Button
                onClick={() => {
                  if (lastFormData) {
                    handleConfirmPayment(lastFormData, selectedPickupPoint);
                  }
                }}
                disabled={isCheckingOut || !lastFormData}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  '💳 Payer par carte bancaire'
                )}
              </Button>

              {/* Séparateur */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Bouton PayPal */}
              <PayPalCheckoutButton
                items={cart}
                total={total}
                shippingCost={shippingCostHT}
                disabled={!lastFormData}
                onSuccess={(orderId) => {
                  router.push(`/checkout/success?paypal_order=${orderId}&total=${total.toFixed(2)}`);
                }}
              />

              {/* Retour */}
              <Button
                variant="ghost"
                onClick={() => setMainStep('checkout-form')}
                disabled={isCheckingOut}
                className="w-full text-muted-foreground"
              >
                ← Modifier les informations
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

