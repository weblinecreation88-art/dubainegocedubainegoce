/**
 * Acces a l'API PayPal (cote serveur uniquement).
 *
 * Identifiants : PAYPAL_CLIENT_ID (ou NEXT_PUBLIC_PAYPAL_CLIENT_ID) et
 * PAYPAL_SECRET, montes par apphosting.yaml. PAYPAL_BASE_URL vaut l'API live.
 */

export const PAYPAL_BASE = (process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com').replace(/\/$/, '');

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim();
  const secret = (process.env.PAYPAL_SECRET || '').trim();

  if (!clientId || !secret) {
    console.error('[PayPal] PAYPAL_CLIENT_ID ou PAYPAL_SECRET manquant sur le serveur.');
    throw new Error('Paiement PayPal non configuré.');
  }

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
    console.error('[PayPal] Erreur OAuth', res.status, errBody);
    throw new Error(`Impossible d'obtenir le jeton PayPal (${res.status}).`);
  }

  const data = await res.json();
  return data.access_token;
}
