'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flame, TrendingUp } from 'lucide-react';

interface ViralHeroProps {
  variant?: 'yeah' | 'khamrah' | 'tudor';
}

const viralProducts = {
  yeah: {
    name: 'YEAH Maison Alhambra',
    tagline: 'L\'Incontournable Viral',
    subtitle: 'Équivalent YSL à 35€',
    story: 'Le parfum que tout le monde demande. YEAH capture l\'essence sensuelle de Yves Saint Laurent, sans vider votre portefeuille. Viral sur TikTok, adoré sur YouTube : c\'est THE parfum à avoir absolument.',
    highlight: 'Viral sur TikTok & YouTube',
    price: 35,
    originalPrice: 300,
    slug: 'yeah-maison-alhambra',
    features: [
      'Sensuel et sophistiqué',
      'Équivalent YSL',
      'Meilleur rapport qualité/prix',
      'Tenue 8-10h impressionnante',
    ],
    bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20',
    accentColor: 'text-pink-600 dark:text-pink-400',
  },
  khamrah: {
    name: 'Khamrah Lattafa',
    tagline: 'Le Must-Have Oriental',
    subtitle: 'Présent partout sur le web',
    story: 'Khamrah est partout : YouTube, TikTok, Instagram. C\'est LE parfum oriental incontournable. Une composition riche et envoûtante qui captures l\'essence du luxe arabique. Des notes de oud, de vanille et de musc qui créent une signature unique et mémorable.',
    highlight: 'Tendance globale',
    price: 45,
    originalPrice: 250,
    slug: 'khamrah-lattafa',
    features: [
      'Notes orientales luxueuses',
      'Oud premium',
      'Sillage puissant',
      'Parfum signature intemporel',
    ],
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
  tudor: {
    name: 'Tudor Paris Corner',
    tagline: 'L\'Élégance Londonienne',
    subtitle: 'Alternative Tom Ford',
    story: 'Tudor incarne la sophistication britannique avec une touche parisienne. Une composition élégante qui rappelle les grands classiques du luxe, mais avec sa propre signature. Idéal pour ceux qui recherchent la distinction sans compromis.',
    highlight: 'Prestige & Élégance',
    price: 48,
    originalPrice: 280,
    slug: 'tudor-paris-corner',
    features: [
      'Composition élégante',
      'Notes boisées nobles',
      'Alternative Tom Ford',
      'Parfum de connaisseur',
    ],
    bgGradient: 'from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-950/20',
    accentColor: 'text-blue-600 dark:text-blue-400',
  },
};

function ViralHeroCard({ variant = 'yeah' }: ViralHeroProps) {
  const product = viralProducts[variant];

  return (
    <section className={`py-20 md:py-28 bg-gradient-to-br ${product.bgGradient}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visuel */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-2xl blur-3xl"></div>
              <div className="relative z-10 text-center">
                <Flame className="h-24 w-24 text-accent mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-headline font-bold text-gray-900 dark:text-white">{product.name}</p>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="order-1 md:order-2 space-y-6">
            {/* Badge Viral */}
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">{product.tagline}</span>
            </div>

            {/* Titre */}
            <div>
              <h3 className={`text-sm font-medium ${product.accentColor} uppercase tracking-widest mb-2`}>
                {product.subtitle}
              </h3>
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-gray-900 dark:text-white">
                {product.name}
              </h2>
            </div>

            {/* Story */}
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {product.story}
            </p>

            {/* Features */}
            <div className="space-y-2">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{feature}</p>
                </div>
              ))}
            </div>

            {/* Prix Comparison */}
            <div className="bg-white/50 dark:bg-black/30 backdrop-blur rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                    Notre Prix
                  </p>
                  <p className="text-3xl font-bold text-accent">{product.price}€</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                    Marque Prestige
                  </p>
                  <p className="text-2xl font-bold text-gray-400 line-through">{product.originalPrice}€</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              asChild
              size="lg"
              variant="accent"
              className="w-full rounded-none px-8 py-6 text-sm tracking-[0.1em] uppercase gap-2"
            >
              <Link href={`/parfum/${product.slug}`}>
                Découvrir l'Incontournable
              </Link>
            </Button>

            {/* Highlight */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
              ⭐ {product.highlight}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViralHeroCard;
