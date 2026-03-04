import { Metadata } from 'next';
import { getProducts, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';

type Props = { params: { type: string } };

// Mapping pour les types de produits
const TYPE_MAP: Record<string, { label: string; description: string }> = {
  'equivalent': {
    label: 'Équivalents & Dupes',
    description: 'Découvrez notre collection complète d\'équivalents — des parfums d\'exception qui rivalisent avec les grandes maisons de luxe, à des prix accessibles.'
  },
  'dupe': {
    label: 'Dupes',
    description: 'Les meilleurs dupes à petit prix — des fragrances qui rivalisent avec les grands classiques du luxe.'
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

  return {
    title: `${typeInfo.label} - Dubainegoce | Parfums Pas Chers`,
    description: `${typeInfo.description} Livraison 48h en France. 100% Authentique.`,
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
  );
}
