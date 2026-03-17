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
    const { amount, productName, quantity } = await req.json();

    if (!amount || !productName) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const total = (parseFloat(amount) * (quantity || 1)).toFixed(2);
    const accessToken = await getAccessToken();

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
            description: `${productName}${quantity > 1 ? ` x${quantity}` : ''} — Dubai Négoce`,
            amount: {
              currency_code: 'EUR',
              value: total,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: total,
                },
              },
            },
            items: [
              {
                name: productName,
                quantity: String(quantity || 1),
                unit_amount: {
                  currency_code: 'EUR',
                  value: parseFloat(amount).toFixed(2),
                },
                category: 'PHYSICAL_GOODS',
              },
            ],
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
