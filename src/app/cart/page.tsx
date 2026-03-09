'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { getColissimoCost, getMondialRelayCost } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, onSnapshot, DocumentData, doc, setDoc } from 'firebase/firestore';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const PERFUME_WEIGHT_G = 750;

interface CheckoutFormData {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
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

    // Validate form
    if (formData.shippingMethod === 'mondial-relay' && !pickupPoint) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un point relais',
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Calculate shipping cost
      const shippingCost =
        formData.shippingMethod === 'colissimo'
          ? getColissimoCost(totalWeight)
          : getMondialRelayCost(formData.country, totalWeight);

      // Calculate totals with VAT
      const { vat, total } = calculateOrderTotal(subtotal, shippingCost);

      // Save shipping address to user profile
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
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
        { merge: true }
      );

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

  // Calculate costs and totals
  const selectedShippingMethod = 'mondial-relay';
  const shippingCost = getMondialRelayCost('FR', totalWeight);
  const { vat, total } = calculateOrderTotal(subtotal, shippingCost);
  const isFormValid = user !== null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-headline">Finaliser votre commande</h1>
        <p className="text-muted-foreground mt-2">
          {totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Checkout Form */}
        <div className="lg:col-span-2">
          {user ? (
            <CheckoutForm onSubmit={handleCheckout} initialEmail={user.email || ''} isLoading={isCheckingOut} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Veuillez d'abord vous connecter pour continuer</p>
              <Button asChild>
                <Link href={`/login?redirect=/cart`}>Se connecter</Link>
              </Button>
            </Card>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Cart Items */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Votre panier</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b last:pb-0 last:border-0">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded bg-muted overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
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
                      <p className="text-sm font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={clearCart} className="text-xs text-accent hover:underline mt-3">
                  Vider le panier
                </button>
              </div>
            </Card>

            {/* Order Summary with VAT */}
            <OrderSummary
              items={cart}
              subtotal={subtotal}
              vat={vat}
              shipping={shippingCost}
              total={total}
              shippingMethod={selectedShippingMethod}
              selectedPickupPoint={selectedPickupPoint}
              onSubmit={() => {}}
              isLoading={isCheckingOut}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

