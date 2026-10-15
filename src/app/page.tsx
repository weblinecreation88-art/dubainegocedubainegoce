import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getFragranceFamilies, getNewArrivals, getProducts } from "@/lib/data";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { ReassuranceSection } from "@/components/layout/reassurance-section";
import React, { Suspense } from "react";
import { HeroBanner } from "@/components/layout/hero-banner";
import dynamic from "next/dynamic";
// Lazy load non-critical components for better initial load performance
const CustomerReviewsSection = dynamic(
  () => import("@/components/customer-reviews-section").then(mod => ({ default: mod.CustomerReviewsSection })),
  {
    loading: () => <div className="h-32 bg-muted/20 animate-pulse" />,
    ssr: true
  }
);

// Garder UNIQUEMENT le composant principal de reviews
// Supprimer les sections excessives pour un design épuré


export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const newArrivals = getNewArrivals();

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
    'good-girl-by-killer-loui-martin'
  ];
  const allProducts = getProducts();
  const popularProducts = popularSlugs
    .map(slug => allProducts.find(p => p.slug === slug))
    .filter((p): p is Product => p !== undefined)
    .map(p => ({ ...p, isBestseller: true }));

  const heroImages = [
    allProducts.find(p => p.slug === 'tobacco-touch-maison-alhambra')?.images[0],
    allProducts.find(p => p.slug === 'woody-oud-80-ml-maison-alhambra')?.images[0],
    allProducts.find(p => p.slug === 'grise-maison-alhambra')?.images[0],
    allProducts.find(p => p.slug === 'porto-neroli-maison-alhambra')?.images[0],
    allProducts.find(p => p.slug === 'khamrah-lattafa')?.images[0],
    allProducts.find(p => p.slug === 'lovely-cherie-maison-alhambra')?.images[0],
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col">
      <HeroBanner images={heroImages} />

      {/* Banners Homme / Femme */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-gray-100 mb-3">Quel parfum recherchez-vous ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/shop/all?genders=femme" className="group relative overflow-hidden rounded-xl aspect-[4/5] block">
              <Image
                src="https://res.cloudinary.com/dzntnjtkc/image/upload/f_auto,q_auto,w_600/v1773725244/femme-parfum-poignet_sixg1u.png"
                alt="Parfums pour Femme - Dubai Negoce"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-headline font-bold mb-1 text-[#c9a96e]">FEMME</h3>
                <p className="text-sm text-white/90 mb-4 font-medium tracking-wide">Élégant · floral · gourmand</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#c9a96e] transition-colors">
                  Découvrir <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/shop/all?genders=homme" className="group relative overflow-hidden rounded-xl aspect-[4/5] block">
              <Image
                src="https://res.cloudinary.com/dzntnjtkc/image/upload/f_auto,q_auto,w_600/v1773725815/ChatGPT_Image_17_mars_2026_05_36_32_clwqv6.png"
                alt="Parfums pour Homme - Dubai Negoce"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-headline font-bold mb-1 text-[#c9a96e]">HOMME</h3>
                <p className="text-sm text-white/90 mb-4 font-medium tracking-wide">Boisé · frais · charismatique</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#c9a96e] transition-colors">
                  Découvrir <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link href="/shop/all?genders=mixte" className="group relative overflow-hidden rounded-xl aspect-[4/5] block">
              <Image
                src="https://res.cloudinary.com/db2ljqpdt/image/upload/f_auto,q_auto,w_600/v1766907448/LOVELY-Photoroom_z0r2jf.jpg"
                alt="Parfums Mixtes - Dubai Negoce"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-headline font-bold mb-1 text-[#c9a96e]">MIXTE</h3>
                <p className="text-sm text-white/90 mb-4 font-medium tracking-wide">Ambré · audacieux · universel</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#c9a96e] transition-colors">
                  Découvrir <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Parfums les Plus Populaires / Best Sellers Section */}
      {popularProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-muted/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-14 text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9a96e] font-bold block mb-2">Les Incontournables</span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-gray-900 dark:text-gray-100">Les Parfums les Plus Populaires</h2>
              <div className="flex justify-center gap-1 my-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#c9a96e] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-muted-foreground mt-2 font-medium tracking-wide">Les fragrances les plus recherchées et plébiscitées de notre boutique</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
              {popularProducts.map((product, index) => (
                <div key={product.id || index} className="transition-transform duration-300 hover:-translate-y-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button asChild size="lg" className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-colors duration-300">
                <Link href="/shop/all?sort=bestsellers">Voir toute la collection</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Explore Our Collection / Categories */}
      <section className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-gray-900 dark:text-gray-100 mb-4">L'Art de la Parfumerie Orientale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Découvrez notre collection à travers les familles olfactives les plus nobles de l'Orient.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {fragranceFamilies.map((family) => (
              <Link href={`/shop/all?families=${family.name}`} key={family.id} className="group relative overflow-hidden rounded-xl aspect-[3/4] block">
                <Image
                  src={family.imageUrl}
                  alt={`Parfums ${family.name} - Dubai Negoce`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors duration-500 group-hover:from-black/80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-headline font-bold drop-shadow-md mb-1">{family.name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 group-hover:text-[#c9a96e] transition-all duration-300">
                    Explorer <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section - Trustpilot */}
      <section className="py-12 md:py-16 bg-[#0f1726] text-white overflow-hidden">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 text-[#c9a96e]">Nos clients parlent de nous</h2>
          
          <div className="bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 flex flex-col items-center shadow-2xl">
            <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg" alt="Trustpilot" width={150} height={40} className="h-8 w-auto mb-6" />
            <p className="text-xl md:text-2xl font-bold mb-2">Découvrez les retours de notre communauté</p>
            <p className="text-white/70 mb-8 max-w-md">
              La transparence est notre priorité. Consultez les expériences réelles de nos clients directement sur notre page Trustpilot.
            </p>
            <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-transparent border-2 border-[#00b67a] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#00b67a] transition-colors shadow-lg">
              Voir tous nos avis certifiés
            </a>
          </div>
        </div>
      </section>

      {/* Pourquoi DubaiNegoce ? */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-[#c9a96e]/10 flex items-center justify-center rounded-full mb-4">
                <span className="text-3xl" aria-hidden="true">🏅</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Authentiques</h3>
              <p className="text-muted-foreground text-sm">Des fragrances orientales sélectionnées avec soin directement auprès des grandes maisons.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-[#c9a96e]/15 flex items-center justify-center rounded-full mb-4">
                <span className="text-2xl font-bold text-[#8f621a] dark:text-[#c9a96e]">35€</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Prix Unique</h3>
              <p className="text-muted-foreground text-sm">Une parfumerie orientale de haute qualité accessible pour tous.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-[#c9a96e]/10 flex items-center justify-center rounded-full mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Livraison France</h3>
              <p className="text-muted-foreground text-sm">Votre parfum expédié depuis la France et livré directement chez vous en 48h.</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-[#c9a96e]/10 flex items-center justify-center rounded-full mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Achat Sécurisé</h3>
              <p className="text-muted-foreground text-sm">Paiement 100% sécurisé et commande protégée de bout en bout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
