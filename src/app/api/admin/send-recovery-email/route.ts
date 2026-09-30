import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { firestore } from '@/firebase/server';

export const dynamic = 'force-dynamic';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }
  return new Resend(apiKey);
}

function getGmailTransporter() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const gmailUser = process.env.GMAIL_USER || 'abderelmalki@gmail.com';

  if (!appPassword) {
    throw new Error('GMAIL_APP_PASSWORD not configured for fallback');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: appPassword,
    },
  });
}

async function sendEmailWithFallback(
  to: string,
  subject: string,
  html: string,
  fromEmail: string
): Promise<{ id: string; method: 'resend' | 'gmail' }> {
  let lastError: any = null;

  // 1. Essayer Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = getResendClient();
      const result = await resend.emails.send({
        from: `DubaiNegoce 🌹 <${fromEmail}>`,
        to: [to],
        subject,
        html,
        replyTo: 'contact@dubainegoce.fr',
      });

      if ((result as any)?.error) {
        console.warn(`[Resend Warning] Error for ${to}:`, (result as any).error);
        lastError = (result as any).error;
      } else {
        const id = (result as any)?.id || (result as any)?.data?.id;
        if (id) {
          return { id, method: 'resend' };
        }
      }
    } catch (err: any) {
      console.warn(`[Resend Error] Exception sending to ${to}:`, err.message || err);
      lastError = err;
    }
  }

  // 2. Fallback Gmail SMTP
  if (process.env.GMAIL_APP_PASSWORD) {
    try {
      console.log(`[Email] Falling back to Gmail SMTP for ${to}...`);
      const transporter = getGmailTransporter();
      const gmailUser = process.env.GMAIL_USER || 'abderelmalki@gmail.com';
      const info = await transporter.sendMail({
        from: `DubaiNegoce <${gmailUser}>`,
        to,
        subject,
        html,
        replyTo: 'contact@dubainegoce.fr',
      });

      return { id: info.messageId, method: 'gmail' };
    } catch (gmailErr: any) {
      console.error(`[Gmail Error] Failed to send to ${to}:`, gmailErr);
      lastError = gmailErr;
    }
  }

  const errMsg = lastError?.message || 'Aucun service email configuré ou fonctionnel (vérifiez RESEND_API_KEY ou GMAIL_APP_PASSWORD)';
  throw new Error(errMsg);
}

interface CartItemData {
  name: string;
  quantity: number;
  price?: number;
  itemPrice?: number;
  image?: string;
}

