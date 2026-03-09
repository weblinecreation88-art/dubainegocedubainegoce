'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Clock } from 'lucide-react';
import { useProductStats } from '@/hooks/useProductStats';

interface RecentActivityProps {
  productId: string;
  productName?: string;
}

/**
 * Affiche l'activité RÉELLE d'un produit basée sur les données Firestore
 * - Nombre réel de ventes aujourd'hui
 * - Dernière vente réelle
 * - Affichage discret si aucune donnée réelle disponible (pas de données simulées)
 */
export function RecentActivity({
  productId,
  productName = 'ce produit',
}: RecentActivityProps) {
  const { stats, isLoading } = useProductStats(productId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return null; // Don't show loading state - just return nothing
  }

  // If no real data exists, don't show the component
  // This prevents showing fake/simulated data
  if (!stats.hasRealData) {
    return null;
  }

  const formatLastSale = (isoDate: string | null): string => {
    if (!isoDate) return 'Aucune vente pour le moment';

    const saleDate = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - saleDate.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'à l\'instant';
    } else if (minutes < 60) {
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="w-full mt-8 space-y-3 p-5 bg-gradient-to-br from-accent/5 to-accent/2 rounded-lg border border-accent/20">
      {/* Ventes aujourd'hui - DONNÉE RÉELLE */}
      {stats.purchasesToday > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-shrink-0">
            <ShoppingBag className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-grow">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {stats.purchasesToday} vente{stats.purchasesToday > 1 ? 's' : ''}
              </span>{' '}
              aujourd'hui
            </p>
          </div>
        </div>
      )}

      {/* Dernière vente - DONNÉE RÉELLE */}
      {stats.lastPurchaseAt && (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-shrink-0">
            <Clock className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-grow">
            <p className="text-muted-foreground">
              Dernière vente:{' '}
              <span className="font-semibold text-foreground">
                {formatLastSale(stats.lastPurchaseAt)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Nombre total d'acheteurs - DONNÉE RÉELLE */}
      {stats.totalPurchases > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-shrink-0">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-grow">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {stats.totalPurchases} acheteur{stats.totalPurchases > 1 ? 's' : ''}
              </span>{' '}
              satisfait{stats.totalPurchases > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Badge de confiance basé sur données réelles */}
      <p className="text-xs text-muted-foreground italic pt-2 border-t border-accent/20">
        ✅ Données vérifiées - {stats.purchasesToday > 0 ? 'Achat' : 'Produit'} populaire
      </p>
    </div>
  );
}
