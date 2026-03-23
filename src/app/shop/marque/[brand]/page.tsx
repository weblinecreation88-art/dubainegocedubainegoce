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

// SEO enrichi par marque pour cibler les mots-clés à fort volume
const BRAND_SEO: Record<string, { title: string; description: string }> = {
    'lattafa': {
        title: 'Parfums Lattafa — Khamrah, Yara, Asad, Ameer Al Oudh | Dubainegoce',
        description: 'Toute la collection Lattafa authentique : Khamrah, Yara, Asad, Ameer Al Oudh, Qaed Al Fursan et plus. Parfums orientaux Dubai à partir de 35€. Livraison 48h France.',
    },
    'maison-alhambra': {
        title: 'Parfums Maison Alhambra — Woody Oud, Jean Lowe, Kismet | Dubainegoce',
        description: 'Collection Maison Alhambra : Woody Oud, Jean Lowe Immortal, Kismet for Women, Toscano Leather… Alternatives de luxe authentiques à moins de 40€. Livraison rapide France.',
    },
    'fragrance-world': {
        title: 'Parfums Fragrance World — Collection Dubai authentique | Dubainegoce',
        description: 'Découvrez la collection Fragrance World chez Dubainegoce — parfums orientaux authentiques des Émirats. Prix accessibles, qualité premium, livraison 48h France.',
    },
    'armaf': {
        title: 'Parfums Armaf — Club de Nuit et collection Dubai | Dubainegoce',
        description: 'Collection Armaf authentique chez Dubainegoce. Club de Nuit et autres fragrances de la marque Dubai premium. Livraison rapide en France.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) return { title: 'Non trouvé' };
    const seo = BRAND_SEO[params.brand];
    if (seo) return seo;
    return {
        title: `Parfums ${brandName} authentiques — Dubai | Dubainegoce`,
        description: `Toute la collection ${brandName} chez Dubainegoce — parfums authentiques des Émirats livrés en France en 48h. Qualité orientale, prix accessibles.`,
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
