'use client';

/**
 * Loader d'images Cloudinary pour next/image.
 *
 * L'optimiseur d'images de Next.js n'est pas actif sur l'hebergement : les
 * URLs Cloudinary etaient servies telles quelles, soit des PNG de 2 Mo pour
 * des visuels affiches en 665 px de large (LCP a 10 s sur mobile).
 *
 * Cloudinary sait transformer a la volee via l'URL :
 *   f_auto  -> WebP/AVIF selon le navigateur
 *   q_auto  -> compression adaptee au contenu
 *   w_<n>   -> redimensionnement a la largeur reellement affichee
 *
 * Mesure sur femme-parfum-poignet.png : 2 137 Ko -> 50 Ko (-97 %).
 */

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUDINARY_MARKER = '/image/upload/';

export function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  // Les images non-Cloudinary sont servies inchangees.
  if (!src.includes('res.cloudinary.com') || !src.includes(CLOUDINARY_MARKER)) {
    return src;
  }

  const [prefix, rest] = src.split(CLOUDINARY_MARKER);

  // Une URL deja transformee (elle porte des parametres avant la version)
  // ne doit pas etre transformee une seconde fois.
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) {
    return src;
  }

  const params = [`w_${width}`, 'f_auto', `q_${quality || 'auto'}`, 'c_limit'];
  return `${prefix}${CLOUDINARY_MARKER}${params.join(',')}/${rest}`;
}

export default cloudinaryLoader;
