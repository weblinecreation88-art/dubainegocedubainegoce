import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'Khamrah Lattafa : mon avis complet et honnête (notes, tenue, sillage)',
    description: 'Khamrah Lattafa est le parfum oriental le plus viral de ces dernières années. Est-ce vraiment justifié ? Avis détaillé après 1 an d\'utilisation — notes, tenue, saisons, pour qui ?',
    keywords: 'Khamrah avis, Khamrah Lattafa test, Khamrah parfum review, Khamrah notes, Khamrah sillage, parfum gourmand oriental, parfum oriental dubai, Lattafa avis',
    alternates: {
        canonical: 'https://dubainegoce.fr/blog/khamrah-lattafa-avis',
    },
    openGraph: {
        title: 'Khamrah Lattafa : mon avis complet et honnête',
        description: 'Avis détaillé après 1 an d\'utilisation — notes, tenue, saisons, pour qui ?',
        url: 'https://dubainegoce.fr/blog/khamrah-lattafa-avis',
        type: 'article',
    },
};

export default function BlogPostPage() {
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Khamrah Lattafa : mon avis complet et honnête (notes, tenue, sillage)',
        description: 'Khamrah Lattafa est le parfum oriental le plus viral de ces dernières années. Avis détaillé après 1 an d\'utilisation.',
        image: 'https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png',
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
            '@id': 'https://dubainegoce.fr/blog/khamrah-lattafa-avis',
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
                name: 'Khamrah Lattafa Avis',
                item: 'https://dubainegoce.fr/blog/khamrah-lattafa-avis',
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
                        src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png"
                        alt="Khamrah Lattafa avis complet"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                    />
                </div>

                <p className="text-sm text-primary font-semibold mb-2">Avis produit</p>
                <h1>Khamrah Lattafa : avis complet après 1 an d'utilisation</h1>

                <p className="lead">
                    Il y a des parfums qui font consensus. Khamrah de Lattafa est de ceux-là. Depuis qu'il a commencé à circuler sur les réseaux sociaux, les avis sont unanimes : cette création orientale est une réussite remarquable. Après plus d'un an à le porter régulièrement, voici mon retour détaillé.
                </p>

                <h2>Le flacon et la première impression</h2>
                <p>
                    Khamrah se présente dans un flacon lourd et soigné, digne de la haute parfumerie orientale. Le spray est généreux — deux pulvérisations suffisent largement pour une journée entière.
                </p>
                <p>
                    À la première ouverture, vous recevrez immédiatement <strong>une vague de chaleur sucrée-épicée</strong>. C'est riche, gourmand, dense et enveloppant.
                </p>

                <h2>Les notes de Khamrah Lattafa</h2>
                <p>
                    La pyramide officielle de Khamrah :
                </p>
                <ul>
                    <li><strong>Tête</strong> : Safran, datte, cannelle</li>
                    <li><strong>Cœur</strong> : Praliné, caramel, café</li>
                    <li><strong>Fond</strong> : Vanille, oud doux, musc blanc, benjoin</li>
                </ul>
                <p>
                    Ce qui ressort vraiment sur peau : la <strong>datte caramélisée</strong> domine les premières heures, enveloppée de cannelle chaude. Puis le praliné et la vanille prennent progressivement le dessus pour un fond terriblement réconfortant.
                </p>

                <h2>Sillage et tenue : une performance exceptionnelle</h2>
                <p>
                    En termes de sillage, il projette avec intensité les premières heures. La tenue sur peau atteint aisément <strong>8 à 12 heures</strong>, et encore plus sur les vêtements. C'est la force de la concentration en huiles parfumées des formulations orientales.
                </p>

                <h2>En quelle saison porter Khamrah ?</h2>
                <p>
                    Khamrah est un <strong>parfum d'automne et d'hiver</strong> par excellence. Sa richesse et sa chaleur s'épanouissent dans le froid, laissant un sillage somptueux sans devenir étouffant.
                </p>

                <h2>Pour qui est Khamrah ?</h2>
                <p>
                    Officiellement unisexe, Khamrah est apprécié aussi bien par les femmes que par les hommes pour son équilibre entre la gourmandise de la vanille/praliné et la chaleur des épices d'Orient.
                </p>

                <h2>Mon verdict</h2>
                <p>
                    Khamrah Lattafa est un <strong>grand parfum oriental</strong>. Son sillage, sa tenue, sa complexité et sa générosité en font l'un des meilleurs investissements pour votre dressing olfactif.
                </p>
                <p>
                    Note : <strong>9.5/10</strong> — Un chef-d'œuvre de la maison Lattafa.
                </p>

                <div className="not-prose mt-8 flex gap-4 flex-wrap">
                    <Link
                        href="/parfum/khamrah-lattafa"
                        className="inline-block bg-black text-white px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-800 transition-colors"
                    >
                        Commander Khamrah →
                    </Link>
                    <Link
                        href="/shop/marque/lattafa"
                        className="inline-block border border-gray-300 text-gray-700 px-8 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gray-50 transition-colors"
                    >
                        Toute la collection Lattafa
                    </Link>
                </div>

            </article>
        </div>
    );
}
