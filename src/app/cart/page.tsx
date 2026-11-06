'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ChevronLeft, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useState, useEffect } from 'react';
import { computeShippingCost, FREE_SHIPPING_THRESHOLD } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CheckoutForm, type CheckoutFormData } from '@/components/checkout/checkout-form';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { trackAbandonedCart } from '@/app/actions';
import { trackEcommerce } from '@/lib/analytics';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [formCountry, setFormCountry] = useState('FR');
  const [formShippingMethod, setFormShippingMethod] = useState<'colissimo' | 'mondial-relay'>('mondial-relay');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [savedUserAddress, setSavedUserAddress] = useState<Partial<CheckoutFormData> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pré-remplir avec l'adresse enregistrée si le client est connecté
  useEffect(() => {
    async function loadSavedAddress() {
      if (!user || !firestore) return;
      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const saved = userDoc.exists() ? userDoc.data()?.shippingAddress : null;
        if (saved) {
          setSavedUserAddress({
            email: user.email || saved.email || '',
            phone: saved.phone || '',
            firstName: saved.firstName || '',
            lastName: saved.lastName || '',
            address: saved.address || '',
            postalCode: saved.postalCode || '',
            city: saved.city || '',
            country: saved.country || 'FR',
          });
        }
      } catch (e) {
        console.warn('Adresse enregistrée illisible :', e);
      }
    }
    loadSavedAddress();
  }, [user, firestore]);

  const totalItems = getCartCount();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Jauge de livraison offerte (Gratuit dès 3 parfums en France)
  const remainingItemsForFreeShipping = Math.max(0, 3 - totalItems);
  const freeShippingProgress = Math.min(100, Math.round((totalItems / 3) * 100));

  // Tarifs transparents calculés dès le panier et synchronisés avec le paiement
  const mondialRelayCost = computeShippingCost('mondial-relay', formCountry, totalItems, subtotal);
  const colissimoCost = computeShippingCost('colissimo', formCountry, totalItems, subtotal);
  const shippingCost = formShippingMethod === 'colissimo' ? colissimoCost : mondialRelayCost;
  const { total } = calculateOrderTotal(subtotal, shippingCost);

  // Validation directe : enregistre l'adresse / panier abandonné et ouvre immédiatement Stripe Checkout !
  const handleCheckoutFormSubmit = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    setFormCountry(formData.country);
    setFormShippingMethod(formData.shippingMethod);
    const effectivePickupPoint = pickupPoint || selectedPickupPoint;

    // Suivi panier abandonné, y compris pour les invités (non bloquant)
    if (formData.email && cart.length > 0) {
      trackAbandonedCart(cart, formData.email, user?.uid).catch((err) =>
        console.warn('Suivi panier abandonné impossible :', err)
      );
    }

    // Mémoriser l'adresse dans le profil si le client est connecté
    if (user && firestore) {
      try {
        await setDoc(
          doc(firestore, 'users', user.uid),
          {
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
        console.warn("Enregistrement de l'adresse impossible :", error);
      }
    }

    // Redirection directe vers Stripe Checkout sans écran intermédiaire inutile
    await handleConfirmStripePayment(formData, effectivePickupPoint);
  };

  const handleConfirmStripePayment = async (formData: CheckoutFormData, pickupPoint: MondialRelayPickupPoint | null) => {
    setIsCheckingOut(true);

    try {
      const currentShippingCost = computeShippingCost(formData.shippingMethod, formData.country, totalItems, subtotal);
      const { total: finalTotal } = calculateOrderTotal(subtotal, currentShippingCost);

      trackEcommerce('begin_checkout', {
        value: finalTotal,
        items: cart.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer: {
            email: formData.email,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            postalCode: formData.postalCode,
            city: formData.city,
            country: formData.country,
            shippingMethod: formData.shippingMethod || formShippingMethod,
          },
          pickupPoint: pickupPoint
            ? {
                id: pickupPoint.id,
                name: pickupPoint.name,
                address: pickupPoint.address,
                postalCode: pickupPoint.postalCode,
                city: pickupPoint.city,
              }
            : null,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Impossible de démarrer le paiement.');
      }

      window.location.assign(result.url);
    } catch (error: any) {
      console.error('Checkout error:', error);
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
            Découvrez nos parfums de Dubaï et laissez-vous tenter par nos créations d&apos;exception.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop/all">Explorer la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Finaliser ma commande</h1>
          <p className="text-muted-foreground text-sm">
            Commande rapide en 1 étape — {totalItems} article{totalItems > 1 ? 's' : ''} dans votre panier
          </p>
        </div>
        <Link href="/shop/all" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Continuer mes achats
        </Link>
      </div>

      {/* Jauge de livraison offerte */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-xs md:text-sm font-medium mb-2">
          {remainingItemsForFreeShipping > 0 ? (
            <span>
              Plus que{' '}
              <strong className="text-accent font-bold">
                {remainingItemsForFreeShipping} parfum{remainingItemsForFreeShipping > 1 ? 's' : ''}
              </strong>{' '}
              pour la <strong>livraison Colissimo 100% OFFERTE</strong> !
              {totalItems === 2 && (
                <span className="block sm:inline sm:ml-1 text-xs text-accent font-semibold">
                  (Économisez 9,59 € de frais de port)
                </span>
              )}
            </span>
          ) : (
            <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
              🎉 Félicitations : Livraison Colissimo 100% OFFERTE sur votre commande !
            </span>
          )}
          <span className="font-bold text-xs">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Layout 1 seule page : Panier à gauche + Livraison & Paiement direct à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLONNE GAUCHE : Récapitulatif du panier */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="font-bold text-base">Votre Panier ({totalItems})</h2>
              <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive underline">
                Vider
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b last:pb-0 last:border-0 items-center">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded bg-muted overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/parfum/${item.slug}`} className="font-semibold text-sm hover:text-accent truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.price.toFixed(2)} € TTC l&apos;unité</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-16">
                    <p className="font-bold text-sm">{(item.price * item.quantity).toFixed(2)} €</p>
                    <button
                      type="button"
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

            <div className="space-y-2 pt-4 mt-4 border-t text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total articles</span>
                <span className="font-medium text-foreground">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>
                  {formShippingMethod === 'mondial-relay'
                    ? 'Livraison Mondial Relay (Point / Locker)'
                    : 'Livraison Colissimo Domicile (48h)'}
                </span>
                <span className="font-medium text-foreground">
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-semibold">OFFERTE</span>
                  ) : (
                    `${shippingCost.toFixed(2)} €`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t">
                <div>
                  <span className="font-bold text-base">Total à payer</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(TVA incluse)</span>
                </div>
                <span className="text-xl font-extrabold text-accent">{total.toFixed(2)} €</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground bg-card border rounded-lg p-3">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-accent" />
              <span>Colissimo 48h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>100% Authentique</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-4 w-4 text-accent" />
              <span>Stripe SSL</span>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Formulaire d'expédition + Bouton direct vers Stripe */}
        <div className="lg:col-span-7" id="checkout-express">
          <CheckoutForm
            onSubmit={handleCheckoutFormSubmit}
            initialData={{
              ...(savedUserAddress || {}),
              shippingMethod: formShippingMethod,
              country: formCountry,
            }}
            isLoading={isCheckingOut}
            totalAmount={total}
            shippingCost={shippingCost}
            mondialRelayCost={mondialRelayCost}
            colissimoCost={colissimoCost}
            onCountryChange={setFormCountry}
            onShippingMethodChange={setFormShippingMethod}
            onPickupPointChange={setSelectedPickupPoint}
          />
        </div>
      </div>
    </div>
  );
}
