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
            className="relative w-full overflow-hidden bg-black md:h-screen md:min-h-[600px]"
            style={{ height: "clamp(500px, 100vh, 100vh)" }}
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
                            className="object-contain opacity-90"
                            sizes="100vw"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4 py-8">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-2 sm:mb-4 tracking-wider drop-shadow-2xl"
                >
                    L'ESSENCE DE DUBAÏ
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs sm:text-sm md:text-lg text-gray-200 mb-4 sm:mb-10 tracking-[0.15em] sm:tracking-[0.3em] uppercase font-light drop-shadow-lg max-w-md sm:max-w-none"
                >
                    Collection Exclusive de Parfums Orientaux
                </motion.p>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button asChild size="lg" className="bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-white rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-all duration-300">
                        <Link href="/shop/all">
                            Découvrir la Collection
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
