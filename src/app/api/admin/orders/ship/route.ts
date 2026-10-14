import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';
import { sendEmail } from '@/lib/email';
import { renderOrderShippedEmail } from '@/lib/email-templates/order-shipped';
import type { Order } from '@/lib/types';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

/**
 * Marque une commande comme expediee et previent le client.
 *
 * POST /api/admin/orders/ship
 * { userId, orderId, trackingNumber, carrier? }
 *
 * L'e-mail de confirmation promet au client un message a l'expedition :
 * c'est cette route qui tient la promesse.
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  if (!firestore) {
    return NextResponse.json({ error: 'Firestore non configuré.' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { userId, orderId, trackingNumber, carrier } = body as {
    userId?: string;
    orderId?: string;
    trackingNumber?: string;
    carrier?: 'colissimo' | 'mondial-relay';
  };

  if (!userId || !orderId || !trackingNumber?.trim()) {
    return NextResponse.json(
      { error: 'userId, orderId et trackingNumber sont requis.' },
      { status: 400 }
    );
  }

  const tracking = trackingNumber.trim().toUpperCase();
  const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(orderId);

  try {
    const snap = await orderRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }

    const order = { id: snap.id, ...snap.data() } as Order;

    // Le transporteur choisi a la commande fait foi si l'admin n'en impose pas un autre.
    const resolvedCarrier = carrier || order.shippingMethod || 'colissimo';
    const shippedAt = new Date().toISOString();

    await orderRef.update({
      status: 'shipped',
      trackingNumber: tracking,
      carrier: resolvedCarrier,
      shippedAt,
    });

    const customerEmail = order.customerEmail;
    if (!customerEmail) {
      // La commande est bien marquee expediee : seul l'avis client manque.
      console.warn(`[orders/ship] Commande ${orderId} sans e-mail client : avis non envoyé.`);
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Commande marquée expédiée, mais aucune adresse e-mail n'est enregistrée.",
      });
    }

    const html = renderOrderShippedEmail(
      { ...order, carrier: resolvedCarrier as Order['carrier'] },
      tracking,
      appUrl
    );

    const emailResult = await sendEmail({
      to: customerEmail,
      subject: `Votre commande DubaiNegoce #${orderId.substring(0, 8)} est en route`,
      html,
      replyTo: 'contact@dubainegoce.fr',
    });

    if (!emailResult.success) {
      // Ne pas annuler l'expedition pour un echec d'e-mail : le colis est parti.
      console.error(`[orders/ship] E-mail d'expédition non envoyé : ${emailResult.error}`);
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: `Commande marquée expédiée, mais l'e-mail a échoué : ${emailResult.error}`,
      });
    }

    console.log(`[orders/ship] Commande ${orderId} expédiée (${tracking}), client prévenu.`);
    return NextResponse.json({
      success: true,
      emailSent: true,
      trackingNumber: tracking,
      carrier: resolvedCarrier,
      shippedAt,
    });
  } catch (error: any) {
    console.error('[orders/ship] Erreur :', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur interne.' },
      { status: 500 }
    );
  }
}
