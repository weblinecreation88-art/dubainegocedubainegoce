/**
 * Cloudinary Image Loader pour Next.js Image Component
 * Transforme les images locales en URLs Cloudinary optimisées avec responsive sizing
 */

export interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Loader personnalisé pour Next.js Image component
 * Convertit les images locales en URLs Cloudinary avec optimisations automatiques
 */
export function cloudinaryLoader({ src, width, quality = 70 }: CloudinaryLoaderParams): string {
  // Si c'est déjà une URL Cloudinary complète, la retourner as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Pour les images locales, les servir via Cloudinary avec optimisations
  // Format: /images-parfums/filename.ext → CDN URL avec transformations
  const cloudinaryBase = 'https://res.cloudinary.com/dzagwz94z/image/upload';
  
  // Paramètres d'optimisation:
  // f_webp: Force format WebP pour meilleure compression
  // q_70: Qualité 70 (bon compromis compression/qualité)
  // w_${width}: Responsive width basé sur breakpoint Next.js
  // dpr_auto: Responsive DPR pour retina displays
  // c_fit: Fit image dans dimensions sans distortion
  const transformations = `f_webp,q_${quality},w_${width},dpr_auto,c_fit`;
  
  return `${cloudinaryBase}/${transformations}${src}`;
}

/**
 * Alternative: Loader optimisé pour images locales uniquement
 * (Ne transforme que les images dans /images-parfums/)
 */
export function localImageOptimizer({ src, width, quality = 70 }: CloudinaryLoaderParams): string {
  // URLs Cloudinary/externes: retourner as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Images locales uniquement
  if (src.startsWith('/images-parfums/')) {
    // Utiliser Cloudinary pour les transformer
    const cloudinaryBase = 'https://res.cloudinary.com/dzagwz94z/image/upload';
    const transformations = `f_webp,q_${quality},w_${Math.min(width, 600)},dpr_auto,c_fit`;
    return `${cloudinaryBase}/${transformations}${src}`;
  }

  // Pour autres images locales, utiliser statiquement
  return src;
}
