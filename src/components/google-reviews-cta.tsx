'use client';

import { Button } from '@/components/ui/button';
import { Star, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function GoogleReviewsCta() {
  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-[#c58a3d]/20 shadow-2xl">
      {/* Particules dorées */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-[#c58a3d] rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-[#b67a2d] rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-[#c58a3d] rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-20 w-1 h-1 bg-[#c58a3d] rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-10 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Effet de lueur dorée */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#c58a3d]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#b67a2d]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-10 md:p-16">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* En-tête avec logo Google */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Image
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                alt="Google"
                width={80}
                height={26}
                className="h-6 w-auto"
              />
              <span className="text-white/80 text-sm font-medium">Reviews</span>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-white">
              Votre avis <span className="text-[#c58a3d]">compte</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Partagez votre expérience et aidez d'autres passionnés à découvrir nos trésors olfactifs orientaux.
            </p>
          </motion.div>

          {/* Étoiles dorées */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-8 h-8 md:w-10 md:h-10 fill-[#c58a3d] text-[#c58a3d] drop-shadow-[0_0_8px_rgba(197,138,61,0.5)]"
              />
            ))}
          </motion.div>

          {/* Bouton CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#c58a3d] to-[#b67a2d] hover:from-[#b67a2d] hover:to-[#a56a1d] text-white text-lg px-10 py-7 h-auto rounded-full shadow-lg shadow-[#c58a3d]/30 hover:shadow-[#c58a3d]/50 transition-all duration-300"
            >
              <a
                href="https://g.page/r/CYfNDXizM9KSEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                Laisser un avis
                <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>

          {/* Texte de remerciement */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
          >
            Merci de faire partie de notre communauté
          </motion.p>
        </div>
      </div>
    </div>
  );
}
