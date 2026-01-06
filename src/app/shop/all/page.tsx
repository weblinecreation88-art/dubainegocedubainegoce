
import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from './loading';

export const metadata: Metadata = {
  title: 'Boutique - Tous les Parfums',
  description: 'Explorez notre collection complète de parfums de Dubaï. Filtrez par marque (Lattafa, Maison Alhambra...), famille olfactive ou genre pour trouver votre sillage parfait.',
};

export default function ShopAllPage() {
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
