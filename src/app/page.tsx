
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { getFragranceFamilies, getNewArrivals, getProducts, getGenderCategories } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { SocialFollowSection } from "@/components/layout/social-follow-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { PerfumeFinderCta } from "@/components/perfume-finder-cta";
import { GoogleReviewsCta } from "@/components/google-reviews-cta";

export default function Home() {
  const fragranceFamilies = getFragranceFamilies();
  const newArrivals = getNewArrivals();
  const genders = getGenderCategories();

  const bestsellersSlugs = [
    'yara-lattafa',
    'asad-lattafa',
    'ameer-al-oudh-intense-oud-lattafa',
    'badee-al-oud-oud-for-glory-lattafa',
    'fakhar-black-lattafa',
    'mayar-lattafa'
  ];
  const bestsellers = getProducts().filter(p => bestsellersSlugs.includes(p.slug));

  const featuredPerfume = getProducts().find(p => p.slug === 'asad-lattafa');
  const allFwProducts = getProducts().filter(p => p.brand.name === 'Fragrance World');

  const lattafaSlugs = [
    'asad-lattafa',
    'yara-lattafa',
    'badee-al-oud-oud-for-glory-lattafa',
    'fakhar-black-lattafa',
    'ameer-al-oudh-intense-oud-lattafa',
    'mayar-lattafa',
    'ramz-gold-lattafa-mixte',
    'raghba-lattafa-mixte',
  ];
  const lattafaProducts = getProducts().filter(p => lattafaSlugs.includes(p.slug));

  const heroVideos = [
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766320321/grok-video-62d89989-e362-4f7b-8748-be7160716d9d_s0bycy.mp4",
    "https://res.cloudinary.com/dzntnjtkc/video/upload/v1766320320/grok-video-00e16448-d9d4-42d7-b008-a52bb2d894e6_uw6xgz.mp4",
    "https://res.cloudinary.com/db2ljqpdt/video/upload/v1766907652/2025-04-28-102545306_q3wg4n.mp4",
    "https://res.cloudinary.com/dhjwimevi/video/upload/v1766255882/grok-video-0f20adcf-d493-4780-ab4f-29b6c76af0c9_rt4q9m.mp4",
    "https://res.cloudinary.com/dhjwimevi/video/upload/v1766255882/grok-video-47eb3ac0-be42-4cdb-a184-80277705f1d4_ca1kj5.mp4"
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
      {/* Hero Section - Deux colonnes : Texte + Vidéo */}
      <section className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center">
        {/* Fond décoratif */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c58a3d]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c58a3d]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Colonne Gauche - Texte */}
              <div>
                {/* Badge premium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full border border-[#c58a3d]/30 bg-[#c58a3d]/10 backdrop-blur-md"
                >
                  <Sparkles className="h-4 w-4 text-[#c58a3d]" />
                  <span className="text-[#c58a3d] font-semibold text-sm tracking-wider uppercase">
                    L'Âme de Dubaï en Flacon
                  </span>
                </motion.div>

                {/* Titre principal */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 text-white leading-tight"
                >
                  Fragrances{' '}
                  <span className="bg-gradient-to-r from-[#d4a053] via-[#c58a3d] to-[#b67a2d] bg-clip-text text-transparent">
                    Prestigieuses
                  </span>
                  {' '}d'Orient
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
                >
                  Découvrez une collection exclusive de parfums rares. DubaiNegoce sélectionne pour vous les essences les plus précieuses.
                </motion.p>

                {/* Prix fixe badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="inline-block mb-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] shadow-2xl shadow-[#c58a3d]/30"
                >
                  <p className="text-white font-bold text-2xl md:text-3xl">
                    35€
                    <span className="text-base font-normal ml-2 opacity-90">
                      / Flacon
                    </span>
                  </p>
                  <p className="text-white/90 text-sm mt-1">
                    Prix fixe • Livraison gratuite
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="mb-8"
                >
                  <Button
                    asChild
                    size="lg"
                    className="group bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] hover:from-[#b67a2d] hover:to-[#a56a1d] text-white px-8 py-6 text-lg font-bold shadow-2xl shadow-[#c58a3d]/30 rounded-xl transition-all hover:scale-105"
                  >
                    <Link href="/shop">
                      Explorer la Collection
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-wrap gap-4 text-gray-400 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span>100% Authentique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    <span>Livraison Rapide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#c58a3d]"></div>
                    <span>Paiement Sécurisé</span>
                  </div>
                </motion.div>
              </div>

              {/* Colonne Droite - Vidéo */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#c58a3d]/20 border-2 border-[#c58a3d]/30">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-[4/5] object-cover"
                  >
                    <source src="https://res.cloudinary.com/dhjwimevi/video/upload/v1768402825/WhatsApp_Video_2026-01-09_at_11.14.29_m4vr47.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                  {/* Overlay léger */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                  {/* Badge sur la vidéo */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-[#c58a3d]/30">
                      <p className="text-[#c58a3d] font-bold text-lg">KHAMRAH</p>
                      <p className="text-white/80 text-sm">Le parfum iconique de Lattafa</p>
                    </div>
                  </div>
                </div>

                {/* Décoration autour de la vidéo */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[#c58a3d]/30 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-[#c58a3d]/20 rounded-2xl -z-10"></div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          >
            <span className="text-xs uppercase tracking-wider">Découvrir</span>
            <ArrowRight className="h-5 w-5 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Brand Stats Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
            {[
              { label: "Essences Rares", val: "150+", icon: "✨" },
              { label: "Prix Fixe", val: "35€", icon: "💎" },
              { label: "Années d'Expertise", val: "3", icon: "🏆" },
              { label: "Livraison Rapide", val: "48-72h", icon: "🚀" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center md:border-r border-white/10 md:last:border-none px-4"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-5xl font-headline font-bold bg-gradient-to-r from-[#d4a053] via-[#c58a3d] to-[#b67a2d] bg-clip-text text-transparent mb-2">
                  {stat.val}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gender Categories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-headline text-center mb-12"
          >
            Explorer par <span className="text-[#c58a3d]">Genre</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {genders.map((gender, index) => (
              <motion.div
                key={gender.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop/all?genders=${gender.name}`}>
                  <Card className="overflow-hidden group relative text-center rounded-2xl h-full border-2 border-transparent hover:border-[#c58a3d]/50 transition-all duration-300">
                    <div className="relative w-full h-80">
                      <Image
                        src={gender.imageUrl}
                        alt={gender.displayName}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-6">
                      <h3 className="text-3xl font-headline text-white mb-2">{gender.displayName}</h3>
                      <span className="inline-flex items-center text-[#c58a3d] font-semibold group-hover:text-white transition-colors">
                        Voir la sélection
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-headline">Nouveautés</h2>
                  <p className="text-muted-foreground mt-2">Les dernières pépites de notre collection.</p>
              </div>

              {/* Grille 4x2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newArrivals.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative group">
                        {/* Badge "Nouveau" flottant */}
                        <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-green-500/50 animate-pulse">
                          ✨ Nouveau
                        </div>
                        <ProductCard product={product} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="flex justify-center mt-8">
                <Button asChild size="lg" variant="outline" className="group">
                  <Link href="/shop">
                    Voir toutes les nouveautés
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
      )}
      
      {/* Bestsellers Section - Enhanced */}
      {bestsellers.length > 0 && (
          <section id="bestsellers" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 scroll-mt-20 relative overflow-hidden">
            {/* Effets décoratifs en arrière-plan */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c58a3d]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c58a3d]/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
              {/* En-tête avec badge prestige */}
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  {/* Badge Premium avec icône Sparkles */}
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#c58a3d] bg-gradient-to-r from-amber-400/10 to-amber-600/10 backdrop-blur-md mb-6">
                    <Sparkles className="h-5 w-5 text-[#c58a3d] animate-pulse" />
                    <span className="text-[#b67a2d] dark:text-[#c58a3d] font-bold tracking-widest uppercase text-sm">
                      Sélection Prestige
                    </span>
                    <Sparkles className="h-5 w-5 text-[#c58a3d] animate-pulse" />
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 gradient-amber-text">
                    Nos Best-Sellers
                  </h2>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                    Les favoris de notre communauté, des noms devenus iconiques. Découvrez les parfums qui ont conquis des milliers de cœurs.
                  </p>
                </motion.div>
              </div>

              {/* Grille 4x2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bestsellers.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative group">
                        {/* Badge "Best-Seller" flottant */}
                        <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-[#c58a3d]/50 animate-pulse">
                          ⭐ Best
                        </div>
                        <ProductCard product={product} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button avec effet de glow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-center mt-12"
              >
                <Button asChild size="lg" className="btn-primary-modern text-lg px-12 py-7 group shadow-2xl shadow-[#c58a3d]/30">
                  <Link href="/shop">
                    Explorer Toute la Collection
                    <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </motion.div>

              {/* Ligne décorative avec texte */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-4 mt-16"
              >
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400"></div>
                <p className="text-sm text-muted-foreground italic">Les essences qui font voyager</p>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400"></div>
              </motion.div>
            </div>
          </section>
      )}

      {/* Featured Brand Section - My Fragrance World */}
      {allFwProducts.length > 0 && (
          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-headline">My Fragrance World</h2>
                  <p className="text-muted-foreground mt-2">L'audace et la créativité à leur paroxysme.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allFwProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild size="lg" variant="outline" className="group">
                  <Link href="/shop/all?brands=Fragrance%20World">
                    Voir toute la collection Fragrance World
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {lattafaProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button asChild size="lg" variant="outline" className="group">
                <Link href="/shop/all?brands=Lattafa">
                  Découvrir tous les parfums Lattafa
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
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

      {/* Featured Perfume Section - KHAMRAH */}
      <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="prose prose-invert prose-headings:font-headline prose-headings:text-primary max-w-none">
                      <p className="text-primary font-semibold">Parfum à l'honneur</p>
                      <h2 className="text-4xl md:text-5xl mt-2">KHAMRAH</h2>
                      <p className="text-lg text-muted-foreground">
                         Un chef-d'œuvre oriental aux notes envoûtantes de cannelle, vanille et oud. KHAMRAH de Lattafa est devenu une icône incontournable de la parfumerie orientale.
                      </p>
                      <Button asChild size="lg" className="group mt-4">
                          <Link href="/shop/all?search=khamrah">
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
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover"
                          />
                      </div>
                  </div>
              </div>
          </div>
      </section>

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
                    <Link href="/parfum/yara-lattafa">
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

      {/* KAMRAH Promo Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-950/20 dark:to-gray-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Texte à gauche */}
              <div className="p-8 lg:p-12 space-y-6 order-2 lg:order-1">
                <div className="inline-block">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Promotion Exclusive
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-2">KHAMRAH QAHWA</h2>
                  <p className="text-xl text-muted-foreground">L'élégance orientale à prix fixe</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-primary/20">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold text-primary">35€</span>
                    <span className="text-2xl text-muted-foreground line-through">49.99€</span>
                  </div>
                  <p className="text-lg font-semibold text-primary mt-2">Prix fixe - Toutes les fragrances KHAMRAH QAHWA</p>
                  <p className="text-sm text-muted-foreground mt-2">Un parfum gourmand aux notes de café et de vanille</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Notes de café torréfié</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Qualité premium garantie</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Livraison rapide</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8">
                    <Link href="/shop/all?search=khamrah">
                      Voir KHAMRAH QAHWA
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Offre valable dans la limite des stocks disponibles</p>
              </div>

              {/* Image à droite */}
              <div className="relative h-[400px] lg:h-[500px] order-1 lg:order-2">
                <Image
                  src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1764270620/Screenshot_2025-06-02-00-12-11-453_com.android.chrome-edit_1_prxl15.jpg"
                  alt="KHAMRAH QAHWA - Parfum Lattafa aux notes de café"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZAFFIRO Collection Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image à gauche */}
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1768337452/Maison_Alhambra_Zaffiro_Collection_Regale_Edp_Eau_De_Parfum_For_Unisex___100_Ml-1-Photoroom-Photoroom_jhkuzd.jpg"
                  alt="ZAFFIRO - Collection Premium"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Texte à droite */}
              <div className="p-8 lg:p-12 space-y-6">
                <div className="inline-block">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Collection Premium
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    ZAFFIRO
                  </h2>
                  <p className="text-xl text-muted-foreground">L'excellence olfactive à votre portée</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      35€
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">54.99€</span>
                  </div>
                  <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                    Prix fixe - Toute la collection ZAFFIRO
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Découvrez une collection raffinée inspirée des plus grandes créations
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Collection exclusive haute qualité</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Notes sophistiquées et raffinées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Tenue longue durée</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/parfum/zaffiro-regale-maison-alhambra">
                      Découvrir ZAFFIRO
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Collection limitée - Offre spéciale</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Google Reviews CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <GoogleReviewsCta />
        </div>
      </section>

      {/* Philosophy Quote Section */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white text-center border border-amber-500/20 shadow-2xl"
          >
            {/* Guillemet décoratif géant */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#c58a3d]/10 text-[15rem] font-headline leading-none pointer-events-none select-none italic">
              "
            </div>

            {/* Effets de particules */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-2 h-2 bg-[#c58a3d] rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-[#b67a2d] rounded-full animate-pulse delay-100"></div>
              <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-[#c58a3d] rounded-full animate-pulse delay-300"></div>
            </div>

            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-headline italic mb-10 relative z-10 leading-relaxed text-white"
            >
              "Le parfum est la forme la plus intense du souvenir. Chez DubaiNegoce, nous capturons l'essence même de l'élégance orientale."
            </motion.h4>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] mb-4 flex items-center justify-center text-white shadow-2xl shadow-[#c58a3d]/50">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="text-[#c58a3d] font-bold tracking-widest uppercase text-sm">
                Maison DubaiNegoce
              </p>
              <p className="text-gray-400 text-xs mt-2 italic">
                L'art de la parfumerie orientale depuis 2023
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEO Content Section - Optimisé pour 2025 */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-center mb-6">
              Parfums de Dubaï Authentiques | Prix Fixe 35€
            </h2>
            <div className="text-base md:text-lg leading-relaxed space-y-4">
              <p>
                Bienvenue chez <strong>DubaiNegoce</strong>, votre spécialiste des <strong>parfums orientaux authentiques</strong> importés directement de Dubaï. Nous proposons une sélection exclusive de <strong>parfums de luxe à prix accessible</strong> : tous nos <strong>parfums sont à 35€</strong> avec la <strong>livraison Mondial Relay GRATUITE</strong>.
              </p>
              <p>
                Découvrez les plus grandes marques de <strong>parfumerie de Dubaï</strong> : <strong>Lattafa</strong> (avec les iconiques <strong>YARA</strong>, <strong>Khamrah</strong>, <strong>Asad</strong>), <strong>Maison Alhambra</strong> (célèbre pour <strong>Zaffiro</strong>), <strong>Fragrance World</strong> et <strong>French Avenue</strong>. Chaque <strong>eau de parfum</strong> est <strong>100% authentique</strong>, garantie et contrôlée.
              </p>
              <p>
                Que vous recherchiez un <strong>parfum homme</strong>, un <strong>parfum femme</strong> ou une fragrance <strong>mixte unisexe</strong>, notre collection répond à toutes les envies : notes <strong>oud</strong>, <strong>boisées</strong>, <strong>florales</strong>, <strong>gourmandes</strong> ou <strong>épicées</strong>. Tous nos parfums offrent une <strong>tenue longue durée</strong> exceptionnelle.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Stock permanent</strong> • <strong>Livraison rapide 48-72h</strong> • <strong>Service client français</strong> • <strong>Paiement sécurisé</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Follow Section */}
      <SocialFollowSection />

    </div>
  );
}
