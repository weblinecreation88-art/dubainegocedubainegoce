'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/lib/data';
import { Product } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Rocket,
  Headphones,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionOption {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Pour qui recherchez-vous un parfum ?',
    subtitle: 'Sélectionnez le profil qui portera cette fragrance.',
    options: [
      { id: 'femme', title: 'Pour Femme', subtitle: 'Fragrances féminines, solaires & raffinées', emoji: '👩' },
      { id: 'homme', title: 'Pour Homme', subtitle: 'Fragrances masculines, boisées & affirmées', emoji: '👨' },
      { id: 'mixte', title: 'Unisexe / Mixte', subtitle: 'Créations intemporelles sans frontière de genre', emoji: '✨' },
    ],
  },
  {
    id: 2,
    title: 'Pour quelle occasion principale ?',
    subtitle: 'Définissez le moment de prédilection de votre futur parfum.',
    options: [
      { id: 'quotidien', title: 'Au quotidien / Bureau', subtitle: 'Subtil, élégant, agréable toute la journée', emoji: '💼' },
      { id: 'soiree', title: 'Soirées & Événements', subtitle: 'Sillage puissant, envoûtant et séducteur', emoji: '🌙' },
      { id: 'signature', title: 'Signature polyvalente', subtitle: 'Le parfum idéal en toute saison et tout moment', emoji: '👑' },
    ],
  },
  {
    id: 3,
    title: 'Quelle ambiance olfactive préférez-vous ?',
    subtitle: 'Choisissez les accords qui vous attirent le plus.',
    options: [
      { id: 'gourmand', title: 'Gourmand & Sucré', subtitle: 'Vanille onctueuse, fève tonka, praline & ambre', emoji: '🍬' },
      { id: 'boise', title: 'Boisé & Oud Prestigieux', subtitle: 'Oud oriental, cèdre noble, cuir & épices chaudes', emoji: '🪵' },
      { id: 'floral', title: 'Floral & Envoûtant', subtitle: 'Rose royale, jasmin blanc, musc soyeux', emoji: '🌸' },
      { id: 'frais', title: 'Frais & Hespéridé', subtitle: 'Bergamote vive, agrumes pétillants, thé vert', emoji: '🌊' },
    ],
  },
  {
    id: 4,
    title: 'Quelle est votre priorité absolue ?',
    subtitle: 'Ce qui compte le plus pour vous dans une fragrance.',
    options: [
      { id: 'tenue', title: 'Tenue extrême (8h+)', subtitle: 'Un sillage persistant du matin jusqu’au soir', emoji: '⏳' },
      { id: 'compliments', title: 'Compliments garantis', subtitle: 'Une fragrance qui attire tous les regards', emoji: '💬' },
      { id: 'luxe', title: 'Rapport Qualité / Prix', subtitle: 'L’équivalent d’un parfum de niche à 35€', emoji: '💎' },
    ],
  },
];

