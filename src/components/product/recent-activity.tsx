'use client';

import { useState, useEffect } from 'react';
import { Users, ShoppingBag, Clock } from 'lucide-react';

interface RecentActivityProps {
  productName?: string;
  viewersCount?: number;
  salesTodayCount?: number;
  lastSaleMinutesAgo?: number;
}

/**
 * Génère des données réalistes d'activité simulée
 */
function generateActivityData() {
  // Entre 1 et 5 personnes regardent en ce moment
  const viewers = Math.floor(Math.random() * 5) + 1;

  // Entre 3 et 15 ventes aujourd'hui
  const salesToday = Math.floor(Math.random() * 12) + 3;

  // Dernière vente il y a entre 5 et 120 minutes
  const lastSaleMinutes = Math.floor(Math.random() * 115) + 5;

  return { viewers, salesToday, lastSaleMinutes };
}

export function RecentActivity({
  productName = 'ce produit',
  viewersCount,
  salesTodayCount,
  lastSaleMinutesAgo,
}: RecentActivityProps) {
  const [activity, setActivity] = useState({
    viewers: 0,
    salesToday: 0,
    lastSaleMinutes: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Utiliser les données fournies ou générer des données simulées
    const data = {
      viewers: viewersCount || Math.floor(Math.random() * 5) + 1,
      salesToday: salesTodayCount || Math.floor(Math.random() * 12) + 3,
      lastSaleMinutes: lastSaleMinutesAgo || Math.floor(Math.random() * 115) + 5,
    };

    setActivity(data);

    // Mettre à jour les viewers toutes les 30 secondes (simule le changement)
    const interval = setInterval(() => {
      setActivity(prev => ({
        ...prev,
        viewers: Math.floor(Math.random() * 6) + 1,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, [viewersCount, salesTodayCount, lastSaleMinutesAgo]);

  if (!mounted) {
    return null;
  }

  const formatLastSale = (minutes: number): string => {
    if (minutes < 60) {
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full mt-8 space-y-3 p-5 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-muted/50">
      {/* Personnes regardent */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex-shrink-0">
          <Users className="h-5 w-5 text-accent animate-pulse" />
        </div>
        <div className="flex-grow">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{activity.viewers} personne{activity.viewers > 1 ? 's' : ''}</span> regarde{activity.viewers > 1 ? 'nt' : ''} {productName} en ce moment
          </p>
        </div>
      </div>

      {/* Ventes aujourd'hui */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex-shrink-0">
          <ShoppingBag className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-grow">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{activity.salesToday} vente{activity.salesToday > 1 ? 's' : ''}</span> aujourd'hui
          </p>
        </div>
      </div>

      {/* Dernière vente */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex-shrink-0">
          <Clock className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-grow">
          <p className="text-muted-foreground">
            Dernière vente: <span className="font-semibold text-foreground">{formatLastSale(activity.lastSaleMinutes)}</span>
          </p>
        </div>
      </div>

      {/* Note de confiance */}
      <p className="text-xs text-muted-foreground italic pt-2 border-t border-muted/30">
        ✅ Cet article est très demandé - Achetez maintenant pour éviter les délais
      </p>
    </div>
  );
}
