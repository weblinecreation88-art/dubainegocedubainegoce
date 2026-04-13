'use client';

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        const interval = setInterval(next, 3000);
        return () => clearInterval(interval);
    }, [images.length, isPaused, next]);

    return (
        <section
            className="relative w-full overflow-hidden bg-black h-[55vh] md:h-[75vh] md:min-h-[500px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Image background */}
            <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`Hero image ${currentIndex + 1}`}
                            fill
                            priority={currentIndex === 0}
                            className="object-cover opacity-90"
                            sizes="100vw"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Overlay pour lisibilité */}
            <div className="absolute inset-0 bg-black/50 z-[1]" />

            {/* Content */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 py-8">
                <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-[10px] sm:text-xs text-white/70 mb-2 sm:mb-3 tracking-[0.3em] uppercase font-light"
                >
                    Le spécialiste des dupes de luxe de Dubaï
                </motion.p>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-2 sm:mb-4 tracking-wide drop-shadow-2xl leading-tight max-w-4xl"
                >
                    Parfums Inspirés des<br className="hidden sm:block" /> Grandes Marques
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-4 sm:mb-6 drop-shadow-lg"
                >
                    Tous à <span className="text-yellow-400">35€</span> · Livrés en 48h
                </motion.p>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-10 text-[10px] sm:text-xs text-white/80 tracking-widest uppercase"
                >
                    <span>✔ 100% Authentique</span>
                    <span>✔ Prix unique garanti</span>
                    <span>✔ Paiement sécurisé</span>
                </motion.div>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Button asChild size="lg" className="bg-white text-black hover:bg-yellow-400 hover:text-black border border-transparent rounded-none px-6 py-3 md:px-12 md:py-7 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase transition-all duration-300 font-semibold">
                        <Link href="/shop/all?sort=bestsellers">
                            Voir les Best-Sellers
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/60 hover:bg-white/10 rounded-none px-6 py-3 md:px-10 md:py-7 text-xs md:text-sm tracking-[0.15em] uppercase transition-all duration-300">
                        <Link href="/shop/all">
                            Toute la Collection
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Prev / Next arrows */}
            <button
                onClick={prev}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-colors"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={next}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-colors"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        aria-label={`Aller à l'image ${i + 1}`}
                        className={`rounded-full transition-all duration-300 p-2 ${
                            i === currentIndex
                                ? "bg-white w-4 h-4"
                                : "bg-white/40 hover:bg-white/70 w-3 h-3"
                        }`}
                        aria-current={i === currentIndex ? "true" : "false"}
                    />
                ))}
            </div>
        </section>
    );
}
