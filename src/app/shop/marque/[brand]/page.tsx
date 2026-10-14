import { Metadata } from 'next';
import { getProducts, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';

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
        description: 'Collection Maison Alhambra : Woody Oud, Jean Lowe Immortal, Kismet for Women, Toscano Leather… Créations orientales prestigieuses à moins de 40€. Livraison rapide France.',
    },
    'fragrance-world': {
        title: 'Parfums Fragrance World — Collection Dubai authentique | Dubainegoce',
        description: 'Découvrez la collection Fragrance World chez Dubainegoce — parfums orientaux authentiques des Émirats. Prix accessibles, qualité premium, livraison 48h France.',
    },
    'french-avenue': {
        title: 'Parfums French Avenue — Liquid Brun, Kenzie | Dubainegoce',
        description: 'Découvrez les eaux de parfum French Avenue : Liquid Brun, collection Kenzie. Parfums orientaux d\'exception livrés en 48h.',
    },
    'armaf': {
        title: 'Parfums Armaf — Club de Nuit et collection Dubai | Dubainegoce',
        description: 'Collection Armaf authentique chez Dubainegoce. Club de Nuit et autres fragrances de la marque Dubai premium. Livraison rapide en France.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) return { title: 'Non trouvé' };
    const url = `https://dubainegoce.fr/shop/marque/${params.brand}`;
    const seo = BRAND_SEO[params.brand] || {
        title: `Parfums ${brandName} authentiques — Dubai | Dubainegoce`,
        description: `Toute la collection ${brandName} chez Dubainegoce — parfums authentiques des Émirats livrés en France en 48h. Qualité orientale, prix accessibles.`,
    };

    return {
        title: seo.title,
        description: seo.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: url,
            type: 'website',
        },
    };
}

export default function BrandShopPage({ params }: Props) {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) notFound();

    const allProducts = getProducts();
    const products = allProducts.filter(p => p.brand.name === brandName);
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
            {
                '@type': 'ListItem',
                position: 3,
                name: brandName,
                item: `https://dubainegoce.fr/shop/marque/${params.brand}`,
            },
        ],
    };

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Parfums ${brandName}`,
        description: `Toute la collection ${brandName} — parfums 100% authentiques des Émirats Arabes Unis.`,
        url: `https://dubainegoce.fr/shop/marque/${params.brand}`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.slice(0, 10).map((p, idx) => ({
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
                    brands={[]}
                    families={families}
                    genders={genders}
                    title={brandName}
                    description={`Toute la collection ${brandName} — triez par prix, meilleures ventes ou nouveautés.`}
                />
            </Suspense>
        </>
    );
}
