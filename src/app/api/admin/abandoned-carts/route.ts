import { firestore } from '@/firebase/server';
import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export interface AbandonedCartData {
  id: string;
  userId: string;
  email: string;
  cartValue: number;
  itemCount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: 'active' | 'expired' | 'recovered';
  createdAt: string;
  daysSinceAbandonment: number;
  emailsSent: {
    day3: boolean;
    day7: boolean;
  };
  recoveryEmail?: {
    sentAt: string;
    promoCode: string;
    discount: number;
  };
}

export interface AbandonedCartsStats {
  totalCarts: number;
  totalValue: number;
  recoveryRate: number;
  avgRecoveryTime: number;
  activeCartsCount: number;
  expiredCartsCount: number;
  recoveredCartsCount: number;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all'; // all, active, expired, recovered
    const days = parseInt(searchParams.get('days') || '30'); // Last N days

    // Calculate date range
    const now = new Date();
    const dateFrom = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Fetch abandoned carts - build query with proper chaining
    let query = firestore.collection('abandoned_carts').where('createdAt', '>=', dateFrom.toISOString());

    // Filter by status if specified
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();

    const carts: AbandonedCartData[] = [];
    let totalValue = 0;
    let recoveredCount = 0;
    let activeDaysSum = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() as any;
      const createdAt = new Date(data.createdAt);
      const daysSince = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      const cartData: AbandonedCartData = {
        id: doc.id,
        userId: data.userId,
        email: data.email,
        cartValue: data.cartValue || 0,
        itemCount: data.cartSnapshot?.length || 0,
        items: (data.cartSnapshot || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        status: data.status || 'active',
        createdAt: data.createdAt,
        daysSinceAbandonment: daysSince,
        emailsSent: {
          day3: data.emailsSent?.day3 || false,
          day7: data.emailsSent?.day7 || false,
        },
        ...(data.recoveryEmail && {
          recoveryEmail: {
            sentAt: data.recoveryEmail.sentAt,
            promoCode: data.recoveryEmail.promoCode,
            discount: data.recoveryEmail.discount,
          },
        }),
      };

      carts.push(cartData);
      totalValue += cartData.cartValue;

      if (cartData.status === 'recovered') {
        recoveredCount++;
        activeDaysSum += daysSince;
      }
    }

    // Calculate stats
    const stats: AbandonedCartsStats = {
      totalCarts: snapshot.size,
      totalValue,
      recoveryRate: snapshot.size > 0 ? Math.round((recoveredCount / snapshot.size) * 100) : 0,
      avgRecoveryTime: recoveredCount > 0 ? Math.round(activeDaysSum / recoveredCount) : 0,
      activeCartsCount: carts.filter(c => c.status === 'active').length,
      expiredCartsCount: carts.filter(c => c.status === 'expired').length,
      recoveredCartsCount: recoveredCount,
    };

    return NextResponse.json({
      carts,
      stats,
    });
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}

/**
 * Mark a cart as recovered
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { cartId, action } = body;

    if (!cartId || !action) {
      return NextResponse.json(
        { error: 'cartId and action are required' },
        { status: 400 }
      );
    }

    if (action === 'mark-recovered') {
      await firestore
        .collection('abandoned_carts')
        .doc(cartId)
        .update({
          status: 'recovered',
          recoveredAt: new Date().toISOString(),
        });

      return NextResponse.json({ success: true, message: 'Cart marked as recovered' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
