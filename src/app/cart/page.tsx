'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trash2,
  ShoppingBag,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  MapPin,
  Pencil,
  CheckCircle2,
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useState, useEffect, useRef } from 'react';
import { computeShippingCost, FREE_SHIPPING_THRESHOLD } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { CheckoutForm, type CheckoutFormData } from '@/components/checkout/checkout-form';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { trackAbandonedCart } from '@/app/actions';
import { trackEcommerce, trackEvent } from '@/lib/analytics';
import { PaymentBadges } from '@/components/ui/payment-badges';

const SAVED_ADDRESS_STORAGE_KEY = 'dubainegoce_checkout_address';

function normalizeCountryCode(raw?: string): string {
  if (!raw) return 'FR';
  const upper = raw.trim().toUpperCase();
  if (['FR', 'BE', 'LU', 'NL', 'DE', 'CH'].includes(upper)) return upper;
  const lower = raw.trim().toLowerCase();
  if (lower.includes('france')) return 'FR';
  if (lower.includes('belg')) return 'BE';
  if (lower.includes('lux')) return 'LU';
  if (lower.includes('pays-bas') || lower.includes('nederland')) return 'NL';
  if (lower.includes('allemagne') || lower.includes('deutsch')) return 'DE';
  if (lower.includes('suisse') || lower.includes('schweiz')) return 'CH';
  return 'FR';
}

