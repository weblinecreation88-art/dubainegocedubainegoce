'use client';

import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function GoogleReviewsCta() {
  return (
    <div className="relative overflow-hidden bg-white py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center justify-center gap-12 text-center">

          {/* Header - Minimalist */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Image
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                alt="Google"
                width={70}
                height={24}
                className="opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] font-luxury-body text-black/40">Reviews</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-luxury-headline text-black tracking-tight leading-tight">
              L'Expérience DubaiNegoce
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>
          </motion.div>

          {/* Rating & Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]"
                  />
                ))}
              </div>
              <p className="text-2xl font-luxury-headline text-black/80 italic">
                "Une qualité exceptionnelle et un service irréprochable."
              </p>
            </div>

            <p className="text-sm font-luxury-body text-black/60 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Rejoignez plus de 1000 passionnés de parfumerie orientale qui nous font confiance pour leur collection.
            </p>
          </motion.div>

          {/* CTA Button - Luxury Style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              className="rounded-none border-black hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white px-10 py-6 h-auto tracking-[0.4em] font-luxury-body text-[10px] bg-transparent text-black border transition-all duration-500"
            >
              <a
                href="https://g.page/r/CYfNDXizM9KSEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                PARTAGER VOTRE AVIS
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </Button>
          </motion.div>

          <Quote className="h-6 w-6 text-[#D4AF37] opacity-20" />
        </div>
      </div>
    </div>
  );
}
