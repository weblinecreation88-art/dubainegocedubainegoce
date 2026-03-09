'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, TrendingUp, Clock, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AbandonedCartData {
  id: string;
  userId: string;
  email: string;
  cartValue: number;
  itemCount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: 'active' | 'expired' | 'recovered';
  createdAt: string;
  daysSinceAbandonment: number;
  emailsSent: {
    day3: boolean;
    day7: boolean;
  };
  recoveryEmail?: {
    sentAt: string;
    promoCode: string;
    discount: number;
  };
}

interface Stats {
  totalCarts: number;
  totalValue: number;
  recoveryRate: number;
  avgRecoveryTime: number;
  activeCartsCount: number;
  expiredCartsCount: number;
  recoveredCartsCount: number;
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCartData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch abandoned carts
  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedStatus !== 'all') params.append('status', selectedStatus);
        params.append('days', selectedDays.toString());

        const response = await fetch(`/api/admin/abandoned-carts?${params}`);
        if (!response.ok) throw new Error('Failed to fetch carts');

        const data = await response.json();
        setCarts(data.carts);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching carts:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les paniers abandonnés',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, [selectedStatus, selectedDays, toast]);

  const handleSendRecoveryEmail = async (cartId: string, email: string) => {
    setSendingEmail(cartId);
    try {
      const response = await fetch('/api/admin/send-recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          promoCode: 'COMEBACK5',
          discount: 5,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast({
        title: 'Succès',
        description: `Email de récupération envoyé à ${email}`,
      });

      // Refresh carts
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      params.append('days', selectedDays.toString());
      const refreshResponse = await fetch(`/api/admin/abandoned-carts?${params}`);
      const data = await refreshResponse.json();
      setCarts(data.carts);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'email',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const handleMarkRecovered = async (cartId: string) => {
    try {
      const response = await fetch('/api/admin/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          action: 'mark-recovered',
        }),
      });

      if (!response.ok) throw new Error('Failed to update cart');

      toast({
        title: 'Succès',
        description: 'Panier marqué comme récupéré',
      });

      // Update local state
      setCarts(carts.map(c => c.id === cartId ? { ...c, status: 'recovered' } : c));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le panier',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      expired: 'secondary',
      recovered: 'outline',
    };

    const labels: Record<string, string> = {
      active: 'Actif',
      expired: 'Expiré',
      recovered: 'Récupéré',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto" />
          <p className="text-muted-foreground">Chargement des paniers abandonnés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Paniers Abandonnés</h1>
        <p className="text-muted-foreground">Gérez et récupérez les paniers laissés sans finaliser</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Abandonnés"
            value={stats.totalCarts.toString()}
            change={`${stats.activeCartsCount} actifs`}
            icon={<ShoppingCart className="h-6 w-6" />}
            bgColor="bg-orange-500/10"
            iconColor="text-orange-500"
          />
          <MetricCard
            title="Valeur Totale"
            value={`${stats.totalValue.toLocaleString('fr-FR')} €`}
            change={`Panier moyen: ${stats.totalCarts > 0 ? Math.round(stats.totalValue / stats.totalCarts) : 0}€`}
            icon={<DollarSign className="h-6 w-6" />}
            bgColor="bg-green-500/10"
            iconColor="text-green-500"
          />
          <MetricCard
            title="Taux de Récupération"
            value={`${stats.recoveryRate}%`}
            change={`${stats.recoveredCartsCount} récupérés`}
            icon={<TrendingUp className="h-6 w-6" />}
            bgColor="bg-blue-500/10"
            iconColor="text-blue-500"
          />
          <MetricCard
            title="Temps Moyen"
            value={`${stats.avgRecoveryTime} jours`}
            change={`Avant récupération`}
            icon={<Clock className="h-6 w-6" />}
            bgColor="bg-purple-500/10"
            iconColor="text-purple-500"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="space-y-2">
          <p className="text-sm font-medium">Statut:</p>
          <div className="flex gap-2">
            {['all', 'active', 'expired', 'recovered'].map(status => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'all' ? 'Tous' : status === 'active' ? 'Actifs' : status === 'expired' ? 'Expirés' : 'Récupérés'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Période:</p>
          <div className="flex gap-2">
            {[7, 30, 90].map(days => (
              <Button
                key={days}
                variant={selectedDays === days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDays(days)}
              >
                {days} jours
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Paniers ({carts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">Aucun panier abandonné trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Valeur</th>
                    <th className="text-left p-3 font-semibold">Articles</th>
                    <th className="text-left p-3 font-semibold">Créé</th>
                    <th className="text-left p-3 font-semibold">Jours</th>
                    <th className="text-left p-3 font-semibold">Statut</th>
                    <th className="text-left p-3 font-semibold">Emails</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map(cart => (
                    <tr key={cart.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <a href={`mailto:${cart.email}`} className="text-accent hover:underline">
                          {cart.email}
                        </a>
                      </td>
                      <td className="p-3 font-semibold">{cart.cartValue.toFixed(2)}€</td>
                      <td className="p-3">{cart.itemCount} article(s)</td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {new Date(cart.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3">{cart.daysSinceAbandonment}j</td>
                      <td className="p-3">{getStatusBadge(cart.status)}</td>
                      <td className="p-3 text-xs">
                        {cart.emailsSent.day3 && <Badge variant="outline" className="mr-1">J3</Badge>}
                        {cart.emailsSent.day7 && <Badge variant="outline">J7</Badge>}
                        {!cart.emailsSent.day3 && !cart.emailsSent.day7 && <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={sendingEmail === cart.id || cart.status === 'recovered'}
                          onClick={() => handleSendRecoveryEmail(cart.id, cart.email)}
                          className="gap-1"
                        >
                          <Mail className="h-4 w-4" />
                          {sendingEmail === cart.id ? 'Envoi...' : 'Email'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">💡 Conseil:</p>
            <p>Les emails de récupération sont automatiquement envoyés à J+3 et J+7. Vous pouvez aussi les envoyer manuellement.</p>
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
