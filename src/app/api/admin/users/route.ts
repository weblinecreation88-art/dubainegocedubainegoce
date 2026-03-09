import { firestore } from '@/firebase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    const ordersSnapshot = await firestore.collection('orders').get();

    const userOrdersMap = new Map<string, { count: number; total: number }>();

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      const userId = order.userId;
      const current = userOrdersMap.get(userId) || { count: 0, total: 0 };
      current.count++;
      current.total += order.total || 0;
      userOrdersMap.set(userId, current);
    });

    const users: any[] = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const orders = userOrdersMap.get(doc.id) || { count: 0, total: 0 };

      users.push({
        id: doc.id,
        email: userData.email,
        displayName: userData.displayName,
        createdAt: userData.createdAt?.toDate?.() || new Date(),
        orderCount: orders.count,
        totalSpent: orders.total,
      });
    });

    // Sort by creation date (newest first)
    users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
