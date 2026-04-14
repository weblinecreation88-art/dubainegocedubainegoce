'use client';

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Truck, Star, ShieldCheck } from "lucide-react";

interface HeroBannerProps {
  images: string[];
}

export function HeroBanner({ images }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length === 0 || isPaused) return;
    const interval = setInterval(next, 3500);
    return () => clearInterval(interval);
  }, [images.length, isPaused, next]);

  return (
    <section className="w-full bg-[#0f1726] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] lg:min-h-[600px]">

        {/* COLONNE GAUCHE — Texte */}
        <div className="flex flex-col justify-center py-12 lg:py-16 px-6 sm:px-10 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-12 order-2 lg:order-1">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[11px] tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-4"
          >
            Importé directement de Dubaï
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-serif text-white leading-tight mb-6"
          >
            Des fragrances<br />
            d&apos;exception qui<br />
            <span className="italic text-[#c9a96e]">rivalisent avec</span><br />
            les grandes maisons
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <Button asChild size="lg" className="bg-[#c9a96e] text-[#0f1726] hover:bg-[#b8944e] font-semibold px-8 rounded-none tracking-wide">
              <Link href="/shop/all?sort=bestsellers">Voir les Best-Sellers &rsaquo;</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-none tracking-wide">
              <Link href="/shop">Toute la Collection &rsaquo;</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-5 text-xs text-white/50 border-t border-white/10 pt-6"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#c9a96e]" /> 100% Authentique</span>
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[#c9a96e]" /> Importé de Dubaï</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[#c9a96e]" /> Livraison 48h</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-4 text-xs text-[#c9a96e] font-semibold tracking-widest uppercase"
          >
            Prix unique : <span className="text-white">35€</span>
          </motion.p>
        </div>

        {/* COLONNE DROITE — Image full bleed */}
        <div
          className="relative order-1 lg:order-2 h-[320px] sm:h-[420px] lg:h-full lg:min-h-[600px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={images[currentIndex]}
                alt={`Parfum ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dégradé gauche pour fondre avec le navy */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0f1726] to-transparent z-10" />
              <div className="absolute inset-0 bg-[#0f1726]/5" />
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} aria-label="Image précédente" className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} aria-label="Image suivante" className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white/70 hover:text-white transition-all rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} aria-label={`Image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === currentIndex ? "bg-[#c9a96e] w-5 h-1.5" : "bg-white/40 hover:bg-white/60 w-1.5 h-1.5"}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