export default function TrouverMonParfumPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const allProducts = useMemo(() => getProducts(), []);

  const totalQuestions = QUESTIONS.length;
  const isFinished = currentStep >= totalQuestions;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  // Algorithme de recommandation
  const recommendedProducts = useMemo<Product[]>(() => {
    if (!isFinished) return [];

    const genderFilter = answers[0]; // 'femme' | 'homme' | 'mixte'
    const familyFilter = answers[2]; // 'gourmand' | 'boise' | 'floral' | 'frais'

    const familyKeywords: Record<string, string[]> = {
      gourmand: ['vanille', 'tonka', 'gourmand', 'praline', 'caramel', 'khamrah', 'yara', 'sucre', 'chocolat'],
      boise: ['oud', 'bois', 'cuir', 'toscano', 'ambre', 'cedre', 'leather', 'wood', 'immortal'],
      floral: ['rose', 'floral', 'fleur', 'jasmin', 'musc', 'baroque', 'mayar', 'bouquet'],
      frais: ['frais', 'bergamote', 'agrumes', 'citron', 'neroli', 'vert', 'jean lowe', 'aquatique', 'marine'],
    };

    const targetKeywords = familyFilter ? familyKeywords[familyFilter] || [] : [];

    const scored = allProducts.map((product) => {
      let score = 0;

      // 1. Score de genre
      if (genderFilter === 'mixte') {
        score += 2;
      } else if (product.gender === genderFilter) {
        score += 3;
      } else if (product.gender === 'mixte') {
        score += 2;
      }

      // 2. Score de famille olfactive
      const searchText = `${product.name} ${product.shortDescription || ''} ${product.family || ''} ${(product.tags || []).join(' ')}`.toLowerCase();

      targetKeywords.forEach((kw) => {
        if (searchText.includes(kw)) score += 3;
      });

      // 3. Bonus bestsellers et nouveautés
      if (product.isBestseller) score += 2;
      if (product.rating && product.rating >= 4.7) score += 1;

      return { product, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((item) => item.product);
  }, [allProducts, answers, isFinished]);

  return (
    <main className="flex-1 min-h-screen bg-[#080d17] text-white py-8 md:py-16 relative overflow-hidden">
      {/* Halos de lumière ambiants */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#c9a96e]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c9a96e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-white/50 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-[#c9a96e] font-medium">Diagnostic Olfactif</span>
        </nav>

        {/* En-tête principal */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/25 text-[#c9a96e] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Personnalisé en 30s</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight mb-3">
            Quel parfum est fait pour vous&nbsp;?
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            Trouvez votre signature olfactive idéale parmi plus de 140 trésors de Dubaï à 35€.
          </p>
        </div>

        {/* Conteneur Quiz ou Résultats */}
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-[#131d2e]/95 via-[#0e1726]/95 to-[#0b121e]/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-[#c9a96e]/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden min-h-[480px] flex flex-col relative">
          {/* Ligne dorée supérieure */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

          {!isFinished ? (
            <>
              {/* Barre de progression */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      title="Question précédente"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a96e]">
                    Étape 0{currentStep + 1} / 0{totalQuestions}
                  </span>
                </div>

                <div className="flex gap-2">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i <= currentStep
                          ? 'w-7 sm:w-10 bg-[#c9a96e] shadow-[0_0_8px_rgba(201,169,110,0.6)]'
                          : 'w-3 sm:w-4 bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Contenu de la question active */}
              <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-serif text-white mb-2">
                      {QUESTIONS[currentStep].title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60 mb-6">
                      {QUESTIONS[currentStep].subtitle}
                    </p>

                    <div className="space-y-3">
                      {QUESTIONS[currentStep].options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelectOption(option.id)}
                          className="w-full text-left p-4 sm:p-5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c9a96e]/60 transition-all duration-300 flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-3.5 sm:gap-4">
                            <span className="text-2xl sm:text-3xl p-2 rounded-lg bg-white/5 group-hover:bg-[#c9a96e]/10 transition-colors">
                              {option.emoji}
                            </span>
                            <div>
                              <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#c9a96e] transition-colors">
                                {option.title}
                              </div>
                              <div className="text-xs text-white/60 leading-relaxed mt-0.5">
                                {option.subtitle}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Écran de résultats */
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/40 flex items-center justify-center mx-auto mb-3 text-2xl shadow-[0_0_20px_rgba(201,169,110,0.3)]">
                    ✨
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
                    Vos 3 correspondances idéales
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70">
                    Voici les fragrances sélectionnées pour votre profil olfactif.
                  </p>
                </div>

                {/* Liste des parfums recommandés */}
                <div className="space-y-4 mb-8">
                  {recommendedProducts.map((p, idx) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#c9a96e]/50 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/10">
                          {p.images?.[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              ✨
                            </div>
                          )}
                          <span className="absolute top-1 left-1 bg-[#c9a96e] text-[#0f1726] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs text-[#c9a96e] font-semibold uppercase tracking-wider">
                            {p.brand?.name || 'Dubaï'}
                          </div>
                          <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                            {p.name}
                          </h3>
                          {p.inspiredBy && (
                            <p className="text-[11px] text-white/50 truncate">
                              Inspiré de : <span className="text-white/80">{p.inspiredBy}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-[#c9a96e]">
                              {p.price.toFixed(2)} €
                            </span>
                            <span className="text-[10px] text-white/40">· Flacon {p.volumeMl || 100}ml</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        asChild
                        size="sm"
                        className="bg-[#c9a96e] text-[#0f1726] hover:bg-[#b8944e] font-semibold rounded-full px-4 text-xs shrink-0 tracking-wider uppercase"
                      >
                        <Link href={`/parfum/${p.slug}`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Bannière Code Promo */}
                <div className="p-4 rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-center mb-6">
                  <div className="text-xs text-[#c9a96e] font-bold uppercase tracking-wider mb-1">
                    🎉 Offre Privilège Immédiate
                  </div>
                  <div className="text-sm text-white/90">
                    Bénéficiez de <strong>-5% supplémentaires</strong> avec le code :
                    <span className="ml-2 font-mono font-bold text-[#c9a96e] bg-black/40 px-2.5 py-1 rounded border border-[#c9a96e]/40">
                      COMEBACK5
                    </span>
                  </div>
                </div>

                {/* Bouton recommencer */}
                <div className="text-center">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#c9a96e] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recommencer le diagnostic</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* 4 Avantages Réassurance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#c9a96e] shrink-0" />
            <div>
              <div className="font-semibold text-white">100% Authentique</div>
              <div className="text-white/50 text-[11px]">Import direct de Dubaï</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#c9a96e] shrink-0" />
            <div>
              <div className="font-semibold text-white">Prix Fixe 35€</div>
              <div className="text-white/50 text-[11px]">Le luxe accessible</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Rocket className="w-5 h-5 text-[#c9a96e] shrink-0" />
            <div>
              <div className="font-semibold text-white">Expédition 48h</div>
              <div className="text-white/50 text-[11px]">Colissimo &amp; Mondial Relay</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-[#c9a96e] shrink-0" />
            <div>
              <div className="font-semibold text-white">Service Client</div>
              <div className="text-white/50 text-[11px]">Réponse 7j/7 en France</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
