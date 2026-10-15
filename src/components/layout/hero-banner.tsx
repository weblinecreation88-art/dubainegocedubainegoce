'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, ShieldCheck } from "lucide-react";

interface HeroBannerProps {
  images: string[];
}

export function HeroBanner({ images }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [images.length, isPaused, next]);

  return (
    <section className="w-full bg-[#0f1726] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px] lg:min-h-[580px] items-stretch">

          {/* COLONNE GAUCHE — Texte (Rendu immédiat sans animation bloquante pour FCP optimal) */}
          <div className="flex flex-col justify-center py-12 lg:py-16 pr-0 lg:pr-12 order-2 lg:order-1">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#c9a96e] font-medium mb-4 block">
              IMPORTÉ DIRECTEMENT DE DUBAÏ
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-headline font-bold text-white leading-tight mb-4">
              Votre parfum oriental<br />
              <span className="text-[#c9a96e]">authentique à 35 €</span>
            </h1>

            <p className="text-white/70 text-base lg:text-lg mb-8 leading-relaxed max-w-md">
              Lattafa · Maison Alhambra · Fragrance World · French Avenue
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-[#c9a96e] text-[#0f1726] hover:bg-[#b8944e] font-bold px-10 py-7 text-sm sm:text-base rounded-none tracking-widest uppercase shadow-xl shadow-[#c9a96e]/20 w-full sm:w-auto">
                  <Link href="/trouver-mon-parfum">Trouver mon parfum</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white rounded-none tracking-wide py-7 w-full sm:w-auto">
                  <Link href="/shop/all">Découvrir la collection</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-white bg-white/5 p-4 rounded border border-white/10">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#c9a96e]" /> Paiement 100% Sécurisé</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4 text-[#c9a96e]" /> Parfums Authentiques</span>
              <span className="flex items-center gap-2">
                <span className="flex text-[#00b67a]">
                  <Star className="h-4 w-4 fill-current" />
                </span>
                Excellent Trustpilot
              </span>
            </div>
          </div>

          {/* COLONNE DROITE — Slider optimisé CSS pur (sans framer-motion, image LCP visible au premier octet) */}
          <div
            className="relative order-1 lg:order-2 h-[300px] sm:h-[380px] lg:h-full lg:min-h-[580px] overflow-hidden border-b lg:border-b-0 lg:border-l border-[#c9a96e]/60"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full h-full">
              {images.map((img, i) => (
                <div
                  key={img || i}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Parfum oriental ${i + 1} - Dubai Negoce`}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-[#0f1726]/10" />
                </div>
              ))}
            </div>

            {/* Flèches */}
            {images.length > 1 && (
              <>
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
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
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
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
