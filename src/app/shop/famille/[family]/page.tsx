import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';

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
    const url = `https://dubainegoce.fr/shop/famille/${params.family}`;

    return {
        title: `Parfums ${familyName} - Eaux de Parfum Dubaï | Dubainegoce`,
        description: `Découvrez notre collection de parfums de la famille ${familyName} (Lattafa, Maison Alhambra, French Avenue). Eaux de parfum 100% authentiques, livraison 48h.`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `Parfums ${familyName} - Dubainegoce`,
            description: `Notre sélection d'eaux de parfum de la famille ${familyName}.`,
            url: url,
            type: 'website',
        },
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
                name: `Parfums ${familyName}`,
                item: `https://dubainegoce.fr/shop/famille/${params.family}`,
            },
        ],
    };

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Parfums ${familyName}`,
        description: `Notre sélection de parfums ${familyName} — filtrez par marque, genre et prix.`,
        url: `https://dubainegoce.fr/shop/famille/${params.family}`,
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
                    brands={brands}
                    families={families}
                    genders={genders}
                    title={`Parfums ${familyName}`}
                    description={`Notre sélection de parfums ${familyName} — filtrez par marque, genre et prix.`}
                />
            </Suspense>
        </>
    );
}
