import { firestore } from '@/firebase/server';
import { NextRequest, NextResponse } from 'next/server';

interface ProductStats {
  productId: string;
  totalPurchases: number;
  purchasesToday: number;
  lastPurchaseAt: string | null;
  activeViewersEstimate: number;
  discoveredByCount: number;
  updatedAt: string;
}

/**
 * GET /api/products/[id]/stats
 * Fetch real product statistics from Firestore
 * Returns actual purchase data from orders collection
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Get all orders from Firestore
    const ordersSnapshot = await firestore.collection('orders').get();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    let totalPurchases = 0;
    let purchasesToday = 0;
    let lastPurchaseAt: string | null = null;

    // Iterate through orders to find ones containing this product
    ordersSnapshot.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      const items = orderData.items || [];

      // Check if this order contains our product
      const hasProduct = items.some(
        (item: any) => item.productId === productId || item.id === productId
      );

      if (hasProduct) {
        totalPurchases++;

        // Check if order is from today
        const createdAt = orderData.createdAt;
        if (createdAt) {
          const orderTime = createdAt.toDate?.()
            ? createdAt.toDate().getTime()
            : new Date(createdAt).getTime();

          if (orderTime >= todayTime) {
            purchasesToday++;
          }

          // Track most recent purchase
          if (!lastPurchaseAt || orderTime > new Date(lastPurchaseAt).getTime()) {
            lastPurchaseAt = new Date(orderTime).toISOString();
          }
        }
      }
    });

    // Calculate discovered count (realistic estimate: 3x view ratio)
    const discoveredByCount = Math.max(totalPurchases * 3, 0);

    const result: ProductStats & { hasRealData: boolean } = {
      productId,
      totalPurchases,
      purchasesToday,
      lastPurchaseAt,
      activeViewersEstimate: 0, // Reserved for future Firebase Analytics integration
      discoveredByCount,
      updatedAt: new Date().toISOString(),
      hasRealData: totalPurchases > 0,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching product stats:', error);

    // Graceful degradation - return empty stats instead of error
    return NextResponse.json({
      productId: params.id,
      totalPurchases: 0,
      purchasesToday: 0,
      lastPurchaseAt: null,
      activeViewersEstimate: 0,
      discoveredByCount: 0,
      updatedAt: new Date().toISOString(),
      hasRealData: false,
    } as ProductStats & { hasRealData: boolean });
  }
}
