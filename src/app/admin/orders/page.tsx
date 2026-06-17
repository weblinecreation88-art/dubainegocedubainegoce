'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { adminFetch } from '@/lib/admin-fetch';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  total: number;
  itemCount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const auth = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminFetch(auth, '/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth]);

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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
        <p className="text-muted-foreground">Gestion et suivi de toutes les commandes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Commandes" value={stats.total.toString()} color="bg-blue-500" />
        <StatCard label="Revenu Total" value={`${stats.revenue.toLocaleString('fr-FR')} €`} color="bg-green-500" />
        <StatCard label="Panier Moyen" value={`${stats.average} €`} color="bg-purple-500" />
        <StatCard label="En Attente" value={stats.pending.toString()} color="bg-yellow-500" />
      </div>

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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-foreground">ID Commande</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Email Client</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Articles</th>
              <th className="px-6 py-4 text-right font-semibold text-foreground">Total</th>
              <th className="px-6 py-4 text-center font-semibold text-foreground">Statut</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Date</th>
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
                    <p className="text-foreground font-medium">{order.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium text-foreground">{order.itemCount}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground text-lg">
                      {order.total.toLocaleString('fr-FR')} €
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
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
