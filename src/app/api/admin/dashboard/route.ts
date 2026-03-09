import { firestore } from '@/firebase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    // Fetch orders
    const ordersSnapshot = await firestore.collection('orders').get();
    const orders: any[] = [];
    let totalRevenue = 0;
    let todayOrders = 0;
    let todayRevenue = 0;

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      orders.push(order);
      const orderTotal = order.total || 0;
      totalRevenue += orderTotal;

      const createdAt = order.createdAt;
      if (createdAt) {
        const orderDate = createdAt.toDate?.()
          ? createdAt.toDate()
          : new Date(createdAt);
        if (orderDate >= today) {
          todayOrders++;
          todayRevenue += orderTotal;
        }
      }
    });

    // Fetch users
    const usersSnapshot = await firestore.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Fetch emails
    const emailsSnapshot = await firestore.collection('emailLogs').get();
    const emailsSent = emailsSnapshot.size;

    let emailsOpened = 0;
    emailsSnapshot.forEach((doc) => {
      if ((doc.data() as any).opened) {
        emailsOpened++;
      }
    });

    const metrics = {
      totalOrders: orders.length,
      totalRevenue,
      todayOrders,
      todayRevenue,
      totalUsers,
      totalPageViews: totalUsers * 5,
      conversionRate:
        totalUsers > 0 ? Math.round((orders.length / totalUsers) * 100) : 0,
      avgOrderValue:
        orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      emailsSent,
      emailOpenRate:
        emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
