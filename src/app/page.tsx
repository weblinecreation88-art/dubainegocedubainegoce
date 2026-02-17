"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { GoogleReviewsCta } from "@/components/google-reviews-cta";
import { getNewArrivals, getBestsellers, getProducts } from "@/lib/data";

export default function Home() {
  const newProducts = getNewArrivals();
  const bestsellers = getBestsellers();

  return (
    <div className="flex flex-col overflow-x-hidden bg-white">
      {/* Hero Section - Cinematic Luxury */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dk93srhfb/image/upload/v1771065148/ChatGPT_Image_14_janv._2026_11_16_58_ztqqce.png"
            alt="DubaiNegoce Luxury Fragrance"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white font-luxury-body opacity-80">
              L'Héritage de l'Orient
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-luxury-headline text-white leading-tight">
              LE LUXE POUR TOUS
            </h1>
            <p className="text-sm md:text-lg text-white/90 font-luxury-body max-w-2xl mx-auto leading-relaxed tracking-wide opacity-90 italic">
              "Le parfum est la forme la plus intense du souvenir."
            </p>
            <div className="pt-8">
              <Button
                asChild
                className="btn-primary-modern bg-white text-black hover:bg-[#D4AF37] hover:text-white border-none px-12 py-8 rounded-none transition-all duration-500"
              >
                <Link href="/shop" className="tracking-[0.3em] font-luxury-body text-[10px]">
                  DÉCOUVRIR LA COLLECTION
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

      </section>

      {/* Featured Products Section - Kenzie & Aether */}
      <section className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body">Sélection Exclusive</span>
            <h2 className="text-4xl md:text-5xl font-luxury-headline text-black">NOUVELLE ARRIVAGE</h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
            {getProducts()
              .filter(p => ['5004', '5005', '5006', '5001', '5007', '5002', '3914', '3917'].includes(p.id))
              .sort((a, b) => {
                const order = ['5004', '5005', '5006', '5001', '5007', '5002', '3914', '3917'];
                return order.indexOf(a.id) - order.indexOf(b.id);
              })
              .map((product) => (
                <div key={product.id} className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] max-w-sm">
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-black/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group transition-all duration-500 hover:transform hover:-translate-y-1">
              <p className="text-3xl font-luxury-headline mb-2 text-black transition-colors group-hover:text-[#D4AF37]">35€</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-luxury-body text-black/50">Prix Unique</p>
            </div>
            <div className="text-center group transition-all duration-500 hover:transform hover:-translate-y-1">
              <p className="text-3xl font-luxury-headline mb-2 text-black transition-colors group-hover:text-[#D4AF37]">130+</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-luxury-body text-black/50">Références</p>
            </div>
            <div className="text-center group transition-all duration-500 hover:transform hover:-translate-y-1">
              <p className="text-3xl font-luxury-headline mb-2 text-black transition-colors group-hover:text-[#D4AF37]">4.9/5</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-luxury-body text-black/50">Avis Clients</p>
            </div>
            <div className="text-center group transition-all duration-500 hover:transform hover:-translate-y-1">
              <p className="text-3xl font-luxury-headline mb-2 text-black transition-colors group-hover:text-[#D4AF37]">24h</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-luxury-body text-black/50">Expédition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body">Collections</span>
            <h2 className="text-4xl md:text-5xl font-luxury-headline text-black">EXPLOREZ VOS SILLAGES</h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: 'Pour Elle',
                slug: '/genre/femme',
                img: 'https://res.cloudinary.com/dk93srhfb/image/upload/v1771065963/discover-ganymede-and-ganymede-extrait-by-marc-antoine-barrois_nkv2nn.jpg'
              },
              {
                name: 'Universel',
                slug: '/genre/unisex',
                img: 'https://res.cloudinary.com/dk93srhfb/image/upload/v1771066397/Capture_d_%C3%A9cran_2024-07-27_131310_jyawx1.png'
              },
              {
                name: 'Pour Lui',
                slug: '/genre/homme',
                img: 'https://res.cloudinary.com/dk93srhfb/image/upload/v1771066148/homme-se-parfume-avec-stule_bs7iuh.jpg'
              }
            ].map((cat) => (
              <Link key={cat.name} href={cat.slug} className="group relative aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 bg-black">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/20 group-hover:bg-black/0 transition-colors duration-700">
                  <h3 className="text-2xl md:text-3xl font-luxury-headline text-white tracking-[0.3em] uppercase text-center border-y border-white/0 py-4 group-hover:border-white/40 transition-all duration-700">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Grid */}
      <section className="py-32 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-24 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body">Les Incontournables</span>
            <h2 className="text-4xl md:text-5xl font-luxury-headline text-black">NOS MEILLEURES VENTES</h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 max-w-7xl mx-auto">
            {bestsellers.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
          <div className="mt-16">
            <Button
              asChild
              className="btn-primary-modern bg-black text-white hover:bg-[#D4AF37] hover:text-black border-none px-12 py-8 rounded-none transition-all duration-500"
            >
              <Link href="/shop" className="tracking-[0.3em] font-luxury-body text-[10px]">
                VOIR TOUTE LA BOUTIQUE
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <Quote className="h-10 w-10 mx-auto text-[#D4AF37] opacity-40 mb-8" />
            <h2 className="text-3xl md:text-5xl font-luxury-headline text-black leading-tight italic">
              "Le parfum est la touche finale de l'élégance, un détail qui souligne l'invisible, un supplément d'âme."
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-12 h-[1px] bg-[#D4AF37] mb-6"></div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-luxury-body text-black">DubaiNegoce</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <GoogleReviewsCta />
        </div>
      </section>

      {/* SEO Section - Luxury Refinement */}
      <section className="py-32 bg-white border-t border-black/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-luxury-body">L'Excellence Orientale</span>
              <h2 className="text-3xl md:text-5xl font-luxury-headline text-black leading-tight">
                Authenticité & Prestige <br />
                <span className="text-2xl md:text-3xl italic opacity-60">Le Luxe à Prix Unique 35€</span>
              </h2>
            </div>

            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>

            <div className="prose prose-sm md:prose-base mx-auto font-luxury-body text-black/60 leading-relaxed tracking-wide space-y-6">
              <p>
                Bienvenue chez <strong>DubaiNegoce</strong>, votre équipe de <strong>passionnés par la parfumerie orientale</strong>. Nous sélectionnons avec soin les créations les plus authentiques de Dubaï, pour vous offrir un voyage olfactif unique.
              </p>
              <p className="italic">
                "Notre mission : partager notre passion pour les parfums d'Orient avec une sélection authentique et accessible."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
