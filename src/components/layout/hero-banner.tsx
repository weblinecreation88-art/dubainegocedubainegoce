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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px] lg:min-h-[580px] items-stretch">

          {/* COLONNE GAUCHE — Texte */}
          <div className="flex flex-col justify-center py-12 lg:py-16 pr-0 lg:pr-12 order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-[11px] tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-4"
            >
              IMPORTÉ DIRECTEMENT DE DUBAÏ
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-headline font-bold text-white leading-tight mb-4"
            >
              Votre parfum oriental<br />
              <span className="text-[#c9a96e]">authentique à 35 €</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-white/70 text-base lg:text-lg mb-8 leading-relaxed max-w-md"
            >
              Lattafa · Maison Alhambra · Fragrance World · French Avenue
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-[#c9a96e] text-[#0f1726] hover:bg-[#b8944e] font-bold px-10 py-7 text-sm sm:text-base rounded-none tracking-widest uppercase shadow-xl shadow-[#c9a96e]/20 w-full sm:w-auto">
                  <Link href="/trouver-mon-parfum">Trouver mon parfum</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-none tracking-wide py-7 w-full sm:w-auto">
                  <Link href="/shop/all">Découvrir la collection</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-white bg-white/5 p-4 rounded border border-white/10"
            >
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#c9a96e]" /> Paiement 100% Sécurisé</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-[#c9a96e]" /> Parfums Authentiques</span>
              <span className="flex items-center gap-2">
                <span className="flex text-[#00b67a]">
                  <Star className="h-4 w-4 fill-current" />
                </span>
                Excellent Trustpilot
              </span>
            </motion.div>
          </div>

          {/* COLONNE DROITE — Slider */}
          <div
            className="relative order-1 lg:order-2 h-[300px] sm:h-[380px] lg:h-full lg:min-h-[580px] overflow-hidden border-b lg:border-b-0 lg:border-l border-[#c9a96e]/60"
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
                {/* Aucune transition - séparation nette */}
                {/* Overlay léger */}
                <div className="absolute inset-0 bg-[#0f1726]/10" />
              </motion.div>
            </AnimatePresence>

            {/* Flèches */}
            <button
              onClick={prev}
              aria-label="Image précédente"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-colors rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Image suivante"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/40 hover:bg-black/70 text-white/80 hover:text-white transition-colors rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Image ${i + 1}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 focus:outline-none"
                >
                  <span
                    className={`rounded-full transition-colors duration-300 ${
                      i === currentIndex
                        ? "bg-[#c9a96e] w-5 h-2"
                        : "bg-white/50 hover:bg-white/80 w-2 h-2"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
