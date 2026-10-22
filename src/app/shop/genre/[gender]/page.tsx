import { Metadata } from 'next';
import { getProducts, getBrands, getFragranceFamilies, getGenderCategories } from '@/lib/data';
import ShopPageContent from '@/components/shop/shop-page-content';
import { Suspense } from 'react';
import ShopAllLoading from '../../all/loading';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';

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
        title: 'Parfums Femme Orientaux — Yara, Kismet, Ana Abiyedh',
        description: 'Explorez notre sélection de parfums de Dubaï. Comparez les maisons, les familles olfactives, les prix et les disponibilités.',
    },
    homme: {
        title: 'Parfums Homme Orientaux — Asad, Jean Lowe, Khamrah',
        description: 'Explorez notre sélection de parfums de Dubaï. Comparez les maisons, les familles olfactives, les prix et les disponibilités.',
    },
    mixte: {
        title: 'Parfums Mixtes Unisexe Orientaux — Woody Oud, Khamrah',
        description: 'Explorez notre sélection de parfums de Dubaï. Comparez les maisons, les familles olfactives, les prix et les disponibilités.',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const config = GENDER_MAP[params.gender];
    if (!config) return { title: 'Non trouvé' };
    const seo = GENDER_SEO[params.gender] || {
        title: `${config.label} orientaux authentiques`,
        description: `Découvrez notre sélection de ${config.label.toLowerCase()} authentiques (Lattafa, Maison Alhambra). Parfums Dubai à partir de 35€, livraison rapide France.`,
    };
    const url = `https://dubainegoce.fr/shop/genre/${params.gender}`;

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

export default function GenderShopPage({ params }: Props) {
    const config = GENDER_MAP[params.gender];
    if (!config) notFound();

    const allProducts = getProducts();
    const products = allProducts.filter(p => p.gender === config.genderName);
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
                name: config.label,
                item: `https://dubainegoce.fr/shop/genre/${params.gender}`,
            },
        ],
    };

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: config.label,
        description: `Notre sélection de parfums ${config.genderName} — filtrez par marque, famille olfactive et prix.`,
        url: `https://dubainegoce.fr/shop/genre/${params.gender}`,
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
                    title={config.label}
                    description={`Notre sélection de parfums ${config.genderName} — filtrez par marque, famille olfactive et prix.`}
                />
            </Suspense>
        </>
    );
}
