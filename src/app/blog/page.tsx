
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'Blog Parfums Orientaux — Guides, Avis et Décryptages | Dubainegoce',
    description: 'Guides d\'achat, avis détaillés, décryptage de l\'oud, sélections des meilleures créations de Dubaï (Lattafa, Maison Alhambra, French Avenue).',
    keywords: 'guide parfum oriental, avis Khamrah, avis Maison Alhambra, parfum oud guide, parfum oriental femme, Lattafa meilleur parfum, parfums dubai',
    alternates: {
        canonical: 'https://dubainegoce.fr/blog',
    },
    openGraph: {
        title: 'Blog Parfums Orientaux — Dubainegoce',
        description: 'Guides, avis et sélections des meilleurs parfums de Dubaï.',
        url: 'https://dubainegoce.fr/blog',
        type: 'website',
    },
};

const blogPosts = [
    {
        title: 'Fakhar Black Lattafa : le masculin sombre qui s\'installe dans les tops',
        description: 'Intense, boisé, profond — Fakhar Black est le parfum homme de Lattafa qu\'on ne s\'attendait pas à autant apprécier. Avis complet, sillage, occasions.',
        link: '/blog/fakhar-black-lattafa-homme',
        imageUrl: '/images-parfums/fakhar-black-lattafa.png',
        imageHint: 'Fakhar Black Lattafa parfum masculin sombre'
    },
    {
        title: 'Badee Al Oud Oud For Glory : l\'oriental iconique de 2025',
        description: 'Pourquoi Badee Al Oud For Glory de Lattafa s\'est imposé comme référence en 2025. Oud profond, sillage imposant, tenue exceptionnelle — notre avis honnête.',
        link: '/blog/badee-al-oud-for-glory-avis',
        imageUrl: '/images-parfums/badee-al-oud-oud-for-glory-lattafa.png',
        imageHint: 'Badee Al Oud For Glory Lattafa oriental'
    },
    {
        title: 'Fragrance World : la marque Dubai qui avance discrètement et s\'impose',
        description: 'Moins connue que Lattafa, Fragrance World formule des parfums d\'une qualité surprenante depuis 30 ans. A King, K King, Dark As Wood — notre portrait de la marque.',
        link: '/blog/fragrance-world-marque',
        imageUrl: '/images-parfums/dark-as-wood-fragrance-world.png',
        imageHint: 'Fragrance World Dark As Wood parfum Dubai'
    },
    {
        title: 'La collection Kenzie French Avenue : les gourmands qui cartonnent sur TikTok',
        description: 'Kenzie Marshmallow, Candid Vanilla, Pistachio — la série gourmande qui fait le buzz en 2026. Notes, avis, pour qui ? On a tout testé pour vous.',
        link: '/blog/kenzie-collection-french-avenue',
        imageUrl: '/images-parfums/kenzie-pistachio-100ml.jpg',
        imageHint: 'Kenzie Pistachio French Avenue gourmand'
    },
    {
        title: 'Liquid Brun French Avenue : le gourmand épicé qui fait parler de lui en 2026',
        description: 'Vanille bourbon, cardamome, praline — Liquid Brun de French Avenue est une création olfactive remarquable. Notre avis après test.',
        link: '/blog/liquid-brun-french-avenue',
        imageUrl: '/images-parfums/liquid-brun-100ml.webp',
        imageHint: 'Liquid Brun French Avenue vanille épicé'
    },
    {
        title: 'Les 8 meilleurs parfums de Dubaï à sillage puissant à moins de 40€',
        description: 'Khamrah, Asad, Yara, Woody Oud… les créations orientales les plus performantes en tenue et en sillage. Comparatif complet.',
        link: '/blog/dupes-parfums-luxe',
        imageUrl: '/images-parfums/confidential-platinum-lattafa.jpg',
        imageHint: 'meilleurs parfums dubai orientaux Lattafa'
    },
    {
        title: 'Khamrah Lattafa : avis complet et honnête après 1 an d\'utilisation',
        description: 'Le parfum oriental le plus viral de ces dernières années. Notes, tenue, sillage, pour qui, quelle saison — tout ce que vous voulez savoir avant d\'acheter.',
        link: '/blog/khamrah-lattafa-avis',
        imageUrl: '/images-parfums/maahir-lattafa.png',
        imageHint: 'Khamrah Lattafa parfum oriental gourmand'
    },
    {
        title: '7 parfums orientaux pour femme qu\'on adore en 2026',
        description: 'Des floraux sucrés aux oud profonds : notre sélection des meilleures fragrances orientales féminines disponibles à moins de 40€.',
        link: '/blog/parfums-orientaux-femme-2026',
        imageUrl: 'https://res.cloudinary.com/dzntnjtkc/image/upload/v1773725244/femme-parfum-poignet_sixg1u.png',
        imageHint: 'parfums orientaux femme poignet'
    },
    {
        title: 'Maison Alhambra : les secrets de la marque de parfumerie de Dubaï',
        description: 'Qui est vraiment Maison Alhambra ? Histoire, qualité, meilleures fragrances, pyramides olfactives — notre avis complet sur la maison émiratie.',
        link: '/blog/maison-alhambra-la-marque',
        imageUrl: '/images-parfums/kismet-for-women-maison-alhambra.webp',
        imageHint: 'Maison Alhambra parfum Dubai'
    },
    {
        title: 'Tout savoir sur le parfum oud avant d\'acheter — guide complet',
        description: 'Qu\'est-ce que l\'oud ? Pourquoi est-il si cher ? Comment choisir son premier oud ? Guide complet avec sélection des meilleurs oud à moins de 40€.',
        link: '/blog/guide-parfum-oud',
        imageUrl: '/images-parfums/oud-mood-lattafa.png',
        imageHint: 'parfum oud bois d agar oriental'
    },
    {
        title: 'À découvrir cet été 2025 : la marque Alhambra continue de captiver',
        description: 'La marque Alhambra continue de captiver l\'univers du parfum avec ses créations uniques pour l\'été 2025.',
        link: '/blog/alhambra-ete-2025',
        imageUrl: '/images-parfums/la-vita-bella-maison-alhambra.webp',
        imageHint: 'Maison Alhambra été 2025 parfum femme'
    },
    {
        title: 'Parfumerie 2025 : comment la tendance orientale redéfinit le marché',
        description: 'La tendance des parfums orientaux redéfinit le marché avec ses notes riches et complexes. Décryptage.',
        link: '/blog/tendances-parfums-orientaux-2025',
        imageUrl: 'https://res.cloudinary.com/dzntnjtkc/image/upload/v1773725815/ChatGPT_Image_17_mars_2026_05_36_32_clwqv6.png',
        imageHint: 'parfum oriental tendance marché 2025'
    },
    {
        title: 'Top 5 des parfums Lattafa à absolument tester en 2025',
        description: 'Découvrez notre sélection des incontournables de la maison Lattafa pour 2025, des fragrances qui marquent les esprits.',
        link: '/blog/top-5-lattafa-2025',
        imageUrl: '/images-parfums/asad-lattafa.png',
        imageHint: 'Asad Lattafa collection meilleur parfum'
    }
];

