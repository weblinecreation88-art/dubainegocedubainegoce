'use client';

import { useState, useEffect } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { getProductReviews, formatReviewDate, type TrustpilotReview } from '@/lib/trustpilot-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CustomerReviewsProps {
  productName: string;
  limit?: number;
  trustpilotUrl?: string;
}

export function CustomerReviews({
  productName,
  limit = 3,
  trustpilotUrl = 'https://www.trustpilot.com/review/dubainegoce.fr'
}: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<TrustpilotReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const data = await getProductReviews(productName, limit);
      setReviews(data);
      setIsLoading(false);
    };

    fetchReviews();
  }, [productName, limit]);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-bold mb-1">Avis des clients</h3>
        <p className="text-sm text-muted-foreground">347 avis vérifiés</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map(review => (
          <div
            key={review.id}
            className="border rounded-lg p-4 bg-white dark:bg-slate-950 hover:shadow-md transition-shadow"
          >
            {/* Header: Rating + Name + Date */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {/* Stars */}
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                {/* Reviewer Name */}
                <p className="font-semibold text-sm text-foreground">
                  {review.reviewer.name}
                  {review.verified && (
                    <Badge variant="outline" className="ml-2 text-xs h-5">
                      ✓ Acheté
                    </Badge>
                  )}
                </p>
              </div>
              {/* Date */}
              <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {formatReviewDate(review.createdAt)}
              </p>
            </div>

            {/* Title */}
            {review.title && (
              <p className="font-semibold text-sm mb-1.5 text-foreground">
                {review.title}
              </p>
            )}

            {/* Text (truncated) */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      {/* See All Link */}
      <Button
        asChild
        variant="outline"
        className="w-full"
      >
        <Link href={trustpilotUrl} target="_blank" rel="noopener noreferrer">
          Voir tous les avis
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
