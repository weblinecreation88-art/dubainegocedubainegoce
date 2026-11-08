import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: "L'hiver arrive : Mesdames, Messieurs, et si vous osiez ce parfum de Dubaï qui fait tourner les têtes ?",
  description:
    "Quel parfum porter en hiver pour laisser un sillage inoubliable ? Découvrez notre sélection de parfums de Dubaï (Lattafa, Maison Alhambra, French Avenue) à 35 € pour Elle, pour Lui et à partager.",
  keywords:
    'parfum hiver femme, parfum hiver homme, parfum dubai hiver, quel parfum porter en hiver, parfum qui tient longtemps hiver, Khamrah hiver, Asad Lattafa hiver, Yara Moi hiver, Liquid Brun hiver',
  alternates: {
    canonical: 'https://dubainegoce.fr/blog/parfums-hiver-dubai-couple-seduction',
  },
  openGraph: {
    title: "L'hiver arrive : Mesdames, Messieurs, et si vous osiez ce parfum de Dubaï ?",
    description:
      "Vanille bourbon, épices chaudes, oud et caramel : les parfums de Dubaï qui subliment le froid à 35 €.",
    url: 'https://dubainegoce.fr/blog/parfums-hiver-dubai-couple-seduction',
    type: 'article',
  },
};

