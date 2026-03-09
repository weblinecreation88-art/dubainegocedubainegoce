'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/server';
import { collection, getDocs } from 'firebase/firestore';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsData {
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  topFamilies: { family: string; sales: number }[];
  conversionFunnel: { step: string; count: number }[];
  deviceStats: { device: string; visits: number }[];
  loading: boolean;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    dailyRevenue: [],
    topProducts: [],
    topFamilies: [],
    conversionFunnel: [],
    deviceStats: [],
    loading: true,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders: any[] = [];
        const dailyRevenueMap = new Map<string, number>();

        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data();
          orders.push(orderData);

          // Calculate daily revenue
          const createdAt = orderData.createdAt;
          if (createdAt) {
            const orderDate = createdAt.toDate?.()
              ? createdAt.toDate()
              : new Date(createdAt);
            const dateKey = orderDate.toISOString().split('T')[0];
            const current = dailyRevenueMap.get(dateKey) || 0;
            dailyRevenueMap.set(dateKey, current + (orderData.total || 0));
          }

          // Aggregate product sales
        });

        // Convert daily revenue to array and sort by date
        const dailyRevenue = Array.from(dailyRevenueMap.entries())
          .map(([date, revenue]) => ({ date, revenue }))
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(-30); // Last 30 days

        // Top products by sales
        const productSalesMap = new Map<string, { sales: number; revenue: number; name: string }>();
        orders.forEach((order: any) => {
          const items = order.items || [];
          items.forEach((item: any) => {
            const key = item.productId || item.id;
            const current = productSalesMap.get(key) || {
              sales: 0,
              revenue: 0,
              name: item.name || 'Produit inconnu',
            };
            current.sales++;
            current.revenue += item.price * item.quantity || 0;
            productSalesMap.set(key, current);
          });
        });

        const topProducts = Array.from(productSalesMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10);

        // Top families (simulated)
        const familyMap = new Map<string, number>();
        topProducts.forEach((product, index) => {
          const families = [
            'Oriental',
            'Frais',
            'Floral',
            'Boisé',
            'Fruité',
            'Musqué',
          ];
          const family = families[index % families.length];
          const current = familyMap.get(family) || 0;
          familyMap.set(family, current + product.sales);
        });

        const topFamilies = Array.from(familyMap.entries())
          .map(([family, sales]) => ({ family, sales }))
          .sort((a, b) => b.sales - a.sales);

        // Conversion funnel (estimated)
        const totalVisits = Math.ceil(orders.length * 20); // Estimated
        const conversions = orders.length;

        const conversionFunnel = [
          { step: 'Visiteurs', count: totalVisits },
          { step: 'Produit Consulté', count: Math.ceil(totalVisits * 0.6) },
          { step: 'Panier Ouvert', count: Math.ceil(totalVisits * 0.25) },
          { step: 'Achat Complété', count: conversions },
        ];

        // Device stats (simulated)
        const deviceStats = [
          { device: 'Mobile', visits: Math.ceil(totalVisits * 0.65) },
          { device: 'Desktop', visits: Math.ceil(totalVisits * 0.30) },
          { device: 'Tablette', visits: Math.ceil(totalVisits * 0.05) },
        ];

        setData({
          dailyRevenue,
          topProducts: topProducts.map((p) => ({
            name: p.name,
            sales: p.sales,
            revenue: Math.round(p.revenue),
          })),
          topFamilies,
          conversionFunnel,
          deviceStats,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchAnalytics();
  }, []);

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des analytiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytique</h1>
        <p className="text-muted-foreground">
          Analyse détaillée de vos performances
        </p>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenu Quotidien (Derniers 30 jours)
        </h2>
        <div className="h-64 flex items-end gap-1 justify-start overflow-x-auto pb-4">
          {data.dailyRevenue.map((item, index) => {
            const maxRevenue = Math.max(
              ...data.dailyRevenue.map((r) => r.revenue)
            );
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div
                key={index}
                className="flex-1 min-w-[20px] bg-accent rounded-t hover:bg-accent/80 transition-colors group relative"
                style={{ height: `${Math.max(height, 5)}%` }}
                title={`${item.date}: ${item.revenue}€`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {item.revenue}€
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products and Families */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top 10 Produits
          </h2>
          <div className="space-y-2">
            {data.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-accent w-6">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} ventes • {product.revenue}€
                    </p>
                  </div>
                </div>
                <div className="h-2 w-16 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{
                      width: `${
                        (product.sales /
                          Math.max(
                            ...data.topProducts.map((p) => p.sales)
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Families */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Familles Olfactives
          </h2>
          <div className="space-y-2">
            {data.topFamilies.map((family, index) => {
              const maxSales = Math.max(...data.topFamilies.map((f) => f.sales));
              const percentage = Math.round((family.sales / maxSales) * 100);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {family.family}
                    </span>
                    <span className="text-muted-foreground">
                      {family.sales} ventes
                    </span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversion Funnel & Device Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Entonnoir de Conversion
          </h2>
          <div className="space-y-3">
            {data.conversionFunnel.map((step, index) => {
              const percentage = Math.round(
                (step.count / data.conversionFunnel[0].count) * 100
              );
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {step.step}
                    </span>
                    <span className="text-muted-foreground">{step.count}</span>
                  </div>
                  <div
                    className="h-8 bg-accent rounded flex items-center px-3 transition-all"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-xs font-bold text-accent-foreground">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Appareils
          </h2>
          <div className="space-y-3">
            {data.deviceStats.map((device, index) => {
              const totalVisits = data.deviceStats.reduce(
                (sum, d) => sum + d.visits,
                0
              );
              const percentage = Math.round((device.visits / totalVisits) * 100);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {device.device}
                    </span>
                    <span className="text-muted-foreground">
                      {device.visits} visites
                    </span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
