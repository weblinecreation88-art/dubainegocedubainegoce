import { Metadata } from 'next';
import { getProducts, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = { params: { type: string } };

// Mapping pour les types de produits
const TYPE_MAP: Record<string, {
  label: string;
  description: string;
  longDescription: string;
  keywords: string[];
  hero: string;
}> = {
  'equivalent': {
    label: 'Équivalents & Dupes Parfums',
    description: 'Découvrez 104 équivalents parfum à prix réduit — des alternatives luxe YSL, Dior, Creed, Paco Rabanne. Livraison 48h, 100% authentique.',
    longDescription: 'Trouvez votre alternative parfum avec notre collection de 104 dupes et équivalents de qualité. Des parfums similaires aux grands classiques (YSL, Dior, Creed, Paco Rabanne) à des prix accessibles. Composition rivale, prix réduit, authenticité garantie.',
    keywords: ['dupe parfum', 'équivalent parfum', 'parfum pas cher', 'alternative dior', 'alternative ysl', 'parfum clone qualité', 'équivalent creed', 'alternative paco rabanne'],
    hero: 'Le Luxe à la Portée de Tous — Découvrez nos 104 Équivalents & Dupes'
  },
  'dupe': {
    label: 'Dupes Parfums',
    description: 'Les meilleurs dupes parfum à petit prix — alternatives de qualité aux grands classiques du luxe. Livraison 48h France.',
    longDescription: 'Accédez aux parfums de luxe sans exploser votre budget avec nos dupes de qualité. Compositions similaires, sillage comparable, prix réduits.',
    keywords: ['dupe parfum', 'parfum dupe qualité', 'faux parfum qualité', 'parfum similaire'],
    hero: 'Alternatives de Luxe à Prix Réduit'
  }
};

export async function generateStaticParams() {
  return [
    { type: 'equivalent' },
    { type: 'dupe' }
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const typeInfo = TYPE_MAP[params.type];
  if (!typeInfo) return { title: 'Non trouvé' };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
  const canonicalUrl = `${siteUrl}/shop/type/${params.type}`;

  return {
    title: typeInfo.label,
    description: typeInfo.description,
    keywords: typeInfo.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: typeInfo.label,
      description: typeInfo.description,
      url: canonicalUrl,
      siteName: 'Dubai Negoce',
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: typeInfo.label,
      description: typeInfo.description,
    },
  };
}

export default function TypeShopPage({ params }: Props) {
  const typeInfo = TYPE_MAP[params.type];
  if (!typeInfo) notFound();

  const allProducts = getProducts();
  // Les deux types 'equivalent' et 'dupe' pointent vers les mêmes produits
  const products = allProducts.filter(p => p.type === 'dupe' || p.type === 'equivalent');
  const families = getFragranceFamilies();
  const genders = getGenderCategories();

  return (
    <>
      {/* SEO Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-accent/5 to-accent/10 border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-white mb-4">
              {typeInfo.hero}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {typeInfo.longDescription}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700">
                ✓ 104 Parfums Sélectionnés
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700">
                ✓ Livraison 48h
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700">
                ✓ 100% Authentique
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Content */}
      <Suspense fallback={<ShopAllLoading />}>
        <ShopPageContent
          products={products}
          brands={[]}
          families={families}
          genders={genders}
          title={typeInfo.label}
          description={typeInfo.description}
        />
      </Suspense>

      {/* SEO Footer Section */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-muted/10 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-headline font-bold text-gray-900 dark:text-white mb-4">
            Qu'est-ce qu'un Équivalent Parfum?
          </h2>
          <div className="prose prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Un équivalent parfum est une fragrance de qualité comparable aux grandes marques de luxe, mais à prix réduit. Nos sélections rivalisent en composition, sillage et tenue avec les originaux, sans compromettre la qualité.
            </p>
            <p>
              <strong>Pourquoi choisir un équivalent?</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>💰 <strong>Prix Accessibles</strong> — Jusqu'à 80-90% moins cher que les marques de luxe</li>
              <li>🎯 <strong>Composition Rivale</strong> — Sillage, tenue et notes olfactives similaires</li>
              <li>✨ <strong>100% Authentiques</strong> — Tous nos produits sont certifiés authentiques</li>
              <li>⚡ <strong>Livraison Rapide</strong> — Expédition en 48h partout en France</li>
              <li>🔄 <strong>Garantie Satisfaction</strong> — Retour gratuit sous 14 jours</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              <em>Nous ne sommes pas affiliés aux grandes marques de luxe mentionnées. Nos équivalents sont des alternatives légales de qualité, sélectionnées pour rivaliser avec les compositions originales.</em>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
