import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';

type Props = { params: { brand: string } };

// Mapping slug URL → nom exact de la marque dans les données
const BRAND_MAP: Record<string, string> = {
    'lattafa': 'Lattafa',
    'maison-alhambra': 'Maison Alhambra',
    'paris-corner': 'Paris Corner',
    'armaf': 'Armaf',
    'banafa-for-oud': 'Banafa for Oud',
    'ard-al-zaafaran': 'Ard Al Zaafaran',
    'fragrance-world': 'Fragrance World',
    'jean-couturier': 'Jean Couturier',
    'jb-loves-fragrances': 'JB Loves Fragrances',
    'prive-zarah': 'PriveZarah',
    'asdaaf': 'Asdaaf',
    'rave': 'Rave',
    'pandora-scents': 'Pandora Scents',
    'nasomatto': 'Nasomatto',
    'mirada': 'MIRADA',
    'hamidi': 'Hamidi',
    'loui-martin': 'Loui Martin',
    'surrati': 'Surrati',
    'french-avenue': 'French Avenue',
    'guerlain': 'Guerlain',
    'jacques-yves': 'Jacques Yves',
    'gulf-orchid': 'Gulf Orchid',
    'sublime': 'Sublime',
    'naturafrika': 'Naturafrika',
};

export async function generateStaticParams() {
    return Object.keys(BRAND_MAP).map(brand => ({ brand }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) return { title: 'Non trouvé' };
    return {
        title: `Parfums ${brandName} - Dubainegoce`,
        description: `Découvrez toute la collection ${brandName} chez Dubainegoce — parfums authentiques livrés en France. Filtrez par genre, famille olfactive et prix.`,
    };
}

export default function BrandShopPage({ params }: Props) {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) notFound();

    const allProducts = getProducts();
    const products = allProducts.filter(p => p.brand.name === brandName);
    const families = getFragranceFamilies();
    const genders = getGenderCategories();

    return (
        <Suspense fallback={<ShopAllLoading />}>
            <ShopPageContent
                products={products}
                brands={[]}
                families={families}
                genders={genders}
                title={brandName}
                description={`Toute la collection ${brandName} — triez par prix, meilleures ventes ou nouveautés.`}
            />
        </Suspense>
    );
}
