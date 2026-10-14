'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, TrendingUp, Award } from 'lucide-react';

interface FragranceHighlight {
  name: string;
  tagline: string;
  family: string;
  price: number;
  slug: string;
  description: string;
  forWho: string;
}

const highlights: FragranceHighlight[] = [
  {
    name: 'YEAH Maison Alhambra',
    tagline: 'Fraîcheur & Élégance',
    family: 'Fougère Aromatique & Boisé',
    price: 35,
    slug: 'yeah-maison-alhambra',
    description: 'Une ouverture lumineuse de pomme et gingembre sur un fond de bois nobles et fève tonka.',
    forWho: 'Pour l\'homme moderne en quête d\'un sillage dynamique',
  },
  {
    name: 'Glacier Pour Homme',
    tagline: 'Sillage Rafraîchissant',
    family: 'Aromatique Frais & Épicé',
    price: 30,
    slug: 'glacier-pour-homme-maison-alhambra',
    description: 'Un accord vivifiant d\'agrumes et de poivre relevé par un fond boisé ambré d\'une grande fraîcheur.',
    forWho: 'Idéal pour le quotidien et les journées actives',
  },
  {
    name: 'The Tux',
    tagline: 'Prestige & Raffinement',
    family: 'Chypré Boisé & Épicé',
    price: 40,
    slug: 'the-tux-maison-alhambra-mixte',
    description: 'Une sophistication orientale intense mêlant patchouli noble, épices douces et accord ambré.',
    forWho: 'Pour les soirées formelles et les grandes occasions',
  },
  {
    name: 'Grise Maison Alhambra',
    tagline: 'Harmonie Florale',
    family: 'Chypré Floral & Boisé',
    price: 32,
    slug: 'grise-maison-alhambra',
    description: 'Un équilibre subtil entre rose de mai, mousse de chêne et notes boisées raffinées.',
    forWho: 'Pour les amateurs de sillages épurés et intemporels',
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
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Haute Parfumerie Orientale</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-gray-900 dark:text-white mb-6">
            L'Excellence des Parfums de Dubaï<br />
            <span className="text-accent">À Prix Accessible</span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-8">
            Découvrez les créations de <strong>Maison Alhambra</strong> : des eaux de parfum intenses, 
            élaborées avec des essences rares et une tenue exceptionnelle, accessibles à tous.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <Award className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Formules Concentrées</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Tenue 8h à 12h</p>
            </div>
            <div className="text-center">
              <Heart className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">100% Authentique</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Flacons d'Exception</p>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8 hover:shadow-xl hover:border-accent/50 transition-all duration-300"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {item.tagline}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-4 pt-8">
                {/* Name & Family */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-accent font-medium">
                    {item.family}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>

                {/* For Who */}
                <div className="bg-gray-50 dark:bg-white/5 rounded p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">
                    Profil olfactif
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {item.forWho}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                      Eau de Parfum 100% Originale
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {item.price}€
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
                  <Link href={`/parfum/${item.slug}`}>
                    Découvrir la Fragrance
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-headline font-bold mb-4">
            L'Art de la Parfumerie Orientale
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-white/90 text-lg">
            Explorez notre catalogue complet de créations Maison Alhambra, Lattafa et grands parfumeurs des Émirats.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-accent hover:bg-gray-100 rounded-none px-12 py-6 text-sm tracking-[0.1em] uppercase"
          >
            <Link href="/shop/marque/maison-alhambra">
              Explorer la Collection
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
