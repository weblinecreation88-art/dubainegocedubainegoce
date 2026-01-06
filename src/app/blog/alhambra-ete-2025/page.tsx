
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'À découvrir cet été 2025 : la marque Alhambra',
    description: 'La marque Alhambra continue de captiver l’univers du bijou senteur avec ses créations uniques pour l\'été 2025.',
};

export default function BlogPostPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <article className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                <div className="relative mb-8 w-full aspect-video">
                     <Image
                        src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765958123/ChatGPT_Image_29_juil._2025_01_03_23_f4fvfe.png"
                        alt="Article de blog sur les parfums Alhambra"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                        data-ai-hint="perfume display"
                    />
                </div>
                
                <p className="text-sm text-primary font-semibold mb-2">Article parfum</p>
                <h1>À découvrir cet été 2025 : la marque Alhambra continue de captiver</h1>
                
                <p className="lead">
                    La marque Alhambra, synonyme de luxe accessible et d’inspiration orientale, continue de captiver l’univers du bijou senteur. Pour l'été 2025, elle promet des créations qui allient fraîcheur et caractère, parfaites pour les longues journées ensoleillées et les soirées douces.
                </p>

                <h2>L'essence de l'été par Alhambra</h2>
                <p>
                    L'été est une saison d'évasion, et les nouveaux parfums Alhambra sont conçus comme une invitation au voyage. Attendez-vous à des notes de tête hespéridées, comme la bergamote d'Italie et le citron de Sicile, qui apportent une fraîcheur immédiate et vivifiante. Ces notes pétillantes sont souvent associées à des touches fruitées et exotiques, rappelant les cocktails savourés en bord de mer.
                </p>

                <h2>Le cœur floral et le fond boisé</h2>
                <p>
                    Au cœur de ces nouvelles fragrances, on retrouvera la signature florale chère à la maison, avec des accords de jasmin sambac, de tubéreuse et de fleur d'oranger. Ces fleurs blanches, opulentes et solaires, apportent une féminité et une élégance intemporelles. Pour assurer un sillage mémorable, les notes de fond se révèlent plus chaleureuses et enveloppantes. Le bois de santal crémeux, le vétiver terreux et une touche de vanille ou d'ambre viennent ancrer la composition, lui conférant une tenue exceptionnelle même par temps chaud.
                </p>
                
                <h2>Notre avis</h2>
                <p>
                    La collection été 2025 de la marque Alhambra s'annonce comme un incontournable pour tous les amateurs de parfumerie orientale moderne. En mêlant habilement fraîcheur, opulence et profondeur, ces nouvelles créations sauront séduire un large public. Que vous cherchiez un parfum pour vos vacances ou une nouvelle signature pour la belle saison, Alhambra a de quoi vous captiver.
                </p>
            </article>
        </div>
    );
}
