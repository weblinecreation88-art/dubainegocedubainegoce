
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
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

export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const newArrivals = getNewArrivals();

  const bestsellersSlugs = [
    'yara-lattafa',
    'khamrah-lattafa',
    'asad-lattafa',
    'ameer-al-oudh-intense-oud-lattafa',
    'badee-parfum-lattafa',
    'qaed-al-fursan',
    'fakhar-black-lattafa',
    'mayar-lattafa'
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
      <section className="relative h-screen md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-background dark:bg-black"></div>
        <div className="container mx-auto h-full px-4">
            <div className="relative z-10 h-full grid md:grid-cols-2 items-center gap-8">
                <div className="text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 text-foreground">
                        L'Essence de Dubaï, Capturée dans un Flacon
                    </h1>
                    <p className="text-lg md:text-xl max-w-xl mb-8 text-muted-foreground">
                        Découvrez notre sélection exclusive de parfums rares et authentiques, importés directement pour vous.
                    </p>
                    <Button asChild size="lg" className="group">
                        <Link href="/shop">
                        Explorer la Collection
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="relative flex items-center justify-center h-full">
                    <div className="relative aspect-square w-full max-w-md">
                        {/* Halo doré lumineux externe avec animation pulse */}
                        <div
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0.2) 40%, transparent 70%)',
                                filter: 'blur(40px)',
                                transform: 'scale(1.3)',
                            }}
                        />

                        {/* Halo doré lumineux moyen */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                boxShadow: '0 0 60px 30px rgba(212, 175, 55, 0.6), 0 0 100px 50px rgba(212, 175, 55, 0.4), 0 0 140px 70px rgba(212, 175, 55, 0.2)',
                            }}
                        />

                        {/* Bordure dorée brillante */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                border: '3px solid rgba(212, 175, 55, 0.8)',
                                boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.5)',
                            }}
                        />

                        {/* Container vidéo avec overflow hidden */}
                        <div className="relative aspect-square w-full rounded-full overflow-hidden">
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
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      <ReassuranceSection />

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-headline">Nouveautés</h2>
                  <p className="text-muted-foreground mt-2">Les dernières pépites de notre collection.</p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {newArrivals.slice(0, 8).map((product, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
      )}
      
      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
          <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-headline">Nos Best-Sellers</h2>
                  <p className="text-muted-foreground mt-2">Les favoris de notre communauté, des noms devenus iconiques.</p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {bestsellers.map((product, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
      )}

      {/* Fragrance Families Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center mb-12">
            Nos familles olfactives
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {fragranceFamilies.map((family) => (
              <Link href={`/shop/all?families=${family.name}`} key={family.id}>
                <div className="overflow-hidden group relative text-center rounded-lg">
                  <div className="relative w-full h-48">
                    <Image
                      src={family.imageUrl}
                      alt={family.name}
                      data-ai-hint={family.imageHint}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h3 className="text-xl font-headline text-white">{family.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Perfume Section */}
      {featuredPerfume && (
        <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                        <p className="text-primary font-semibold">Parfum à l'honneur</p>
                        <h2 className="text-4xl md:text-5xl mt-2">{featuredPerfume.name}</h2>
                        <p className="text-lg text-muted-foreground">
                           {featuredPerfume.shortDescription}
                        </p>
                        <Button asChild size="lg" className="group mt-4">
                            <Link href={`/parfum/${featuredPerfume.slug}`}>
                                Découvrir ce trésor
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                    <div>
                        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
                            <video
                                src="https://res.cloudinary.com/dhjwimevi/video/upload/v1766255881/grok-video-00e16448-d9d4-42d7-b008-a52bb2d894e6_mrdac7.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* Featured Brand Section - My Fragrance World */}
      {allFwProducts.length > 0 && (
          <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-headline">My Fragrance World</h2>
                  <p className="text-muted-foreground mt-2">L'audace et la créativité à leur paroxysme.</p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {allFwProducts.slice(0, 8).map((product, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
      )}
      
      {/* Lattafa Section */}
      {lattafaProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline">L'Univers Lattafa</h2>
                <p className="text-muted-foreground mt-2">Plongez dans les créations iconiques de Lattafa.</p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {lattafaProducts.map((product, index) => (
                  <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>
      )}

      <div className="my-16 container mx-auto px-4">
          <PerfumeFinderCta />
      </div>

      {/* YARA Iconic Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image à gauche */}
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="https://res.cloudinary.com/dzntnjtkc/image/upload/v1766911492/YARA_id3ssb.jpg"
                  alt="YARA - Parfum Iconique"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Texte à droite */}
              <div className="p-8 lg:p-12 space-y-6">
                <div className="inline-block">
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Parfum Iconique
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    YARA
                  </h2>
                  <p className="text-xl text-muted-foreground">Une fragrance emblématique et intemporelle</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-rose-200 dark:border-rose-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      35€
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">52.99€</span>
                  </div>
                  <p className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mt-2">
                    Prix exclusif - YARA
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Un classique indémodable qui séduit depuis des années
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Fragrance florale orientale</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Sillage envoûtant et mémorable</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Parfait pour toutes occasions</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                    <Link href="/shop/all?search=yara">
                      Découvrir YARA
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8 border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                    <Link href="/shop">
                      Voir toute la collection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Un parfum iconique à prix exceptionnel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Follow Section */}
      <SocialFollowSection />

    </div>
  );
}
