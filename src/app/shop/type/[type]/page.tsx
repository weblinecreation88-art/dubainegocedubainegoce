import { Metadata } from 'next';
import { getProducts, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound, redirect } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';

type Props = { params: { type: string } };

// Mapping pour les types de produits autorisés
const TYPE_MAP: Record<string, {
  label: string;
  description: string;
  longDescription: string;
  keywords: string[];
  hero: string;
  filterType?: string;
}> = {
  'oriental': {
    label: 'Parfums Orientaux de Dubaï',
    description: 'Découvrez notre collection d\'eaux de parfum orientales authentiques de Dubaï. Sillage intense, tenue longue durée, livraison 48h.',
    longDescription: 'Explorez notre sélection de parfums orientaux élaborés par les plus prestigieuses maisons de Dubaï (Lattafa, Maison Alhambra, French Avenue). Des sillages riches en oud, ambre, vanille et épices nobles.',
    keywords: ['parfum oriental', 'parfum dubai', 'eau de parfum oriental', 'parfum lattafa', 'parfum maison alhambra', 'parfum oud', 'parfum longue tenue'],
    hero: 'Haute Parfumerie Orientale — Eaux de Parfum de Dubaï',
    filterType: 'oriental'
  },
  'original': {
    label: 'Créations Originales',
    description: 'Découvrez les créations parfumées originales des grandes maisons de Dubaï. Fragrances uniques et authentiques.',
    longDescription: 'Une gamme de créations olfactives exclusives alliant savoir-faire ancestral oriental et modernité internationale.',
    keywords: ['créations parfum', 'parfum original dubai', 'lattafa original', 'parfum de niche dubai'],
    hero: 'Créations Olfactives Originales & Exclusives',
    filterType: 'original'
  }
};

export async function generateStaticParams() {
  return [
    { type: 'oriental' },
    { type: 'original' }
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Redirection automatique des anciens slugs
  if (params.type === 'equivalent' || params.type === 'dupe') {
    return { title: 'Parfums Orientaux de Dubaï' };
  }

  const typeInfo = TYPE_MAP[params.type];
  if (!typeInfo) return { title: 'Non trouvé' };

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
  const canonicalUrl = `${siteUrl}/shop/type/${params.type}`;

  return {
    title: `${typeInfo.label}`,
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
  // Redirection 301 immédiate pour les anciens chemins
  if (params.type === 'equivalent' || params.type === 'dupe') {
    redirect('/shop/type/oriental');
  }

  const typeInfo = TYPE_MAP[params.type];
  if (!typeInfo) notFound();

  const allProducts = getProducts();
  const filter = typeInfo.filterType || 'oriental';
  const products = allProducts.filter(p => p.type === filter || (filter === 'oriental' && p.type !== 'original'));
  const families = getFragranceFamilies();
  const genders = getGenderCategories();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://dubainegoce.fr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Boutique',
        item: 'https://dubainegoce.fr/shop/all',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: typeInfo.label,
        item: `https://dubainegoce.fr/shop/type/${params.type}`,
      },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: typeInfo.label,
    description: typeInfo.description,
    url: `https://dubainegoce.fr/shop/type/${params.type}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://dubainegoce.fr/parfum/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
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
                ✓ Eaux de Parfum 100% Authentiques
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700">
                ✓ Livraison 48h France
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700">
                ✓ Flacons Scellés d'Origine
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
            L'Excellence de la Parfumerie Orientale
          </h2>
          <div className="prose prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              Les parfums de Dubaï sont mondialement réputés pour leur sillage envoûtant, leur haute concentration en extraits et leur tenue incomparable.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>✨ <strong>100% Authentiques</strong> — Produits neufs sous emballage scellé du fabricant officiel</li>
              <li>🌿 <strong>Matières Premières Nobles</strong> — Oud, ambre gris, vanille de Madagascar, rose de Damas</li>
              <li>⚡ <strong>Tenue Exceptionnelle</strong> — Formules Eau de Parfum conçues pour durer toute la journée</li>
              <li>📦 <strong>Expédition Soignée</strong> — Livraison rapide en 48h depuis notre stock en France</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