export default function WinterPerfumeGuidePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline:
      "L'hiver arrive : Mesdames, Messieurs, et si vous osiez ce parfum de Dubaï qui fait tourner les têtes ?",
    description:
      "Quel parfum porter en hiver pour laisser un sillage inoubliable ? Sélection de parfums orientaux de Dubaï pour Elle, pour Lui et mixtes à 35 €.",
    image: 'https://dubainegoce.fr/images/hero/hero-khamrah.jpg',
    datePublished: '2026-11-08T09:00:00+01:00',
    dateModified: '2026-11-08T09:00:00+01:00',
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
      '@id': 'https://dubainegoce.fr/blog/parfums-hiver-dubai-couple-seduction',
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
        name: 'Sélection Parfums Hiver Dubaï',
        item: 'https://dubainegoce.fr/blog/parfums-hiver-dubai-couple-seduction',
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
            src="/images/hero/hero-khamrah.jpg"
            alt="Parfums d'hiver de Dubaï aux notes de cannelle, vanille, dattes et ambre"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        <p className="text-sm text-primary font-semibold mb-2">Spécial Automne / Hiver • Conseils Olfactifs</p>
        <h1>
          L&apos;hiver arrive : Mesdames, Messieurs, et si vous osiez ce parfum de Dubaï qui fait se retourner tout le monde ?
        </h1>

        <p className="lead">
          Vous l&apos;avez sans doute déjà remarqué dès les premiers matins froids : votre parfum frais d&apos;été semble s&apos;évaporer en moins d&apos;une heure sous votre manteau. L&apos;air sec et glacé étouffe les notes légères d&apos;agrumes… mais il révèle magnifiquement les <strong>eaux de parfum orientales de Dubaï</strong>. Et si cet hiver, vous changiez de signature olfactive ?
        </p>

        <h2>Pourquoi le froid est le meilleur allié des parfums de Dubaï ?</h2>
        <p>
          En été, les molécules aromatiques s&apos;évaporent très vite sous l&apos;effet de la chaleur. En hiver, c&apos;est tout l&apos;inverse : le contraste entre la fraîcheur de l&apos;air extérieur et la chaleur de votre peau (ou d&apos;une écharpe en laine) permet aux notes denses — <strong>vanille bourbon, fève tonka, cannelle, ambre, praline, cuir et bois d&apos;oud</strong> — de se diffuser lentement, heure après heure, sans jamais devenir étouffantes.
        </p>
        <p>
          C&apos;est précisément le terrain de jeu favori des maisons émiraties comme <strong>Lattafa</strong>, <strong>Maison Alhambra</strong> et <strong>French Avenue</strong> : des jus riches qui tiennent <strong>8 à 12 heures sur la peau</strong> et plusieurs jours sur un manteau ou un pull en maille.
        </p>

        <h2>Mesdames : et si vous portiez le parfum qui intrigue à chaque passage ?</h2>
        <p>
          Oubliez les petits floraux discrets que tout le monde porte dans le métro ou au bureau. En hiver, une femme qui porte un oriental gourmand ou boisé-ambré crée immédiatement un effet de curiosité autour d&apos;elle :
        </p>
        <ul>
          <li>
            <strong>
              <Link href="/parfum/yara-moi-lattafa">Yara Moi — Lattafa (35,00 €)</Link> :
            </strong>{' '}
            Plus enveloppant et mystérieux que le Yara rose classique, il marie la pêche blanche fondante, le jasmin, le <strong>caramel chaud</strong> et le bois de santal crémeux. Sur un col roulé en hiver, son sillage est d&apos;une douceur irrésistible.
          </li>
          <li>
            <strong>
              <Link href="/parfum/lovely-cherie-maison-alhambra">Lovely Chérie — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Une cerise noire liquoreuse relevée d&apos;amande amère, de rose turque et de fève tonka grillée. C&apos;est le parfum de soirée d&apos;hiver par excellence : audacieux, sensuel et ultra-complimenté.
          </li>
          <li>
            <strong>
              <Link href="/parfum/la-vita-bella-maison-alhambra">La Vita Bella — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Pour celles qui aiment l&apos;élégance poudrée de l&apos;iris associée à la praline et à la vanille chaude. Un cocon réconfortant qui traverse toute la journée.
          </li>
        </ul>

        <h2>Messieurs : et si vous portiez ce parfum charismatique qu&apos;elle voudra vous emprunter ?</h2>
        <p>
          Messieurs, l&apos;hiver est la saison idéale pour délaisser les eaux fraîches sportives et passer sur un sillage boisé, épicé ou vanillé-ambré qui impose une présence calme et magnétique :
        </p>
        <ul>
          <li>
            <strong>
              <Link href="/parfum/asad-lattafa">Asad — Lattafa (35,00 €)</Link> :
            </strong>{' '}
            Numéro 1 incontesté des ventes masculines en hiver. Son départ de poivre noir et d&apos;épices chaudes laisse place à un cœur de café, d&apos;iris et de patchouli sur un fond d&apos;ambre sec, de benjoin et de vanille fumée. Deux pulvérisations sur l&apos;écharpe suffisent pour toute la journée.
          </li>
          <li>
            <strong>
              <Link href="/parfum/liquide-brun-french-avenue">Liquid Brun — French Avenue (35,00 €)</Link> :
            </strong>{' '}
            La révélation gourmande-épicée : cardamome vibrante, fleur d&apos;oranger, <strong>vanille bourbon et praline boisée</strong>. C&apos;est le parfum masculin qui récolte le plus de questions du type <em>« Pardon, quel est votre parfum ? »</em>.
          </li>
          <li>
            <strong>
              <Link href="/parfum/woody-oud-80-ml-maison-alhambra">Woody Oud — Maison Alhambra (35,00 €)</Link> :
            </strong>{' '}
            Un boisé noble, sec et feutré (bois d&apos;agar, santal, vétiver, cardamome et fève tonka). Parfait sous une veste ou un costume par temps froid.
          </li>
        </ul>

        <h2>Le secret d&apos;initiés : et si vous partagiez le même flacon à deux ?</h2>
        <p>
          À Dubaï, les plus belles créations ne portent pas d&apos;étiquette « Homme » ou « Femme » : elles évoluent différemment selon le pH de chaque peau. Deux références mixtes font l&apos;unanimité absolue dès que le thermomètre descend :
        </p>
        <ol>
          <li>
            <strong>
              <Link href="/parfum/khamrah-lattafa">Khamrah — Lattafa (35,00 €)</Link> :
            </strong>{' '}
            Un accord somptueux de cannelle, muscade, dattes confites, praline, vanille et bois d&apos;ambre. Sur une peau féminine, sa facette vanillée-pralinée ressort avec gourmandise ; sur une peau masculine, ses épices et ses bois ambrés prennent le dessus.
          </li>
          <li>
            <strong>
              <Link href="/parfum/badee-al-oud-oud-for-glory-lattafa">Badee Al Oud (Oud for Glory) — Lattafa (35,00 €)</Link> :
            </strong>{' '}
            Safran, noix de muscade, lavande et bois d&apos;oud majestueux. Une signature royale pour les soirées d&apos;hiver.
          </li>
        </ol>

        <h2>Le bon plan hiver : composez votre trio à 35 € (Livraison Colissimo Offerte)</h2>
        <p>
          Sur <strong>Dubaï Négoce</strong>, tous nos flacons authentiques scellés sous blister sont proposés au <strong>tarif unique de 35,00 € TTC</strong>, et la <strong>livraison Colissimo 48h à domicile est 100 % offerte dès 3 parfums</strong> (économisez 9,59 € de frais de port).
        </p>
        <p>
          C&apos;est l&apos;occasion idéale de composer votre vestiaire d&apos;hiver ou de préparer vos coffrets cadeaux : <strong>1 parfum pour Madame + 1 parfum pour Monsieur + 1 parfum mixte à partager</strong> !
        </p>

        <div className="not-prose mt-8 p-6 bg-[#f7f0e6] border border-[#e4dac9] rounded-lg text-[#111827]">
          <p className="text-sm font-bold text-[#d4a017] uppercase tracking-wider mb-3">
            Les incontournables de l&apos;hiver à 35,00 € TTC
          </p>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/parfum/khamrah-lattafa" className="hover:text-[#d4a017] transition-colors">
                → Khamrah 100 ml — Lattafa (Mixte • Cannelle, Dattes &amp; Praline)
              </Link>
            </li>
            <li>
              <Link href="/parfum/asad-lattafa" className="hover:text-[#d4a017] transition-colors">
                → Asad 100 ml — Lattafa (Homme • Épices noires, Ambre &amp; Vanille)
              </Link>
            </li>
            <li>
              <Link href="/parfum/yara-moi-lattafa" className="hover:text-[#d4a017] transition-colors">
                → Yara Moi 100 ml — Lattafa (Femme • Pêche, Caramel &amp; Santal)
              </Link>
            </li>
            <li>
              <Link href="/parfum/liquide-brun-french-avenue" className="hover:text-[#d4a017] transition-colors">
                → Liquid Brun 100 ml — French Avenue (Mixte • Cardamome &amp; Vanille Bourbon)
              </Link>
            </li>
            <li>
              <Link href="/parfum/lovely-cherie-maison-alhambra" className="hover:text-[#d4a017] transition-colors">
                → Lovely Chérie 80 ml — Maison Alhambra (Femme/Mixte • Cerise noire &amp; Tonka)
              </Link>
            </li>
          </ul>
        </div>

        <div className="not-prose mt-6 flex flex-wrap gap-3">
          <Link
            href="/shop/all"
            className="inline-block bg-[#111827] text-white px-7 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#d4a017] hover:text-[#111827] transition-colors rounded-[2px]"
          >
            Découvrir toute la boutique (35 €) →
          </Link>
          <Link
            href="/trouver-mon-parfum"
            className="inline-block border border-[#111827] text-[#111827] px-7 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#111827] hover:text-white transition-colors rounded-[2px]"
          >
            Faire le test : Trouver mon parfum d&apos;hiver →
          </Link>
        </div>
      </article>
    </div>
  );
}
