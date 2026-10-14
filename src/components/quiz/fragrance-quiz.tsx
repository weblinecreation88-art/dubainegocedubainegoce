'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/data';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';

type Step = 0 | 1 | 2 | 3 | 4;

interface Answers {
  gender: string;
  family: string;
  intensity: string;
  occasion: string;
}

export function FragranceQuiz() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>({
    gender: '',
    family: '',
    intensity: '',
    occasion: '',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<{ product: Product, score: number }[]>([]);

  const handleSelect = (key: keyof Answers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => {
      if (step < 3) {
        setStep((step + 1) as Step);
      } else {
        calculateResults({ ...answers, [key]: value });
      }
    }, 400);
  };

  const calculateResults = (finalAnswers: Answers) => {
    setIsCalculating(true);
    setStep(4);
    
    setTimeout(() => {
      const allProducts = getProducts();
      
      const scoredProducts = allProducts.map(product => {
        let score = 0;
        
        // Match gender
        if (product.gender === finalAnswers.gender || product.gender === 'mixte' || finalAnswers.gender === 'mixte') {
          score += 40; 
        }
        
        // Match family
        if (product.family.toLowerCase().includes(finalAnswers.family.toLowerCase())) {
          score += 30;
        }
        
        // Match intensity
        if (product.intensity?.toLowerCase() === finalAnswers.intensity.toLowerCase()) {
          score += 15;
        }
        
        // Match occasion
        if (product.occasion?.some(o => o.toLowerCase() === finalAnswers.occasion.toLowerCase())) {
          score += 15;
        }

        // Add some noise if perfectly tied
        score += Math.random() * 2;

        return { product, score };
      });

      // Sort by score desc, then pick top 3
      const top3 = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
        
      setResults(top3);
      setIsCalculating(false);
    }, 1500); // Fake calculating delay for UX
  };

  const resetQuiz = () => {
    setAnswers({ gender: '', family: '', intensity: '', occasion: '' });
    setStep(0);
    setResults([]);
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const getBtnClass = (isSelected: boolean) => 
    `p-5 rounded-xl border flex items-center gap-4 text-left transition-all duration-300 ${isSelected ? 'border-[#c9a96e] bg-[#c9a96e]/5 shadow-[0_0_20px_rgba(201,169,110,0.15)] ring-1 ring-[#c9a96e]/50' : 'border-gray-200 hover:border-[#c9a96e]/50 hover:shadow-lg hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-white/5'}`;

  const getGridBtnClass = (isSelected: boolean) => 
    `p-6 rounded-xl border flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${isSelected ? 'border-[#c9a96e] bg-[#c9a96e]/5 shadow-[0_0_20px_rgba(201,169,110,0.15)] ring-1 ring-[#c9a96e]/50' : 'border-gray-200 hover:border-[#c9a96e]/50 hover:shadow-lg hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-white/5'}`;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl dark:bg-[#0f1726]/95 rounded-2xl shadow-2xl overflow-hidden border border-gray-100/50 dark:border-white/10 min-h-[520px] flex flex-col relative">
      
      {/* Header progress */}
      {step < 4 && (
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800/50">
          <div className="flex items-center gap-4">
            {step > 0 && (
              <button onClick={() => setStep((step - 1) as Step)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </button>
            )}
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
              0{step + 1} / 04
            </span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-[#c9a96e] shadow-[0_0_8px_rgba(201,169,110,0.5)]' : 'w-4 bg-gray-200 dark:bg-gray-800'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div key="step0" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">Pour qui recherchez-vous un parfum ?</h2>
                <p className="text-muted-foreground">Sélectionnez le destinataire de cette fragrance.</p>
              </div>
              <div className="grid gap-4">
                <button onClick={() => handleSelect('gender', 'femme')} className={getBtnClass(answers.gender === 'femme')}>
                  <span className="text-3xl md:text-4xl">👩</span>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-lg text-gray-900 dark:text-white">Pour Femme</h3>
                    <p className="text-sm text-muted-foreground">Fragrances féminines & élégantes</p>
                  </div>
                  {answers.gender === 'femme' && <Check className="text-[#c9a96e] w-6 h-6" />}
                </button>
                <button onClick={() => handleSelect('gender', 'homme')} className={getBtnClass(answers.gender === 'homme')}>
                  <span className="text-3xl md:text-4xl">👨</span>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-lg text-gray-900 dark:text-white">Pour Homme</h3>
                    <p className="text-sm text-muted-foreground">Fragrances masculines & charismatiques</p>
                  </div>
                  {answers.gender === 'homme' && <Check className="text-[#c9a96e] w-6 h-6" />}
                </button>
                <button onClick={() => handleSelect('gender', 'mixte')} className={getBtnClass(answers.gender === 'mixte')}>
                  <span className="text-3xl md:text-4xl">✨</span>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-lg text-gray-900 dark:text-white">Pour Moi (Mixte)</h3>
                    <p className="text-sm text-muted-foreground">Créations unisexes & intemporelles</p>
                  </div>
                  {answers.gender === 'mixte' && <Check className="text-[#c9a96e] w-6 h-6" />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">Quelle famille olfactive ?</h2>
                <p className="text-muted-foreground">Laissez-vous guider par vos notes préférées.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'boisé', label: 'Boisé', icon: '🪵' },
                  { id: 'oriental', label: 'Oriental', icon: '🌙' },
                  { id: 'gourmand', label: 'Gourmand', icon: '🍦' },
                  { id: 'floral', label: 'Floral', icon: '🌹' },
                  { id: 'fruité', label: 'Fruité', icon: '🍊' },
                  { id: 'ambré', label: 'Ambré', icon: '🖤' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect('family', item.id)} 
                    className={getGridBtnClass(answers.family === item.id)}
                  >
                    <span className="text-4xl mb-1">{item.icon}</span>
                    <h3 className="font-headline font-bold text-gray-900 dark:text-white">{item.label}</h3>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">Quelle intensité ?</h2>
                <p className="text-muted-foreground">Du sillage discret à l'empreinte mémorable.</p>
              </div>
              <div className="grid gap-4">
                {[
                  { id: 'légère', label: 'Légère', desc: 'Subtil et discret, parfait pour une présence douce.' },
                  { id: 'moyenne', label: 'Moyenne', desc: 'Équilibré, présent tout au long de la journée sans entêter.' },
                  { id: 'forte', label: 'Forte', desc: 'Puissant, laisse un sillage mémorable (Oud, Cuir...).' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect('intensity', item.id)} 
                    className={getBtnClass(answers.intensity === item.id)}
                  >
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-lg text-gray-900 dark:text-white">{item.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-2">Pour quelle occasion ?</h2>
                <p className="text-muted-foreground">Le parfum idéal pour sublimer vos moments.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'tous les jours', label: 'Tous les jours', icon: '☀️' },
                  { id: 'travail', label: 'Travail', icon: '💼' },
                  { id: 'soirée', label: 'Soirée', icon: '🥂' },
                  { id: 'rendez-vous', label: 'Rendez-vous', icon: '❤️' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => handleSelect('occasion', item.id)} 
                    className={getGridBtnClass(answers.occasion === item.id)}
                  >
                    <span className="text-4xl mb-1">{item.icon}</span>
                    <h3 className="font-headline font-bold text-gray-900 dark:text-white">{item.label}</h3>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center w-full">
              {isCalculating ? (
                <div className="py-24 flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#c9a96e]/20 blur-xl rounded-full animate-pulse" />
                    <RefreshCw className="w-16 h-16 text-[#c9a96e] animate-spin relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-gray-900 dark:text-white mb-2">Analyse olfactive en cours...</h2>
                    <p className="text-muted-foreground">Recherche dans notre bibliothèque de fragrances premium</p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-10 pb-4">
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10">
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-gray-900 dark:text-white mb-3">Votre profil olfactif</h2>
                    <p className="text-muted-foreground">
                      Vous aimez les fragrances <strong className="text-foreground capitalize">{answers.family}s</strong>, 
                      d'intensité <strong className="text-foreground capitalize">{answers.intensity}</strong> pour <strong className="text-foreground capitalize">{answers.occasion}</strong>.
                    </p>
                  </div>
                  
                  <div className="w-full">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Notre Sélection</h3>
                      <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                      {results.map((res, i) => {
                        const matchPercentage = Math.min(100, Math.round(res.score + 5)); 
                        return (
                          <div key={res.product.id} className="relative group">
                            {i === 0 && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#c9a96e] to-[#b8944e] text-[#0f1726] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#c9a96e]/30">
                                Match Parfait
                              </div>
                            )}
                            <ProductCard product={res.product} />
                            <div className="absolute -top-3 -right-3 z-20 bg-white dark:bg-black border-2 border-[#c9a96e] text-[#c9a96e] font-bold text-xs px-2.5 py-1 rounded-full shadow-lg">
                              {matchPercentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 border-t mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg" className="bg-[#c9a96e] text-[#0f1726] hover:bg-[#b8944e] font-bold px-8 rounded-full tracking-widest uppercase w-full sm:w-auto">
                      <a href="/shop/all">Toute la collection</a>
                    </Button>
                    <Button onClick={resetQuiz} variant="ghost" size="lg" className="rounded-full text-muted-foreground hover:text-foreground w-full sm:w-auto">
                      Refaire le test
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}
