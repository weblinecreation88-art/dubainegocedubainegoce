'use client';

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroBannerProps {
    videos: string[];
}

export function HeroBanner({ videos }: HeroBannerProps) {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        if (videos.length === 0) return;
        const interval = setInterval(() => {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [videos.length]);

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black">
            {/* Full width video background */}
            <div className="absolute inset-0 w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.video
                        key={currentVideoIndex}
                        src={videos[currentVideoIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                </AnimatePresence>
            </div>

            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center px-4">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-4 tracking-wider drop-shadow-2xl"
                >
                    L'ESSENCE DE DUBAÏ
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-lg text-gray-200 mb-10 tracking-[0.3em] uppercase font-light drop-shadow-lg"
                >
                    Collection Exclusive de Parfums Orientaux
                </motion.p>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button asChild size="lg" className="bg-white text-black hover:bg-black hover:text-white border border-transparent hover:border-white rounded-none px-12 py-7 text-sm tracking-[0.2em] uppercase transition-all duration-300">
                        <Link href="/shop">
                            Découvrir la Collection
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
