
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: ‘Blog Parfums Orientaux — Guides, Avis et Dupes de Luxe | Dubainegoce’,
    description: ‘Guides d\’achat, avis honnêtes, comparatifs dupes de luxe, décryptage de l\’oud — tout ce qu\’il faut savoir sur les parfums orientaux de Dubai (Lattafa, Maison Alhambra).’,
    keywords: ‘guide parfum oriental, avis Khamrah, dupe parfum luxe, Maison Alhambra avis, parfum oud guide, parfum oriental femme, Lattafa meilleur parfum’,
};

const blogPosts = [
    {
        title: ‘Fakhar Black Lattafa : le masculin sombre qui s\’installe dans les tops’,
        description: ‘Intense, boisé, profond — Fakhar Black est le parfum homme de Lattafa qu\’on ne s\’attendait pas à autant apprécier. Avis complet, sillage, occasions.’,
        link: ‘/blog/fakhar-black-lattafa-homme’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png’,
        imageHint: ‘Fakhar Black Lattafa parfum masculin sombre’
    },
    {
        title: ‘Badee Al Oud Oud For Glory : l\’oriental iconique de 2025’,
        description: ‘Pourquoi Badee Al Oud For Glory de Lattafa s\’est imposé comme référence en 2025. Oud profond, sillage imposant, tenue exceptionnelle — notre avis honnête.’,
        link: ‘/blog/badee-al-oud-for-glory-avis’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png’,
        imageHint: ‘Badee Al Oud For Glory Lattafa oriental’
    },
    {
        title: ‘Fragrance World : la marque Dubai qui avance discrètement et s\’impose’,
        description: ‘Moins connue que Lattafa, Fragrance World formule des parfums d\’une qualité surprenante depuis 30 ans. A King, K King, Dark As Wood — notre portrait de la marque.’,
        link: ‘/blog/fragrance-world-marque’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png’,
        imageHint: ‘Fragrance World Dubai marque parfum’
    },
    {
        title: ‘La collection Kenzie French Avenue : les gourmands qui cartonnent sur TikTok’,
        description: ‘Kenzie Marshmallow, Candid Vanilla, Pistachio — la série gourmande qui fait le buzz en 2026. Notes, avis, pour qui ? On a tout testé pour vous.’,
        link: ‘/blog/kenzie-collection-french-avenue’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png’,
        imageHint: ‘Kenzie French Avenue collection gourmand’
    },
    {
        title: ‘Liquid Brun French Avenue : le gourmand épicé qui fait parler de lui en 2026’,
        description: ‘Vanille bourbon, cardamome, praline — Liquid Brun de French Avenue est l\’alternative crédible à Althair que personne n\’attendait. Notre avis après test.’,
        link: ‘/blog/liquid-brun-french-avenue’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png’,
        imageHint: ‘Liquid Brun French Avenue gourmand épicé’
    },
    {
        title: ‘Les 8 meilleurs dupes de parfums de luxe à moins de 40€’,
        description: ‘Baccarat Rouge, Sauvage, Aventus, Tobacco Vanille… les alternatives qui s\’en rapprochent le plus, pour 10 à 15 fois moins cher. Comparatif honnête.’,
        link: ‘/blog/dupes-parfums-luxe’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png’,
        imageHint: ‘parfum luxe dupe comparatif’
    },
    {
        title: ‘Khamrah Lattafa : avis complet et honnête après 1 an d\’utilisation’,
        description: ‘Le parfum oriental le plus viral de ces dernières années. Notes, tenue, sillage, pour qui, quelle saison — tout ce que vous voulez savoir avant d\’acheter.’,
        link: ‘/blog/khamrah-lattafa-avis’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png’,
        imageHint: ‘Khamrah Lattafa avis review’
    },
    {
        title: ‘7 parfums orientaux pour femme qu\’on adore en 2026’,
        description: ‘Des floraux sucrés aux oud profonds : notre sélection des meilleures fragrances orientales féminines disponibles à moins de 40€.’,
        link: ‘/blog/parfums-orientaux-femme-2026’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png’,
        imageHint: ‘parfums orientaux femme selection’
    },
    {
        title: ‘Maison Alhambra : la marque Dubai qui remplace le luxe à 200€’,
        description: ‘Qui est vraiment Maison Alhambra ? Histoire, qualité, meilleures fragrances, comparaisons — avis honnête sur la marque qui fait parler d\’elle.’,
        link: ‘/blog/maison-alhambra-la-marque’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png’,
        imageHint: ‘Maison Alhambra marque Dubai’
    },
    {
        title: ‘Tout savoir sur le parfum oud avant d\’acheter — guide complet’,
        description: ‘Qu\’est-ce que l\’oud ? Pourquoi est-il si cher ? Comment choisir son premier oud ? Guide complet avec sélection des meilleurs oud à moins de 40€.’,
        link: ‘/blog/guide-parfum-oud’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png’,
        imageHint: ‘guide parfum oud bois d agar’
    },
    {
        title: ‘À découvrir cet été 2025 : la marque Alhambra continue de captiver’,
        description: ‘La marque Alhambra continue de captiver l\’univers du parfum avec ses créations uniques pour l\’été 2025.’,
        link: ‘/blog/alhambra-ete-2025’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png’,
        imageHint: ‘perfume display’
    },
    {
        title: ‘Parfumerie 2025 : comment la tendance orientale redéfinit le marché’,
        description: ‘La tendance des parfums orientaux redéfinit le marché avec ses notes riches et complexes. Décryptage.’,
        link: ‘/blog/tendances-parfums-orientaux-2025’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png’,
        imageHint: ‘oriental perfume market’
    },
    {
        title: ‘Top 5 des parfums Lattafa à absolument tester en 2025’,
        description: ‘Découvrez notre sélection des incontournables de la maison Lattafa pour 2025, des fragrances qui marquent les esprits.’,
        link: ‘/blog/top-5-lattafa-2025’,
        imageUrl: ‘https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png’,
        imageHint: ‘Lattafa perfume collection’
    }
];

export default function BlogPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
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
