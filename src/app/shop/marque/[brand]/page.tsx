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
        title: 'Parfums Lattafa — Khamrah, Yara, Asad, Ameer Al Oudh',
        description: "Explorez les parfums Lattafa, dont Khamrah, Yara et Asad. Comparez contenances et prix, et consultez les références disponibles.",
    },
    'maison-alhambra': {
        title: 'Parfums Maison Alhambra — Woody Oud, Jean Lowe, Kismet',
        description: "Retrouvez les parfums Maison Alhambra : Tobacco Touch, Toscano Leather et les autres références du catalogue. Consultez prix et disponibilités.",
    },
    'fragrance-world': {
        title: 'Parfums Fragrance World — Collection Dubai authentique',
        description: "Parcourez les parfums Fragrance World et affinez votre choix par genre ou famille olfactive. Les prix et stocks sont indiqués pour chaque référence.",
    },
    'french-avenue': {
        title: 'Parfums French Avenue — Liquid Brun, Kenzie',
        description: "Découvrez les parfums French Avenue, dont Liquid Brun et la collection Kenzie. Comparez les références, leurs contenances et leur disponibilité.",
    },
    'paris-corner': {
        title: 'Parfums Paris Corner — Khair et sélection disponible',
        description: 'Découvrez les parfums Paris Corner du catalogue. Consultez les contenances, les prix et les stocks, puis filtrez selon vos envies.',
    },
    'armaf': {
        title: 'Parfums Armaf — Club de Nuit et collection Dubai',
        description: 'Collection Armaf authentique chez Dubainegoce. Club de Nuit et autres fragrances de la marque Dubai premium. Livraison rapide en France.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const brandName = BRAND_MAP[params.brand];
    if (!brandName) return { title: 'Non trouvé' };
    const url = `https://dubainegoce.fr/shop/marque/${params.brand}`;
    const seo = BRAND_SEO[params.brand] || {
        title: `Parfums ${brandName} authentiques — Dubai`,
        description: `Toute la collection ${brandName} chez Dubainegoce — comparez les références, leurs contenances et leur disponibilité.`,
    };

    return {
        title: seo.title,
        description: seo.description,
        robots: { index: getProducts().some(p => p.brand.name === brandName), follow: true },
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
                    title={`Parfums ${brandName}`}
                    description={`Découvrez les parfums ${brandName}. Comparez les contenances, les prix et les disponibilités, puis filtrez par genre ou famille olfactive.`}
                />
            </Suspense>
        </>
    );
}
