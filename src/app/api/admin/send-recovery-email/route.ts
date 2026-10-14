import { adminGuard } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email';
import { firestore } from '@/firebase/server';
import type { DocumentReference } from 'firebase-admin/firestore';

/**
 * Relance manuelle d'un panier abandonne, depuis /admin/abandoned-carts.
 *
 * POST /api/admin/send-recovery-email
 * Authorization: Bearer <jeton Firebase admin>   (ou x-admin-key: ADMIN_API_KEY)
 * {
 *   "cartId": "abc123",            // recommande : identifie le panier precis
 *   "email": "client@exemple.fr",  // a defaut de cartId
 *   "userId": "uid",               // optionnel
 *   "promoCode": "COMEBACK5",
 *   "discount": 5
 * }
 *
 * Le code promo doit exister dans Stripe (Produits > Coupons > Codes promo) :
 * le client le saisit sur la page de paiement Stripe.
 */

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

type CartLine = { name: string; quantity: number; price: number };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderRecoveryEmail(
  customerName: string,
  promoCode: string,
  discount: number,
  cartValue: number,
  items: CartLine[]
): string {
  const name = escapeHtml(customerName);
  const code = escapeHtml(promoCode);
  const savedAmount = cartValue > 0 ? ((cartValue * discount) / 100).toFixed(2) : null;

  const itemsHtml = items.length
    ? `<table role="presentation" width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
        ${items
          .map(
            (i) => `<tr>
              <td style="border-bottom:1px solid #eee;">${escapeHtml(i.name || 'Parfum')}</td>
              <td style="border-bottom:1px solid #eee;text-align:center;">x${Number(i.quantity) || 1}</td>
              <td style="border-bottom:1px solid #eee;text-align:right;">${(Number(i.price) || 0).toFixed(2)} €</td>
            </tr>`
          )
          .join('')}
      </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">
    <div style="max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#1a1a1a;color:#fff;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:22px;">Votre panier vous attend</h1>
        <p style="margin:8px 0 0;color:#d4af37;">Une offre réservée pour vous, ${name}</p>
      </div>
      <div style="background:#fff;padding:24px;">
        <p>Bonjour ${name},</p>
        <p>Vous avez laissé des parfums dans votre panier sur <strong>DubaiNegoce.fr</strong>. Pour vous aider à finaliser votre commande, nous vous offrons <strong>${discount}% de réduction</strong>.</p>
        ${itemsHtml}
        <div style="border:2px dashed #d4af37;padding:16px;margin:20px 0;border-radius:6px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#666;">Votre code de réduction</p>
          <p style="margin:6px 0;font-size:30px;font-weight:bold;letter-spacing:2px;color:#1a1a1a;">${code}</p>
          <p style="margin:0;font-size:12px;color:#666;">À saisir sur la page de paiement — valable 7 jours</p>
        </div>
        ${
          savedAmount
            ? `<p style="text-align:center;background:#fff8e1;padding:10px;border-radius:6px;">Soit <strong>${savedAmount} €</strong> d'économie sur ce panier.</p>`
            : ''
        }
        <p style="text-align:center;margin:28px 0;">
          <a href="${APP_URL}/cart" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;">Finaliser ma commande</a>
        </p>
        <p style="font-size:14px;color:#666;text-align:center;">Une question ? Répondez simplement à cet e-mail ou écrivez à contact@dubainegoce.fr</p>
      </div>
      <div style="background:#1a1a1a;color:#aaa;padding:14px;text-align:center;font-size:12px;border-radius:0 0 8px 8px;">
        © ${new Date().getFullYear()} DubaiNegoce — Paiement sécurisé, livraison en point relais ou à domicile.
      </div>
    </div>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  const denied = await adminGuard(request);
  if (denied) return denied;

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "Envoi d'e-mails non configuré : le secret BREVO_API_KEY est absent sur le serveur." },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const promoCode = String(body?.promoCode || 'COMEBACK5').trim().toUpperCase();
  const discount = Math.min(Math.max(Number(body?.discount) || 5, 1), 50);

  try {
    // --- Retrouver le panier : par son id, sinon le plus recent de ce client ---
    let cartRef: DocumentReference | null = null;
    let cart: any = null;

    if (body?.cartId) {
      const snap = await firestore.collection('abandoned_carts').doc(String(body.cartId)).get();
      if (snap.exists) {
        cartRef = snap.ref;
        cart = snap.data();
      }
    } else if (body?.email || body?.userId) {
      // Pas de orderBy : evite d'exiger un index composite, on trie en memoire.
      const field = body.userId ? 'userId' : 'email';
      const snap = await firestore
        .collection('abandoned_carts')
        .where(field, '==', String(body.userId || body.email))
        .get();
      const latest = snap.docs.sort((a, b) =>
        String(b.data().createdAt || '').localeCompare(String(a.data().createdAt || ''))
      )[0];
      if (latest) {
        cartRef = latest.ref;
        cart = latest.data();
      }
    }

    const email: string = String(cart?.email || body?.email || '').trim();
    const userId: string = String(cart?.userId || body?.userId || '');

    if (!email) {
      return NextResponse.json({ error: 'Panier ou adresse e-mail introuvable.' }, { status: 404 });
    }

    const items: CartLine[] = (cart?.cartSnapshot || []).map((i: any) => ({
      name: i?.name,
      quantity: i?.quantity,
      price: i?.price,
    }));
    const cartValue = Number(cart?.cartValue) || 0;

    // --- Prenom du client, si connu ---
    let customerName = email.split('@')[0];
    if (userId) {
      try {
        const userDoc = await firestore.collection('users').doc(userId).get();
        const u = userDoc.data();
        customerName = u?.firstName || u?.displayName || u?.name || customerName;
      } catch (e) {
        console.warn('[send-recovery-email] Profil client illisible :', e);
      }
    }

    const html = renderRecoveryEmail(customerName, promoCode, discount, cartValue, items);
    const subject = `${customerName}, -${discount}% pour finaliser votre commande (code ${promoCode})`;

    const result = await sendEmail({
      to: email,
      subject,
      html,
      replyTo: 'contact@dubainegoce.fr',
    });

    const sentAt = new Date().toISOString();

    // Journal des e-mails (page Logs Emails), que l'envoi reussisse ou non.
    await firestore
      .collection('emailLogs')
      .add({
        email,
        recipient: email,
        type: 'abandoned_cart_recovery',
        subject,
        messageId: result.messageId || '',
        promoCode,
        status: result.success ? 'sent' : 'failed',
        error: result.success ? null : result.error || null,
        opened: false,
        clicked: false,
        sentAt: new Date(),
        method: 'brevo',
      })
      .catch((e) => console.warn('[send-recovery-email] Log impossible :', e));

    if (!result.success) {
      console.error(`[send-recovery-email] Brevo a refusé l'envoi à ${email} : ${result.error}`);
      return NextResponse.json(
        { error: `Brevo a refusé l'envoi : ${result.error}` },
        { status: 502 }
      );
    }

    if (cartRef) {
      await cartRef
        .update({
          'emailsSent.recovery': sentAt,
          recoveryEmail: { sentAt, promoCode, discount, messageId: result.messageId || 'sent' },
        })
        .catch((e) => console.warn('[send-recovery-email] Mise à jour du panier impossible :', e));
    }

    return NextResponse.json({
      success: true,
      message: `E-mail de relance envoyé à ${email}`,
      messageId: result.messageId || null,
      sentAt,
      details: {
        recipient: email,
        promoCode,
        discount: `${discount}%`,
        cartValue: cartValue > 0 ? `${cartValue.toFixed(2)}€` : 'inconnue',
      },
    });
  } catch (error: any) {
    console.error('[send-recovery-email] Erreur :', error);
    return NextResponse.json(
      { error: error?.message || "Échec de l'envoi de l'e-mail." },
      { status: 500 }
    );
  }
}

/**
 * Historique des relances envoyees a un client.
 * GET /api/admin/send-recovery-email?userId=XXX
 */
export async function GET(request: NextRequest) {
  const denied = await adminGuard(request);
  if (denied) return denied;

  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId requis.' }, { status: 400 });
    }

    const snapshot = await firestore
      .collection('abandoned_carts')
      .where('userId', '==', userId)
      .get();

    const sentEmails = snapshot.docs
      .filter((doc) => doc.data().recoveryEmail)
      .map((doc) => ({
        cartId: doc.id,
        email: doc.data().email,
        cartValue: doc.data().cartValue,
        sentAt: doc.data().recoveryEmail.sentAt,
        promoCode: doc.data().recoveryEmail.promoCode,
      }));

    return NextResponse.json({
      userId,
      recoveryEmailsSent: sentEmails.length,
      emails: sentEmails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Impossible de lire l\'historique.' },
      { status: 500 }
    );
  }
}
