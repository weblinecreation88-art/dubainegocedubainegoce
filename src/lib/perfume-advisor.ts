import { getProducts } from '@/lib/data';
import type { Product } from '@/lib/types';

// Conseiller parfum du chatbot : choix guidés -> 3 recommandations du catalogue.
// Calcul déterministe (sans IA) pour fonctionner même sans clé API.

export type AdvisorGender = 'femme' | 'homme' | 'mixte';
export type AdvisorFamily = 'gourmand' | 'boise' | 'floral' | 'frais' | 'oriental';
export type AdvisorIntensity = 'légère' | 'moyenne' | 'forte';
export type AdvisorOccasion = 'tous les jours' | 'travail' | 'soirée' | 'rendez-vous';

export interface AdvisorAnswers {
  gender: AdvisorGender;
  family: AdvisorFamily;
  intensity: AdvisorIntensity;
  occasion: AdvisorOccasion;
}

export interface AdvisorRecommendation {
  name: string;
  slug: string;
  brand: string;
  family: string;
  price: number;
  image: string;
  inspiredBy?: string;
}

// Familles du catalogue correspondant à chaque choix : [exactes, proches]
const FAMILY_MAP: Record<AdvisorFamily, { exact: string[]; close: string[]; keywords: string[] }> = {
  gourmand: { exact: ['gourmand'], close: ['ambré', 'oriental'], keywords: ['vanille', 'praline', 'caramel', 'miel', 'tonka', 'chocolat'] },
  boise: { exact: ['boisé', 'oud', 'cuir'], close: ['chypré', 'oriental', 'aromatique'], keywords: ['oud', 'bois', 'cèdre', 'santal', 'cuir', 'vétiver'] },
  floral: { exact: ['floral'], close: ['fruité', 'musqué', 'chypré'], keywords: ['rose', 'jasmin', 'fleur', 'musc', 'pivoine', 'iris'] },
  frais: { exact: ['hespéridé', 'aquatique', 'aromatique', 'fougère'], close: ['fruité'], keywords: ['bergamote', 'agrume', 'citron', 'frais', 'marin', 'thé', 'menthe'] },
  oriental: { exact: ['oriental', 'ambré'], close: ['musqué', 'gourmand', 'boisé'], keywords: ['ambre', 'encens', 'safran', 'épice', 'oud', 'musc'] },
};

function scoreProduct(product: Product, answers: AdvisorAnswers): number {
  // Un parfum homme n'est jamais proposé pour une femme, et inversement.
  if (answers.gender !== 'mixte' && product.gender !== 'mixte' && product.gender !== answers.gender) {
    return -Infinity;
  }

  let score = 0;
  score += product.gender === answers.gender ? 30 : 20;

  const family = product.family.toLowerCase();
  const map = FAMILY_MAP[answers.family];
  if (map.exact.some(f => family.includes(f))) score += 40;
  else if (map.close.some(f => family.includes(f))) score += 15;

  const text = `${product.shortDescription} ${product.tags.join(' ')}`.toLowerCase();
  score += Math.min(3, map.keywords.filter(k => text.includes(k)).length) * 4;

  if (product.intensity?.toLowerCase() === answers.intensity) score += 10;
  if (product.occasion?.some(o => o.toLowerCase() === answers.occasion)) score += 8;
  if (product.isBestseller) score += 5;
  score += Math.min(product.rating || 0, 5);

  return score;
}

export function recommendPerfumes(answers: AdvisorAnswers, limit = 3): AdvisorRecommendation[] {
  return getProducts()
    .filter(p => p.stock > 0)
    .map(product => ({ product, score: scoreProduct(product, answers) }))
    .filter(r => r.score > -Infinity)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ product }) => ({
      name: product.name,
      slug: product.slug,
      brand: product.brand.name,
      family: product.family,
      price: product.price,
      image: product.images[0] || '',
      inspiredBy: product.inspiredBy,
    }));
}
