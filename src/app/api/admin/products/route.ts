import { adminGuard } from '@/lib/admin-auth';
import { firestore } from '@/firebase/server';
import { NextResponse, NextRequest } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET(request: NextRequest) {
  const denied = await adminGuard(request);
  if (denied) return denied;

  try {
    const allProducts = getProducts();
    const ordersSnapshot = await firestore.collection('orders').get();

    const productSalesMap = new Map<
      string,
      { sales: number; revenue: number }
    >();

    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      const items = order.items || [];
      items.forEach((item: any) => {
        const key = item.productId || item.id;
        const current = productSalesMap.get(key) || {
          sales: 0,
          revenue: 0,
        };
        current.sales++;
        current.revenue += (item.price || 0) * (item.quantity || 1);
        productSalesMap.set(key, current);
      });
    });

    // Combine product data with sales data
    const productStats = allProducts.map((product) => {
      const salesData = productSalesMap.get(product.id) || {
        sales: 0,
        revenue: 0,
      };
      const estimatedViews = Math.max(
        salesData.sales * 20,
        Math.floor(Math.random() * 500) + 50
      );
      const conversionRate =
        estimatedViews > 0
          ? Math.round((salesData.sales / estimatedViews) * 100)
          : 0;

      return {
        id: product.id,
        name: product.name,
        brand: product.brand.name,
        price: product.price,
        totalSales: salesData.sales,
        estimatedViews,
        revenue: Math.round(salesData.revenue),
        conversionRate,
      };
    });

    return NextResponse.json(productStats);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
