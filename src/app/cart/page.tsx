'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ChevronLeft, ShieldCheck, Truck, Lock, ArrowRight } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getColissimoCost, getMondialRelayInternationalCost } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CheckoutForm, CheckoutFormData } from '@/components/checkout/checkout-form';
import { OrderSummary } from '@/components/checkout/order-summary';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { PayPalCheckoutButton } from '@/components/checkout/paypal-checkout-button';
import { trackAbandonedCart } from '@/app/actions';

const PERFUME_WEIGHT_G = 750;
const FREE_SHIPPING_THRESHOLD = 60; // Livraison offerte dès 60€

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
  const [savedUserAddress, setSavedUserAddress] = useState<Partial<CheckoutFormData> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Charger l'adresse enregistrée si l'utilisateur est connecté
  useEffect(() => {
    async function loadSavedAddress() {
      if (user && firestore) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.shippingAddress) {
              setSavedUserAddress({
                email: user.email || data.shippingAddress.email || '',
                phone: data.shippingAddress.phone || '',
                firstName: data.shippingAddress.firstName || '',
                lastName: data.shippingAddress.lastName || '',
                address: data.shippingAddress.address || '',
                postalCode: data.shippingAddress.postalCode || '',
                city: data.shippingAddress.city || '',
                country: data.shippingAddress.country || 'FR',
              });
            }
          }
        } catch (e) {
          console.warn('Could not load saved address:', e);
        }
      }
    }
    loadSavedAddress();
  }, [user, firestore]);

  const totalItems = getCartCount();
  const totalWeight = totalItems * PERFUME_WEIGHT_G;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Barre de progression pour la livraison gratuite
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Étape 2 validée : enregistrement des infos et passage au paiement
  const handleCheckoutFormSubmit = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    setLastFormData(formData);
    setSelectedPickupPoint(pickupPoint);
    setFormCountry(formData.country);
    setFormShippingMethod(formData.shippingMethod);

    // Synchronisation panier abandonné (non bloquante)
    if (formData.email && cart.length > 0) {
      trackAbandonedCart(cart, formData.email, user?.uid).catch((err) =>
        console.warn('Abandoned cart sync error:', err)
      );
    }

    // Sauvegarder dans le profil si connecté
    if (user && firestore) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            id: user.uid,
            shippingAddress: {
              email: formData.email,
              phone: formData.phone || '',
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              postalCode: formData.postalCode,
              city: formData.city,
              country: formData.country,
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.warn('Error saving user address:', error);
      }
    }

    // Passer directement à l'étape Paiement
    setMainStep('review-payment');
  };

  // Paiement Stripe direct via l'API côté serveur
  const handleConfirmStripePayment = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    setIsCheckingOut(true);

    try {
      let shippingCost = 0;
      if (formData.shippingMethod === 'colissimo') {
        shippingCost = getColissimoCost(totalWeight);
      } else {
        shippingCost = getMondialRelayInternationalCost(formData.country, totalWeight);
      }

      const { vat, total, shipping } = calculateOrderTotal(subtotal, shippingCost);

      // GTM Tracking (begin_checkout)
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

      // Appel API Next.js direct
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: formData.email,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country,
            phone: formData.phone,
          },
          shippingMethod: formData.shippingMethod,
          shippingCost: shipping,
          total: total.toFixed(2),
          pickupPoint,
          userId: user?.uid || 'guest',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Impossible de créer la session de paiement.');
      }

      // Redirection immédiate vers Stripe Checkout
      window.location.assign(data.url);
    } catch (error: any) {
      console.error('Stripe Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de paiement',
        description: error.message || 'Une erreur est survenue lors de la redirection vers le paiement.',
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
        <div className="flex flex-col items-center justify-center text-center bg-card p-12 rounded-lg max-w-lg mx-auto border shadow-sm">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline font-bold">Votre panier est vide</h2>
          <p className="text-muted-foreground mt-2 max-w-md mb-6 text-sm">
            Découvrez nos parfums de Dubaï authentiques et laissez-vous tenter par nos créations d'exception.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop/all">Explorer la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calcul dynamique des totaux
  let shippingCostHT = 0;
  if (formShippingMethod === 'colissimo') {
    shippingCostHT = getColissimoCost(totalWeight);
  } else {
    shippingCostHT = getMondialRelayInternationalCost(formCountry, totalWeight);
  }
  const { vat, total, shipping } = calculateOrderTotal(subtotal, shippingCostHT);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* STEP 1: Review Cart */}
      {mainStep === 'review-cart' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Votre Panier</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems} article{totalItems > 1 ? 's' : ''} sélectionné{totalItems > 1 ? 's' : ''}
            </p>
          </div>

          {/* Jauge de livraison gratuite */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-xs md:text-sm font-medium mb-2">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Plus que <strong className="text-accent">{remainingForFreeShipping.toFixed(2)} €</strong> pour la{' '}
                  <strong>Livraison Offerte</strong> !
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  🎉 Félicitations ! Vous bénéficiez de la livraison offerte !
                </span>
              )}
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <Card className="p-6 mb-6 shadow-sm">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:pb-0 last:border-0 items-center">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded bg-muted overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/parfum/${item.slug}`} className="font-semibold text-sm hover:text-accent truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.price.toFixed(2)} € TTC l'unité
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Diminuer quantité"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Augmenter quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-20">
                    <p className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} €</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      title="Supprimer du panier"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total (TTC)</span>
                <span className="font-semibold">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Frais de livraison</span>
                <span>Calculés à l'étape suivante</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t">
              <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive underline">
                Vider le panier
              </button>
              <span className="text-xs text-muted-foreground">Paiement 100% Sécurisé</span>
            </div>
          </Card>

          {/* Boutons d'action principaux */}
          <div className="space-y-3">
            <Button
              onClick={() => setMainStep('checkout-form')}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base font-bold shadow-md flex items-center justify-center gap-2"
            >
              Commander maintenant ({subtotal.toFixed(2)} €)
              <ArrowRight className="h-5 w-5" />
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <Link href="/shop/all" className="hover:underline flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" />
                Continuer mes achats
              </Link>
              {!user && (
                <Link href="/login?redirect=/cart" className="hover:underline text-accent">
                  Déjà un compte ? Se connecter
                </Link>
              )}
            </div>
          </div>

          {/* Badges de réassurance */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-accent" />
              <span>Expédition 24/48h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span>100% Authentique</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-5 w-5 text-accent" />
              <span>Paiement SSL Sécurisé</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Checkout Form (Guest + Logged in) */}
      {mainStep === 'checkout-form' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => setMainStep('review-cart')} className="mb-2 -ml-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour au panier
            </Button>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Informations de livraison</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Saisissez vos coordonnées pour l'expédition de votre commande
            </p>
          </div>

          <CheckoutForm
            onSubmit={handleCheckoutFormSubmit}
            initialEmail={user?.email || ''}
            initialData={savedUserAddress || undefined}
            isLoading={isCheckingOut}
            onCountryChange={setFormCountry}
            onShippingMethodChange={setFormShippingMethod}
            onPickupPointChange={setSelectedPickupPoint}
          />
        </div>
      )}

      {/* STEP 3: Review & Payment */}
      {mainStep === 'review-payment' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => setMainStep('checkout-form')} className="mb-2 -ml-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Modifier mes informations
            </Button>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Paiement Sécurisé</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Choisissez votre moyen de paiement sécurisé pour finaliser
            </p>
          </div>

          <div className="grid gap-6">
            {/* Résumé de la commande */}
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
                if (lastFormData) handleConfirmStripePayment(lastFormData, selectedPickupPoint);
              }}
              isLoading={isCheckingOut}
              isFormValid={!!lastFormData}
            />

            {/* Séparateur */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">ou payer instantanément avec</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Bouton PayPal avec données complètes */}
            <PayPalCheckoutButton
              items={cart}
              total={total}
              shippingCost={shipping}
              customerInfo={lastFormData}
              shippingMethod={formShippingMethod}
              pickupPoint={selectedPickupPoint}
              userId={user?.uid || 'guest'}
              disabled={!lastFormData}
              onSuccess={(orderId) => {
                router.push(`/checkout/success?session_id=${orderId}&total=${total.toFixed(2)}`);
              }}
            />

            {/* Retour */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMainStep('checkout-form')}
              disabled={isCheckingOut}
              className="w-full text-muted-foreground"
            >
              ← Modifier l'adresse ou le mode de livraison
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
