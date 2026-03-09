'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock } from 'lucide-react';

interface LimitedOfferBannerProps {
  isBestseller?: boolean;
  isNew?: boolean;
  stock?: number;
  hasFlashOffer?: boolean;
}

export function LimitedOfferBanner({
  isBestseller = false,
  isNew = false,
  stock = 0,
  hasFlashOffer = false,
}: LimitedOfferBannerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Calculer le temps restant jusqu'à demain minuit
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  const showUrgencyBanner =
    (isBestseller && stock <= 5) || (isNew && stock <= 3) || hasFlashOffer;

  if (!showUrgencyBanner) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-accent/80 to-accent/60 rounded-lg p-4 mb-6 border border-accent/30 shadow-lg animate-pulse-subtle">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Icon & Title */}
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-accent-foreground animate-bounce" style={{ animationDuration: '2s' }} />
          <div className="text-accent-foreground font-semibold">
            {hasFlashOffer && '🎁 PROMOTION: -15% cette semaine!'}
            {!hasFlashOffer && isBestseller && '⭐ MEILLEURE VENTE - Stocks limités!'}
            {!hasFlashOffer && isNew && !isBestseller && '🆕 NOUVEAU! Très demandé!'}
          </div>
        </div>

        {/* Countdown timer si promotion flash */}
        {hasFlashOffer && (
          <div className="ml-auto flex items-center gap-2 text-sm text-accent-foreground font-semibold">
            <Clock className="h-4 w-4" />
            <span>Expire dans {timeLeft}</span>
          </div>
        )}

        {/* Stock warning si peu en stock */}
        {stock > 0 && stock <= 5 && (
          <div className="ml-auto text-sm text-accent-foreground font-semibold">
            ⚠️ Seulement {stock} unité{stock > 1 ? 's' : ''} à ce prix!
          </div>
        )}
      </div>

      {/* Progress bar */}
      {stock > 0 && stock <= 10 && (
        <div className="mt-3 w-full bg-accent-foreground/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent-foreground h-full transition-all duration-300 rounded-full"
            style={{ width: `${(stock / 10) * 100}%` }}
          />
        </div>
      )}

      {/* CTA text */}
      <p className="text-xs text-accent-foreground/80 mt-2 italic">
        Achetez maintenant avant rupture de stock
      </p>
    </div>
  );
}
