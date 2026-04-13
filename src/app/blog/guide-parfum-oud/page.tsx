import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tout savoir sur le parfum oud avant d\'acheter — guide complet 2026',
    description: 'Qu\'est-ce que l\'oud ? Pourquoi coûte-t-il si cher ? Comment choisir son premier parfum oud homme ou femme ? Guide complet avec sélection des meilleurs oud à moins de 40€.',
    keywords: 'parfum oud, oud parfum homme, oud parfum femme, qu\'est-ce que l\'oud, oud bois d\'agar, parfum oud oriental, meilleur parfum oud pas cher, guide oud débutant',
};

export default function BlogPostPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <article className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">

                <div className="relative mb-8 w-full aspect-video">
                    <Image
                        src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765958235/ChatGPT_Image_17_d%C3%A9c._2025_08_56_48_elcbtv.png"
                        alt="Guide parfum oud complet"
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="rounded-lg object-cover"
                    />
                </div>

                <p className="text-sm text-primary font-semibold mb-2">Guide parfum</p>
                <h1>Tout savoir sur le parfum oud avant d'acheter</h1>

                <p className="lead">
                    L'oud est souvent décrit comme "l'or liquide de la parfumerie". C'est la matière première la plus chère au monde — plus que l'or lui-même, gram pour gram. Et pourtant, si vous n'en avez jamais porté, vous passez peut-être à côté d'une expérience olfactive unique. Ce guide vous explique tout.
                </p>

                <h2>Qu'est-ce que l'oud exactement ?</h2>
                <p>
                    L'oud (aussi appelé <strong>bois d'agar</strong>, agarwood ou aloès en occident) est une résine aromatique qui se forme dans le bois de certains arbres d'Asie du Sud-Est, principalement l'<em>Aquilaria</em>. Quand cet arbre est infecté par un champignon particulier (<em>Phialophora parasitica</em>), il produit une résine sombre et parfumée pour se défendre. Cette résine, c'est l'oud.
                </p>
                <p>
                    La production naturelle est extrêmement rare. Moins de 2% des arbres Aquilaria produisent de l'oud de qualité. Ce qui explique pourquoi l'huile d'oud pure peut se négocier entre <strong>30 000 et 100 000€ le kilogramme</strong>. Oui, vous avez bien lu.
                </p>
                <p>
                    Dans la parfumerie, l'oud est utilisé soit sous forme d'huile pure (extrêmement coûteuse), soit sous forme de synthétiques (plus accessibles mais moins complexes), soit en combinaison des deux.
                </p>

                <h2>Comment ça sent, l'oud ?</h2>
                <p>
                    C'est la question la plus difficile à répondre sans le faire sentir. L'oud naturel a un profil olfactif extrêmement complexe : <strong>boisé, fumé, légèrement animal, terreux, avec une touche sucrée et presque cuirée</strong>. C'est une matière qui évolue considérablement sur peau — les premières minutes sont souvent intenses et presque choquantes, puis le parfum s'adoucit et gagne en profondeur.
                </p>
                <p>
                    L'oud est souvent décrit comme "masculin", mais c'est un préjugé occidental. Dans la tradition parfumée du Golfe et du sous-continent indien, l'oud est mixte par nature. Les femmes le portent autant que les hommes, souvent sous des formes plus florales ou douces.
                </p>

                <h2>Les différents types d'oud en parfumerie</h2>
                <h3>L'oud oriental pur</h3>
                <p>
                    Dense, fumé, animal, peu dilué. C'est le type qu'on trouve dans les parfums de la péninsule arabique. Il ne fait pas de compromis et peut être déroutant pour les non-initiés. <strong>Pour les connaisseurs.</strong>
                </p>

                <h3>L'oud occidental (ou "oud blanc")</h3>
                <p>
                    Popularisé par Tom Ford avec Oud Wood, puis par d'autres maisons de niche. L'oud y est dilué dans des accords boisés, floraux ou musqués pour le rendre plus accessible aux palais occidentaux. Plus doux, moins animal, mais perdant en partie la magie de l'oud pur.
                </p>

                <h3>L'oud floral ou oud rose</h3>
                <p>
                    L'association oud + rose est une tradition parfumée millénaire dans le monde arabe. La rose adoucit et féminise l'oud, créant des accords d'une profondeur et d'une romantique intense. C'est souvent le meilleur point d'entrée pour les femmes.
                </p>

                <h3>L'oud gourmand</h3>
                <p>
                    L'oud combiné à des notes sucrées (vanille, caramel, datte). Khamrah Lattafa en est un exemple parfait. Plus accessible, chaleureux, idéal pour l'hiver.
                </p>

                <h2>Comment choisir son premier parfum oud ?</h2>
                <p>
                    Mon conseil : <strong>ne commencez pas par un oud pur oriental</strong>. Même pour les amateurs de parfums, c'est souvent un choc. Voici une progression logique :
                </p>

                <ol>
                    <li>
                        <strong>Débutant</strong> : Commencez par un oud boisé occidental comme <Link href="/parfum/woody-oud-80-ml-maison-alhambra">Woody Oud Maison Alhambra</Link>. L'oud y est présent mais très intégré dans un accord boisé-épicé élégant.
                    </li>
                    <li>
                        <strong>Intermédiaire</strong> : Passez à un oud-rose comme <Link href="/parfum/infini-oud-maison-alhambra-mixte">Infini Oud Maison Alhambra</Link>. La rose équilibre l'oud, le résultat est complexe mais accessible.
                    </li>
                    <li>
                        <strong>Initié</strong> : Essayez <Link href="/parfum/ameer-al-oudh-intense-oud-lattafa">Ameer Al Oudh Intense Oud Lattafa</Link>. Là, l'oud est central et puissant. C'est intense, fumé, authentiquement oriental.
                    </li>
                    <li>
                        <strong>Connaisseur</strong> : Explorez <Link href="/parfum/oud-mood-lattafa">Oud Mood Lattafa</Link> pour un oud profond et complexe dans la grande tradition parfumée du Golfe.
                    </li>
                </ol>

                <h2>Pourquoi les parfums oud de Dubai sont-ils si réputés ?</h2>
                <p>
                    Les Émirats Arabes Unis ont une tradition parfumée de plusieurs siècles basée sur l'oud. L'oud y est utilisé dans les maisons (sur des brûle-parfums), dans les vêtements, dans les cérémonies. Cette expertise séculaire se traduit par des formulations d'une complexité et d'une qualité supérieures à ce qu'on trouve en Europe pour des prix équivalents.
                </p>
                <p>
                    Les maisons de parfumerie du Golfe comme Lattafa ou Maison Alhambra bénéficient d'un accès direct aux matières premières (l'oud vient d'Asie du Sud-Est mais transite massivement par les Émirats), d'une expertise locale millénaire, et d'une capacité de production qui maintient des prix accessibles.
                </p>

                <h2>Conseils pratiques pour porter l'oud</h2>
                <ul>
                    <li><strong>Moins c'est plus</strong> : 1-2 pulvérisations suffisent largement. L'oud est concentré et puissant.</li>
                    <li><strong>Points chauds</strong> : Poignets, nuque, creux du coude. La chaleur corporelle développe les notes.</li>
                    <li><strong>Laissez-le évoluer</strong> : L'oud change considérablement les premières heures. Ne jugez pas sur le premier spray — attendez 20-30 minutes.</li>
                    <li><strong>Automne-hiver</strong> : Les ouds denses se portent mieux dans le froid. Les oud-roses et oud boisés peuvent s'adapter à toute saison.</li>
                    <li><strong>Sur tissu</strong> : L'oud tient extrêmement longtemps sur les vêtements. Un pull parfumé à l'oud le lundi peut encore sentir le jeudi.</li>
                </ul>

                <h2>Notre sélection oud à moins de 40€</h2>
                <p>
                    Tous les parfums oud de notre boutique sont authentiques, importés directement depuis les Émirats. Voici les incontournables :
                </p>
                <ul>
                    <li><Link href="/parfum/woody-oud-80-ml-maison-alhambra">Woody Oud Maison Alhambra</Link> — Idéal pour commencer</li>
                    <li><Link href="/parfum/ameer-al-oudh-intense-oud-lattafa">Ameer Al Oudh Intense Oud Lattafa</Link> — Pour les amateurs d'oud authentique</li>
                    <li><Link href="/parfum/infini-oud-maison-alhambra-mixte">Infini Oud Maison Alhambra</Link> — L'oud-rose mixte élégant</li>
                    <li><Link href="/parfum/oud-mood-lattafa">Oud Mood Lattafa</Link> — L'oud oriental profond</li>
                    <li><Link href="/parfum/khamrah-lattafa">Khamrah Lattafa</Link> — L'oud gourmand-vanillé viral</li>
                </ul>

                <div className="not-prose mt-8">
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
