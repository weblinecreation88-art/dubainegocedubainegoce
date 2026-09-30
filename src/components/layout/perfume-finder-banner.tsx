'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Clock, CheckCircle2, Shield } from 'lucide-react';

export function PerfumeFinderBanner() {
  const scentFamilies = [
    {
      emoji: '🍬',
      name: 'Gourmand & Sucré',
      desc: 'Vanille, praline, caramel chaud',
      popular: 'Ex : Khamrah, Yara',
    },
    {
      emoji: '🪵',
      name: 'Boisé & Oud Prestigieux',
      desc: 'Cèdre, ambre précieux, cuir',
      popular: 'Ex : Toscano, Woody Oud',
    },
    {
      emoji: '🌸',
      name: 'Floral & Envoûtant',
      desc: 'Rose de Damas, jasmin, musc blanc',
      popular: 'Ex : Baroque Rouge, Mayar',
    },
    {
      emoji: '🌊',
      name: 'Frais & Hespéridé',
      desc: 'Bergamote, agrumes, thé vert',
      popular: 'Ex : Jean Lowe, Porto Neroli',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#0a0f1d] via-[#0f1726] to-[#0a0f1d] relative overflow-hidden border-y border-[#c9a96e]/20">
      {/* Halo lumineux d'ambiance or dubaï */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[350px] bg-[#c9a96e]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-[#dfc48c]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Trame géométrique subtile */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#c9a96e 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#131d2e]/95 via-[#0e1726]/95 to-[#0b121e]/98 border border-[#c9a96e]/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-10 md:p-14 text-center overflow-hidden"
        >
          {/* Ligne lumineuse dorée supérieure */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-[2px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

          {/* Badge élégant */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-[#c9a96e] text-xs font-semibold uppercase tracking-[0.25em] mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a96e] animate-pulse" />
            <span>Diagnostic Olfactif Personnalisé</span>
          </div>

          {/* Titre sans retour à la ligne orphelin sur le point d'interrogation */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight sm:leading-snug mb-4 max-w-3xl mx-auto">
            Vous ne savez pas quel parfum choisir&nbsp;?
          </h2>

          {/* Sous-titre */}
          <p className="text-sm sm:text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed mb-8">
            Répondez à 4 questions simples et laissez notre recommandation sur mesure vous révéler les fragrances Dubaï idéales pour votre style.
          </p>

          {/* Grille des 4 univers olfactifs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
            {scentFamilies.map((fam, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#c9a96e]/40 transition-all duration-300 group"
              >
                <div className="text-xl sm:text-2xl mb-2">{fam.emoji}</div>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 group-hover:text-[#c9a96e] transition-colors">
                  {fam.name}
                </h4>
                <p className="text-[11px] text-white/60 leading-tight mb-2">
                  {fam.desc}
                </p>
                <span className="text-[10px] text-[#c9a96e]/85 font-medium block">
                  {fam.popular}
                </span>
              </div>
            ))}
          </div>

          {/* Bouton CTA & Micro-réassurances */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/trouver-mon-parfum"
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#c9a96e] via-[#dfc48c] to-[#c9a96e] text-[#0f1726] font-bold text-xs sm:text-sm md:text-base uppercase tracking-[0.18em] rounded-full shadow-[0_10px_30px_rgba(201,169,110,0.35)] hover:shadow-[0_15px_45px_rgba(201,169,110,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <span>Trouver mon parfum idéal</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c9a96e]" />
                Temps estimé : <strong className="text-white/90">30 secondes</strong>
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a96e]" />
                100% gratuit &amp; instantané
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#c9a96e]" />
                Parmi +140 équivalents à 35€
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