export default function BlogPage() {
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
                name: 'Blog',
                item: 'https://dubainegoce.fr/blog',
            },
        ],
    };

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Blog Dubainegoce',
        description: 'Guides d\'achat, avis détaillés et sélections des meilleurs parfums de Dubaï.',
        url: 'https://dubainegoce.fr/blog',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: blogPosts.length,
            itemListElement: blogPosts.map((p, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: `https://dubainegoce.fr${p.link}`,
                name: p.title,
            })),
        },
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <JsonLd data={breadcrumbJsonLd} />
            <JsonLd data={collectionJsonLd} />
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Le Blog DubaiNegoce</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Actualités, conseils et découvertes sur le monde fascinant des parfums de Dubaï.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    <Card key={index} className="flex flex-col bg-card group">
                        <CardHeader className="p-0">
                            <Link href={post.link} className="block">
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={post.imageHint}
                                    />
                                </div>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <p className="text-sm text-primary font-semibold mb-2">Article parfum</p>
                            <CardTitle className="text-xl font-headline mb-2 min-h-[3.75rem]">
                                <Link href={post.link} className="hover:text-primary transition-colors">
                                    {post.title}
                                </Link>
                            </CardTitle>
                            <CardDescription>
                                {post.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                             <Button asChild variant="link" className="p-0 group">
                                <Link href={post.link}>
                                    En lire plus
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
