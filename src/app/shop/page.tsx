
import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from './loading';

export const metadata: Metadata = {
  title: 'Boutique - Tous les Parfums de Dubaï | Dubainegoce',
  description: 'Découvrez notre collection de 144 parfums orientaux de Dubaï. Lattafa, Maison Alhambra, Fragrance World et plus. Filtrez par marque, genre ou famille olfactive.',
};

export default function ShopPage() {
  const products = getProducts();
  const brands = getBrands();
  const families = getFragranceFamilies();
  const genders = getGenderCategories();

  return (
    <Suspense fallback={<ShopAllLoading />}>
        <ShopPageContent
            products={products}
            brands={brands}
            families={families}
            genders={genders}
        />
    </Suspense>
  );
}
