'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockUrgencyBannerProps {
  stock: number;
  productName: string;
}

export function StockUrgencyBanner({ stock, productName }: StockUrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [pulse, setPulse] = useState(false);

  // Calculate urgency level
  const urgencyLevel = stock <= 0 ? 'outofstock' : stock <= 2 ? 'critical' : stock <= 5 ? 'warning' : 'low';
  const stockPercentage = Math.min((stock / 20) * 100, 100); // 20 = normal stock level

  // Pulse animation for critical stock
  useEffect(() => {
    if (urgencyLevel === 'critical') {
      const pulseInterval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1500);
      return () => clearInterval(pulseInterval);
    }
  }, [urgencyLevel]);

  if (!isVisible || urgencyLevel === 'low') {
    return null;
  }

  const getUrgencyStyles = () => {
    switch (urgencyLevel) {
      case 'outofstock':
        return {
          bg: 'bg-red-100 dark:bg-red-950/40',
          border: 'border-red-300 dark:border-red-800',
          text: 'text-red-900 dark:text-red-100',
          progressBg: 'bg-red-500'
        };
      case 'critical':
        return {
          bg: 'bg-red-100 dark:bg-red-950/40',
          border: 'border-red-300 dark:border-red-800',
          text: 'text-red-900 dark:text-red-100',
          progressBg: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-orange-100 dark:bg-orange-950/40',
          border: 'border-orange-300 dark:border-orange-800',
          text: 'text-orange-900 dark:text-orange-100',
          progressBg: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-900',
          progressBg: 'bg-gray-500'
        };
    }
  };

  const styles = getUrgencyStyles();

  const getMessage = () => {
    if (urgencyLevel === 'outofstock') {
      return `${productName} est rupture de stock`;
    }
    if (urgencyLevel === 'critical') {
      return stock === 1
        ? `⚠️ Dernier exemplaire en stock - Commandez maintenant!`
        : `⚠️ Plus que ${stock} en stock - Achetez maintenant!`;
    }
    return `⏳ Stock limité (${stock} disponibles) — Commandez vite!`;
  };

  return (
    <div
      className={cn(
        'mx-0 rounded-lg border p-3 sm:p-4 mb-4',
        styles.bg,
        styles.border,
        pulse && urgencyLevel === 'critical' && 'animate-pulse'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {urgencyLevel === 'outofstock' ? (
          <AlertCircle className={cn('h-5 w-5 mt-0.5 flex-shrink-0', styles.text)} />
        ) : (
          <TrendingDown className={cn('h-5 w-5 mt-0.5 flex-shrink-0 animate-bounce', styles.text)} />
        )}

        <div className="flex-1">
          {/* Message */}
          <p className={cn('font-semibold text-sm sm:text-base', styles.text)}>
            {getMessage()}
          </p>

          {/* Stock Progress Bar */}
          {urgencyLevel !== 'outofstock' && (
            <div className="mt-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', styles.progressBg)}
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
          )}

          {/* Additional Info */}
          {urgencyLevel === 'outofstock' && (
            <p className={cn('text-xs mt-1.5', styles.text)}>
              Rejoignez la liste d'attente pour être notifié du réapprovisionnement
            </p>
          )}
        </div>

        {/* Close Button */}
        {urgencyLevel !== 'outofstock' && (
          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              'text-xl font-bold leading-none mt-0.5 opacity-60 hover:opacity-100 transition-opacity',
              styles.text
            )}
            aria-label="Fermer l'alerte"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
