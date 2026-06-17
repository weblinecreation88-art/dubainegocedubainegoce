import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { firestore } from '@/firebase/server';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * API Endpoint pour envoyer une relance email personnalisée
 * POST /api/admin/send-recovery-email
 *
 * Requires an Authorization: Bearer <admin Firebase ID token | ADMIN_API_KEY> header.
 *
 * Body:
 * {
 *   "email": "customer@example.com",
 *   "userId": "uid",
 *   "promoCode": "COMEBACK5",
 *   "discount": 5
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
  cartValue?: number
): string {
  const savedAmount = cartValue ? (cartValue * discount / 100).toFixed(2) : 'XX.XX';
  const cartLink = `https://dubainegoce.fr/cart?promo=${promoCode}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #d4145a 0%, #fbb034 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .promo-box { background: white; border: 3px solid #d4145a; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center; }
          .promo-code { font-size: 32px; font-weight: bold; color: #d4145a; letter-spacing: 2px; }
          .promo-label { font-size: 12px; color: #666; margin-top: 5px; }
          .cta-button { display: inline-block; background: #d4145a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .savings { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center; font-weight: bold; color: #856404; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .list { margin: 20px 0; padding: 0 20px; }
          .list li { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎁 Vous avez oublié quelque chose!</h1>
            <p>Voici une offre exclusive pour vous</p>
          </div>

          <div class="content">
            <h2>Bonjour ${customerName},</h2>

            <p>Nous avons remarqué que vous aviez des articles dans votre panier sur <strong>DubaiNegoce.fr</strong> !</p>

            <p>Pour ne pas rater cette occasion, nous vous offrons une <strong>réduction spéciale de ${discount}%</strong> sur votre commande.</p>

            <div class="promo-box">
              <p class="promo-label">Votre code de réduction exclusif</p>
              <p class="promo-code">${promoCode}</p>
              <p class="promo-label">Valable 7 jours</p>
            </div>

            ${cartValue ? `
              <div class="savings">
                💰 Vous économiserez jusqu'à <strong>${savedAmount}€</strong> sur cette commande!
              </div>
            ` : ''}

            <h3>Ce que vous trouvez chez DubaiNegoce:</h3>
            <ul class="list">
              <li>✅ Parfums originaux et équivalents premium</li>
              <li>✅ Livraison rapide (48h) en France métropolitaine</li>
              <li>✅ 100% authentique - Garantie satisfait ou remboursé</li>
              <li>✅ Retour gratuit sous 14 jours</li>
              <li>✅ Service client réactif</li>
            </ul>

            <center>
              <a href="${cartLink}" class="cta-button">Terminer ma commande →</a>
            </center>

            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              Questions? Contactez-nous à <strong>contact@dubainegoce.fr</strong>
            </p>
          </div>

          <div class="footer">
            <p>© 2026 DubaiNegoce - Tous droits réservés</p>
            <p>Cette offre est valable 7 jours à partir de la réception de cet email</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { email, userId, promoCode = 'COMEBACK5', discount = 5 } = body;

    // Validation
    if (!email || !userId) {
      return NextResponse.json(
        { error: 'email and userId required' },
        { status: 400 }
      );
    }

    // Récupérer les infos du panier abandonné
    let cartValue = 0;
    let customerName = email.split('@')[0];

    try {
      const abandonedCartsSnapshot = await firestore
        .collection('abandoned_carts')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (!abandonedCartsSnapshot.empty) {
        const cartData = abandonedCartsSnapshot.docs[0].data();
        cartValue = cartData.cartValue || 0;
      }

      // Récupérer le nom du client s'il existe
      const userDoc = await firestore.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.name) {
          customerName = userData.name;
        }
      }
    } catch (e) {
      console.log('Could not fetch cart/user data:', e);
    }

    // Envoyer l'email
    const resend = getResendClient();
    const fromEmail = process.env.FROM_EMAIL || 'noreply@dubainegoce.fr';

    const emailHtml = renderRecoveryEmail(customerName, promoCode, discount, cartValue);

    const result = await resend.emails.send({
      from: `DubaiNegoce <${fromEmail}>`,
      to: [email],
      subject: `🎁 ${discount}% de réduction sur vos parfums préférés! Code: ${promoCode}`,
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
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
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
