'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Eye, ShoppingCart } from 'lucide-react';
import { adminFetch } from '@/lib/admin-fetch';

interface ProductStats {
  id: string;
  name: string;
  brand: string;
  price: number;
  totalSales: number;
  estimatedViews: number;
  revenue: number;
  conversionRate: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    'revenue' | 'sales' | 'conversion' | 'name'
  >('revenue');

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await adminFetch('/api/admin/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();

        // Sort by selected criteria
        const sorted = [...data].sort((a: ProductStats, b: ProductStats) => {
          switch (sortBy) {
            case 'revenue':
              return b.revenue - a.revenue;
            case 'sales':
              return b.totalSales - a.totalSales;
            case 'conversion':
              return b.conversionRate - a.conversionRate;
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });

        setProducts(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product stats:', error);
        setLoading(false);
      }
    };

    fetchProductStats();
  }, [sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.totalSales, 0);
  const avgConversion =
    Math.round(
      (products.reduce((sum, p) => sum + p.conversionRate, 0) /
        totalProducts) *
        10
    ) / 10;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Produits</h1>
        <p className="text-muted-foreground">
          Performance et statistiques de chaque produit
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Produits"
          value={totalProducts.toString()}
          icon="🛍️"
        />
        <SummaryCard
          label="Ventes Totales"
          value={totalSales.toString()}
          icon="📦"
        />
        <SummaryCard
          label="Revenu Total"
          value={`${totalRevenue.toLocaleString('fr-FR')} €`}
          icon="💰"
        />
        <SummaryCard
          label="Conversion Moy."
          value={`${avgConversion}%`}
          icon="📊"
        />
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('revenue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'revenue'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Par Revenu
        </button>
        <button
          onClick={() => setSortBy('sales')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'sales'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Par Ventes
        </button>
        <button
          onClick={() => setSortBy('conversion')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'conversion'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Par Conversion
        </button>
        <button
          onClick={() => setSortBy('name')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            sortBy === 'name'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Par Nom
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Produit
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Marque
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Prix
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                Ventes
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                Vues
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                Conversion
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Revenu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {product.id}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.brand}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                  {product.price}€
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-foreground">
                      {product.totalSales}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-foreground">
                      {product.estimatedViews}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-foreground">
                      {product.conversionRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-foreground">
                    {product.revenue.toLocaleString('fr-FR')}€
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">📊 Données</h3>
        <p className="text-sm text-muted-foreground">
          Les statistiques sont mises à jour en temps réel depuis votre base de
          données Firestore. Les vues estimées sont calculées selon un ratio
          standard de 20 vues par vente.
        </p>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
