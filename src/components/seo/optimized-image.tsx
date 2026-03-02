'use client';

import Image from 'next/image';
import { generateAltText } from '@/lib/seo-fixer';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  title?: string;
  width: number;
  height: number;
  context?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Composant Image optimisé avec:
 * - ALT text automatique ou custom
 * - Lazy loading
 * - Responsive sizing
 * - WebP support
 */
export function OptimizedImage({
  src,
  alt,
  title,
  width,
  height,
  context,
  priority = false,
  className = ''
}: OptimizedImageProps) {
  const altText = alt || generateAltText(src.split('/').pop() || 'image', context);

  return (
    <Image
      src={src}
      alt={altText}
      title={title || altText}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      // Optimisations Next.js
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  );
}
