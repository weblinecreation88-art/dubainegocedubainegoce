'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, DollarSign, Sparkles, TrendingUp } from 'lucide-react';

interface DupeComparison {
  name: string;
  tagline: string;
  inspiration: string;
  alhambraPrice: number;
  inspiredPrice: number;
  alhambraSlug: string;
  description: string;
  forWho: string;
}

const comparisons: DupeComparison[] = [
  {
    name: 'YEAH Maison Alhambra',
    tagline: 'L\'Alternative YSL',
    inspiration: 'Inspiré de Yves Saint Laurent',
    alhambraPrice: 35,
    inspiredPrice: 300,
    alhambraSlug: 'yeah-maison-alhambra',
    description: 'Élégance sensuelle sans la facture de luxe.',
    forWho: 'Pour celles qui aiment les grands classiques',
  },
  {
    name: 'Glacier Pour Homme',
    tagline: 'L\'Alternative Dior',
    inspiration: 'Inspiré de Dior Sauvage',
    alhambraPrice: 30,
    inspiredPrice: 110,
    alhambraSlug: 'glacier-pour-homme-maison-alhambra',
    description: 'Fraîcheur masculine épurée à petit prix.',
    forWho: 'Pour les hommes qui cherchent la qualité',
  },
  {
    name: 'The Tux',
    tagline: 'L\'Alternative Creed',
    inspiration: 'Inspiré de Creed Royal Oud',
    alhambraPrice: 40,
    inspiredPrice: 280,
    alhambraSlug: 'the-tux-maison-alhambra-mixte',
    description: 'Sophistication orientale de luxe à prix démocratique.',
    forWho: 'Pour les amateurs de fragrances premium',
  },
  {
    name: 'Grise Maison Alhambra',
    tagline: 'L\'Alternative Issey Miyake',
    inspiration: 'Inspiré de L\'Eau d\'Issey',
    alhambraPrice: 32,
    inspiredPrice: 95,
    alhambraSlug: 'grise-maison-alhambra',
    description: 'Minimalisme floral et aquatique raffiné.',
    forWho: 'Pour les minimalistes qui aiment les fragrances propres',
  },
];

export function AffordableLuxurySection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-white via-rose-50/30 to-white dark:from-background dark:via-rose-950/10 dark:to-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Luxe Abordable</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-gray-900 dark:text-white mb-6">
            Vous aimez le Luxe ?<br />
            <span className="text-accent">Pas 300€</span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-8">
            Découvrez les créations de <strong>Maison Alhambra</strong> : des parfums d'exception qui rivalisent avec les plus grandes maisons de luxe,
            à une fraction du prix. Parce que la beauté ne devrait pas être réservée aux comptes en banque gonflés.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <DollarSign className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Jusqu'à 90% moins cher</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Même qualité</p>
            </div>
            <div className="text-center">
              <Heart className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">100% Authentique</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Prestigieux</p>
            </div>
          </div>
        </div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {comparisons.map((comp, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8 hover:shadow-xl hover:border-accent/50 transition-all duration-300"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {comp.tagline}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4 pt-8">
                {/* Name & Inspiration */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">
                    {comp.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {comp.inspiration}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {comp.description}
                </p>

                {/* For Who */}
                <div className="bg-gray-50 dark:bg-white/5 rounded p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                    Pour qui ?
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {comp.forWho}
                  </p>
                </div>

                {/* Price Comparison */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                      Alhambra
                    </p>
                    <p className="text-3xl font-bold text-accent">
                      {comp.alhambraPrice}€
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                      Marque Prestige
                    </p>
                    <p className="text-3xl font-bold text-gray-400 line-through">
                      {comp.inspiredPrice}€
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="w-full mt-6 rounded-none py-6 text-sm tracking-[0.1em] uppercase"
                >
                  <Link href={`/parfum/${comp.alhambraSlug}`}>
                    Découvrir le Prix
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-headline font-bold mb-4">
            Le Luxe à la Portée de Tous
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-white/90 text-lg">
            Explorez notre collection complète de créations Maison Alhambra. Des dupes incontournables
            aux compositions originales : tout ce qu'il faut pour affirmer votre style.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-accent hover:bg-gray-100 rounded-none px-12 py-6 text-sm tracking-[0.1em] uppercase"
          >
            <Link href="/shop/marque/maison-alhambra">
              Explorer Maison Alhambra
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
