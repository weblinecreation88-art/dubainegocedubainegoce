'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  Mail,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { adminFetch } from '@/lib/admin-fetch';

interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  totalUsers: number;
  totalPageViews: number;
  conversionRate: number;
  avgOrderValue: number;
  emailsSent: number;
  emailOpenRate: number;
  loading: boolean;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    totalUsers: 0,
    totalPageViews: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    emailsSent: 0,
    emailOpenRate: 0,
    loading: true,
  });
  const auth = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminFetch(auth, '/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics({ ...data, loading: false });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setMetrics((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [auth]);

  if (metrics.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des métriques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos métriques principales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenu Total"
          value={`${metrics.totalRevenue.toLocaleString('fr-FR')} €`}
          change={`+${metrics.todayRevenue.toLocaleString('fr-FR')} € aujourd'hui`}
          icon={<DollarSign className="h-6 w-6" />}
          bgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />

        <MetricCard
          title="Commandes"
          value={metrics.totalOrders.toString()}
          change={`+${metrics.todayOrders} aujourd'hui`}
          icon={<ShoppingCart className="h-6 w-6" />}
          bgColor="bg-green-500/10"
          iconColor="text-green-500"
        />

        <MetricCard
          title="Utilisateurs"
          value={metrics.totalUsers.toString()}
          change={`${metrics.conversionRate}% taux de conversion`}
          icon={<Users className="h-6 w-6" />}
          bgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />

        <MetricCard
          title="Panier Moyen"
          value={`${metrics.avgOrderValue} €`}
          change={`${metrics.totalPageViews.toLocaleString('fr-FR')} pages vues`}
          icon={<TrendingUp className="h-6 w-6" />}
          bgColor="bg-orange-500/10"
          iconColor="text-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Emails Envoyés"
          value={metrics.emailsSent.toString()}
          change={`${metrics.emailOpenRate}% taux d'ouverture`}
          icon={<Mail className="h-6 w-6" />}
          bgColor="bg-indigo-500/10"
          iconColor="text-indigo-500"
        />

        <MetricCard
          title="Vues de Pages"
          value={metrics.totalPageViews.toString()}
          change={`Moyenne: ${(metrics.totalPageViews / Math.max(metrics.totalUsers, 1)).toFixed(1)} pages/utilisateur`}
          icon={<Eye className="h-6 w-6" />}
          bgColor="bg-pink-500/10"
          iconColor="text-pink-500"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Résumé d'Aujourd'hui</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Commandes</p>
            <p className="text-2xl font-bold text-foreground">{metrics.todayOrders}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Revenu</p>
            <p className="text-2xl font-bold text-foreground">{metrics.todayRevenue}€</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Panier Moyen</p>
            <p className="text-2xl font-bold text-foreground">
              {metrics.todayOrders > 0 ? Math.round(metrics.todayRevenue / metrics.todayOrders) : 0}€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

function MetricCard({
  title,
  value,
  change,
  icon,
  bgColor,
  iconColor,
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{change}</p>
    </div>
  );
}
