'use client';

import { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { useProductStats } from '@/hooks/useProductStats';

interface PopularityBadgeProps {
  productId: string;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
}

/**
 * Affiche les badges de popularité basés sur DONNÉES RÉELLES
 * - "NOUVEAU" si isNew=true
 * - "BESTSELLER" si isBestseller=true
 * - Compte réel d'acheteurs découvrant le produit
 * - N'affiche PAS de faux chiffres (graceful degradation)
 */
export function PopularityBadge({
  productId,
  isNew = false,
  isBestseller = false,
  rating = 4.5,
}: PopularityBadgeProps) {
  const { stats, isLoading } = useProductStats(productId);
  const [displayCount, setDisplayCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading || !stats.hasRealData) {
      return;
    }

    // Use real discovery count
    const target = stats.discoveredByCount;

    if (target === 0) {
      setDisplayCount(0);
      return;
    }

    // Animate count-up with real data
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
  }, [stats.discoveredByCount, stats.hasRealData, isLoading, mounted]);

  if (!mounted || isLoading) {
    return null;
  }

  // Only show if it's new OR bestseller AND has real data
  if ((!isNew && !isBestseller) || !stats.hasRealData) {
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
        Découvert par{' '}
        <span className="font-headline text-accent">
          {displayCount.toLocaleString('fr-FR')}
        </span>{' '}
        client{displayCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
