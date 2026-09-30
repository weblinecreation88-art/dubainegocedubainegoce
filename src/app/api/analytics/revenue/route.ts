import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.nextUrl.searchParams.get('apiKey');

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Query all orders from all users
    const usersSnapshot = await firestore.collection('users').get();
    const orders: any[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const ordersSnapshot = await firestore
        .collection('users')
        .doc(userDoc.id)
        .collection('orders')
        .where('orderDate', '>=', startDate.toISOString())
        .where('orderDate', '<=', endDate.toISOString())
        .get();

      ordersSnapshot.docs.forEach(doc => {
        orders.push({
          userId: userDoc.id,
          ...doc.data()
        });
      });
    }

    // Calculate metrics
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by date
    const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach((order: any) => {
      const date = order.orderDate?.split('T')[0] || new Date().toISOString().split('T')[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = { revenue: 0, orders: 0 };
      }
      revenueByDay[date].revenue += order.totalAmount || 0;
      revenueByDay[date].orders += 1;
    });

    // Group by product
    const revenueByProduct: Record<string, { name: string; revenue: number; quantity: number }> = {};
    orders.forEach((order: any) => {
      order.orderItems?.forEach((item: any) => {
        const productId = item.productId;
        if (!revenueByProduct[productId]) {
          revenueByProduct[productId] = {
            name: item.name || 'Unknown',
            revenue: 0,
            quantity: 0
          };
        }
        revenueByProduct[productId].revenue += item.itemPrice * item.quantity;
        revenueByProduct[productId].quantity += item.quantity;
      });
    });

    // Conversion metrics
    const conversionMetrics = {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
    };

    return NextResponse.json({
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days
      },
      summary: conversionMetrics,
      revenueByDay,
      topProducts: Object.entries(revenueByProduct)
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 10)
        .map(([id, data]) => ({
          productId: id,
          ...data
        }))
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
