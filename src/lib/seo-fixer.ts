/**
 * Utilitaire pour fixer les problèmes SEO Semrush
 * Génère automatiquement les metadata, H1, ALT, etc.
 */

export interface SEOFix {
  title: string;           // 50-60 chars
  description: string;     // 150-160 chars
  h1: string;              // Titre H1 unique
  keywords: string[];      // 5-8 keywords
  ogImage?: string;
  schema?: any;
}

/**
 * Fix: Duplicate Titles (28 pages)
 * Solution: Générer titres uniques basés sur contenu
 */
export function generateUniqueTitle(
  baseTitle: string,
  variant?: string,
  suffix: string = ' | Dubainegoce'
): string {
  const maxLength = 58;
  let title = baseTitle;
  
  if (variant) {
    title = `${baseTitle} - ${variant}`;
  }
  
  if (title.length + suffix.length > maxLength) {
    title = title.substring(0, maxLength - suffix.length);
  }
  
  return `${title}${suffix}`;
}

/**
 * Fix: Missing Descriptions (90 pages)
 * Solution: Générer descriptions uniques de 150-160 chars
 */
export function generateDescription(
  productName: string,
  brand: string,
  price?: string,
  shortDesc?: string
): string {
  const maxLength = 160;
  
  let desc = shortDesc || `Découvrez ${productName} de ${brand}`;
  
  if (price) {
    desc += ` à partir de ${price}€`;
  }
  
  desc += '. Authentique, livraison rapide 48h.';
  
  if (desc.length > maxLength) {
    desc = desc.substring(0, maxLength - 3) + '...';
  }
  
  return desc;
}

/**
 * Fix: Missing H1 Tags (28 pages)
 * Solution: Générer H1 uniques et descriptifs
 */
export function generateH1(
  productName: string,
  brand?: string,
  family?: string
): string {
  let h1 = productName;
  
  if (brand) {
    h1 = `${productName} ${brand}`;
  }
  
  if (family) {
    h1 += ` - ${family}`;
  }
  
  return h1;
}

/**
 * Fix: Missing ALT Attributes (383 pages)
 * Solution: Générer ALT text descriptif pour images
 */
export function generateAltText(
  imageName: string,
  context?: string
): string {
  let alt = imageName
    .replace(/[-_]/g, ' ')
    .replace(/\.(jpg|png|webp|svg)$/i, '');
  
  if (context) {
    alt = `${alt} - ${context}`;
  }
  
  return alt;
}

/**
 * Fix: Duplicate Meta Keywords
 * Solution: Générer keywords uniques basés sur contenu
 */
export function generateKeywords(
  mainKeyword: string,
  brand?: string,
  category?: string
): string[] {
  const keywords: string[] = [mainKeyword];
  
  if (brand) {
    keywords.push(brand);
    keywords.push(`${mainKeyword} ${brand}`);
  }
  
  if (category) {
    keywords.push(category);
    keywords.push(`${mainKeyword} ${category}`);
  }
  
  keywords.push('parfum dubaï');
  keywords.push('parfum authentique');
  keywords.push('livraison rapide');
  
  // Limiter à 8 keywords
  return keywords.slice(0, 8);
}

/**
 * Fix: Low Text/HTML Ratio (90 pages)
 * Retourner la taille optimale pour texte vs HTML
 */
export function getOptimalContentSize(): { minWords: number; minChars: number } {
  return {
    minWords: 300,     // Minimum 300 mots par page
    minChars: 1500,    // Minimum 1500 caractères
  };
}

/**
 * Générer SEO complet pour une page
 */
export function generateCompleteSEO(
  productName: string,
  brand: string,
  data: {
    price?: string;
    description?: string;
    family?: string;
    gender?: string;
    image?: string;
  }
): SEOFix {
  return {
    title: generateUniqueTitle(productName, brand),
    description: generateDescription(productName, brand, data.price, data.description),
    h1: generateH1(productName, brand, data.family),
    keywords: generateKeywords(productName, brand, data.family),
    ogImage: data.image,
  };
}
