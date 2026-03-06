'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface YaraSpotlightProps {
  variant?: 'gourmand' | 'candy' | 'moi';
}

const yaraContent = {
  gourmand: {
    name: 'Yara Lattafa',
    subtitle: 'L\'Essence Gourmande',
    tagline: 'SOPHISTICATION SUCRÉE',
    story: 'Yara Lattafa enveloppe vos sens dans une symphonie olfactive irrésistible. Orange vibrante, vanille veloutée, praline succulente. Une création où chaque note danse en harmonie parfaite.',
    notes: 'Orange • Vanille • Praline',
    forWho: 'Pour les femmes qui aiment se démarquer',
    slug: 'yara-lattafa',
    imageUrl: '/images-parfums/yara-lattafa.png',
    bgGradient: 'from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20',
    accentColor: 'text-orange-600 dark:text-orange-400',
  },
  candy: {
    name: 'Yara Candy Lattafa',
    subtitle: 'La Douceur Fruité',
    tagline: 'FRAMBOISE & RÊVERIE',
    story: 'Yara Candy capture l\'essence de l\'innocence gourmande. Cassis éclatant, rose délicat, musc blanc aérien. Un parfum qui respire la jeunesse et l\'insouciance.',
    notes: 'Cassis • Rose • Musc Blanc',
    forWho: 'Pour les femmes légères et pétillantes',
    slug: 'yara-candy-lattafa',
    imageUrl: '/images-parfums/yara-candy-lattafa.png',
    bgGradient: 'from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20',
    accentColor: 'text-pink-600 dark:text-pink-400',
  },
  moi: {
    name: 'Yara Moi Lattafa',
    subtitle: 'L\'Élégance Florale',
    tagline: 'BERGAMOTE & JASMIN',
    story: 'Yara Moi est la signature de celle qui sait séduire. Bergamote pétillante, jasmin envoûtant, ambre enveloppant. Un parfum pour affirmer votre beauté naturelle.',
    notes: 'Bergamote • Jasmin • Ambre',
    forWho: 'Pour les femmes qui incarnent l\'élégance',
    slug: 'yara-moi-lattafa',
    imageUrl: '/images-parfums/yara-moi-lattafa.png',
    bgGradient: 'from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20',
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
};

function YaraSpotlight({ variant = 'gourmand' }: YaraSpotlightProps) {
  const content = yaraContent[variant];
  const isReversed = variant === 'candy';

  return (
    <section className={`py-20 md:py-32 bg-gradient-to-br ${content.bgGradient}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'md:[direction:rtl]' : ''}`}>
          {/* Image */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-3xl"></div>
              <Image
                src={content.imageUrl}
                alt={content.name}
                fill
                className="object-contain relative z-10 drop-shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`order-1 md:order-2 ${isReversed ? 'md:[direction:ltr]' : ''}`}>
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-widest">{content.tagline}</span>
              </div>

              {/* Title */}
              <div>
                <h3 className={`text-sm font-medium ${content.accentColor} uppercase tracking-widest mb-2`}>
                  {content.subtitle}
                </h3>
                <h2 className="text-4xl md:text-5xl font-headline font-bold text-gray-900 dark:text-white">
                  {content.name}
                </h2>
              </div>

              {/* Story */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                {content.story}
              </p>

              {/* Notes */}
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Pyramide Olfactive
                </p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {content.notes}
                </p>
              </div>

              {/* For Who */}
              <div className="border-l-2 border-accent pl-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-accent">{content.forWho}</span>
                </p>
              </div>

              {/* CTA */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="accent"
                  className="rounded-none px-8 py-6 text-sm tracking-[0.1em] uppercase"
                >
                  <Link href={`/parfum/${content.slug}`}>
                    Découvrir
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-none px-8 py-6 text-sm tracking-[0.1em] uppercase"
                >
                  <Link href={`/parfum/${content.slug}`}>
                    Voir Détails
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default YaraSpotlight;
