import { getBrandPath } from '@/lib/catalog-urls';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getFragranceFamilies, getNewArrivals, getProducts, getBrands } from '@/lib/data';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { HeroBanner } from '@/components/layout/hero-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dubainegoce.fr/' },
};

export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const brands = getBrands().slice(0, 8);
  const allProducts = getProducts();

  const popularSlugs = [
    'tobacco-touch-maison-alhambra',
    'grise-maison-alhambra',
    'woody-oud-80-ml-maison-alhambra',
    'porto-neroli-maison-alhambra',
    'lovely-cherie-maison-alhambra',
    'toscano-leather-maison-alhambra',
    'khamrah-lattafa',
    'fleur-de-coton-sublime',
    'zaffiro-collection-crafted-oud-maison-alhambra',
    'pose-as-rose-fragrance-world',
    'liquide-brun-french-avenue',
    'good-girl-by-killer-loui-martin',
  ];

  // Sélection de produits réellement disponibles en stock
  const popularProducts = popularSlugs
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined && p.stock > 0)
    .map((p) => ({ ...p, isBestseller: true }))
    .slice(0, 5);

  const newArrivals = getNewArrivals()
    .filter((p) => p.stock > 0)
    .slice(0, 5);

  const heroImages = [
    '/images/hero/hero-khamrah.jpg',
    '/images/hero/hero-yara-moi.jpg',
    '/images/hero/hero-tudor.jpg',
    '/images/hero/hero-kenzie.jpg',
    '/images/hero/hero-yara.jpg',
  ];

  return (
    <div className="storefront-home flex flex-col space-y-10 pb-12">
      {/* 1. BANNIÈRE COURTE PRÉSENTANT LES PARFUMS ET L'OFFRE RÉELLE */}
      <HeroBanner images={heroImages} />

      {/* 2. SÉLECTION DE PRODUITS DISPONIBLES IMMÉDIATEMENT ACCESSIBLE */}
      <section className="storefront-selection container mx-auto px-4">
        <div className="bg-white border border-[#e4dac9] rounded p-4 sm:p-6 shadow-sm">
          <Tabs defaultValue="popular" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#d4a017] pb-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#111827]">
                  Parfums disponibles en stock
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Flacons neufs scellés • Livraison Colissimo offerte dès 3 parfums
                </p>
              </div>
              <TabsList className="bg-[#f7f0e6] border border-[#e4dac9] rounded-[2px] p-1 h-auto self-start sm:self-auto">
                <TabsTrigger
                  value="popular"
                  className="rounded-[2px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-[#111827] data-[state=active]:text-[#d4a017]"
                >
                  Sélection Populaire
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="rounded-[2px] px-4 py-1.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-[#111827] data-[state=active]:text-[#d4a017]"
                >
                  Nouveautés
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="popular" className="m-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="m-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-4 border-t border-[#e4dac9] flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#111827] text-white hover:bg-[#d4a017] hover:text-[#111827] rounded-[2px] px-8 h-11 text-xs font-bold tracking-wider uppercase transition-colors"
            >
              <Link href="/shop/all">
                Voir tout le catalogue ({allProducts.length} références) <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. ENTRÉES PAR GENRE, MARQUE ET FAMILLE OLFACTIVE */}
      <section className="storefront-discovery container mx-auto px-4 space-y-8">
        {/* 3a. Par Genre (Femme / Homme / Mixte) */}
        <div className="bg-white border border-[#e4dac9] rounded p-4 sm:p-6 shadow-sm">
          <div className="border-b-2 border-[#d4a017] pb-2.5 mb-5 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-headline font-bold text-[#111827]">
              Choisir par Genre
            </h2>
            <Link href="/shop/all" className="text-xs font-bold text-[#d4a017] hover:underline uppercase">
              Tout voir →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/shop/all?genders=femme"
              className="group relative overflow-hidden rounded border border-[#e4dac9] aspect-[16/9] block"
            >
              <Image
                src="https://res.cloudinary.com/dzntnjtkc/image/upload/f_auto,q_auto,w_600/v1773725244/femme-parfum-poignet_sixg1u.png"
                alt="Parfums pour Femme"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h3 className="text-xl font-headline font-bold text-[#d4a017]">PARFUMS FEMME</h3>
                <p className="text-xs text-white/90 mb-2">Floral · Gourmand · Poudré</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#d4a017]">
                  Explorer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/shop/all?genders=homme"
              className="group relative overflow-hidden rounded border border-[#e4dac9] aspect-[16/9] block"
            >
              <Image
                src="https://res.cloudinary.com/dzntnjtkc/image/upload/f_auto,q_auto,w_600/v1773725815/ChatGPT_Image_17_mars_2026_05_36_32_clwqv6.png"
                alt="Parfums pour Homme"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h3 className="text-xl font-headline font-bold text-[#d4a017]">PARFUMS HOMME</h3>
                <p className="text-xs text-white/90 mb-2">Boisé · Épicé · Frais</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#d4a017]">
                  Explorer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/shop/all?genders=mixte"
              className="group relative overflow-hidden rounded border border-[#e4dac9] aspect-[16/9] block"
            >
              <Image
                src="https://res.cloudinary.com/db2ljqpdt/image/upload/f_auto,q_auto,w_600/v1766907448/LOVELY-Photoroom_z0r2jf.jpg"
                alt="Parfums Mixtes"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h3 className="text-xl font-headline font-bold text-[#d4a017]">PARFUMS MIXTES</h3>
                <p className="text-xs text-white/90 mb-2">Oud · Ambre · Créations Unisexes</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#d4a017]">
                  Explorer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* 3b. Par Maisons de Dubaï & Familles Olfactives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Marques */}
          <div className="bg-white border border-[#e4dac9] rounded p-4 sm:p-6 shadow-sm">
            <div className="border-b-2 border-[#d4a017] pb-2.5 mb-4">
              <h2 className="text-lg sm:text-xl font-headline font-bold text-[#111827]">
                Maisons de Parfumerie de Dubaï
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={getBrandPath(brand.name)}
                  className="flex flex-col items-center justify-center p-3 rounded border border-[#e4dac9] bg-[#fdfaf4] hover:border-[#d4a017] hover:bg-[#f7f0e6] transition-colors text-center group"
                >
                  <div className="relative h-12 w-20 mb-2 bg-white rounded border border-gray-100 overflow-hidden">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#111827] group-hover:text-[#d4a017] truncate w-full">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Familles Olfactives */}
          <div className="bg-white border border-[#e4dac9] rounded p-4 sm:p-6 shadow-sm">
            <div className="border-b-2 border-[#d4a017] pb-2.5 mb-4">
              <h2 className="text-lg sm:text-xl font-headline font-bold text-[#111827]">
                Familles Olfactives
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fragranceFamilies.map((family) => (
                <Link
                  key={family.id}
                  href={`/shop/all?families=${encodeURIComponent(family.name)}`}
                  className="group relative overflow-hidden rounded border border-[#e4dac9] h-24 block"
                >
                  <Image
                    src={family.imageUrl}
                    alt={`Parfums ${family.name}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-white text-center">
                    <span className="font-headline font-bold text-sm sm:text-base">{family.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#d4a017] font-bold mt-0.5">
                      Voir les parfums →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. AVIS TRUSTPILOT & PRÉSENTATION DU VENDEUR */}
      <section className="storefront-confidence container mx-auto px-4">
        <div className="bg-white border border-[#e4dac9] rounded p-6 sm:p-8 shadow-sm">
          {/* Avis Trustpilot & Présentation Vendeur */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#f7f0e6] border border-[#e4dac9] rounded p-5 sm:p-6">
            <div className="lg:col-span-8 space-y-2">
              <h2 className="text-lg sm:text-xl font-headline font-bold text-[#111827]">
                À propos de Dubaï Négoce &amp; Avis Clients
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>Dubaï Négoce</strong> sélectionne les eaux de parfum authentiques des maisons émiraties (Lattafa, Maison Alhambra, Fragrance World, French Avenue, Paris Corner, Ard Al Zaafaran). Consultez nos conditions de livraison et les retours d&apos;expérience publiés sur notre profil public Trustpilot.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold">
                <Link href="/about" className="text-[#111827] hover:text-[#d4a017] underline">
                  Qui sommes-nous ?
                </Link>
                <Link href="/shipping" className="text-[#111827] hover:text-[#d4a017] underline">
                  Conditions de livraison &amp; retours
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3">
              <a
                href="https://fr.trustpilot.com/review/dubainegoce.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-5 py-3 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Consulter nos avis sur Trustpilot</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#00b67a]" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
