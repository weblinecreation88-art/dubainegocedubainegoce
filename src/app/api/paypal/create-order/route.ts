import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_BASE = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_SECRET!;
  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error('Impossible d\'obtenir le token PayPal');
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, productName, quantity, items, total, shippingAmount } = await req.json();

    if (!amount && !total) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // Support multi-items (checkout) or single item (product page)
    const isMultiItem = items && items.length > 0;
    const orderTotal = total
      ? parseFloat(total).toFixed(2)
      : (parseFloat(amount) * (quantity || 1)).toFixed(2);
    const shippingValue = shippingAmount ? parseFloat(shippingAmount).toFixed(2) : '0.00';
    const itemsTotal = (parseFloat(orderTotal) - parseFloat(shippingValue)).toFixed(2);

    const accessToken = await getAccessToken();

    const paypalItems = isMultiItem
      ? items.map((item: { name: string; quantity: string; unit_amount: { currency_code: string; value: string } }) => ({
          name: item.name,
          quantity: item.quantity,
          unit_amount: item.unit_amount,
          category: 'PHYSICAL_GOODS',
        }))
      : [
          {
            name: productName,
            quantity: String(quantity || 1),
            unit_amount: {
              currency_code: 'EUR',
              value: parseFloat(amount).toFixed(2),
            },
            category: 'PHYSICAL_GOODS',
          },
        ];

    const breakdown: Record<string, { currency_code: string; value: string }> = {
      item_total: { currency_code: 'EUR', value: itemsTotal },
    };
    if (parseFloat(shippingValue) > 0) {
      breakdown.shipping = { currency_code: 'EUR', value: shippingValue };
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
            description: `${productName} — Dubai Négoce`,
            amount: {
              currency_code: 'EUR',
              value: orderTotal,
              breakdown,
            },
            items: paypalItems,
          },
        ],
        application_context: {
          brand_name: 'Dubai Négoce',
          locale: 'fr-FR',
          shipping_preference: 'GET_FROM_FILE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('PayPal create-order error:', err);
      return NextResponse.json({ error: 'Erreur création commande PayPal' }, { status: 500 });
    }

    const order = await res.json();
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error('PayPal create-order exception:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
