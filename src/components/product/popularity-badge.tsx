'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';

interface PopularityBadgeProps {
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  purchaseCount?: number;
}

/**
 * Génère un nombre simulé de "découvertes" pour un produit
 */
function generatePurchaseCount(baseRating: number = 4.5): number {
  // Simulation réaliste: plus la note est élevée, plus il y a de ventes
  const baseCount = Math.floor(baseRating * 150);
  const variance = Math.floor(Math.random() * 200) - 100;
  return Math.max(100, baseCount + variance);
}

export function PopularityBadge({
  isNew = false,
  isBestseller = false,
  rating = 4.5,
  purchaseCount: initialPurchaseCount,
}: PopularityBadgeProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const purchaseCount = initialPurchaseCount || generatePurchaseCount(rating);

  useEffect(() => {
    setMounted(true);

    // Animation count-up
    const target = purchaseCount;
    const duration = 2000; // 2 secondes
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-quad)
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(target * easeProgress);

      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [purchaseCount]);

  if (!mounted) {
    return null;
  }

  // N'afficher que si c'est nouveau OU si c'est un bestseller
  if (!isNew && !isBestseller) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full border border-accent/30 hover:border-accent/50 transition-colors">
      {isNew && (
        <>
          <span className="text-accent font-headline font-bold text-sm">🆕 NOUVEAU</span>
          <span className="text-muted-foreground text-xs">|</span>
        </>
      )}

      {isBestseller && (
        <>
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-accent font-headline font-bold text-sm">BESTSELLER</span>
          <span className="text-muted-foreground text-xs">|</span>
        </>
      )}

      <TrendingUp className="h-4 w-4 text-accent" />
      <span className="text-accent-foreground font-semibold text-sm">
        Découvert par <span className="font-headline text-accent">{displayCount.toLocaleString('fr-FR')}</span> clients
      </span>
    </div>
  );
}
