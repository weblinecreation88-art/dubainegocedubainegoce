import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'Liquid Brun French Avenue : Avis & Test du Gourmand Épicé Tendance',
    description: 'Liquid Brun de French Avenue cartonne en 2026 — vanille bourbon, cardamome, praline. Notre avis complet sur cette création olfactive des Émirats.',
    keywords: 'Liquid Brun French Avenue, Liquid Brun avis, parfum gourmand épicé, parfum vanille cardamome, French Avenue parfum, parfum oriental dubai',
    alternates: {
        canonical: 'https://dubainegoce.fr/blog/liquid-brun-french-avenue',
    },
    openGraph: {
        title: 'Liquid Brun French Avenue : Avis & Test du Gourmand Épicé Tendance',
        description: 'Notre avis complet sur cette création olfactive des Émirats.',
        url: 'https://dubainegoce.fr/blog/liquid-brun-french-avenue',
        type: 'article',
    },
};

export default function BlogPostPage() {
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Liquid Brun French Avenue : Avis & Test du Gourmand Épicé Tendance',
        description: 'Liquid Brun de French Avenue cartonne en 2026 — vanille bourbon, cardamome, praline.',
        image: 'https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png',
        datePublished: '2026-03-01T00:00:00+01:00',
        dateModified: '2026-09-01T00:00:00+01:00',
        author: {
            '@type': 'Organization',
            name: 'Dubainegoce',
            url: 'https://dubainegoce.fr',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Dubainegoce',
            logo: {
                '@type': 'ImageObject',
                url: 'https://dubainegoce.fr/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://dubainegoce.fr/blog/liquid-brun-french-avenue',
        },
    };

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
            {
                '@type': 'ListItem',
                position: 3,
                name: 'Liquid Brun French Avenue Avis',
                item: 'https://dubainegoce.fr/blog/liquid-brun-french-avenue',
            },
        ],
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <JsonLd data={articleJsonLd} />
            <JsonLd data={breadcrumbJsonLd} />
            <article className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">

                <div className="relative mb-8 w-full aspect-video">
                    <Image
                        src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png"
                        alt="Liquid Brun French Avenue parfum épicé vanillé"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                    />
                </div>

                <p className="text-sm text-primary font-semibold mb-2">Parfum tendance 2026</p>
                <h1>Liquid Brun : le parfum épicé-vanillé qui fait parler de lui en 2026</h1>

                <p className="lead">
                    Il y a des parfums qui arrivent discrètement et s'imposent progressivement dans les discussions. Liquid Brun de French Avenue est de ceux-là. Depuis quelques mois, il revient régulièrement dans les listes des meilleurs gourmands à moins de 40€. On l'a testé en détail pour vous.
                </p>

                <h2>French Avenue, l'excellence des Émirats</h2>
                <p>
                    French Avenue est une maison de parfumerie de Dubaï qui mise sur un savoir-faire d'exception : des fragrances sophistiquées formulées avec des essences rares et l'expertise orientale du Golfe. Résultat : des jus concentrés en Eau de Parfum, tenues solides et prix accessibles.
                </p>
                <p>
                    La marque se fait un nom auprès des connaisseurs recherchant des créations originales aux sillages profonds et chaleureux.
                </p>

                <h2>Le profil olfactif : vanille bourbon, cardamome, praline</h2>
                <p>
                    Liquid Brun s'inscrit dans la catégorie prestigieuse des <strong>gourmands épicés</strong>, très recherchée pour sa signature enveloppante et réconfortante.
                </p>
                <p>
                    À l'ouverture, c'est la <strong>cardamome</strong> qui s'exprime en premier — vive, légèrement poivrée et texturée. Elle s'intègre rapidement dans un accord plus doux où dominent la <strong>vanille bourbon</strong> et la <strong>praline</strong> fondante. Le résultat est gourmand, noble et parfaitement équilibré.
                </p>
                <p>
                    En fond, des notes de bois ambrés et de musc viennent ancrer le jus et lui conférer une remarquable profondeur.
                </p>

                <h2>Tenue et sillage : la signature orientale</h2>
                <p>
                    Comme beaucoup de grandes créations émiraties, Liquid Brun assure une tenue de <strong>8 à 10 heures sur peau</strong> et davantage sur vêtements. Le sillage est généreux sans être entêtant.
                </p>
                <p>
                    Une ou deux pulvérisations suffisent amplement pour vous accompagner toute la journée.
                </p>

                <h2>Pour qui, quelle saison ?</h2>
                <p>
                    Liquid Brun est particulièrement sublime lors des <strong>saisons fraîches</strong> (automne et hiver) où les notes chaudes de vanille et de praline trouvent toute leur ampleur.
                </p>
                <p>
                    C'est un parfum <strong>mixte</strong>, apprécié aussi bien par les hommes que par les femmes grâce à l'équilibre subtil entre le piquant de la cardamome et la gourmandise de la vanille.
                </p>

                <h2>Le verdict</h2>
                <p>
                    Liquid Brun est une <strong>magnifique réussite</strong>. C'est une fragrance chaleureuse, addictive et raffinée qui mérite amplement sa popularité actuelle.
                </p>
                <p>
                    <strong>Note : 9/10</strong> — Un incontournable pour les amateurs de parfums gourmands et épicés.
                </p>

                <div className="not-prose mt-8 p-6 bg-card border border-border rounded-lg">
                    <p className="text-sm font-semibold text-primary mb-2">À découvrir</p>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/parfum/liquide-brun-french-avenue" className="text-foreground hover:text-primary transition-colors font-medium">
                                → Liquid Brun 100ml — French Avenue
                            </Link>
                        </li>
                        <li>
                            <Link href="/shop/marque/french-avenue" className="text-foreground hover:text-primary transition-colors">
                                → Toute la collection French Avenue
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog/dupes-parfums-luxe" className="text-foreground hover:text-primary transition-colors">
                                → Les 8 meilleurs parfums de Dubaï à sillage puissant
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="not-prose mt-6">
                    <Link
                        href="/shop"
                        className="inline-block bg-black text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors"
                    >
                        Explorer tous nos parfums →
                    </Link>
                </div>

            </article>
        </div>
    );
}
