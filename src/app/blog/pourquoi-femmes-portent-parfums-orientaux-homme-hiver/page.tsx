import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Mesdames, et si votre meilleur parfum d’hiver était au rayon Homme ? (Et Messieurs, osez le gourmand !)',
  description:
    'Pourquoi les femmes adorent porter des parfums orientaux boisés ou épicés en hiver, et pourquoi les hommes qui osent la vanille et la praline reçoivent tant de compliments.',
  keywords:
    'parfum mixte dubai, femme qui porte parfum homme, parfum oriental mixte hiver, Grise Maison Alhambra avis, Toscano Leather avis, Khamrah Lattafa mixte, Liquid Brun avis',
  alternates: {
    canonical: 'https://dubainegoce.fr/blog/pourquoi-femmes-portent-parfums-orientaux-homme-hiver',
  },
  openGraph: {
    title: 'Mesdames, et si votre meilleur parfum d’hiver était au rayon Homme ?',
    description:
      'Le secret le mieux gardé de la parfumerie de Dubaï : oser croiser les genres en hiver pour un sillage unique.',
    url: 'https://dubainegoce.fr/blog/pourquoi-femmes-portent-parfums-orientaux-homme-hiver',
    type: 'article',
  },
};

export default function UnisexCuriosityBlogPostPage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline:
      'Mesdames, et si votre meilleur parfum d’hiver était au rayon Homme ? (Et Messieurs, osez le gourmand !)',
    description:
      'Pourquoi croiser les familles olfactives entre hommes et femmes en hiver offre les sillages les plus complimentés de la parfumerie de Dubaï.',
    image: 'https://dubainegoce.fr/images/hero/hero-tudor.jpg',
    datePublished: '2026-11-08T10:00:00+01:00',
    dateModified: '2026-11-08T10:00:00+01:00',
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
      '@id': 'https://dubainegoce.fr/blog/pourquoi-femmes-portent-parfums-orientaux-homme-hiver',
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
        name: 'Oser les parfums orientaux mixtes en hiver',
        item: 'https://dubainegoce.fr/blog/pourquoi-femmes-portent-parfums-orientaux-homme-hiver',
      },
    ],
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <article className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
        <div className="relative mb-8 w-full aspect-video overflow-hidden rounded-lg border border-[#e4dac9]">
          <Image
            src="/images/hero/hero-tudor.jpg"
            alt="Parfum oriental boisé, épicé et floral de Dubaï"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        <p className="text-sm text-primary font-semibold mb-2">Décryptage &amp; Tendance Hiver</p>
        <h1>
          Mesdames, et si votre meilleur parfum d&apos;hiver était au rayon Homme ? (Et Messieurs, oseriez-vous un gourmand ?)
        </h1>

        <p className="lead">
          En parfumerie occidentale traditionnelle, on a longtemps rangé les fleurs sucrées d&apos;un côté et les bois sombres de l&apos;autre. Mais à Dubaï, la règle d&apos;or est toute différente : <strong>une grande fragrance appartient à la peau qui la porte</strong>. Et en hiver, inverser les codes réserve souvent les plus belles surprises.
        </p>

        <h2>Mesdames : pourquoi un boisé ou un chypré épicé sublime une tenue d&apos;hiver</h2>
        <p>
          Vous est-il déjà arrivé d&apos;aimer l&apos;odeur d&apos;une écharpe masculine légèrement boisée ou ambrée ? Ce n&apos;est pas un hasard. Portés par une femme en automne-hiver, les accords de <strong>patchouli, mousse de chêne, cuir souple, safran ou bois de santal</strong> créent un contraste d&apos;une élégance rare :
        </p>
        <ul>
          <li>
            <strong>
              <Link href="/parfum/grise-maison-alhambra">Grise — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Un chypré moderne où la rose veloutée rencontre la bergamote, le patchouli et la mousse de chêne. Ni sucré, ni convenu : c&apos;est le parfum « haute couture » qui donne immédiatement de l&apos;allure avec un manteau long.
          </li>
          <li>
            <strong>
              <Link href="/parfum/toscano-leather-maison-alhambra">Toscano Leather — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Un cuir souple adouci par une note subtile de framboise et de safran. Sur une peau féminine, la framboise et l&apos;ambre prennent le dessus et offrent un sillage mystérieux qu&apos;aucune autre personne autour de vous ne portera.
          </li>
          <li>
            <strong>
              <Link href="/parfum/woody-oud-80-ml-maison-alhambra">Woody Oud — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Un bois de santal crémeux et épicé qui enveloppe comme du cachemire.
          </li>
        </ul>

        <h2>Messieurs : pourquoi les notes gourmandes et vanillées sont votre meilleur atout par temps froid</h2>
        <p>
          Beaucoup d&apos;hommes hésitent encore devant les mots « vanille », « praline », « dattes » ou « cerise » par peur d&apos;un résultat trop sucré. Pourtant, dans la parfumerie de Dubaï, la gourmandise masculine est toujours <strong>équilibrée par des épices vives (cardamome, poivre noir, cannelle) et des bois secs</strong>.
        </p>
        <p>
          Résultat : au lieu d&apos;un parfum froid et austère, vous dégagez une chaleur rassurante et magnétique :
        </p>
        <ul>
          <li>
            <strong>
              <Link href="/parfum/liquide-brun-french-avenue">Liquid Brun — French Avenue (35,00 €)</Link> :
            </strong>{' '}
            La cardamome épicée ouvre le bal avant de laisser place à une vanille bourbon boisée. C&apos;est aujourd&apos;hui l&apos;un des parfums masculins/mixtes les plus complimentés en soirée.
          </li>
          <li>
            <strong>
              <Link href="/parfum/khamrah-lattafa">Khamrah — Lattafa (35,00 €)</Link> :
            </strong>{' '}
            Son accord épicé-boisé de cannelle, de muscade et d&apos;ambre vanillé en fait un monstre de tenue (plus de 10 heures sur peau) dès que les températures passent sous les 12°C.
          </li>
        </ul>

        <h2>Comment tester sans se tromper ?</h2>
        <p>
          L&apos;avantage du tarif unique à <strong>35,00 € TTC</strong> chez <strong>Dubaï Négoce</strong>, c&apos;est que vous pouvez sortir des sentiers battus sans dépenser 200 € dans un flacon de niche. Et dès 3 flacons dans votre panier, la <strong>livraison Colissimo à domicile est offerte</strong>.
        </p>

        <div className="not-prose mt-8 p-6 bg-[#f7f0e6] border border-[#e4dac9] rounded-lg text-[#111827]">
          <p className="text-sm font-bold text-[#d4a017] uppercase tracking-wider mb-3">
            Les 5 parfums de caractère à oser cet hiver (35,00 € TTC)
          </p>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/parfum/grise-maison-alhambra" className="hover:text-[#d4a017] transition-colors">
                → Grise 100 ml — Maison Alhambra (Chypré Floral &amp; Boisé)
              </Link>
            </li>
            <li>
              <Link href="/parfum/toscano-leather-maison-alhambra" className="hover:text-[#d4a017] transition-colors">
                → Toscano Leather 80 ml — Maison Alhambra (Cuir, Safran &amp; Framboise)
              </Link>
            </li>
            <li>
              <Link href="/parfum/liquide-brun-french-avenue" className="hover:text-[#d4a017] transition-colors">
                → Liquid Brun 100 ml — French Avenue (Cardamome, Vanille Bourbon &amp; Bois)
              </Link>
            </li>
            <li>
              <Link href="/parfum/khamrah-lattafa" className="hover:text-[#d4a017] transition-colors">
                → Khamrah 100 ml — Lattafa (Cannelle, Dattes, Praline &amp; Ambre)
              </Link>
            </li>
            <li>
              <Link href="/parfum/woody-oud-80-ml-maison-alhambra" className="hover:text-[#d4a017] transition-colors">
                → Woody Oud 80 ml — Maison Alhambra (Santal, Oud &amp; Cardamome)
              </Link>
            </li>
          </ul>
        </div>

        <div className="not-prose mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop/genre/mixte"
            className="inline-block bg-[#111827] text-white px-7 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#d4a017] hover:text-[#111827] transition-colors rounded-[2px]"
          >
            Explorer nos parfums mixtes →
          </Link>
          <Link
            href="/shop/all"
            className="inline-block border border-[#111827] text-[#111827] px-7 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#111827] hover:text-white transition-colors rounded-[2px]"
          >
            Voir tout le catalogue à 35 € →
          </Link>
        </div>
      </article>
    </div>
  );
}
