import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'Les 8 Meilleurs Parfums Orientaux de Dubaï à Moins de 40€ — Sillage & Tenue',
    description: 'Khamrah, Asad, Yara, Woody Oud… Notre sélection des 8 meilleures eaux de parfum de Dubaï alliant puissance olfactive et tenue longue durée.',
    keywords: 'meilleur parfum dubai, parfum oriental pas cher, parfum lattafa avis, parfum maison alhambra, parfum longue tenue, eau de parfum dubai',
    alternates: {
        canonical: 'https://dubainegoce.fr/blog/dupes-parfums-luxe',
    },
    openGraph: {
        title: 'Les 8 Meilleurs Parfums Orientaux de Dubaï à Moins de 40€',
        description: 'Sélection des meilleures eaux de parfum de Dubaï alliant sillage et tenue.',
        url: 'https://dubainegoce.fr/blog/dupes-parfums-luxe',
        type: 'article',
    },
};

export default function BlogPostPage() {
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Les 8 Meilleurs Parfums Orientaux de Dubaï à Moins de 40€ — Sillage & Tenue',
        description: 'Khamrah, Asad, Yara, Woody Oud… Notre sélection des 8 meilleures eaux de parfum de Dubaï.',
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
            '@id': 'https://dubainegoce.fr/blog/dupes-parfums-luxe',
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
                name: 'Les 8 Meilleurs Parfums Orientaux de Dubaï',
                item: 'https://dubainegoce.fr/blog/dupes-parfums-luxe',
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
                        alt="Meilleurs parfums orientaux de Dubaï à moins de 40€"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                    />
                </div>

                <p className="text-sm text-primary font-semibold mb-2">Guide Parfumerie Orientale</p>
                <h1>Les 8 Meilleurs Parfums de Dubaï à Sillage Puissant à Moins de 40€</h1>

                <p className="lead">
                    La parfumerie des Émirats Arabes Unis a conquis le monde grâce à des compositions riches, une tenue remarquable et une concentration généreuse. Voici notre sélection des 8 créations orientales incontournables à intégrer à votre collection.
                </p>

                <h2>1. <Link href="/parfum/khamrah-lattafa">Khamrah Lattafa</Link> — Le Gourmand Ambré d'Exception</h2>
                <p>
                    Khamrah est devenu une véritable légende dans l'univers de la parfumerie orientale. Avec ses notes de datte caramélisée, praliné, cannelle chaleureuse et vanille crémeuse sur un fond d'ambre boisé, ce parfum offre une expérience sensorielle enveloppante et luxueuse.
                </p>
                <p>
                    Sa tenue sur peau dépasse aisément 10 heures avec un sillage gourmand captivant qui ne passe jamais inaperçu.
                </p>

                <h2>2. <Link href="/parfum/asad-lattafa">Asad Lattafa</Link> — L'Élégance Masculine Boisée & Épicée</h2>
                <p>
                    Asad est une création masculine puissante et charismatique. Il s'ouvre sur un accord épicé d'ananas noir et poivre, soutenu par un cœur de café et d'iris, pour finir sur un sillage d'ambre sec, de patchouli et de bois précieux.
                </p>
                <p>
                    Idéal pour les saisons fraîches et les soirées, il dégage une aura de confiance et de sophistication.
                </p>

                <h2>3. <Link href="/parfum/jean-lowe-immortal-maison-alhambra">Jean Lowe Immortal Maison Alhambra</Link> — La Fraîcheur Boisée & Cuirée</h2>
                <p>
                    Jean Lowe Immortal allie avec brio une fraîcheur aromatique intense à la chaleur du cuir doux et des bois ambrés. Un équilibre parfait entre dynamisme et noblesse, convenant parfaitement à un usage quotidien comme professionnel.
                </p>

                <h2>4. <Link href="/parfum/yara-lattafa">Yara Lattafa</Link> — La Douceur Gourmande et Florale</h2>
                <p>
                    Yara est le parfum féminin le plus plébiscité de Lattafa. Ses notes d'héliotrope, d'orchidée tropicale, de fruits sucrés, de vanille veloutée et de musc blanc créent une signature olfactive douce, réconfortante et extrêmement féminine.
                </p>

                <h2>5. <Link href="/parfum/woody-oud-80-ml-maison-alhambra">Woody Oud Maison Alhambra</Link> — L'Oud Boisé et Fumé</h2>
                <p>
                    Pour les amateurs de bois nobles, Woody Oud sublime l'essence de bois d'agar (oud), de gingembre, d'encens et de mousse de chêne. Une composition mixte, moderne et envoûtante.
                </p>

                <h2>6. <Link href="/parfum/kismet-for-women-maison-alhambra">Kismet for Women Maison Alhambra</Link> — Le Charme Floral & Poudré</h2>
                <p>
                    Kismet for Women associe la rose de mai, le jasmin sambac, la vanille bourbon et le musc soyeux. Un parfum sensuel, idéal pour les rendez-vous et les grandes réceptions.
                </p>

                <h2>7. <Link href="/parfum/by-saffron-maison-alhambra">By Saffron Maison Alhambra</Link> — L'Or Rouge Oriental</h2>
                <p>
                    Le safran est l'une des épices les plus précieuses en parfumerie. By Saffron met en valeur cette note orientale dorée avec de la rose veloutée, de l'ambre chaud et des notes boisées intenses.
                </p>

                <h2>8. <Link href="/parfum/infini-oud-maison-alhambra-mixte">Infini Oud Maison Alhambra</Link> — La Majesté de l'Oud Mystique</h2>
                <p>
                    Infini Oud est une fragrance riche et texturée où l'oud se marie aux résines précieuses, à la lavande et à la muscade. Un parfum de caractère conçu pour les connaisseurs de grands sillages.
                </p>

                <hr />

                <h2>Comment choisir son parfum oriental de Dubaï ?</h2>
                <ul>
                    <li><strong>Identifiez votre famille olfactive</strong> : Ambrée gourmande (Khamrah, Yara), Boisée épicée (Asad, Woody Oud) ou Florale orientale (Kismet, By Saffron).</li>
                    <li><strong>Adaptez à l'occasion</strong> : Privilégiez les accords frais et aromatiques en journée, et les sillages ambrés profonds en soirée.</li>
                    <li><strong>Appréciez l'évolution</strong> : Les parfums orientaux évoluent sur plusieurs heures, révélant des notes de fond d'une grande richesse.</li>
                </ul>

                <p>
                    Tous nos parfums sont <strong>100% originaux</strong>, scellés sous emballage d'origine et expédiés sous 48h depuis notre stock en France.
                </p>

                <div className="not-prose mt-8">
                    <Link
                        href="/shop"
                        className="inline-block bg-black text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors"
                    >
                        Explorer toute la collection →
                    </Link>
                </div>

            </article>
        </div>
    );
}
