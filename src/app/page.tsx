'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck } from "lucide-react";
import { getFragranceFamilies, getNewArrivals, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { SocialFollowSection } from "@/components/layout/social-follow-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ReassuranceSection } from "@/components/layout/reassurance-section";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { PerfumeFinderCta } from "@/components/perfume-finder-cta";
import { CustomerReviewsSection } from "@/components/customer-reviews-section";

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
  const bestsellers = getProducts().filter(p => bestsellersSlugs.includes(p.slug));

  const featuredPerfume = getProducts().find(p => p.slug === 'khamrah-lattafa');
  const allFwProducts = getProducts().filter(p => p.brand.name === 'Fragrance World');

  const lattafaSlugs = [
    'khamrah-lattafa',
    'asad-lattafa',
    'yara-lattafa',
    'badee-parfum-lattafa',
    'fakhar-black-lattafa',
    'ameer-al-oudh-intense-oud-lattafa',
    'qaed-al-fursan',
    'mayar-lattafa',
  ];
  const lattafaProducts = getProducts().filter(p => lattafaSlugs.includes(p.slug));

  const heroVideos = [
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766320321/grok-video-62d89989-e362-4f7b-8748-be7160716d9d_s0bycy.mp4",
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766320320/grok-video-00e16448-d9d4-42d7-b008-a52bb2d894e6_uw6xgz.mp4",
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766320316/grok-video-e0b263cc-d799-4eaf-af37-19a495bddfb7_athtqf.mp4",
    "https://res.cloudinary.com/dhjwimevi/video/upload/v1766255882/grok-video-0f20adcf-d493-4780-ab4f-29b6c76af0c9_rt4q9m.mp4",
    "https://res.cloudinary.com/dhjwimevi/video/upload/v1766255882/grok-video-47eb3ac0-be42-4cdb-a184-80277705f1d4_ca1kj5.mp4",
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766756032/grok-video-5a5cac64-5a42-4637-a03e-1a419dbb96a6_vx2bon.mp4"
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length);
    }, 5000); // Change video every 5 seconds
    return () => clearInterval(interval);
  }, [heroVideos.length]);


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
        {/* Full width video background */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence>
            <motion.video
              key={currentVideoIndex}
              src={heroVideos[currentVideoIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          </AnimatePresence>
        </div>

        <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-4 tracking-wider drop-shadow-2xl"
          >
            L'ESSENCE DE DUBAÏ
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-lg text-gray-200 mb-10 tracking-[0.3em] uppercase font-light drop-shadow-lg"
          >
            Collection Exclusive de Parfums Orientaux
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild size="lg" className="bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-white rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-all duration-300">
              <Link href="/shop">
                Découvrir la Collection
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="w-full bg-black text-white py-3">
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
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100">Nouveautés</h2>
              <Link href="/shop/all" className="hidden md:flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Tout voir <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {newArrivals.slice(0, 10).map((product, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
              <CarouselNext className="hidden md:flex -right-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
            </Carousel>
            <div className="mt-8 text-center md:hidden">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/shop/all">Voir toutes les nouveautés</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Banner Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1768337222/la_vita_bella_ozdrni.png"
            alt="Luxury Perfume La Vita Bella"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-wider">ÉLÉGANCE REDÉFINIE</h2>
          <p className="max-w-xl mx-auto text-gray-300 text-lg md:text-xl font-light tracking-wide mb-10">
            Explorez l'harmonie parfaite entre les traditions orientales délicates et le luxe contemporain.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-transparent hover:text-white border border-white rounded-none px-12 py-6 text-sm tracking-[0.2em] uppercase transition-all duration-300">
            <Link href="/shop">
              Explorer
            </Link>
          </Button>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestsellers.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-muted/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100">Nos Best Sellers</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {bestsellers.map((product, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
              <CarouselNext className="hidden md:flex -right-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Explore Our Collection / Categories */}
      <section className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-2">Découvrir par Famille</h2>
            <p className="text-muted-foreground">Trouvez la signature olfactive qui vous correspond.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {fragranceFamilies.slice(0, 4).map((family) => (
              <Link href={`/shop/all?families=${family.name}`} key={family.id} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={family.imageUrl}
                    alt={family.name}
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
        </div>
      </section>

      {/* Lattafa Focus Section */}
      {lattafaProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-muted/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-2">La Collection Lattafa</h2>
              <p className="text-muted-foreground">Une sélection méticuleuse des créations iconiques de la Maison Lattafa.</p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4">
                {lattafaProducts.map((product, index) => (
                  <CarouselItem key={index} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="transition-transform duration-300 hover:-translate-y-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
              <CarouselNext className="hidden md:flex -right-4 bg-white/80 hover:bg-white shadow-md border-0 text-black h-10 w-10" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-muted/30">
        <CustomerReviewsSection />
      </div>

      <div className="container mx-auto px-4 py-16">
        <PerfumeFinderCta />
      </div>

      {/* Social Follow Section */}
      <SocialFollowSection />

    </div>
  );
}
