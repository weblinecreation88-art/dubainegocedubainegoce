'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

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
    const intervalId = setInterval(next, 6500);
    return () => clearInterval(intervalId);
  }, [images.length, isPaused, next]);

  return (
    <section className="w-full bg-[#111827] border-b-2 border-[#d4a017]">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#182135] border border-[#d4a017]/40 rounded overflow-hidden">
          {/* Texte concis et vérifiable (7/12) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 text-white">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-[#111827] bg-[#d4a017] font-extrabold px-2.5 py-1 rounded-[2px] mb-3">
              Parfumerie Orientale de Dubaï
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold text-white leading-tight mb-3">
              Eaux de Parfum Authentiques •{' '}
              <span className="text-[#d4a017]">Prix Unique 35,00 € TTC</span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base mb-5 leading-relaxed max-w-xl">
              Retrouvez les fragrances phares des maisons <strong>Lattafa</strong>,{' '}
              <strong>Maison Alhambra</strong>, <strong>French Avenue</strong>,{' '}
              <strong>Fragrance World</strong> et <strong>Paris Corner</strong> en flacons neufs scellés sous blister.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                asChild
                size="lg"
                className="bg-[#d4a017] text-[#111827] hover:bg-[#b88911] hover:text-white font-extrabold px-6 h-11 text-xs sm:text-sm rounded-[2px] tracking-wider uppercase"
              >
                <Link href="/shop/all">Parcourir les parfums</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white rounded-[2px] tracking-wider uppercase px-6 h-11 text-xs sm:text-sm"
              >
                <Link href="/trouver-mon-parfum" className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#d4a017]" />
                  <span>Trouver mon parfum</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-white/90 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#d4a017] shrink-0" />
                <span>
                  <strong>Livraison Colissimo offerte</strong> dès 3 parfums (ou 100 €)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#d4a017] shrink-0" />
                <span>
                  <strong>Paiement sécurisé</strong> par Carte Bancaire, PayPal ou Apple Pay
                </span>
              </div>
            </div>
          </div>

          {/* Visuel produit net et compact (5/12) */}
          <div
            className="lg:col-span-5 relative h-[240px] sm:h-[290px] lg:h-[320px] bg-[#fdfaf4] border-t lg:border-t-0 lg:border-l border-[#d4a017]/40"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {images[currentIndex] && (
              <Image
                key={images[currentIndex]}
                src={images[currentIndex]}
                alt={`Sélection de parfums de Dubaï ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                className="object-contain p-4 transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Image précédente"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center bg-[#111827]/70 hover:bg-[#111827] text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Image suivante"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 flex items-center justify-center bg-[#111827]/70 hover:bg-[#111827] text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
