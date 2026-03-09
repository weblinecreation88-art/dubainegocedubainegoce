import { firestore } from '@/firebase/server';
import { collection, getDocs } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ordersSnapshot = await getDocs(collection(firestore, 'orders'));
    const orders: any[] = [];

    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by date (newest first)
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
