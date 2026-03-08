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

/**
 * Mock reviews for MVP (replace with real Trustpilot API later)
 * In production: fetch from https://api.trustpilot.com/v1/business-units/{businessUnitId}/reviews
 */
const MOCK_REVIEWS: TrustpilotReview[] = [
  {
    id: '1',
    rating: 5,
    title: 'Excellent rapport qualité-prix!',
    text: 'J\'ai commandé le Woody Oud et je suis vraiment satisfait. Le parfum est authentique, arrive rapidement, et le prix est imbattable pour cette qualité. Je recommande vivement!',
    reviewer: { name: 'Marc D.' },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: '2',
    rating: 5,
    title: 'Meilleur achat de l\'année',
    text: 'Parfum de excellente qualité, je n\'aurais jamais pensé trouver quelque chose de cette qualité à ce prix. Livraison rapide et service client très réactif.',
    reviewer: { name: 'Sophie L.' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  },
  {
    id: '3',
    rating: 4,
    title: 'Très satisfait du produit',
    text: 'Le parfum sent très bon et dure longtemps. Seule petite critique: j\'aurais aimé plus d\'infos sur les notes olfactives avant l\'achat.',
    reviewer: { name: 'Jean M.' },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true
  }
];

/**
 * Get reviews for a product (MVP uses mock data)
 * In production: call Trustpilot API with product SKU/name
 */
export async function getProductReviews(
  productName: string,
  limit: number = 5
): Promise<TrustpilotReview[]> {
  try {
    // TODO: Replace with real Trustpilot API call
    // const response = await fetch(
    //   `https://api.trustpilot.com/v1/business-units/${TRUSTPILOT_BUSINESS_UNIT}/reviews?after=${after}&perPage=${limit}`,
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${process.env.TRUSTPILOT_API_TOKEN}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // const data = await response.json();
    // return data.reviews.slice(0, limit);

    // MVP: Return mock reviews
    return MOCK_REVIEWS.slice(0, limit);
  } catch (error) {
    console.error('[getProductReviews] Error fetching reviews:', error);
    return [];
  }
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
