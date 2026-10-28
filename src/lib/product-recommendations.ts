import { Product } from './types';
import { getProducts } from './data';

/**
 * Calcule un score de recommandation pour un produit par rapport au produit actuel
 * Basé sur: famille, bestseller status, rating, disponibilité stock
 */
function calculateRecommendationScore(current: Product, candidate: Product): number {
  if (candidate.id === current.id) return -Infinity; // Exclure le produit actuel

  let score = 0;

  // Même famille = +100 points (très important)
  if (candidate.family === current.family) {
    score += 100;
  }
  // Même marque = +50 points (moins important)
  else if (candidate.brand.name === current.brand.name) {
    score += 50;
  }

  // Même genre = +30 points
  if (candidate.gender === current.gender) {
    score += 30;
  } else if (candidate.gender === 'mixte') {
    score += 15; // Mixte s'adapte à tous
  }

  // Bestseller = +40 points
  if (candidate.isBestseller) {
    score += 40;
  }

  // Nouveau produit = +20 points
  if (candidate.isNew) {
    score += 20;
  }

  // Rating = +10 par point (max 50 pour 5⭐)
  score += Math.min(candidate.rating * 10, 50);

  // Stock disponible = +15 points
  if (candidate.stock > 0) {
    score += 15;
  }

  // Tags en commun = +5 par tag
  const commonTags = candidate.tags.filter(tag => current.tags.includes(tag));
  score += commonTags.length * 5;

  return score;
}

/**
 * Récupère les produits recommandés intelligemment
 * Utilise un système de scoring pour classer par pertinence
 */
export function getSmartRelatedProducts(currentProduct: Product, limit: number = 6): Product[] {
  const allProducts = getProducts();

  const scored = allProducts
    .map(product => ({
      product,
      score: calculateRecommendationScore(currentProduct, product)
    }))
    .filter(item => item.score > -Infinity && item.product.stock > 0) // Exclure le produit actuel et les ruptures
    .sort((a, b) => b.score - a.score) // Tri décroissant par score
    .slice(0, limit)
    .map(item => item.product);

  return scored;
}

/**
 * Simule les produits "fréquemment achetés ensemble" avec le produit actuel
 * En production, cela viendrait de Firestore (commandes groupées)
 */
export function getFrequentlyBoughtTogether(currentProduct: Product, limit: number = 3): Product[] {
  const allProducts = getProducts();

  // Logique de simulation:
  // Produits de la même famille et de rating élevé, avec stock disponible
  // (En production: analyser les commandes Firestore)
  const frequently = allProducts
    .filter(p =>
      p.id !== currentProduct.id &&
      p.family === currentProduct.family &&
      p.rating >= 4.0 &&
      p.stock > 0
    )
    .sort((a, b) => b.isBestseller ? 1 : -1) // Bestsellers d'abord
    .slice(0, limit);

  return frequently;
}

/**
 * Récupère une description contextualisée pour la section "produits recommandés"
 */
export function getRecommendationContextText(currentProduct: Product): string {
  const family = currentProduct.family;
  const gender = currentProduct.gender;

  const contextTexts: Record<string, string> = {
    'floral-homme': `Vous aimez les parfums floraux & boisés? Découvrez ces sélections`,
    'floral-femme': `Vous aimez les parfums floraux? Découvrez d'autres pépites florales`,
    'boisé-homme': `Vous aimez les parfums boisés? Découvrez ces sélections`,
    'boisé-femme': `Vous aimez les parfums boisés? Découvrez d'autres pépites`,
    'fruité': `Vous aimez les parfums fruités? Découvrez ces sélections`,
    'oriental-femme': `Vous aimez les parfums orientaux? Découvrez d'autres créations`,
    'oriental-homme': `Vous aimez les parfums orientaux & épicés? Découvrez ces sélections`,
    'frais': `Vous aimez les parfums frais? Découvrez ces sélections fraîches`,
    'ambré': `Vous aimez les parfums ambrés? Découvrez nos sélections`,
  };

  // Clé par famille et genre
  const key = `${family}-${gender}`.toLowerCase();

  // Retourner le texte spécifique ou un texte générique
  return contextTexts[key] || `Vous aimez ce parfum? Découvrez d'autres créations que vous pourriez aimer`;
}

/**
 * Texte pour le discount combo "Fréquemment achetés ensemble"
 */
export function getComboDiscountText(selectedCount: number = 3): string {
  const discount = 5; // 5% bonus
  return `🎁 +${discount}% de réduction si vous achetez les ${selectedCount} ensemble`;
}
