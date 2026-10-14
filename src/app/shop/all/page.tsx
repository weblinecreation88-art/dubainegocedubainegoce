import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from './loading';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Boutique — Parfums Authentiques de Dubaï | Lattafa, Maison Alhambra | Dubainegoce',
  description: 'Explorez notre collection exclusive de parfums authentiques de Dubaï. Lattafa, Maison Alhambra, French Avenue, Fragrance World. Filtrez par marque, famille olfactive, genre. Livraison rapide 48h.',
  keywords: 'parfums dubaï, lattafa, maison alhambra, french avenue, fragrance world, parfums orientaux, parfums authentiques',
  alternates: {
    canonical: 'https://dubainegoce.fr/shop/all',
  },
  openGraph: {
    title: 'Boutique — Parfums Authentiques de Dubaï | Dubainegoce',
    description: 'Catalogue complet d\'eaux de parfum orientales de Dubaï.',
    url: 'https://dubainegoce.fr/shop/all',
    type: 'website',
  },
};

export default function ShopAllPage() {
  const products = getProducts();
  const brands = getBrands();
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
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Boutique Dubainegoce',
    description: 'Catalogue complet des parfums orientaux de Dubaï.',
    url: 'https://dubainegoce.fr/shop/all',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 12).map((p, idx) => ({
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
      {/* SEO H1 */}
      <h1 className="sr-only">Boutique — Découvrez nos Parfums Authentiques de Dubaï</h1>

      <Suspense fallback={<ShopAllLoading />}>
        <ShopPageContent
          products={products}
          brands={brands}
          families={families}
          genders={genders}
        />
      </Suspense>
    </>
  );
}
