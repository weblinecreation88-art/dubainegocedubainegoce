import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { firestore } from '@/firebase/server';

/**
 * API Endpoint pour envoyer une relance email personnalisée
 * POST /api/admin/send-recovery-email
 *
 * Body:
 * {
 *   "email": "alain.guyon47@sfr.fr",
 *   "userId": "Cel70J9yBQMT2fiXVgnAL76LGjq1",
 *   "promoCode": "COMEBACK5",
 *   "discount": 5,
 *   "apiKey": "YOUR_ADMIN_API_KEY"
 * }
 */

export const dynamic = 'force-dynamic';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }
  return new Resend(apiKey);
}

function renderRecoveryEmail(
  customerName: string,
  promoCode: string,
  discount: number,
  cartValue?: number,
  cartItems?: Array<{ name: string; quantity: number; price: number }>
): string {
  const savedAmount = cartValue ? (cartValue * discount / 100).toFixed(2) : null;
  const cartLink = `https://dubainegoce.fr/cart`;
  const firstName = customerName.split(' ')[0];

  const itemsHtml = cartItems && cartItems.length > 0
    ? cartItems.map(item => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
            <span style="font-size:14px; color:#1a1a1a; font-weight:500;">${item.name}</span>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align:right; font-size:14px; color:#555; white-space:nowrap;">
            ${item.quantity} × ${item.price.toFixed(2)} €
          </td>
        </tr>`).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre panier vous attend — DubaiNegoce</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#0f1726; padding: 28px 40px; text-align:center;">
              <p style="margin:0; font-size:22px; font-weight:700; letter-spacing:3px; color:#ffffff;">DUBAÏ NÉGOCE</p>
              <p style="margin:6px 0 0; font-size:11px; color:#c9a96e; letter-spacing:2px; text-transform:uppercase;">Importé directement de Dubaï</p>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a2540 0%, #0f1726 100%); padding: 36px 40px; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; color:#c9a96e; letter-spacing:2px; text-transform:uppercase;">Offre exclusive</p>
              <h1 style="margin:0 0 12px; font-size:28px; font-weight:700; color:#ffffff; line-height:1.3;">
                ${firstName}, votre panier<br>vous attend encore…
              </h1>
              <p style="margin:0; font-size:15px; color:#aab4c8; line-height:1.6;">
                Vos parfums sont réservés. Finalisez votre commande<br>et profitez de <strong style="color:#c9a96e;">${discount}% de réduction</strong> avec le code ci-dessous.
              </p>
            </td>
          </tr>

          <!-- LIVRAISON RAPIDE BAND -->
          <tr>
            <td style="background:#c9a96e; padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 14px 20px; text-align:center; border-right: 1px solid rgba(255,255,255,0.3);">
                    <p style="margin:0; font-size:11px; color:#ffffff; letter-spacing:1px; text-transform:uppercase; font-weight:600;">📦 Paris &amp; Île-de-France</p>
                    <p style="margin:4px 0 0; font-size:17px; font-weight:800; color:#0f1726;">Livraison en 48h</p>
                  </td>
                  <td width="50%" style="padding: 14px 20px; text-align:center;">
                    <p style="margin:0; font-size:11px; color:#ffffff; letter-spacing:1px; text-transform:uppercase; font-weight:600;">🚚 Reste de la France</p>
                    <p style="margin:4px 0 0; font-size:17px; font-weight:800; color:#0f1726;">Livraison en 72h</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENU -->
          <tr>
            <td style="padding: 36px 40px;">

              <!-- Panier -->
              ${itemsHtml ? `
              <p style="margin:0 0 12px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Votre sélection</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${itemsHtml}
                ${cartValue ? `
                <tr>
                  <td style="padding-top:12px; font-size:15px; font-weight:700; color:#0f1726;">Total</td>
                  <td style="padding-top:12px; text-align:right; font-size:15px; font-weight:700; color:#0f1726;">${cartValue.toFixed(2)} €</td>
                </tr>` : ''}
              </table>` : ''}

              <!-- CODE PROMO -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#f8f5ef; border: 2px dashed #c9a96e; border-radius:10px; padding: 24px; text-align:center;">
                    <p style="margin:0 0 6px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:2px;">Votre code exclusif · valable 48h</p>
                    <p style="margin:0 0 8px; font-size:36px; font-weight:800; color:#0f1726; letter-spacing:6px;">${promoCode}</p>
                    <p style="margin:0; font-size:14px; color:#c9a96e; font-weight:600;">
                      ${discount}% de réduction${savedAmount ? ` — économisez <strong>${savedAmount} €</strong>` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${cartLink}" style="display:inline-block; background:#0f1726; color:#ffffff; text-decoration:none; padding: 16px 48px; border-radius:6px; font-size:15px; font-weight:700; letter-spacing:1px;">
                      Finaliser ma commande →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- GARANTIES -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="padding: 0 8px; text-align:center; vertical-align:top;">
                    <div style="background:#f8f9fb; border-radius:8px; padding:16px 12px;">
                      <p style="margin:0 0 6px; font-size:20px;">✅</p>
                      <p style="margin:0; font-size:12px; font-weight:700; color:#0f1726;">100% Authentique</p>
                      <p style="margin:4px 0 0; font-size:11px; color:#888;">Parfums originaux importés directement</p>
                    </div>
                  </td>
                  <td width="33%" style="padding: 0 8px; text-align:center; vertical-align:top;">
                    <div style="background:#f8f9fb; border-radius:8px; padding:16px 12px;">
                      <p style="margin:0 0 6px; font-size:20px;">🔒</p>
                      <p style="margin:0; font-size:12px; font-weight:700; color:#0f1726;">Paiement sécurisé</p>
                      <p style="margin:4px 0 0; font-size:11px; color:#888;">Stripe · Carte · PayPal</p>
                    </div>
                  </td>
                  <td width="33%" style="padding: 0 8px; text-align:center; vertical-align:top;">
                    <div style="background:#f8f9fb; border-radius:8px; padding:16px 12px;">
                      <p style="margin:0 0 6px; font-size:20px;">↩️</p>
                      <p style="margin:0; font-size:12px; font-weight:700; color:#0f1726;">Retours gratuits</p>
                      <p style="margin:4px 0 0; font-size:11px; color:#888;">Sous 14 jours, sans question</p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0f1726; padding: 24px 40px; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; color:#aab4c8;">
                Une question ? <a href="mailto:contact@dubainegoce.fr" style="color:#c9a96e; text-decoration:none;">contact@dubainegoce.fr</a>
              </p>
              <p style="margin:0; font-size:11px; color:#555; line-height:1.6;">
                © 2026 DubaiNegoce · Importé directement de Dubaï<br>
                <a href="https://dubainegoce.fr" style="color:#555; text-decoration:none;">dubainegoce.fr</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId, promoCode = 'RETOUR3', discount = 3 } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'email required' },
        { status: 400 }
      );
    }

    // Récupérer les infos du panier abandonné
    let cartValue = 0;
    let cartItems: Array<{ name: string; quantity: number; price: number }> = [];
    let customerName = email.split('@')[0];

    try {
      // Chercher d'abord par email (plus fiable que userId pour les paniers)
      const byEmail = await firestore
        .collection('abandoned_carts')
        .where('email', '==', email)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      const byUserId = userId && byEmail.empty
        ? await firestore
            .collection('abandoned_carts')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get()
        : null;

      const snap = !byEmail.empty ? byEmail : byUserId;

      if (snap && !snap.empty) {
        const cartData = snap.docs[0].data();
        cartValue = cartData.cartValue || 0;
        cartItems = (cartData.cartSnapshot || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));
      }

      // Récupérer le nom du client
      if (userId) {
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const fullName = userData?.displayName || userData?.name || userData?.firstName;
          if (fullName) customerName = fullName;
        }
      }
    } catch (e) {
      console.log('Could not fetch cart/user data:', e);
    }

    // Envoyer l'email
    const resend = getResendClient();
    const fromEmail = process.env.FROM_EMAIL || 'noreply@dubainegoce.fr';
    const firstName = customerName.split(' ')[0];

    const emailHtml = renderRecoveryEmail(customerName, promoCode, discount, cartValue, cartItems);

    const result = await resend.emails.send({
      from: `DubaiNegoce <${fromEmail}>`,
      to: [email],
      subject: `${firstName}, vos parfums vous attendent — ${discount}% offerts avec le code ${promoCode}`,
      html: emailHtml,
      replyTo: 'contact@dubainegoce.fr'
    });

    // Mettre à jour le statut dans Firestore
    if (result && !result.error && 'id' in result) {
      try {
        const abandonedCartsSnapshot = await firestore
          .collection('abandoned_carts')
          .where('userId', '==', userId)
          .where('email', '==', email)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!abandonedCartsSnapshot.empty) {
          const cartDoc = abandonedCartsSnapshot.docs[0];
          await cartDoc.ref.update({
            'emailsSent.recovery': new Date().toISOString(),
            'recoveryEmail': {
              sentAt: new Date().toISOString(),
              promoCode,
              discount,
              emailId: (result as any).id || 'sent'
            }
          });
        }
      } catch (e) {
        console.log('Could not update cart status:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Email de relance envoyé à ${email}`,
      emailId: (result as any).id || 'sent',
      details: {
        recipient: email,
        promoCode,
        discount: `${discount}%`,
        cartValue: cartValue > 0 ? `${cartValue}€` : 'unknown',
        savedAmount: cartValue > 0 ? `${(cartValue * discount / 100).toFixed(2)}€` : 'N/A'
      }
    });
  } catch (error) {
    console.error('Send recovery email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint pour vérifier le statut
 * GET /api/admin/send-recovery-email?userId=XXX&apiKey=YYY
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.nextUrl.searchParams.get('apiKey');
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Chercher les emails de relance envoyés
    const abandonedCartsSnapshot = await firestore
      .collection('abandoned_carts')
      .where('userId', '==', userId)
      .get();

    const sentEmails = abandonedCartsSnapshot.docs
      .filter(doc => doc.data().recoveryEmail)
      .map(doc => ({
        email: doc.data().email,
        cartValue: doc.data().cartValue,
        sentAt: doc.data().recoveryEmail.sentAt,
        promoCode: doc.data().recoveryEmail.promoCode
      }));

    return NextResponse.json({
      userId,
      recoveryEmailsSent: sentEmails.length,
      emails: sentEmails
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
