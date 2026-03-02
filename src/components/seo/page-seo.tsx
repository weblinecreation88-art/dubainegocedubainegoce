'use client';

import { ReactNode } from 'react';
import { JsonLd } from './json-ld';

interface PageSEOProps {
  title: string;
  description: string;
  h1: string;
  schema?: any;
  children?: ReactNode;
}

/**
 * Composant réutilisable pour SEO des pages
 * - Gère les H1 uniques
 * - Gère les metadata
 * - Gère les JSON-LD schemas
 * - Gère les images optimisées
 */
export function PageSEO({ 
  title, 
  description, 
  h1, 
  schema,
  children 
}: PageSEOProps) {
  return (
    <>
      {/* JSON-LD Schema */}
      {schema && <JsonLd data={schema} />}
      
      {/* H1 Principal (SEO critique) */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        {h1}
      </h1>

      {/* Description sous H1 */}
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        {description}
      </p>

      {children}
    </>
  );
}
