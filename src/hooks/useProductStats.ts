'use client';

import { useState, useEffect } from 'react';

export interface ProductStats {
  productId: string;
  totalPurchases: number;
  purchasesToday: number;
  lastPurchaseAt: string | null;
  activeViewersEstimate: number;
  discoveredByCount: number;
  updatedAt: string;
  hasRealData: boolean;
}

const STATS_CACHE = new Map<string, { data: ProductStats; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch real product statistics
 * Returns real data when available, empty data when not
 * Caches results to avoid excessive API calls
 */
export function useProductStats(productId: string) {
  const [stats, setStats] = useState<ProductStats>({
    productId,
    totalPurchases: 0,
    purchasesToday: 0,
    lastPurchaseAt: null,
    activeViewersEstimate: 0,
    discoveredByCount: 0,
    updatedAt: new Date().toISOString(),
    hasRealData: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Check cache first
        const cached = STATS_CACHE.get(productId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setStats(cached.data);
          setIsLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch(`/api/products/${productId}/stats`);

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }

        const data: ProductStats = await response.json();

        // Cache the result
        STATS_CACHE.set(productId, { data, timestamp: Date.now() });

        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product stats:', err);
        // Don't set error - just use default empty stats
        // This allows graceful degradation
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [productId]);

  return { stats, isLoading, error };
}
