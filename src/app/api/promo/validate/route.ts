import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { priceOrder } from '@/lib/order-pricing';
import { resolvePromoCode } from '@/lib/promo-codes';

/** Vérifie un code promo pour l'afficher dans le panier avant le paiement. */
export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Codes promo momentanément indisponibles.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Le sous-total est recalculé depuis le catalogue, comme pour le paiement.
  const priced = priceOrder(body?.items, 'colissimo', 'FR');
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: priced.status });
  }

  try {
    const result = await resolvePromoCode(new Stripe(stripeSecretKey), body?.code, priced.subtotal);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const { code, percentOff, amountOff, label } = result.promo;
    return NextResponse.json({ code, percentOff, amountOff, label });
  } catch (error) {
    console.error('[api/promo/validate] Erreur Stripe :', error);
    return NextResponse.json({ error: 'Impossible de vérifier ce code pour le moment.' }, { status: 500 });
  }
}
