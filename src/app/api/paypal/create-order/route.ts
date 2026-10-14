import { NextRequest, NextResponse } from 'next/server';
import { PAYPAL_BASE, getPayPalAccessToken } from '@/lib/paypal';
import { priceOrder } from '@/lib/order-pricing';

export const dynamic = 'force-dynamic';

/**
 * Cree une commande PayPal pour le panier.
 *
 * POST { items: [{ id, quantity }], shippingMethod, country }
 * Le montant est recalcule ici depuis le catalogue (prix, stock, frais de port) :
 * le navigateur ne fixe jamais le prix.
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const priced = priceOrder(body?.items, body?.shippingMethod, body?.country);
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: priced.status });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const breakdown: Record<string, { currency_code: string; value: string }> = {
      item_total: { currency_code: 'EUR', value: priced.subtotal.toFixed(2) },
    };
    if (priced.shippingCost > 0) {
      breakdown.shipping = { currency_code: 'EUR', value: priced.shippingCost.toFixed(2) };
    }

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `Commande Dubai Négoce (${priced.totalQuantity} article${priced.totalQuantity > 1 ? 's' : ''})`,
            amount: {
              currency_code: 'EUR',
              value: priced.total.toFixed(2),
              breakdown,
            },
            items: priced.lines.map(({ product, quantity }) => ({
              name: product.name.slice(0, 127),
              sku: product.id,
              quantity: String(quantity),
              unit_amount: { currency_code: 'EUR', value: product.price.toFixed(2) },
              category: 'PHYSICAL_GOODS',
            })),
          },
        ],
        application_context: {
          brand_name: 'Dubai Négoce',
          locale: 'fr-FR',
          // L'adresse de livraison est saisie sur le site (formulaire de commande).
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[PayPal create-order] Erreur :', err);
      return NextResponse.json({ error: 'Erreur lors de la création de la commande PayPal.' }, { status: 502 });
    }

    const order = await res.json();
    return NextResponse.json({ id: order.id, total: priced.total });
  } catch (err: any) {
    console.error('[PayPal create-order] Exception :', err);
    return NextResponse.json({ error: err?.message || 'Erreur serveur PayPal.' }, { status: 500 });
  }
}
