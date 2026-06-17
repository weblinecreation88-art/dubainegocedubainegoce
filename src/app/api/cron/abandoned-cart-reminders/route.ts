import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';
import { Resend } from 'resend';
import { renderAbandonedCartDay1Email, renderAbandonedCartDay3Email, renderAbandonedCartDay7Email } from '@/lib/email-templates/abandoned-cart';

const fromEmail = process.env.FROM_EMAIL || 'contact@dubainegoce.fr';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const PROMO_CODE = 'COMEBACK5';

// Create Resend instance dynamically to avoid build-time initialization
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

export const dynamic = 'force-dynamic';

// Helper to check if date is exactly N days old
function isExactlyNDaysOld(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Check if between N and N+1 days
  return diffDays >= days && diffDays < days + 1;
}

// Verify Vercel cron auth header (optional but recommended)
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  // For Vercel cron, this is a security token. Set in your deployment.
  // Or use a simple API key for testing
  const expectedToken = process.env.CRON_SECRET;
  return expectedToken ? authHeader === `Bearer ${expectedToken}` : true;
}

async function sendAbandonedCartReminders() {
  if (!firestore) {
    console.error('Firestore not configured');
    return { success: false, message: 'Firestore not configured' };
  }

  let resend;
  try {
    resend = getResendClient();
  } catch (error) {
    console.error('Resend not configured:', error);
    return { success: false, message: 'Resend not configured' };
  }

  try {
    const abandonedCartsRef = firestore.collection('abandoned_carts');

    // Get all active abandoned carts
    const snapshot = await abandonedCartsRef
      .where('status', '==', 'active')
      .get();

    let day1Count = 0;
    let day3Count = 0;
    let day7Count = 0;
    const errors: string[] = [];

    for (const doc of snapshot.docs) {
      const cart = doc.data();

      try {
        // ── Email J+1 : rappel doux (pas de promo, 3× plus efficace que J+3) ──
        if (!cart.emailsSent?.day1 && isExactlyNDaysOld(cart.createdAt, 1)) {
          const orders = await firestore
            .collection('users')
            .doc(cart.userId)
            .collection('orders')
            .where('orderDate', '>', cart.createdAt)
            .limit(1)
            .get();

          if (orders.empty) {
            const cartLink = `${appUrl}/cart`;
            const customerName = cart.email.split('@')[0];

            const emailHtml = renderAbandonedCartDay1Email(
              customerName,
              cart.cartSnapshot,
              cart.cartValue,
              cartLink
            );

            const resendClient = getResendClient();
            await resendClient.emails.send({
              from: `Dubainegoce <${fromEmail}>`,
              to: [cart.email],
              subject: `${customerName}, vos parfums vous attendent 🛒`,
              html: emailHtml
            });

            await doc.ref.update({ 'emailsSent.day1': true });
            day1Count++;
            console.log(`[Day 1] Email sent to ${cart.email}`);
          }
        }

        // ── Email J+3 : avec code promo ──
        if (!cart.emailsSent?.day3 && isExactlyNDaysOld(cart.createdAt, 3)) {
          // Check if user hasn't ordered in the meantime
          const orders = await firestore
            .collection('users')
            .doc(cart.userId)
            .collection('orders')
            .where('orderDate', '>', cart.createdAt)
            .limit(1)
            .get();

          if (orders.empty) {
            // Send email
            const cartLink = `${appUrl}/cart?promo=${PROMO_CODE}`;
            const customerName = cart.email.split('@')[0];

            const emailHtml = renderAbandonedCartDay3Email(
              customerName,
              cart.cartSnapshot,
              cart.cartValue,
              PROMO_CODE,
              cartLink
            );

            const resendClient = getResendClient();
            await resendClient.emails.send({
              from: `DubaiNegoce <${fromEmail}>`,
              to: [cart.email],
              subject: '⏰ Vous avez oublié vos parfums! 5% de réduction valable 7 jours',
              html: emailHtml
            });

            // Mark as sent
            await doc.ref.update({ 'emailsSent.day3': true });
            day3Count++;
            console.log(`[Day 3] Email sent to ${cart.email}`);
          }
        }

        // ── Email J+7 : dernière chance ──
        if (!cart.emailsSent?.day7 && isExactlyNDaysOld(cart.createdAt, 7)) {
          // Check if user hasn't ordered in the meantime
          const orders = await firestore
            .collection('users')
            .doc(cart.userId)
            .collection('orders')
            .where('orderDate', '>', cart.createdAt)
            .limit(1)
            .get();

          if (orders.empty) {
            // Send email
            const cartLink = `${appUrl}/cart?promo=${PROMO_CODE}`;
            const customerName = cart.email.split('@')[0];

            const emailHtml = renderAbandonedCartDay7Email(
              customerName,
              cart.cartSnapshot,
              cart.cartValue,
              PROMO_CODE,
              cartLink,
              5
            );

            const resendClient = getResendClient();
            await resendClient.emails.send({
              from: `DubaiNegoce <${fromEmail}>`,
              to: [cart.email],
              subject: '⏰ DERNIER RAPPEL: Votre réduction de 5% expire demain!',
              html: emailHtml
            });

            // Mark as sent and expire cart
            await doc.ref.update({
              'emailsSent.day7': true,
              status: 'expired'
            });
            day7Count++;
            console.log(`[Day 7] Email sent to ${cart.email}`);
          }
        }

      } catch (error: any) {
        const errorMsg = `Error processing cart ${doc.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return {
      success: true,
      day1Sent: day1Count,
      day3Sent: day3Count,
      day7Sent: day7Count,
      errors
    };

  } catch (error: any) {
    console.error('[sendAbandonedCartReminders] Fatal error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

export async function GET(request: NextRequest) {
  // Verify cron auth
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendAbandonedCartReminders();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// For manual testing/triggering
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendAbandonedCartReminders();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
