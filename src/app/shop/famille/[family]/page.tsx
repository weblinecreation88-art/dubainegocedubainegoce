import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';

type Props = { params: { family: string } };

// Mapping slug → nom de famille exact dans les données
const FAMILY_MAP: Record<string, string> = {
    'boise': 'Boisé',
    'oriental': 'Oriental',
    'floral': 'Floral',
    'aquatique': 'Aquatique',
    'oud': 'Oud',
    'fruite': 'Fruité',
    'epice': 'Épicé',
    'musque': 'Musqué',
    'agrume': 'Agrume',
    'chypre': 'Chypre',
    'fougere': 'Fougère',
    'gourmand': 'Gourmand',
};

export async function generateStaticParams() {
    return Object.keys(FAMILY_MAP).map(family => ({ family }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const familyName = FAMILY_MAP[params.family];
    if (!familyName) return { title: 'Non trouvé' };
    return {
        title: `Parfums ${familyName} - Dubainegoce`,
        description: `Découvrez notre sélection de parfums de la famille ${familyName} (Lattafa, Maison Alhambra). Filtrez par marque et prix.`,
    };
}

export default function FamilyShopPage({ params }: Props) {
    const familyName = FAMILY_MAP[params.family];
    if (!familyName) notFound();

    const allProducts = getProducts();
    const products = allProducts.filter(p => p.family === familyName);
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
                title={`Parfums ${familyName}`}
                description={`Notre sélection de parfums ${familyName} — filtrez par marque, genre et prix.`}
            />
        </Suspense>
    );
}
