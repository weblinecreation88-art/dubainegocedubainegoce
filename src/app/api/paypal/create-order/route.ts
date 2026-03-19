import { NextRequest, NextResponse } from 'next/server';

// Hardcodé sur LIVE — ne pas dépendre de PAYPAL_BASE_URL (non injecté au runtime par Firebase App Hosting)
const PAYPAL_BASE = 'https://api-m.paypal.com';
const GCP_PROJECT = 'dubainegoce-227c3';

// Cache en mémoire pour éviter des appels répétés à Secret Manager
let cachedPaypalSecret: string | null = null;

/**
 * Récupère PAYPAL_SECRET depuis l'env ou depuis Google Cloud Secret Manager.
 * Firebase App Hosting n'injecte pas les secrets via apphosting.yaml au runtime,
 * donc on fetch directement depuis Secret Manager en utilisant le service account Cloud Run.
 */
async function getPaypalSecret(): Promise<string> {
  // 1. Priorité : variable d'environnement (si jamais injectée)
  if (process.env.PAYPAL_SECRET) {
    return process.env.PAYPAL_SECRET.trim();
  }

  // 2. Cache mémoire
  if (cachedPaypalSecret) {
    return cachedPaypalSecret;
  }

  // 3. Fetch depuis Secret Manager via le metadata server de Cloud Run
  try {
    // Obtenir le token OAuth2 du service account via le metadata server
    const tokenRes = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' } }
    );

    if (!tokenRes.ok) {
      throw new Error(`Metadata server error: ${tokenRes.status}`);
    }

    const { access_token } = await tokenRes.json();

    // Accéder au secret dans Secret Manager
    const secretRes = await fetch(
      `https://secretmanager.googleapis.com/v1/projects/${GCP_PROJECT}/secrets/PAYPAL_SECRET/versions/latest:access`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!secretRes.ok) {
      const errBody = await secretRes.text();
      throw new Error(`Secret Manager error: ${secretRes.status} — ${errBody}`);
    }

    const secretData = await secretRes.json();
    const secret = Buffer.from(secretData.payload.data, 'base64').toString('utf8').trim();

    cachedPaypalSecret = secret;
    console.log('[PayPal] PAYPAL_SECRET chargé depuis Secret Manager ✓');
    return secret;
  } catch (err) {
    console.error('[PayPal] Impossible de charger PAYPAL_SECRET:', err);
    throw new Error('PAYPAL_SECRET introuvable');
  }
}

async function getAccessToken(): Promise<string> {
  // Préférer PAYPAL_CLIENT_ID (secret GCP) ; fallback sur NEXT_PUBLIC_ (baked au build)
  const clientId = (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!).trim();
  const secret = await getPaypalSecret();

  console.log('[PayPal] getAccessToken — base:', PAYPAL_BASE, '| clientId set:', !!clientId, '| secret set:', !!secret);

  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('[PayPal] OAuth error', res.status, errBody);
    throw new Error(`Impossible d'obtenir le token PayPal (${res.status}): ${errBody}`);
  }
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
