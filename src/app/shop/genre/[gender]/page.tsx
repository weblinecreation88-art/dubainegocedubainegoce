import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../all/loading';
import { notFound } from 'next/navigation';

type Props = { params: { gender: string } };

// Mapping slug → label et query
const GENDER_MAP: Record<string, { label: string; genderName: string }> = {
    homme: { label: 'Parfums Homme', genderName: 'homme' },
    femme: { label: 'Parfums Femme', genderName: 'femme' },
    mixte: { label: 'Parfums Mixtes', genderName: 'mixte' },
};

export async function generateStaticParams() {
    return Object.keys(GENDER_MAP).map(gender => ({ gender }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const config = GENDER_MAP[params.gender];
    if (!config) return { title: 'Non trouvé' };
    return {
        title: `${config.label} - Dubainegoce`,
        description: `Découvrez notre sélection de ${config.label.toLowerCase()} authentiques (Lattafa, Maison Alhambra). Filtrez par marque, famille et prix.`,
    };
}

export default function GenderShopPage({ params }: Props) {
    const config = GENDER_MAP[params.gender];
    if (!config) notFound();

    const allProducts = getProducts();
    const products = allProducts.filter(p => p.gender === config.genderName);
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
                title={config.label}
                description={`Notre sélection de parfums ${config.genderName} — filtrez par marque, famille olfactive et prix.`}
            />
        </Suspense>
    );
}
