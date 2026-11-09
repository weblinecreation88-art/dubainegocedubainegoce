'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroBannerProps {
  images: { src: string; caption: string }[];
}

export function HeroBanner({ images }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Les visuels suivants ne sont montés qu'après le premier rendu : le premier reste
  // prioritaire pour le LCP, les autres sont déjà chargés quand le fondu les affiche.
  const [preloadRest, setPreloadRest] = useState(false);

  const goTo = useCallback((index: number) => setCurrentIndex(index), []);

  useEffect(() => {
    // Attendre la fin du chargement de la page pour ne pas ralentir le premier visuel.
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => setPreloadRest(true), 2500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', schedule);
    };
  }, []);

  useEffect(() => {
    if (!preloadRest || images.length <= 1 || isPaused) return;
    const intervalId = setInterval(() => setCurrentIndex((prev) => (prev + 1) % images.length), 6500);
    return () => clearInterval(intervalId);
  }, [images.length, isPaused, preloadRest]);

  return (
    <section className="storefront-hero w-full bg-[#f3ede3]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Texte éditorial */}
        <div className="order-1 flex flex-col justify-center px-5 sm:px-10 lg:px-16 xl:px-24 py-9 sm:py-14 lg:py-20">
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#6f6559] mb-4 sm:mb-6">
            Parfumerie orientale de Dubaï
          </p>

          <h1 className="font-headline font-normal text-[40px] leading-[1.05] sm:text-6xl lg:text-[64px] xl:text-7xl text-[#1d1a16] mb-5 sm:mb-7">
            Les maisons de Dubaï,
            <br />
            <em className="italic">à prix juste.</em>
          </h1>

          <p className="text-[#4a443c] text-sm sm:text-base leading-relaxed max-w-md mb-7 sm:mb-9">
            Lattafa, Maison Alhambra, French Avenue, Fragrance World : des eaux de parfum authentiques,
            en flacons neufs scellés, au prix unique de <strong className="font-medium text-[#1d1a16]">35 €</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/shop/all"
              className="inline-flex items-center justify-center bg-[#b8955f] hover:bg-[#a8834f] text-[#1d1a16] px-8 h-12 text-xs font-medium uppercase tracking-[0.14em] transition-colors"
            >
              Découvrir la collection
            </Link>
            <Link
              href="/trouver-mon-parfum"
              className="text-xs uppercase tracking-[0.14em] text-[#1d1a16] border-b border-[#1d1a16]/40 hover:border-[#1d1a16] pb-1 transition-colors"
            >
              Trouver mon parfum
            </Link>
          </div>

          <p className="hidden sm:block mt-10 lg:mt-14 text-[11px] tracking-[0.18em] uppercase text-[#6f6559]">
            Livraison Mondial Relay dès 4,10 € · Offerte dès 2 parfums · Paiement sécurisé
          </p>
        </div>

        {/* Visuel en fondu */}
        <div
          className="order-2 relative h-[300px] sm:h-[420px] lg:h-auto lg:min-h-[560px] overflow-hidden bg-[#ebe3d6]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {images.map((image, index) =>
            index === 0 || preloadRest ? (
              <Image
                key={image.src}
                src={image.src}
                alt={image.caption}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : 'eager'}
                className={`object-cover object-center transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : null
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 sm:px-8 pb-4 sm:pb-6 pt-16 bg-gradient-to-t from-black/35 to-transparent">
            <p className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/90">
              {images[currentIndex]?.caption}
            </p>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Afficher le visuel ${index + 1}`}
                    aria-current={index === currentIndex}
                    className={`h-[3px] transition-all ${
                      index === currentIndex ? 'w-7 bg-white' : 'w-3.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
