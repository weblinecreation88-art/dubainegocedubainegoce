import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from './loading';
import { JsonLd } from '@/components/seo/json-ld';

const catalogueMetadata: Metadata = {
  title: 'Boutique — Parfums Authentiques de Dubaï | Lattafa, Maison Alhambra',
  description: 'Découvrez les parfums de Lattafa, Maison Alhambra, French Avenue et Fragrance World. Comparez les prix et filtrez par marque, famille olfactive ou genre.',
  keywords: 'parfums dubaï, lattafa, maison alhambra, french avenue, fragrance world, parfums orientaux, parfums authentiques',
  alternates: {
    canonical: 'https://dubainegoce.fr/shop/all',
  },
  openGraph: {
    title: 'Boutique — Parfums Authentiques de Dubaï',
    description: 'Catalogue complet d\'eaux de parfum orientales de Dubaï.',
    url: 'https://dubainegoce.fr/shop/all',
    type: 'website',
  },
};

export function generateMetadata({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }): Metadata {
  return {
    ...catalogueMetadata,
    ...(searchParams.q ? { robots: { index: false, follow: true } } : {}),
  };
}

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
