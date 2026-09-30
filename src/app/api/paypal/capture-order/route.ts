import { NextRequest, NextResponse } from 'next/server';
import { getServerSecret } from '@/lib/server-secrets';
import { Resend } from 'resend';

// Hardcodé sur LIVE — ne pas dépendre de variables runtime non injectées
const PAYPAL_BASE = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '').trim();
  const secret = await getServerSecret('PAYPAL_SECRET');

  if (!clientId || !secret) {
    console.error('[PayPal Capture] Client ID ou Secret manquant');
    throw new Error('Identifiants PayPal non configurés.');
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
    console.error('[PayPal Capture] OAuth token error:', res.status, errBody);
    throw new Error(`Impossible d'obtenir le token PayPal (${res.status})`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderID,
      items = [],
      customerInfo,
      shippingMethod = 'colissimo',
      pickupPoint,
      userId = 'guest',
      total,
    } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'orderID manquant' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[PayPal Capture] Capture error:', err);
      return NextResponse.json({ error: err.message || 'Erreur capture paiement PayPal' }, { status: 500 });
    }

    const capture = await res.json();
    const captureStatus = capture.status; // 'COMPLETED'

    // Enregistrer la commande dans Firestore si le paiement est confirmé
    if (captureStatus === 'COMPLETED') {
      try {
        const { firestore } = await import('@/firebase/server');
        if (firestore) {
          const payer = capture.payer || {};
          const payerEmail = customerInfo?.email || payer.email_address || '';
          const payerName = customerInfo
            ? `${customerInfo.firstName} ${customerInfo.lastName}`.trim()
            : `${payer.name?.given_name || ''} ${payer.name?.surname || ''}`.trim() || 'Client';

          const capturedAmount =
            capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || total || '0';

          const orderData = {
            id: orderID,
            userId: userId || 'guest',
            orderDate: new Date().toISOString(),
            createdAt: new Date(),
            totalAmount: parseFloat(capturedAmount),
            status: 'completed',
            paymentProvider: 'paypal',
            shippingMethod: shippingMethod,
            pickupPoint: pickupPoint || null,
            customer: {
              email: payerEmail,
              name: payerName,
              phone: customerInfo?.phone || '',
              address: customerInfo
                ? `${customerInfo.address}, ${customerInfo.postalCode || ''} ${customerInfo.city}, ${customerInfo.country}`
                : '',
            },
            orderItems: items.map((item: any) => ({
              productId: item.id || 'unknown',
              quantity: item.quantity || 1,
              itemPrice: item.price || 0,
              name: item.name,
              image: item.image || '',
            })),
            paypalOrderId: orderID,
          };

          // 1. Sauvegarde dans la collection globale des commandes
          await firestore.collection('orders').doc(orderID).set(orderData);
          console.log(`[PayPal Capture] Commande ${orderID} enregistrée dans orders`);

          // 2. Sauvegarde dans la collection utilisateur si connecté
          if (userId && userId !== 'guest') {
            await firestore
              .collection('users')
              .doc(userId)
              .collection('orders')
              .doc(orderID)
              .set(orderData);
          }

          // 3. Marquer le panier abandonné comme converti
          if (payerEmail) {
            try {
              const cleanEmail = payerEmail.replace(/[^a-zA-Z0-9]/g, '_');
              await firestore.collection('abandoned_carts').doc(`${cleanEmail}_current`).set(
                { status: 'converted', convertedAt: new Date().toISOString() },
                { merge: true }
              );
            } catch (cartErr) {
              console.warn('[PayPal Capture] Could not update abandoned cart:', cartErr);
            }
          }

          // 4. Envoi de l'email de confirmation via Resend
          const resendKey = await getServerSecret('RESEND_API_KEY');
          const fromEmail = process.env.FROM_EMAIL || 'contact@resend.woosenteur.fr';

          if (resendKey && payerEmail) {
            const resend = new Resend(resendKey);
            const itemsHtml = orderData.orderItems
              .map(
                (item: any) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${Number(item.itemPrice).toFixed(2)} €</td>
                </tr>
              `
              )
              .join('');

            const emailHtml = `
              <h1>Confirmation de votre commande</h1>
              <p>Bonjour ${payerName},</p>
              <p>Merci pour votre achat chez DubaiNegoce. Voici le récapitulatif de votre commande <strong>#${orderID.substring(0, 10)}</strong> payée par PayPal.</p>
              <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Produit</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantité</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Prix unitaire</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
              <p><strong>Montant total : ${parseFloat(capturedAmount).toFixed(2)} €</strong></p>
              <p>Mode de livraison : ${shippingMethod === 'colissimo' ? 'Colissimo à domicile (48h)' : `Point Relais Mondial Relay (${pickupPoint?.name || ''})`}</p>
              <p>Vous recevrez un email avec votre numéro de suivi dès l'expédition.</p>
              <p>L'équipe DubaiNegoce</p>
            `;

            await resend.emails.send({
              from: `DubaiNegoce <${fromEmail}>`,
              to: [payerEmail],
              subject: `Confirmation de votre commande DubaiNegoce #${orderID.substring(0, 10)}`,
              html: emailHtml,
            });
            console.log(`[PayPal Capture] Email de confirmation envoyé à ${payerEmail}`);
          }
        }
      } catch (saveError) {
        console.error('[PayPal Capture] Erreur enregistrement commande:', saveError);
      }
    }

    return NextResponse.json(capture);
  } catch (err: any) {
    console.error('[PayPal Capture] Exception:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur capture PayPal' }, { status: 500 });
  }
}
