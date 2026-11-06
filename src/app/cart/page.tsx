'use client';

import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Lock, Loader2, Store, Truck } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { useState, useEffect, useRef } from 'react';
import { computeShippingCost, FREE_SHIPPING_MIN_ITEMS, FREE_SHIPPING_THRESHOLD } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';
import { CheckoutForm, type CheckoutFormData } from '@/components/checkout/checkout-form';
import { calculateOrderTotal } from '@/lib/checkout-utils';
import type { MondialRelayPickupPoint } from '@/lib/mondial-relay';
import { trackAbandonedCart } from '@/app/actions';
import { trackEcommerce, trackEvent } from '@/lib/analytics';
import { PaymentBadges } from '@/components/ui/payment-badges';
import { computePromoDiscount, type ResolvedPromo } from '@/lib/promo-codes';

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
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Omit<ResolvedPromo, 'promotionCodeId'> | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<MondialRelayPickupPoint | null>(null);
  const [formCountry, setFormCountry] = useState('FR');
  const [formShippingMethod, setFormShippingMethod] = useState<'colissimo' | 'mondial-relay'>('mondial-relay');
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
            shippingMethod: parsed.shippingMethod || 'mondial-relay',
          });
          setFormCountry(normalizedCountry);
          if (parsed.shippingMethod) {
            setFormShippingMethod(parsed.shippingMethod);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Charger automatiquement l'adresse enregistrée du client connecté
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

        let lastOrderAddress: any = null;
        if (!saved) {
          try {
            const ordersSnap = await getDocs(
              query(
                collection(firestore, 'users', user.uid, 'orders'),
                orderBy('orderDate', 'desc'),
                limit(1)
              )
            );
            if (!ordersSnap.empty) {
              const lastOrder = ordersSnap.docs[0].data();
              lastOrderAddress = lastOrder?.shippingAddress || null;
            }
          } catch (orderErr) {
            console.warn("Lecture de la dernière commande impossible :", orderErr);
          }
        }

        const source = saved || lastOrderAddress;
        if (!source && !user.email) return;

        setSavedUserAddress((prev) => {
          const rawCountry = source?.country || prev?.country || 'FR';
          const normalizedCountry = normalizeCountryCode(rawCountry);
          const merged: Partial<CheckoutFormData> = {
            email: user.email || source?.email || prev?.email || '',
            phone: source?.phone || prev?.phone || '',
            firstName: source?.firstName || prev?.firstName || fallbackFirstName,
            lastName: source?.lastName || prev?.lastName || fallbackLastName,
            address: source?.address || source?.line1 || prev?.address || '',
            postalCode: source?.postalCode || prev?.postalCode || '',
            city: source?.city || prev?.city || '',
            country: normalizedCountry,
            shippingMethod: prev?.shippingMethod || formShippingMethod,
          };
          setFormCountry(normalizedCountry);
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
  }, [user, firestore, formShippingMethod]);

  const totalItems = getCartCount();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Jauge de livraison offerte (gratuite dès FREE_SHIPPING_MIN_ITEMS parfums en France)
  const remainingItemsForFreeShipping = Math.max(0, FREE_SHIPPING_MIN_ITEMS - totalItems);
  const freeShippingProgress = Math.min(100, Math.round((totalItems / FREE_SHIPPING_MIN_ITEMS) * 100));

  // Tarifs transparents calculés dès le panier et synchronisés avec le paiement
  const mondialRelayCost = computeShippingCost('mondial-relay', formCountry, totalItems, subtotal);
  const colissimoCost = computeShippingCost('colissimo', formCountry, totalItems, subtotal);
  const shippingCost = formShippingMethod === 'colissimo' ? colissimoCost : mondialRelayCost;
  const { total: totalBeforeDiscount } = calculateOrderTotal(subtotal, shippingCost);
  // Réduction indicative : Stripe recalcule et applique le code au moment du paiement.
  const promoDiscount = appliedPromo ? computePromoDiscount(appliedPromo, subtotal) : 0;
  const total = Math.round((totalBeforeDiscount - promoDiscount) * 100) / 100;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsCheckingPromo(true);
    setPromoError('');
    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput,
          items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Code promo invalide.');
      setAppliedPromo(result);
      setPromoInput('');
      trackEvent('promo_code_applied', { promo_code: result.code });
    } catch (error: any) {
      setAppliedPromo(null);
      setPromoError(error.message || 'Code promo invalide.');
    } finally {
      setIsCheckingPromo(false);
    }
  };

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

  // Paiement par carte : la session Stripe est créée côté serveur
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
      const { total: orderTotalBeforeDiscount } = calculateOrderTotal(subtotal, currentShippingCost);
      const orderTotal = Math.round((orderTotalBeforeDiscount - promoDiscount) * 100) / 100;

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
          promoCode: appliedPromo?.code,
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
          shippingMethod: savedUserAddress.shippingMethod || formShippingMethod,
        },
        selectedPickupPoint
      );
      return;
    }

    setMainStep('checkout-form');
  };

  const handleCheckoutFormSubmit = async (
    formData: CheckoutFormData,
    pickupPoint: MondialRelayPickupPoint | null
  ) => {
    const normalizedData: CheckoutFormData = {
      ...formData,
      country: normalizeCountryCode(formData.country),
      shippingMethod: formData.shippingMethod || formShippingMethod,
    };

    const effectivePickupPoint = pickupPoint || selectedPickupPoint;

    setSavedUserAddress(normalizedData);
    setSelectedPickupPoint(effectivePickupPoint);
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

    await handleConfirmStripePayment(normalizedData, effectivePickupPoint);
  };

  const formatEuro = (value: number) => `${value.toFixed(2).replace('.', ',')} €`;

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b border-[#1d1a16] mx-auto" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center">
        <div className="container mx-auto px-6 py-20 text-center max-w-lg">
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-3">Panier</p>
          <h1 className="font-headline font-normal text-4xl sm:text-5xl text-[#1d1a16] mb-4">Votre sélection est vide</h1>
          <p className="text-sm text-[#5d564c] leading-relaxed mb-8">
            Parcourez notre collection pour découvrir les grands classiques de la parfumerie orientale.
          </p>
          <Link
            href="/shop/all"
            className="inline-flex items-center justify-center bg-[#1d1a16] hover:bg-[#332e27] text-white px-8 py-3.5 text-xs uppercase tracking-[0.14em] transition-colors"
          >
            Découvrir nos parfums
          </Link>
        </div>
      </div>
    );
  }

  const isCartStep = mainStep === 'review-cart';

  const orderSummary = (
    <div className="bg-[#faf7f2] border border-[#e6ded1] p-6 sm:p-8">
      <h2 className="font-headline font-normal text-[30px] leading-none text-[#1d1a16] mb-6">Votre commande</h2>

      <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-[#6f6559] pb-3 border-b border-[#1d1a16]/20">
        <span>Produit</span>
        <span>Sous-total</span>
      </div>
      <div className="divide-y divide-[#e6ded1]">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 py-3.5 text-[13px]">
            <span className="text-[#4a443c] min-w-0">
              {item.name} <span className="text-[#1d1a16]">× {item.quantity}</span>
            </span>
            <span className="font-medium text-[#1d1a16] whitespace-nowrap">{formatEuro(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-[#1d1a16]/20 text-[13px]">
        <div className="flex justify-between">
          <span className="text-[#4a443c]">Sous-total</span>
          <span className="font-medium text-[#1d1a16]">{formatEuro(subtotal)}</span>
        </div>
        {appliedPromo && (
          <div className="flex justify-between gap-4">
            <span className="text-[#4a443c]">
              Code <span className="uppercase text-[#1d1a16]">{appliedPromo.code}</span> ({appliedPromo.label}){' '}
              <button
                type="button"
                onClick={() => setAppliedPromo(null)}
                className="ml-1 text-[11px] text-[#6f6559] underline underline-offset-2 hover:text-red-700"
              >
                Retirer
              </button>
            </span>
            <span className="font-medium text-[#4f7a4a] whitespace-nowrap">−{formatEuro(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="text-[#4a443c]">
            Livraison · {formShippingMethod === 'mondial-relay' ? 'Mondial Relay' : 'Colissimo domicile 48 h'}
          </span>
          <span className="font-medium text-[#1d1a16] whitespace-nowrap">
            {shippingCost === 0 ? 'Offerte' : formatEuro(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-[#1d1a16]/20">
          <span className="text-[#1d1a16]">
            Total <span className="text-[11px] text-[#6f6559]">TVA incluse</span>
          </span>
          <span className="text-xl font-medium text-[#1d1a16]">{formatEuro(total)}</span>
        </div>
      </div>

      {!appliedPromo && (
        <form onSubmit={handleApplyPromo} className="mt-6">
          <label htmlFor="promo-code" className="block text-[10px] uppercase tracking-[0.16em] text-[#6f6559] mb-2">
            Code promo
          </label>
          <div className="flex">
            <input
              id="promo-code"
              type="text"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError('');
              }}
              placeholder="Saisissez votre code"
              autoComplete="off"
              className="flex-1 min-w-0 h-11 px-3 border border-[#d9cfbf] border-r-0 bg-white text-sm uppercase placeholder:normal-case placeholder:text-[#9a9186] focus:outline-none focus:border-[#1d1a16]"
            />
            <button
              type="submit"
              disabled={isCheckingPromo || !promoInput.trim()}
              className="h-11 px-4 border border-[#1d1a16] text-[11px] uppercase tracking-[0.14em] text-[#1d1a16] hover:bg-[#1d1a16] hover:text-white disabled:opacity-50 transition-colors"
            >
              {isCheckingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Appliquer'}
            </button>
          </div>
          {promoError && <p className="mt-2 text-xs text-red-700">{promoError}</p>}
        </form>
      )}

      {isCartStep && (
        <>
          <button
            type="button"
            onClick={handlePrimaryCheckoutClick}
            disabled={isCheckingOut}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#b8955f] hover:bg-[#a8834f] disabled:opacity-60 text-[#1d1a16] h-[52px] text-xs uppercase tracking-[0.14em] transition-colors font-medium shadow-sm"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirection vers le paiement…
              </>
            ) : hasReadyAddress ? (
              <>
                <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
                Payer maintenant
              </>
            ) : (
              'Commander'
            )}
          </button>
          {!user && (
            <p className="mt-4 text-center text-xs text-[#6f6559]">
              Déjà client ?{' '}
              <Link href="/login?redirect=/cart" className="text-[#1d1a16] underline underline-offset-4">
                Se connecter pour commander en 1 clic
              </Link>
            </p>
          )}
        </>
      )}

      <div className="mt-7 pt-6 border-t border-[#e6ded1]">
        <PaymentBadges showTitle={false} badgeClassName="h-6" />
        <p className="mt-4 text-[11px] text-[#6f6559] leading-relaxed">
          Paiement sécurisé par Stripe. Flacons neufs scellés, retour possible sous 14 jours. Une question ? 07 58 99 97 26.
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* EN-TÊTE ÉDITORIAL + ÉTAPES */}
      <div className="bg-[#f3ede3]">
        <div className="container mx-auto px-5 sm:px-6 max-w-6xl pt-10 pb-8 sm:pt-14 sm:pb-10">
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-4">Dubaï Négoce</p>
          <h1 className="font-headline font-normal text-[44px] sm:text-6xl leading-[1.02] text-[#1d1a16] mb-4">
            {isCartStep ? 'Votre panier.' : 'Votre commande.'}
          </h1>
          <p className="text-sm text-[#5d564c] leading-relaxed max-w-lg mb-8">
            {isCartStep
              ? `${totalItems} parfum${totalItems > 1 ? 's' : ''} sélectionné${totalItems > 1 ? 's' : ''}. Vérifiez votre sélection avant de commander.`
              : 'Renseignez vos coordonnées et choisissez votre mode de livraison.'}
          </p>
          <ol className="flex gap-8 text-xs">
            <li>
              <button
                type="button"
                onClick={() => setMainStep('review-cart')}
                disabled={isCheckingOut}
                className={`pb-2 border-b ${isCartStep ? 'border-[#1d1a16] text-[#1d1a16]' : 'border-transparent text-[#6f6559] hover:text-[#1d1a16]'}`}
              >
                <span className="text-[#6f6559] mr-2">01</span>Panier
              </button>
            </li>
            <li>
              <span className={`inline-block pb-2 border-b ${!isCartStep ? 'border-[#1d1a16] text-[#1d1a16]' : 'border-transparent text-[#6f6559]'}`}>
                <span className="text-[#6f6559] mr-2">02</span>Commande
              </span>
            </li>
          </ol>
        </div>
      </div>

      <div className="container mx-auto px-5 sm:px-6 max-w-6xl py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 min-w-0">
            {isCartStep ? (
              <>
                {/* Jauge de livraison offerte */}
                <div className="mb-8">
                  <p className="text-[13px] text-[#4a443c] mb-3">
                    {remainingItemsForFreeShipping > 0 ? (
                      <>
                        Plus que{' '}
                        <span className="text-[#1d1a16] font-medium">
                          {remainingItemsForFreeShipping} parfum{remainingItemsForFreeShipping > 1 ? 's' : ''}
                        </span>{' '}
                        pour profiter de la livraison offerte.
                      </>
                    ) : (
                      <span className="text-[#1d1a16] font-medium text-green-700">✓ La livraison vous est offerte.</span>
                    )}
                  </p>
                  <div className="w-full bg-[#ebe3d6] h-[3px] overflow-hidden">
                    <div
                      className="bg-[#a8834f] h-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Adresse enregistrée : commande en 1 clic */}
                {hasReadyAddress && savedUserAddress && (
                  <div className="mb-8 p-5 border border-[#e6ded1] flex items-start justify-between gap-4">
                    <div className="text-[13px] space-y-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#6f6559] mb-2">Livraison à</p>
                      <p className="text-[#1d1a16]">
                        {savedUserAddress.firstName} {savedUserAddress.lastName}
                      </p>
                      <p className="text-[#5d564c]">
                        {savedUserAddress.address}, {savedUserAddress.postalCode} {savedUserAddress.city} ({savedUserAddress.country})
                      </p>
                      <p className="text-[#6f6559] text-xs">
                        {savedUserAddress.phone} · {savedUserAddress.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMainStep('checkout-form')}
                      className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-[#1d1a16] border-b border-[#1d1a16]/40 hover:border-[#1d1a16] pb-0.5"
                    >
                      Modifier
                    </button>
                  </div>
                )}

                {/* Articles */}
                <div className="border-t border-[#1d1a16]/20">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 sm:gap-6 py-6 border-b border-[#e6ded1]">
                      <Link href={`/parfum/${item.slug}`} className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-[#f3ede3] overflow-hidden">
                        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-2 mix-blend-multiply" />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between gap-4">
                          <Link
                            href={`/parfum/${item.slug}`}
                            className="font-headline text-[22px] leading-tight text-[#1d1a16] hover:text-[#a8834f] transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm font-medium text-[#1d1a16] whitespace-nowrap">
                            {formatEuro(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className="text-xs text-[#6f6559] mt-1">{formatEuro(item.price)} l&apos;unité</p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center border border-[#e6ded1]">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-9 h-9 flex items-center justify-center text-[#6f6559] hover:text-[#1d1a16]"
                              aria-label="Diminuer la quantité"
                            >
                              −
                            </button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center text-[#6f6559] hover:text-[#1d1a16]"
                              aria-label="Augmenter la quantité"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-[#6f6559] hover:text-red-700 underline underline-offset-4 transition-colors"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 text-xs">
                  <Link href="/shop/all" className="inline-flex items-center gap-1 text-[#1d1a16] hover:text-[#a8834f]">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Continuer mes achats
                  </Link>
                  <button onClick={clearCart} className="text-[#6f6559] hover:text-red-700 underline underline-offset-4">
                    Vider le panier
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-7">
                  <h2 className="font-headline font-normal text-[32px] leading-none text-[#1d1a16]">Détails de livraison</h2>
                  <button
                    type="button"
                    onClick={() => setMainStep('review-cart')}
                    className="text-xs text-[#6f6559] hover:text-[#1d1a16] flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Retour au panier
                  </button>
                </div>
                <CheckoutForm
                  onSubmit={handleCheckoutFormSubmit}
                  initialData={{
                    ...(savedUserAddress || {}),
                    shippingMethod: formShippingMethod,
                    country: formCountry,
                  }}
                  isLoading={isCheckingOut}
                  mondialRelayCost={mondialRelayCost}
                  colissimoCost={colissimoCost}
                  onCountryChange={setFormCountry}
                  onShippingMethodChange={setFormShippingMethod}
                  onPickupPointChange={setSelectedPickupPoint}
                  submitLabel={`Payer ma commande · ${formatEuro(total)}`}
                />
              </>
            )}
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28">{orderSummary}</aside>
        </div>
      </div>
    </div>
  );
}
