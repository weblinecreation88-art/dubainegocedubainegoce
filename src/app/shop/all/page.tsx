
import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from './loading';

export const metadata: Metadata = {
  title: 'Boutique - Parfums Authentiques de Dubaï | Lattafa, Maison Alhambra | Dubainegoce',
  description: 'Explorez notre collection exclusive de 150+ parfums authentiques de Dubaï. Lattafa, Maison Alhambra, Fragrance World. Filtrez par marque, famille olfactive, genre. Livraison rapide 48h.',
  keywords: 'parfums dubaï, lattafa, maison alhambra, fragrance world, parfums orientaux, parfums pas cher, parfums authentiques',
};

export default function ShopAllPage() {
  // Fix: Add H1 in page content via PageSEO wrapper
  const products = getProducts();
  const brands = getBrands();
  const families = getFragranceFamilies();
  const genders = getGenderCategories();

  return (
    <>
      {/* SEO H1 - unique et descriptif */}
      <h1 className="sr-only">Boutique - Découvrez nos Parfums Authentiques de Dubaï</h1>

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
