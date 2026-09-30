'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FrenchAvenueBanner() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black"></div>

      {/* Overlay texturé */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>

      {/* Contenu */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texte */}
          <div className="space-y-6 text-white">
            <div className="inline-block">
              <span className="text-accent font-bold text-sm tracking-[0.2em] uppercase">French Avenue</span>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold leading-tight mb-4">
                L'Élégance <span className="text-accent">Parisienne</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                Découvrez French Avenue, la signature de ceux qui rêvent de Paris. Des fragrances qui capturent l'essence
                des rues pavées, des cafés bohèmes et de la sophistication française intemporelle.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <p className="text-gray-200">Inspirées des fragrances parisiennes prestigieuses</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <p className="text-gray-200">Qualité premium à prix démocratique</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <p className="text-gray-200">Compositions originales & créatives</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Button
                asChild
                size="lg"
                variant="accent"
                className="rounded-none px-8 py-6 text-sm tracking-[0.1em] uppercase gap-2"
              >
                <Link href="/shop/marque/french-avenue">
                  Explorer la Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Illustration/Image */}
          <div className="relative h-96 md:h-full min-h-96 order-first md:order-last">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/30">
                <div className="text-6xl mb-4">🇫🇷</div>
                <p className="text-xl font-headline tracking-widest uppercase">French Avenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
