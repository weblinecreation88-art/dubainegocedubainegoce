import { getBrandPath } from '@/lib/catalog-urls';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFragranceFamilies, getProducts, getBrands } from '@/lib/data';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { HeroBanner } from '@/components/layout/hero-banner';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dubainegoce.fr/' },
};

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
      <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-3">{eyebrow}</p>
      <h2 className="font-headline font-normal text-[34px] sm:text-[44px] leading-[1.1] text-[#1d1a16]">{title}</h2>
      {intro && <p className="mt-4 text-sm text-[#5d564c] leading-relaxed">{intro}</p>}
    </div>
  );
}

export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const brands = getBrands().slice(0, 8);
  const allProducts = getProducts();
  const findProduct = (slug: string) => allProducts.find((p) => p.slug === slug);

  const popularSlugs = [
    'khamrah-lattafa',
    'yara-moi-lattafa',
    'liquide-brun-french-avenue',
    'grise-maison-alhambra',
    'tobacco-touch-maison-alhambra',
    'woody-oud-80-ml-maison-alhambra',
    'porto-neroli-maison-alhambra',
    'lovely-cherie-maison-alhambra',
    'toscano-leather-maison-alhambra',
    'fleur-de-coton-sublime',
    'zaffiro-collection-crafted-oud-maison-alhambra',
    'pose-as-rose-fragrance-world',
    'good-girl-by-killer-loui-martin',
  ];

  // Sélection de produits réellement disponibles en stock
  const curatedProducts = popularSlugs
    .map(findProduct)
    .filter((p): p is Product => p !== undefined && p.stock > 0);
  // Complète avec d'autres parfums en stock pour toujours afficher deux rangées pleines.
  const popularProducts = [
    ...curatedProducts,
    ...allProducts.filter((p) => p.stock > 3 && !curatedProducts.includes(p)),
  ].slice(0, 8);

  const heroImages = [
    { src: '/images/hero/hero-khamrah.jpg', caption: 'Khamrah · Lattafa' },
    { src: '/images/hero/hero-yara-moi.jpg', caption: 'Yara Moi · Lattafa' },
    { src: '/images/hero/hero-tudor.jpg', caption: 'Tudor · Pendora Scents' },
    { src: '/images/hero/hero-kenzie.jpg', caption: 'Kenzie · French Avenue' },
  ];

  const universes = [
    {
      eyebrow: 'Pour elle',
      title: 'Parfums Femme',
      text: 'Floral, gourmand, poudré : la délicatesse a du caractère.',
      href: '/shop/all?genders=femme',
      image: findProduct('yara-lattafa')?.images[0],
    },
    {
      eyebrow: 'Pour lui',
      title: 'Parfums Homme',
      text: 'Boisé, épicé, cuir : un sillage qui vous ressemble.',
      href: '/shop/all?genders=homme',
      image: findProduct('asad-lattafa')?.images[0],
    },
    {
      eyebrow: 'Sans frontières',
      title: 'Parfums Mixtes',
      text: 'Oud, ambre, vanille : une signature à partager.',
      href: '/shop/all?genders=mixte',
      image: (findProduct('teriaq-lattafa-mixte') ?? findProduct('oud-mood-reminiscence-lattafa'))?.images[0],
    },
  ];

  return (
    <div className="storefront-home flex flex-col bg-white">
      <HeroBanner images={heroImages} />

      {/* NOS INCONTOURNABLES */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading
          eyebrow="La sélection Dubaï Négoce"
          title="Nos incontournables"
          intro="Les fragrances que nos clients recommandent le plus, toutes disponibles en stock."
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-7 sm:gap-y-14">
          {popularProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/shop/all"
            className="inline-block text-xs uppercase tracking-[0.18em] text-[#1d1a16] border-b border-[#1d1a16]/40 hover:border-[#1d1a16] pb-1 transition-colors"
          >
            Toute la collection · {allProducts.length} parfums
          </Link>
        </div>
      </section>

      {/* EXPLOREZ NOS UNIVERS */}
      <section className="bg-[#faf7f2] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeading eyebrow="À chacun son sillage" title="Explorez nos univers" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {universes.map((universe) => (
              <Link
                key={universe.href}
                href={universe.href}
                className="group grid grid-cols-2 min-h-[230px] sm:min-h-[300px] bg-[#f3ede3] overflow-hidden"
              >
                <div className="flex flex-col justify-center p-5 sm:p-7">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#6f6559] mb-3">{universe.eyebrow}</p>
                  <h3 className="font-headline font-normal text-[28px] sm:text-[32px] leading-[1.05] text-[#1d1a16] mb-3">
                    {universe.title}
                  </h3>
                  <p className="text-xs text-[#5d564c] leading-relaxed mb-5">{universe.text}</p>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#1d1a16] group-hover:text-[#a8834f] transition-colors">
                    Découvrir
                  </span>
                </div>
                <div className="relative bg-[#ebe3d6]">
                  {universe.image && (
                    <Image
                      src={universe.image}
                      alt={universe.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 17vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LES MAISONS */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Authenticité garantie"
          title={
            <>
              Les maisons
              <br className="sm:hidden" /> de notre sélection
            </>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center max-w-4xl mx-auto">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={getBrandPath(brand.name)}
              className="font-headline text-2xl sm:text-[28px] leading-tight text-[#1d1a16] hover:text-[#a8834f] transition-colors"
            >
              {brand.name}
            </Link>
          ))}
        </div>

        <div className="mt-14 sm:mt-20 pt-10 border-t border-[#e6ded1] text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-5">Par famille olfactive</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {fragranceFamilies.map((family) => (
              <Link
                key={family.id}
                href={`/shop/all?families=${encodeURIComponent(family.name)}`}
                className="px-4 py-2 border border-[#e6ded1] text-sm text-[#1d1a16] hover:border-[#a8834f] hover:text-[#a8834f] transition-colors"
              >
                {family.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* L'ART DE LA PARFUMERIE ORIENTALE */}
      <section className="bg-[#f3ede3]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[300px] sm:h-[420px] lg:h-auto lg:min-h-[520px]">
            <Image
              src="/images/hero/hero-tudor.jpg"
              alt="Notes de bois, de roses et d'agrumes autour d'un flacon de parfum oriental"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-5 sm:px-10 lg:px-16 xl:px-24 py-12 sm:py-16">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-4">L&apos;art de la parfumerie orientale</p>
            <h2 className="font-headline font-normal text-[34px] sm:text-[44px] leading-[1.1] text-[#1d1a16] mb-6">
              Une signature olfactive,
              <br />
              <em className="italic">une émotion unique.</em>
            </h2>
            <p className="text-sm text-[#4a443c] leading-relaxed mb-4 max-w-lg">
              Dubaï Négoce sélectionne les eaux de parfum des grandes maisons émiraties : des compositions
              intenses, gourmandes ou boisées, vendues en flacons neufs scellés sous blister et expédiées
              depuis la France.
            </p>
            <p className="text-sm text-[#4a443c] leading-relaxed mb-8 max-w-lg">
              Une question avant de choisir ? Notre service client répond par téléphone au{' '}
              <a href="tel:+33758999726" className="text-[#1d1a16] font-medium whitespace-nowrap">07 58 99 97 26</a> et
              par e-mail.
            </p>
            <div className="flex flex-wrap gap-x-7 gap-y-4">
              <Link
                href="/about"
                className="text-xs uppercase tracking-[0.16em] text-[#1d1a16] border-b border-[#1d1a16]/40 hover:border-[#1d1a16] pb-1 transition-colors"
              >
                Découvrir notre maison
              </Link>
              <a
                href="https://fr.trustpilot.com/review/dubainegoce.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.16em] text-[#1d1a16] border-b border-[#1d1a16]/40 hover:border-[#1d1a16] pb-1 transition-colors"
              >
                Nos avis Trustpilot
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
