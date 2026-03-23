import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
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

// SEO enrichi par genre pour cibler les mots-clés à fort volume
const GENDER_SEO: Record<string, { title: string; description: string }> = {
    femme: {
        title: 'Parfums Femme Orientaux — Yara, Kismet, Ana Abiyedh | Dubainegoce',
        description: 'Sélection de parfums orientaux pour femme : Yara Lattafa, Kismet Maison Alhambra, Leonie, Ana Abiyedh. Floraux, gourmands, oud-rose — à partir de 35€. Livraison 48h.',
    },
    homme: {
        title: 'Parfums Homme Orientaux — Asad, Jean Lowe, Khamrah | Dubainegoce',
        description: 'Les meilleurs parfums pour homme de Dubai : Asad Lattafa, Jean Lowe Immortal Alhambra, Glacier et plus. Boisés, épicés, ouds authentiques — moins de 40€. Livraison rapide.',
    },
    mixte: {
        title: 'Parfums Mixtes Unisexe Orientaux — Woody Oud, Khamrah | Dubainegoce',
        description: 'Parfums mixtes et unisexes de Dubai : Woody Oud, Infini Oud, Khamrah et plus. Ouds élégants, floraux-ambrés — pour elle comme pour lui, à moins de 40€. Livraison 48h.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const config = GENDER_MAP[params.gender];
    if (!config) return { title: 'Non trouvé' };
    const seo = GENDER_SEO[params.gender];
    if (seo) return seo;
    return {
        title: `${config.label} orientaux authentiques | Dubainegoce`,
        description: `Découvrez notre sélection de ${config.label.toLowerCase()} authentiques (Lattafa, Maison Alhambra). Parfums Dubai à partir de 35€, livraison rapide France.`,
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
