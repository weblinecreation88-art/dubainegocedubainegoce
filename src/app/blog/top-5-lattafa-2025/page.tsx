
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Top 5 des parfums Lattafa à absolument tester en 2025',
    description: 'Découvrez notre sélection des incontournables de la maison Lattafa pour l\'année 2025, des fragrances qui marquent les esprits.',
};

export default function BlogPostPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <article className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                 <div className="relative mb-8 w-full aspect-video">
                     <Image
                        src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765957474/ChatGPT_Image_17_d%C3%A9c._2025_08_44_19_neymoa.png"
                        alt="Top 5 des parfums Lattafa"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                        data-ai-hint="Lattafa perfume collection"
                    />
                </div>

                <p className="text-sm text-primary font-semibold mb-2">Article parfum</p>
                <h1>Top 5 des parfums Lattafa à absolument tester en 2025</h1>

                <p className="lead">
                    La maison Lattafa est devenue une référence incontournable pour les amateurs de parfums orientaux. Avec ses créations de haute qualité à prix doux, elle a su conquérir le cœur de millions d'utilisateurs. Voici notre sélection des 5 parfums Lattafa à absolument découvrir ou redécouvrir en 2025.
                </p>

                <h2>1. <Link href="/parfum/khamrah">Khamrah</Link></h2>
                <p>
                    Incontournable et viral, Khamrah est le parfum gourmand par excellence. Avec ses notes de datte, de cannelle, de praliné et de vanille, il est d'un réconfort absolu. C'est le parfum parfait pour les soirées d'hiver, un véritable délice olfactif qui ne laisse personne indifférent. Son sillage est puissant et sa tenue est légendaire.
                </p>

                <h2>2. <Link href="/parfum/asad">Asad</Link></h2>
                <p>
                    Souvent comparé à un grand classique de la parfumerie de niche, Asad est une fragrance masculine épicée et ambrée. Le poivre noir, le tabac et une touche d'ananas en tête laissent place à un cœur de café et de patchouli. C'est un parfum audacieux, charismatique, idéal pour l'homme qui veut affirmer sa présence.
                </p>

                <h2>3. <Link href="/parfum/ameer-al-oudh-intense-oud">Ameer Al Oudh Intense Oud</Link></h2>
                <p>
                    Pour les amoureux de oud, celui-ci est un must. Un oud boisé, fumé, presque mystique, adouci par une vanille subtile et des notes de sucre brûlé. Il est intense, comme son nom l'indique, et offre une expérience olfactive profonde et authentique, digne des plus grandes maisons de parfumerie orientale.
                </p>

                <h2>4. <Link href="/parfum/yara">Yara</Link></h2>
                <p>
                    Doux, crémeux et terriblement addictif, Yara est le best-seller féminin de la marque. Ses notes d'héliotrope, d'orchidée et de fruits tropicaux se fondent dans une base vanillée et musquée. C'est un parfum-cocon, poudré et gourmand, qui attire les compliments comme un aimant.
                </p>

                <h2>5. <Link href="/parfum/qaed-al-fursan">Qaed Al Fursan</Link></h2>
                <p>
                    Original et surprenant, Qaed Al Fursan est célèbre pour sa note d'ananas juteux et réaliste. Cette touche fruitée est équilibrée par un fond boisé et ambré qui lui donne de la structure et de l'élégance. C'est un parfum parfait pour l'été, qui sort des sentiers battus.
                </p>
                 <p>
                    Cette sélection démontre toute l'étendue du talent de Lattafa, capable de créer des parfums uniques et mémorables pour tous les goûts. N'hésitez pas à les explorer pour trouver votre nouvelle signature olfactive en 2025.
                </p>
            </article>
        </div>
    );
}
