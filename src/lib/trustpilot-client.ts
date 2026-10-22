/**
 * Trustpilot API Client
 * Fetches reviews from Trustpilot for display on product pages
 */

export interface TrustpilotReview {
  id: string;
  rating: number; // 1-5 stars
  title?: string;
  text: string;
  reviewer: {
    name: string;
    email?: string;
  };
  createdAt: string; // ISO date
  images?: Array<{
    url: string;
  }>;
  verified: boolean; // Verified purchase
}

/** No verified product-review source is connected. Never invent a fallback. */
export async function getProductReviews(
  _productName: string,
  _limit: number = 5
): Promise<TrustpilotReview[]> {
  return [];
}

/**
 * Format review date to French "ago" format
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
}

/**
 * Get average rating from reviews
 */
export function getAverageRating(reviews: TrustpilotReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
