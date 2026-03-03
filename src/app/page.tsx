import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { getFragranceFamilies, getNewArrivals, getProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { ReassuranceSection } from "@/components/layout/reassurance-section";
import React, { Suspense } from "react";
import { HeroBanner } from "@/components/layout/hero-banner";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Lazy load non-critical components for better initial load performance
const CustomerReviewsSection = dynamic(
  () => import("@/components/customer-reviews-section").then(mod => ({ default: mod.CustomerReviewsSection })),
  {
    loading: () => <div className="h-32 bg-muted/20 animate-pulse" />,
    ssr: true
  }
);

export const metadata: Metadata = {
  title: "Dubainegoce | L'Essence de Dubaï - Parfums Orientaux de Luxe",
  description: "Découvrez notre collection exclusive de parfums orientaux authentiques (Lattafa, Maison Alhambra, Fragrance World). Livraison 48h. 100% Authentique.",
};

export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const newArrivals = getNewArrivals();

  const bestsellersSlugs = [
    'woody-oud-80-ml-maison-alhambra',
    'the-tux-maison-alhambra-mixte',
    'toscano-leather-maison-alhambra',
    'jean-lowe-matiere-maison-alhambra',
    'glacier-pour-homme-maison-alhambra',
    'kismet-for-women-maison-alhambra',
    'infini-oud-maison-alhambra-mixte',
    'yeah-maison-alhambra'
  ];
  const bestsellers = bestsellersSlugs
    .map(slug => getProducts().find(p => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const lattafaSlugs = [
    'khamrah-lattafa',
    'asad-lattafa',
    'yara-lattafa',
    'ana-abiyedh-60ml-lattafa',
    'come-moiselle-maison-alhambra',
    'leonie-maison-alhambra',
    'badee-parfum-lattafa',
    'fakhar-black-lattafa',
    'ameer-al-oudh-intense-oud-lattafa',
    'qaed-al-fursan',
    'mayar-lattafa',
    'sakeena-lattafa',
    'maahir-lattafa',
    'oud-mood-lattafa',
    'ramz-silver-lattafa',
  ];
  const lattafaProducts = lattafaSlugs
    .map(slug => getProducts().find(p => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  const heroImages = [
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042739/Grise_-_Maison_Alhambra_rgvjtj.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042733/Omniyat_-_Surrati_ice7gl.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042690/Fleur_de_Coton_-_Sublime_bxfwfa.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042680/Good_Girl_by_Killer_-_Loui_Martin_rvtvqn.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042674/Niche_Royal_Rouge_-_Maison_Alhambra_i142ne.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042645/Olivia_Blossom_-_Maison_Alhambra_d9mink.png",
    "https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042629/Fakhar_Wasam_-_Lattafa_hwnd8d.webp",
  ];

  return (
    <div className="flex flex-col">
      <HeroBanner images={heroImages} />

      {/* Trust bar */}
      <div className="w-full bg-black text-white py-4">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center text-xs md:text-sm tracking-widest uppercase gap-6 sm:gap-12 text-center text-gray-300">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-white" /> <span className="text-white">100% Authentique</span></span>
          <span className="hidden sm:block opacity-30">|</span>
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-white" /> <span className="text-white">Livraison 48h</span></span>
        </div>
      </div>

      {/* Trend This Week / Nouveautés */}
      {newArrivals.length > 0 && (
        <section className="py-16 md:py-24 bg-white dark:bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100">Nouveautés Parfums Orientaux</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {newArrivals.slice(0, 8).map((product, index) => (
                <div key={index} className="transition-transform duration-300 hover:-translate-y-1">
                  <ProductCard product={product} priority={index < 4} />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild size="lg" className="bg-black text-white hover:opacity-90 border-0 rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-opacity duration-300">
                <Link href="/shop/all">Voir toutes les nouveautés</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Banner Section */}
      <section className="relative py-24 md:py-36 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://res.cloudinary.com/dzagwz94z/image/upload/f_auto,q_80,dpr_auto/v1772042733/Omniyat_-_Surrati_ice7gl.png"
            alt="Omniyat Surrati - Élégance Redéfinie Dubai Negoce"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-wider">ÉLÉGANCE REDÉFINIE</h2>
          <p className="max-w-xl mx-auto text-gray-300 text-lg md:text-xl font-light tracking-wide mb-10">
            Explorez l'harmonie parfaite entre les traditions orientales délicates et le luxe contemporain.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-transparent hover:text-white border border-white rounded-none px-12 py-6 text-sm tracking-[0.2em] uppercase transition-all duration-300">
            <Link href="/shop/all">
              Explorer
            </Link>
          </Button>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestsellers.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-muted/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100">Nos Best Sellers</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {bestsellers.slice(0, 8).map((product, index) => (
                <div key={index} className="transition-transform duration-300 hover:-translate-y-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild size="lg" className="bg-black text-white hover:opacity-90 border-0 rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-opacity duration-300">
                <Link href="/shop/all?sort=bestsellers">Voir tous les best sellers</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Explore Our Collection / Categories */}
      <section className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14 text-center">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-2">Découvrir par Famille</h2>
            <p className="text-muted-foreground">Trouvez la signature olfactive qui vous correspond.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {fragranceFamilies.slice(0, 4).map((family) => (
              <Link href={`/shop/all?families=${family.name}`} key={family.id} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={family.imageUrl}
                    alt={`Gammes de Parfums ${family.name} - Dubai Negoce`}
                    data-ai-hint={family.imageHint}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-left text-white">
                    <h3 className="text-lg sm:text-xl font-medium mb-1 drop-shadow-md">{family.name}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1 group-hover:text-white transition-colors">
                      Explorer <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button asChild size="lg" className="bg-black text-white hover:opacity-90 border-0 rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-opacity duration-300">
              <Link href="/shop/all">Explorer toutes les familles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lattafa Focus Section */}
      {lattafaProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-muted/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-2">La Collection Lattafa</h2>
              <p className="text-muted-foreground">Une sélection méticuleuse des créations iconiques de la Maison Lattafa.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {lattafaProducts.slice(0, 15).map((product, index) => (
                <div key={index} className="transition-transform duration-300 hover:-translate-y-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild size="lg" className="bg-black text-white hover:opacity-90 border-0 rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-opacity duration-300">
                <Link href="/shop/all?brands=Lattafa">Voir toute la collection Lattafa</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section - Lazy loaded for performance */}
      <Suspense fallback={<div className="h-32 bg-muted/20 animate-pulse" />}>
        <div className="bg-muted/30">
          <CustomerReviewsSection />
        </div>
      </Suspense>

    </div>
  );
}
