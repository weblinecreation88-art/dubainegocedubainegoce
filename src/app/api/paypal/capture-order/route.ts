import { NextRequest, NextResponse } from 'next/server';
import { PAYPAL_BASE, getPayPalAccessToken } from '@/lib/paypal';
import { priceOrder, resolveBuyer } from '@/lib/order-pricing';
import { sendEmail } from '@/lib/email';
import type { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

const escapeHtml = (v: string) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Encaisse une commande PayPal, l'enregistre et envoie la confirmation.
 *
 * POST {
 *   orderID, items: [{ id, quantity }], shippingMethod, country,
 *   customer: { email, phone, firstName, lastName, address, postalCode, city },
 *   pickupPoint?: { id, name, address, postalCode, city }
 * }
 * Authorization: Bearer <jeton Firebase>  (facultatif : sinon commande invitee)
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const orderID = String(body?.orderID || '');
  if (!orderID) {
    return NextResponse.json({ error: 'orderID manquant.' }, { status: 400 });
  }

  const buyer = await resolveBuyer(req.headers.get('authorization'));
  const userId = 'error' in buyer ? 'guest' : buyer.userId;

  const { firestore } = await import('@/firebase/server');
  const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(orderID);

  // Idempotence : un double clic ou un rechargement ne doit pas encaisser deux fois.
  const existing = await orderRef.get();
  if (existing.exists) {
    return NextResponse.json({ status: 'COMPLETED', id: orderID, alreadyProcessed: true });
  }

  try {
    const accessToken = await getPayPalAccessToken();

    let res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });

    let capture: any = await res.json().catch(() => ({}));

    // Deja encaissee (ex. nouvelle tentative) : on relit simplement la commande.
    if (!res.ok && capture?.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') {
      res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${encodeURIComponent(orderID)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      capture = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
      console.error('[PayPal capture] Erreur :', capture);
      return NextResponse.json(
        { error: capture?.message || "Le paiement PayPal n'a pas pu être confirmé." },
        { status: 502 }
      );
    }

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Paiement PayPal non finalisé (statut : ${capture.status}).` },
        { status: 402 }
      );
    }

    const capturedValue = parseFloat(
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ||
        capture.purchase_units?.[0]?.amount?.value ||
        '0'
    );

    // Le detail de la commande est recalcule depuis le catalogue, jamais repris tel quel.
    const priced = priceOrder(body?.items, body?.shippingMethod, body?.country);
    const amountMismatch = priced.ok && Math.abs(priced.total - capturedValue) > 0.01;
    if (amountMismatch) {
      console.error(
        `[PayPal capture] ALERTE montant : encaissé ${capturedValue} €, attendu ${priced.ok ? priced.total : '?'} € (commande ${orderID}).`
      );
    }

    const customer = body?.customer || {};
    const payer = capture.payer || {};
    const customerEmail = String(customer.email || payer.email_address || ('error' in buyer ? '' : buyer.email) || '').trim();
    const customerName =
      `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
      `${payer.name?.given_name || ''} ${payer.name?.surname || ''}`.trim() ||
      'Client';

    const pickup = body?.pickupPoint;
    const orderData: Order & Record<string, unknown> = {
      id: orderID,
      userId,
      orderDate: new Date().toISOString(),
      totalAmount: capturedValue,
      status: 'completed',
      shippingMethod: priced.ok ? priced.shippingMethod : body?.shippingMethod === 'colissimo' ? 'colissimo' : 'mondial-relay',
      customerEmail,
      customerName,
      customerPhone: String(customer.phone || ''),
      shippingCost: priced.ok ? priced.shippingCost : undefined,
      shippingAddress: {
        line1: String(customer.address || ''),
        postalCode: String(customer.postalCode || ''),
        city: String(customer.city || ''),
        country: priced.ok ? priced.country : String(body?.country || 'FR'),
      },
      orderItems: priced.ok
        ? priced.lines.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
            itemPrice: product.price,
            name: product.name,
            image: product.images?.[0] || '',
          }))
        : [],
      paymentProvider: 'paypal',
      paypalOrderId: orderID,
      ...(amountMismatch ? { amountMismatch: true } : {}),
      ...(pickup?.id
        ? {
            pickupPoint: {
              id: String(pickup.id),
              name: String(pickup.name || ''),
              address: String(pickup.address || ''),
              postalCode: String(pickup.postalCode || ''),
              city: String(pickup.city || ''),
            },
          }
        : {}),
    };

    // Firestore refuse les champs undefined.
    const clean = JSON.parse(JSON.stringify(orderData));
    await orderRef.set(clean);
    console.log(`[PayPal capture] Commande ${orderID} enregistrée (${userId}).`);

    // Le client a paye : son panier abandonne ne doit plus etre relance.
    if (customerEmail) {
      const cartRef = firestore
        .collection('abandoned_carts')
        .doc(`${customerEmail.replace(/[^a-zA-Z0-9]/g, '_')}_current`);
      const cartSnap = await cartRef.get().catch(() => null);
      if (cartSnap?.exists) {
        await cartRef
          .update({ status: 'recovered', recoveredAt: new Date().toISOString() })
          .catch(() => undefined);
      }
    }

    // E-mail de confirmation (un echec ne remet pas en cause la commande payee).
    if (customerEmail) {
      const itemsHtml = (clean.orderItems as Array<any>)
        .map(
          (i) => `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(i.name)}</td>
            <td style="padding:8px;border:1px solid #ddd;">${i.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">${Number(i.itemPrice).toFixed(2)} €</td>
          </tr>`
        )
        .join('');

      const delivery =
        clean.shippingMethod === 'mondial-relay'
          ? `Mondial Relay (point relais)${clean.pickupPoint ? ` — ${escapeHtml(clean.pickupPoint.name)}` : ''}`
          : 'Colissimo (livraison à domicile)';

      const html = `
        <h1>Confirmation de votre commande</h1>
        <p>Bonjour ${escapeHtml(customerName)},</p>
        <p>Merci pour votre achat chez DubaiNegoce. Voici le récapitulatif de votre commande <strong>#${escapeHtml(orderID.substring(0, 10))}</strong>, payée par PayPal.</p>
        <table cellpadding="10" cellspacing="0" style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead><tr>
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Produit</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Quantité</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Prix unitaire</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        ${typeof clean.shippingCost === 'number' ? `<p>Frais de livraison : ${clean.shippingCost === 0 ? 'offerts' : `${clean.shippingCost.toFixed(2)} €`}</p>` : ''}
        <p><strong>Montant total : ${capturedValue.toFixed(2)} €</strong></p>
        <p><strong>Mode de livraison :</strong> ${delivery}</p>
        <p>Vous recevrez un autre e-mail avec le numéro de suivi lorsque votre colis sera expédié.</p>
        <p>L'équipe DubaiNegoce</p>`;

      const mail = await sendEmail({
        to: customerEmail,
        subject: `Confirmation de votre commande DubaiNegoce #${orderID.substring(0, 10)}`,
        html,
        replyTo: 'contact@dubainegoce.fr',
      });
      if (!mail.success) {
        console.error(`[PayPal capture] E-mail de confirmation non envoyé : ${mail.error}`);
      }
    }

    return NextResponse.json({ status: 'COMPLETED', id: orderID, total: capturedValue });
  } catch (err: any) {
    console.error('[PayPal capture] Exception :', err);
    return NextResponse.json({ error: err?.message || 'Erreur serveur PayPal.' }, { status: 500 });
  }
}
