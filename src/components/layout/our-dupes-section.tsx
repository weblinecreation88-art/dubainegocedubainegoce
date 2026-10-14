'use client';

import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OurFeaturedCreationsProps {
  products: Product[];
}

export function OurDupesSection({ products }: OurFeaturedCreationsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-14">
          <div className="mb-4">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">Sélection Exclusive</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-white mb-3">
            Nos Créations Emblématiques
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Les fragrances les plus prisées de Dubaï. Des sillages d'une intensité remarquable, élaborés par les plus grands maîtres parfumeurs orientaux.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
          {products.slice(0, 8).map((product, index) => (
            <div key={index} className="transition-transform duration-300 hover:-translate-y-1">
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-black text-white hover:opacity-90 border-0 rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase"
          >
            <Link href="/shop">
              Découvrir tout le catalogue
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