function isAddressComplete(addr?: Partial<CheckoutFormData> | null): addr is CheckoutFormData {
  if (!addr) return false;
  return Boolean(
    addr.email?.trim() &&
      addr.phone?.trim() &&
      addr.firstName?.trim() &&
      addr.lastName?.trim() &&
      addr.address?.trim() &&
      addr.postalCode?.trim() &&
      addr.city?.trim() &&
      addr.country?.trim()
  );
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [formCountry, setFormCountry] = useState('FR');
  const [formShippingMethod, setFormShippingMethod] = useState<'colissimo' | 'mondial-relay'>('colissimo');
  const [mainStep, setMainStep] = useState<'review-cart' | 'checkout-form'>('review-cart');
  const [savedUserAddress, setSavedUserAddress] = useState<Partial<CheckoutFormData> | null>(null);
  const lastTrackedCartSignature = useRef<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const raw = localStorage.getItem(SAVED_ADDRESS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CheckoutFormData>;
        if (parsed && typeof parsed === 'object') {
          const normalizedCountry = normalizeCountryCode(parsed.country);
          setSavedUserAddress({
            ...parsed,
            country: normalizedCountry,
            shippingMethod: 'colissimo',
          });
          setFormCountry(normalizedCountry);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Charger automatiquement l'adresse enregistrée du client connecté (profil ou dernière commande)
  useEffect(() => {
    async function loadSavedAddress() {
      if (!user || !firestore) return;
      try {
        const displayParts = (user.displayName || '').trim().split(/\s+/);
        const fallbackFirstName = displayParts[0] || '';
        const fallbackLastName = displayParts.slice(1).join(' ') || '';

        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        const saved = userData?.shippingAddress || userData?.billingAddress || null;

        let candidate: Partial<CheckoutFormData> = {
          email: user.email || saved?.email || '',
          phone: saved?.phone || userData?.phone || '',
          firstName: saved?.firstName || userData?.firstName || fallbackFirstName,
          lastName: saved?.lastName || userData?.lastName || fallbackLastName,
          address: saved?.address || saved?.address1 || saved?.line1 || '',
          postalCode: saved?.postalCode || '',
          city: saved?.city || '',
          country: normalizeCountryCode(saved?.country),
          shippingMethod: 'colissimo',
        };

        // Si le profil n'a pas encore d'adresse complète, récupérer celle de la dernière commande du client
        if (!isAddressComplete(candidate)) {
          const ordersSnap = await getDocs(
            query(collection(firestore, 'users', user.uid, 'orders'), orderBy('orderDate', 'desc'), limit(1))
          );
          if (!ordersSnap.empty) {
            const lastOrder = ordersSnap.docs[0].data();
            const orderAddr = lastOrder?.shippingAddress;
            const orderNameParts = (lastOrder?.customerName || '').trim().split(/\s+/);
            candidate = {
              email: candidate.email || lastOrder?.customerEmail || '',
              phone: candidate.phone || lastOrder?.customerPhone || '',
              firstName: candidate.firstName || orderNameParts[0] || '',
              lastName: candidate.lastName || orderNameParts.slice(1).join(' ') || '',
              address: candidate.address || orderAddr?.line1 || '',
              postalCode: candidate.postalCode || orderAddr?.postalCode || '',
              city: candidate.city || orderAddr?.city || '',
              country: normalizeCountryCode(orderAddr?.country || candidate.country),
              shippingMethod: 'colissimo',
            };
          }
        }

        setSavedUserAddress((prev) => {
          const merged: Partial<CheckoutFormData> = {
            email: candidate.email || prev?.email || '',
            phone: candidate.phone || prev?.phone || '',
            firstName: candidate.firstName || prev?.firstName || '',
            lastName: candidate.lastName || prev?.lastName || '',
            address: candidate.address || prev?.address || '',
            postalCode: candidate.postalCode || prev?.postalCode || '',
            city: candidate.city || prev?.city || '',
            country: normalizeCountryCode(candidate.country || prev?.country),
            shippingMethod: 'colissimo',
          };
          if (merged.country) setFormCountry(merged.country);
          try {
            localStorage.setItem(SAVED_ADDRESS_STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore storage errors
          }
          return merged;
        });
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
  const shippingCost = computeShippingCost(formShippingMethod, formCountry, totalItems, subtotal);
  const { total } = calculateOrderTotal(subtotal, shippingCost);

  const hasReadyAddress = isAddressComplete(savedUserAddress);

  useEffect(() => {
    if (!isClient || cart.length === 0) return;
    const cartSignature = cart.map((item) => `${item.id}:${item.quantity}`).join('|');
    if (lastTrackedCartSignature.current === cartSignature) return;
    lastTrackedCartSignature.current = cartSignature;

    trackEcommerce('view_cart', {
      value: subtotal,
      items: cart.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }, [cart, isClient, subtotal]);

  // Paiement par carte : la session Stripe est créée côté serveur, qui recalcule
  // prix, stock et frais de port, et pré-remplit le client Stripe pour éviter toute double saisie.
  const handleConfirmStripePayment = async (
    formData: CheckoutFormData,
    pickupPoint: MondialRelayPickupPoint | null
  ) => {
    setIsCheckingOut(true);

    try {
      const currentShippingCost = computeShippingCost(
        formData.shippingMethod,
        formData.country,
        totalItems,
        subtotal
      );
      const { total: orderTotal } = calculateOrderTotal(subtotal, currentShippingCost);

      trackEcommerce('add_payment_info', {
        value: orderTotal,
        payment_type: 'card',
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
      trackEvent('checkout_error', { checkout_step: 'payment_session' });
      toast({
        variant: 'destructive',
        title: 'Erreur de paiement',
        description: error.message || 'Une erreur est survenue lors de la redirection vers le paiement.',
      });
      setIsCheckingOut(false);
    }
  };

  // Clic sur le bouton principal du panier :
  // - Si le client a déjà ses coordonnées enregistrées -> redirection 1-Clic directe vers Stripe (comme Amazon) !
  // - Sinon -> affichage du formulaire unique de coordonnées.
  const handlePrimaryCheckoutClick = async () => {
    trackEcommerce('begin_checkout', {
      value: total,
      items: cart.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    if (hasReadyAddress && savedUserAddress) {
      await handleConfirmStripePayment(
        {
          ...savedUserAddress,
          shippingMethod: savedUserAddress.shippingMethod || 'colissimo',
        },
        selectedPickupPoint
      );
      return;
    }

    setMainStep('checkout-form');
  };

  // Soumission du formulaire de coordonnées : sauvegarde automatique + redirection directe vers Stripe
  const handleCheckoutFormSubmit = async (
    formData: CheckoutFormData,
    pickupPoint: MondialRelayPickupPoint | null
  ) => {
    const normalizedData: CheckoutFormData = {
      ...formData,
      country: normalizeCountryCode(formData.country),
      shippingMethod: formData.shippingMethod || 'colissimo',
    };

    setSavedUserAddress(normalizedData);
    setSelectedPickupPoint(pickupPoint);
    setFormCountry(normalizedData.country);
    setFormShippingMethod(normalizedData.shippingMethod);

    try {
      localStorage.setItem(SAVED_ADDRESS_STORAGE_KEY, JSON.stringify(normalizedData));
    } catch {
      // Ignore storage errors
    }

    const selectedShippingCost = computeShippingCost(
      normalizedData.shippingMethod,
      normalizedData.country,
      totalItems,
      subtotal
    );
    const { total: totalWithShipping } = calculateOrderTotal(subtotal, selectedShippingCost);
    trackEcommerce('add_shipping_info', {
      value: totalWithShipping,
      shipping_tier: normalizedData.shippingMethod,
      items: cart.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // Suivi panier abandonné (non bloquant)
    if (normalizedData.email && cart.length > 0) {
      trackAbandonedCart(cart, normalizedData.email, user?.uid).catch((err) =>
        console.warn('Suivi panier abandonné impossible :', err)
      );
    }

    // Mémoriser l'adresse dans le profil Firestore si le client est connecté
    if (user && firestore) {
      try {
        await setDoc(
          doc(firestore, 'users', user.uid),
          {
            firstName: normalizedData.firstName,
            lastName: normalizedData.lastName,
            phone: normalizedData.phone || '',
            shippingAddress: {
              email: normalizedData.email,
              phone: normalizedData.phone || '',
              firstName: normalizedData.firstName,
              lastName: normalizedData.lastName,
              address: normalizedData.address,
              address1: normalizedData.address,
              postalCode: normalizedData.postalCode,
              city: normalizedData.city,
              country: normalizedData.country,
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.warn("Enregistrement de l'adresse impossible :", error);
      }
    }

    // Redirection directe vers Stripe sans étape intermédiaire redondante
    await handleConfirmStripePayment(normalizedData, pickupPoint);
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
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* ÉTAPE 1 : Panier + Commande 1-Clic si adresse connue */}
      {mainStep === 'review-cart' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Votre Panier</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {totalItems} article{totalItems > 1 ? 's' : ''} sélectionné{totalItems > 1 ? 's' : ''}
            </p>
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
                  pour la <strong>livraison 100% OFFERTE</strong> !
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

          {/* Bloc Adresse Enregistrée (Style Amazon 1-Click) */}
          {hasReadyAddress && savedUserAddress && (
            <Card className="p-4 mb-6 border-accent/40 bg-[#fdfaf4] shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        Livrer à : {savedUserAddress.firstName} {savedUserAddress.lastName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" /> Achat 1-Clic prêt
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {savedUserAddress.address}, {savedUserAddress.postalCode} {savedUserAddress.city} (
                      {savedUserAddress.country})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {savedUserAddress.phone} • {savedUserAddress.email}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMainStep('checkout-form')}
                  className="shrink-0 text-xs h-8 px-2.5"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
              </div>
            </Card>
          )}

          <Card className="p-6 mb-6 shadow-sm">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:pb-0 last:border-0 items-center">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded bg-muted overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/parfum/${item.slug}`}
                      className="font-semibold text-sm hover:text-accent truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.price.toFixed(2)} € TTC l&apos;unité</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Augmenter la quantité"
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

            {/* Mode de livraison et récapitulatif transparent dès le panier */}
            <div className="mt-6 pt-5 border-t space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Mode de livraison</span>
                  <span className="text-xs text-muted-foreground font-normal">Expédition rapide 24/48h</span>
                </div>
                <div className="border border-accent bg-accent/5 ring-1 ring-accent rounded-lg p-3.5 transition-all flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-5 w-5 text-accent flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Colissimo Domicile (48h)</p>
                        <p className="text-xs text-muted-foreground">
                          Livraison rapide en boîte aux lettres avec suivi par e-mail
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {shippingCost === 0 ? (
                        <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                          OFFERT
                        </span>
                      ) : (
                        <span className="font-bold text-sm">{shippingCost.toFixed(2)} €</span>
                      )}
                    </div>
                  </div>
                  {shippingCost > 0 && remainingItemsForFreeShipping > 0 && (
                    <p className="text-[11px] text-accent mt-2 font-medium">
                      💡 Plus que {remainingItemsForFreeShipping} parfum{remainingItemsForFreeShipping > 1 ? 's' : ''}{' '}
                      pour débloquer la livraison GRATUITE (3 parfums = 0 € de livraison) !
                    </p>
                  )}
                </div>
              </div>

              {/* Récapitulatif clair TTC */}
              <div className="space-y-2 pt-3 border-t text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total articles</span>
                  <span className="font-medium text-foreground">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Livraison (Colissimo domicile 48h)</span>
                  <span className="font-medium text-foreground">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-semibold">OFFERTE</span>
                    ) : (
                      `${shippingCost.toFixed(2)} €`
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t">
                  <div>
                    <span className="font-bold text-base">Total à payer</span>
                    <span className="text-xs text-muted-foreground ml-1.5">(TVA incluse)</span>
                  </div>
                  <span className="text-xl font-extrabold text-foreground">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t">
              <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive underline">
                Vider le panier
              </button>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                Paiement 100% sécurisé
              </span>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handlePrimaryCheckoutClick}
              disabled={isCheckingOut}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base font-bold shadow-md flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span>
                  Redirection vers le paiement sécurisé...
                </>
              ) : hasReadyAddress ? (
                <>
                  <Lock className="h-5 w-5" />
                  Commander et payer maintenant • {total.toFixed(2)} €
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Commander maintenant • Total : {total.toFixed(2)} €
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <Link href="/shop/all" className="hover:underline flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" />
                Continuer mes achats
              </Link>
              {!user && (
                <Link href="/login?redirect=/cart" className="hover:underline text-accent font-medium">
                  Déjà client ? Se connecter pour commander en 1 clic
                </Link>
              )}
            </div>

            {/* Badges moyens de paiement acceptés */}
            <div className="pt-4 pb-2 border-t text-center">
              <PaymentBadges title="Paiements 100% sécurisés acceptés :" badgeClassName="h-7" />
            </div>
          </div>

          {/* Réassurance */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-accent" />
              <span>Expédition 24/48h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <span>Produits authentiques</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-5 w-5 text-accent" />
              <span>Paiement SSL sécurisé</span>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 (Uniquement pour un 1er achat ou si le client clique sur "Modifier l'adresse") */}
      {mainStep === 'checkout-form' && (
        <div className="max-w-2xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMainStep('review-cart')}
              disabled={isCheckingOut}
              className="mb-2 -ml-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour au panier
            </Button>
            <h1 className="text-3xl md:text-4xl font-headline font-bold">Adresse de livraison</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Renseignez votre adresse une seule fois : elle sera mémorisée pour vos prochaines commandes.
            </p>
          </div>

          <CheckoutForm
            onSubmit={handleCheckoutFormSubmit}
            initialData={{
              ...(savedUserAddress || {}),
              shippingMethod: formShippingMethod,
              country: formCountry,
            }}
            isLoading={isCheckingOut}
            onCountryChange={setFormCountry}
            onShippingMethodChange={setFormShippingMethod}
            onPickupPointChange={setSelectedPickupPoint}
            submitLabel={`Continuer vers le paiement sécurisé (${total.toFixed(2)} €)`}
          />
        </div>
      )}
    </div>
  );
}
