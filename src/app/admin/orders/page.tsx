'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  total: number;
  itemCount: number;
  status: string;
  createdAt: Date;
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const ordersData: Order[] = [];

        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            userId: data.userId || 'unknown',
            userEmail: data.userEmail || data.email || 'N/A',
            total: data.total || 0,
            itemCount: (data.items || []).length,
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            items: data.items || [],
          });
        });

        // Sort by date (newest first)
        ordersData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const stats = {
    total: orders.length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    average: Math.round(
      orders.reduce((sum, o) => sum + o.total, 0) / Math.max(orders.length, 1)
    ),
    pending: orders.filter((o) => o.status === 'pending').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'ComplétéE ✅';
      case 'pending':
        return 'En Attente ⏳';
      case 'cancelled':
        return 'Annulée ❌';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
        <p className="text-muted-foreground">Gestion et suivi de toutes les commandes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Commandes"
          value={stats.total.toString()}
          color="bg-blue-500"
        />
        <StatCard
          label="Revenu Total"
          value={`${stats.revenue.toLocaleString('fr-FR')} €`}
          color="bg-green-500"
        />
        <StatCard
          label="Panier Moyen"
          value={`${stats.average} €`}
          color="bg-purple-500"
        />
        <StatCard
          label="En Attente"
          value={stats.pending.toString()}
          color="bg-yellow-500"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Toutes ({stats.total})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'completed'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Complétées ({stats.completed})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          En Attente ({stats.pending})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                ID Commande
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Email Client
              </th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">
                Articles
              </th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">
                Total
              </th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">
                Statut
              </th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-accent">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-foreground font-medium">
                        {order.userEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-foreground">
                      {order.itemCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground text-lg">
                      {order.total.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {format(order.createdAt, 'dd MMM yyyy HH:mm', {
                      locale: fr,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">Aucune commande trouvée</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">💡 Actions</h3>
        <p className="text-sm text-muted-foreground">
          Vous pouvez cliquer sur une commande pour voir les détails complets et
          gérer le statut.
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <div className={`w-8 h-8 rounded-lg ${color}`} />
      </div>
    </div>
  );
}