function renderRecoveryEmail(
  customerName: string,
  promoCode: string,
  discount: number,
  cartValue: number,
  cartItems: CartItemData[] = [],
  appUrl: string = 'https://dubainegoce.fr'
): string {
  const savedAmount = cartValue > 0 ? ((cartValue * discount) / 100).toFixed(2) : '0.00';
  const cartLink = `${appUrl}/cart?promo=${promoCode}`;

  const itemsHtml = cartItems.length > 0
    ? cartItems
        .map((item) => {
          const price = item.price ?? item.itemPrice ?? 0;
          return `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a1a1a; font-size: 15px;">${item.name}</p>
              <p style="margin: 0; color: #777; font-size: 13px;">Quantité : ${item.quantity} ${price > 0 ? `× ${price.toFixed(2)}€` : ''}</p>
            </td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #1a1a1a; font-size: 15px;">
              ${price > 0 ? `${(price * item.quantity).toFixed(2)} €` : ''}
            </td>
          </tr>
        `;
        })
        .join('')
    : '';

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f9; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 700; color: #ffffff; }
          .header p { margin: 8px 0 0 0; color: #e0e0e0; font-size: 13px; letter-spacing: 1px; }
          .content { padding: 30px; }
          .greeting { font-size: 18px; color: #1a1a1a; margin-bottom: 15px; font-weight: 600; }
          .promo-box { background: #fff5f8; border: 2px dashed #d4145a; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center; }
          .promo-title { font-size: 13px; color: #d4145a; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin: 0 0 8px 0; }
          .promo-code { font-size: 32px; font-weight: 800; color: #d4145a; letter-spacing: 3px; font-family: monospace; }
          .promo-sub { font-size: 13px; color: #666; margin: 8px 0 0 0; }
          .savings { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px; border-radius: 6px; margin: 20px 0; text-align: center; font-weight: 600; font-size: 15px; }
          .cta-wrap { text-align: center; margin: 30px 0; }
          .cta-button { display: inline-block; background: #d4145a; color: #ffffff !important; padding: 15px 36px; text-decoration: none; border-radius: 30px; font-weight: 700; font-size: 15px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(212, 20, 90, 0.3); }
          .cart-box { background: #fafafa; border: 1px solid #eeeeee; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .cart-title { font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 1px; font-weight: 700; margin-bottom: 12px; }
          .cart-table { width: 100%; border-collapse: collapse; }
          .guarantees { border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; }
          .guarantee-item { display: inline-block; width: 48%; margin-bottom: 12px; font-size: 13px; color: #555; }
          .footer { background: #1a1a1a; color: #999999; padding: 20px; text-align: center; font-size: 12px; }
          .footer a { color: #bbbbbb; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DUBAINEGOCE</h1>
            <p>PARFUMS AUTHENTIQUES DE DUBAÏ</p>
          </div>

          <div class="content">
            <div class="greeting">Bonjour ${customerName || 'Cher client'},</div>

            <p style="color: #444; font-size: 15px; margin: 0 0 16px 0;">
              Vous avez laissé des parfums d'exception dans votre panier. Ne passez pas à côté : nous vous réservons une remise immédiate de <strong>${discount}%</strong> pour finaliser votre commande aujourd'hui.
            </p>

            <div class="promo-box">
              <div class="promo-title">Votre code de réduction exclusif</div>
              <div class="promo-code">${promoCode}</div>
              <div class="promo-sub">-${discount}% sur tout votre panier · Valable 7 jours</div>
            </div>

            ${
              cartValue > 0
                ? `
              <div class="savings">
                💰 Vous économisez <strong>${savedAmount} €</strong> sur votre commande avec ce code !
              </div>
            `
                : ''
            }

            ${
              itemsHtml
                ? `
              <div class="cart-box">
                <div class="cart-title">Vos articles réservés</div>
                <table class="cart-table">
                  <tbody>
                    ${itemsHtml}
                    ${
                      cartValue > 0
                        ? `
                      <tr>
                        <td style="padding-top: 14px; font-weight: bold; color: #1a1a1a; font-size: 15px; border-top: 2px solid #e5e5e5;">Sous-total</td>
                        <td style="padding-top: 14px; text-align: right; font-weight: bold; color: #1a1a1a; font-size: 15px; border-top: 2px solid #e5e5e5;">${cartValue.toFixed(2)} €</td>
                      </tr>
                    `
                        : ''
                    }
                  </tbody>
                </table>
              </div>
            `
                : ''
            }

            <div class="cta-wrap">
              <a href="${cartLink}" class="cta-button">FINALISER MA COMMANDE →</a>
            </div>

            <div class="guarantees">
              <div class="guarantee-item">✅ 100% Authentique garanti</div>
              <div class="guarantee-item">🚀 Expédition 48h Colissimo</div>
              <div class="guarantee-item">🔒 Paiement 100% sécurisé</div>
              <div class="guarantee-item">💬 Service client réactif</div>
            </div>

            <p style="text-align: center; margin-top: 25px; color: #777; font-size: 13px;">
              Une question ? Répondez simplement à cet email ou contactez-nous à <a href="mailto:contact@dubainegoce.fr" style="color: #d4145a;">contact@dubainegoce.fr</a>.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} DubaiNegoce · Tous droits réservés</p>
            <p style="margin: 0;">Cette offre privilège de ${discount}% est valable 7 jours.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { cartId, email, userId, promoCode = 'COMEBACK5', discount = 5, apiKey } = body;

    // 1. Authentification :
    // - Requête interne depuis le dashboard admin ('x-internal-request' ou referer admin)
    // - OU clé API valide si ADMIN_API_KEY est configurée dans l'environnement
    const authHeader = request.headers.get('authorization');
    const isInternalRequest =
      request.headers.get('x-internal-request') === 'true' ||
      request.headers.get('referer')?.includes('/admin/');
    const providedApiKey =
      apiKey ||
      request.nextUrl.searchParams.get('apiKey') ||
      (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (process.env.ADMIN_API_KEY && !isInternalRequest) {
      if (!providedApiKey || providedApiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized: invalid or missing API key' }, { status: 401 });
      }
    }

    // 2. Validation minimale
    if (!cartId && !email) {
      return NextResponse.json(
        { error: 'cartId ou email requis' },
        { status: 400 }
      );
    }

    // 3. Récupération du document de panier abandonné
    let cartDoc: any = null;
    let cartData: any = null;

    if (cartId) {
      const doc = await firestore.collection('abandoned_carts').doc(cartId).get();
      if (doc.exists) {
        cartDoc = doc;
        cartData = doc.data();
      }
    }

    // Fallback par email si cartId n'a rien donné
    if (!cartDoc && email) {
      const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const directDoc = await firestore.collection('abandoned_carts').doc(`${cleanEmail}_current`).get();
      if (directDoc.exists) {
        cartDoc = directDoc;
        cartData = directDoc.data();
      } else {
        const querySnapshot = await firestore
          .collection('abandoned_carts')
          .where('email', '==', email)
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          cartDoc = querySnapshot.docs[0];
          cartData = cartDoc.data();
        }
      }
    }

    const recipientEmail = email || cartData?.email;
    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Impossible de déterminer l\'adresse email du destinataire' },
        { status: 400 }
      );
    }

    const resolvedUserId = userId || cartData?.userId;
    const cartValue = cartData?.cartValue || 0;
    const cartItems: CartItemData[] = cartData?.cartSnapshot || cartData?.items || [];

    // Déterminer le nom du client
    let customerName = cartData?.customerName || recipientEmail.split('@')[0];

    if (resolvedUserId && resolvedUserId !== recipientEmail) {
      try {
        const userDoc = await firestore.collection('users').doc(resolvedUserId).get();
        if (userDoc.exists) {
          const uData = userDoc.data();
          if (uData?.name || uData?.displayName) {
            customerName = uData.name || uData.displayName;
          }
        }
      } catch (err) {
        console.warn('Could not fetch user profile:', err);
      }
    }

    // 4. Préparer l'email
    const fromEmail = process.env.FROM_EMAIL || 'contact@dubainegoce.fr';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

    const subject = customerName && customerName !== recipientEmail.split('@')[0]
      ? `🎁 ${customerName}, vos ${discount}% de réduction sur vos parfums ! Code: ${promoCode}`
      : `🎁 Vos parfums vous attendent : -${discount}% avec le code ${promoCode}`;

    const emailHtml = renderRecoveryEmail(
      customerName,
      promoCode,
      discount,
      cartValue,
      cartItems,
      appUrl
    );

    // 5. Envoyer l'email via Resend avec fallback Gmail
    const emailResult = await sendEmailWithFallback(
      recipientEmail,
      subject,
      emailHtml,
      fromEmail
    );

    const nowIso = new Date().toISOString();

    // 6. Mettre à jour le panier abandonné dans Firestore
    if (cartDoc) {
      try {
        await cartDoc.ref.update({
          'emailsSent.recovery': true,
          'emailsSent.recoveryAt': nowIso,
          recoveryEmail: {
            sentAt: nowIso,
            promoCode,
            discount,
            emailId: emailResult.id || 'sent',
            method: emailResult.method,
          },
        });
      } catch (err) {
        console.error('Error updating abandoned cart in Firestore:', err);
      }
    }

    // 7. Logger dans la collection emailLogs pour le suivi de la section Emails
    try {
      await firestore.collection('emailLogs').add({
        email: recipientEmail,
        recipient: recipientEmail,
        type: 'abandoned_cart_recovery',
        subject,
        messageId: emailResult.id || 'sent',
        promoCode,
        discount,
        status: 'sent',
        opened: false,
        clicked: false,
        sentAt: new Date(),
        cartId: cartDoc ? cartDoc.id : (cartId || null),
        method: emailResult.method,
      });
    } catch (err) {
      console.error('Error logging to emailLogs in Firestore:', err);
    }

    return NextResponse.json({
      success: true,
      message: `Email de relance envoyé avec succès à ${recipientEmail}`,
      emailId: emailResult.id,
      method: emailResult.method,
      details: {
        recipient: recipientEmail,
        customerName,
        promoCode,
        discount: `${discount}%`,
        cartValue: cartValue > 0 ? `${cartValue.toFixed(2)}€` : 'inconnue',
        savedAmount: cartValue > 0 ? `${((cartValue * discount) / 100).toFixed(2)}€` : '0.00€',
      },
    });
  } catch (error: any) {
    console.error('Send recovery email error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Échec de l\'envoi de l\'email de relance',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const isInternalRequest =
      request.headers.get('x-internal-request') === 'true' ||
      request.headers.get('referer')?.includes('/admin/');
    const apiKey =
      request.nextUrl.searchParams.get('apiKey') ||
      (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (process.env.ADMIN_API_KEY && !isInternalRequest) {
      if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ error: 'Unauthorized: invalid or missing API key' }, { status: 401 });
      }
    }

    const userId = request.nextUrl.searchParams.get('userId');
    const email = request.nextUrl.searchParams.get('email');
    const cartId = request.nextUrl.searchParams.get('cartId');

    if (!userId && !email && !cartId) {
      return NextResponse.json({ error: 'userId, email, or cartId required' }, { status: 400 });
    }

    let sentEmails: any[] = [];

    if (cartId) {
      const doc = await firestore.collection('abandoned_carts').doc(cartId).get();
      if (doc.exists && doc.data()?.recoveryEmail) {
        sentEmails.push({
          cartId: doc.id,
          email: doc.data()?.email,
          ...doc.data()?.recoveryEmail,
        });
      }
    } else if (userId) {
      const snapshot = await firestore
        .collection('abandoned_carts')
        .where('userId', '==', userId)
        .get();

      sentEmails = snapshot.docs
        .filter((doc) => doc.data().recoveryEmail)
        .map((doc) => ({
          cartId: doc.id,
          email: doc.data().email,
          ...doc.data().recoveryEmail,
        }));
    } else if (email) {
      const snapshot = await firestore
        .collection('abandoned_carts')
        .where('email', '==', email)
        .get();

      sentEmails = snapshot.docs
        .filter((doc) => doc.data().recoveryEmail)
        .map((doc) => ({
          cartId: doc.id,
          email: doc.data().email,
          ...doc.data().recoveryEmail,
        }));
    }

    return NextResponse.json({
      recoveryEmailsSent: sentEmails.length,
      emails: sentEmails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    );
  }
}
