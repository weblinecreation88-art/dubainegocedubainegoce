import type Stripe from 'stripe';

/**
 * Codes promo : ils se créent dans le tableau de bord Stripe (Produits > Coupons >
 * Codes promotionnels). Le panier les vérifie ici pour afficher la réduction,
 * puis la session de paiement les applique côté Stripe : le montant encaissé
 * reste toujours calculé par Stripe.
 */

export type ResolvedPromo = {
  code: string;
  promotionCodeId: string;
  percentOff: number | null;
  amountOff: number | null; // en euros
  label: string;
};

export type PromoResult = { ok: true; promo: ResolvedPromo } | { ok: false; error: string };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Réduction appliquée sur les articles (hors frais de port), comme le fait Stripe. */
export function computePromoDiscount(promo: Pick<ResolvedPromo, 'percentOff' | 'amountOff'>, subtotal: number): number {
  if (promo.percentOff) return round2(Math.min(subtotal, (subtotal * promo.percentOff) / 100));
  if (promo.amountOff) return round2(Math.min(subtotal, promo.amountOff));
  return 0;
}

export async function resolvePromoCode(stripe: Stripe, rawCode: unknown, subtotal: number): Promise<PromoResult> {
  const code = typeof rawCode === 'string' ? rawCode.trim() : '';
  if (!code || code.length > 64) return { ok: false, error: 'Veuillez saisir un code promo.' };

  const { data } = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  const promotionCode = data[0];
  const coupon = promotionCode?.coupon;
  if (!promotionCode || !coupon || !coupon.valid) {
    return { ok: false, error: 'Ce code promo n’est pas valide ou a expiré.' };
  }
  if (coupon.amount_off && coupon.currency && coupon.currency !== 'eur') {
    return { ok: false, error: 'Ce code promo n’est pas utilisable sur cette boutique.' };
  }

  const minimum = promotionCode.restrictions?.minimum_amount;
  if (minimum && Math.round(subtotal * 100) < minimum) {
    return {
      ok: false,
      error: `Ce code est valable dès ${(minimum / 100).toFixed(2).replace('.', ',')} € d’achat.`,
    };
  }

  const percentOff = coupon.percent_off ?? null;
  const amountOff = coupon.amount_off ? coupon.amount_off / 100 : null;
  const label = percentOff
    ? `-${percentOff} %`
    : `-${(amountOff ?? 0).toFixed(2).replace('.', ',')} €`;

  return {
    ok: true,
    promo: { code: promotionCode.code, promotionCodeId: promotionCode.id, percentOff, amountOff, label },
  };
}
