'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { runRecommendPerfumes } from '@/app/actions';
import { getProductBySlug } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { motion, AnimatePresence } from 'framer-motion';

type RecommendedProduct = {
  product: Product;
  reason: string;
};

type Step = {
  id: string;
  question: string;
  options: { label: string; value: string; icon?: string }[];
};

const STEPS: Step[] = [
  {
    id: 'gender',
    question: "Pour qui cherchez-vous ce parfum ?",
    options: [
      { label: "Pour Femme", value: "femme", icon: "👩" },
      { label: "Pour Homme", value: "homme", icon: "👨" },
      { label: "Unisexe / Mixte", value: "mixte", icon: "✨" },
    ]
  },
  {
    id: 'family',
    question: "Quelle famille olfactive préférez-vous ?",
    options: [
      { label: "Orientale & Épicée", value: "oriental et épicé", icon: "🐪" },
      { label: "Boisée & Oud", value: "boisé avec de l'oud", icon: "🪵" },
      { label: "Florale", value: "floral", icon: "🌸" },
      { label: "Fruitée", value: "fruité", icon: "🍎" },
      { label: "Gourmande & Sucrée", value: "gourmand, sucré ou vanillé", icon: "🧁" },
      { label: "Fraîche & Aquatique", value: "frais et léger", icon: "🌊" },
    ]
  },
  {
    id: 'occasion',
    question: "À quelle occasion sera-t-il porté le plus souvent ?",
    options: [
      { label: "Tous les jours / Travail", value: "pour tous les jours, de façon discrète et élégante", icon: "💼" },
      { label: "Soirées & Rendez-vous", value: "pour des soirées ou des rendez-vous, sensuel", icon: "🌙" },
      { label: "Occasions Spéciales", value: "pour des événements marquants, avec une forte présence", icon: "🎉" },
      { label: "Peu importe", value: "polyvalent pour toute occasion", icon: "🤷" },
    ]
  },
  {
    id: 'intensity',
    question: "Quelle intensité recherchez-vous ?",
    options: [
      { label: "Intense & Sillage puissant", value: "très intense avec un fort sillage ('beast mode')", icon: "🔥" },
      { label: "Modérée", value: "modérée, présente mais équilibrée", icon: "⭐" },
      { label: "Discrète", value: "légère et discrète, plutôt parfum de peau", icon: "🕊️" },
    ]
  }
];

export function PerfumeFinder() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isComplete = currentStepIndex >= STEPS.length;
  const currentStep = STEPS[currentStepIndex];

  const handleSelectOption = async (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Finished all steps, trigger AI
      setCurrentStepIndex(prev => prev + 1); // Move to loading/result view
      await fetchRecommendations(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setRecommendations([]);
    setError(null);
  };

  const fetchRecommendations = async (finalAnswers: Record<string, string>) => {
    setIsLoading(true);
    setError(null);

    // Construct the prompt for the AI based on answers
    const preferencesQuery = `Je recherche un parfum pour ${finalAnswers.gender}. Il doit avoir un profil ${finalAnswers.family}. L'usage principal sera ${finalAnswers.occasion}. Enfin, je souhaite une intensité ${finalAnswers.intensity}.`;

    try {
      const result = await runRecommendPerfumes({
        preferences: preferencesQuery,
        pastPerfumes: "Non spécifié, fiez-vous uniquement à mes préférences détaillées."
      });

      if (result && result.recommendations) {
        const productDetails = result.recommendations
          .map(rec => {
            const product = getProductBySlug(rec.slug);
            return product ? { product, reason: rec.reason } : null;
          })
          .filter((p): p is RecommendedProduct => p !== null);

        setRecommendations(productDetails);
      } else {
        setError("Nous n'avons pas pu trouver de recommandations précises pour ce profil. Essayez d'élargir vos critères.");
      }
    } catch (e) {
      console.error(e);
      setError("Une erreur est survenue lors de l'analyse de votre profil. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[400px] w-full max-w-3xl mx-auto p-4 md:p-6 bg-white dark:bg-card">

      {/* Progress Bar */}
      {!isComplete && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            {currentStepIndex > 0 ? (
              <button onClick={handleBack} className="flex items-center hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Retour
              </button>
            ) : <span></span>}
            <span>Étape {currentStepIndex + 1} sur {STEPS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStepIndex) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">

          {/* QUESTIONS */}
          {!isComplete && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-8 text-foreground">
                {currentStep.question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {currentStep.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-muted hover:border-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group text-left w-full h-full"
                  >
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{option.icon}</span>
                    <span className="font-medium text-foreground text-center">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {isComplete && isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-12"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif mb-2">Analyse de votre profil olfactif...</h3>
                <p className="text-muted-foreground">Notre nez IA recherche les perles rares parmi notre collection.</p>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {isComplete && !isLoading && !error && recommendations.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col w-full"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-primary">Vos Signatures Olfactives</h2>
                <p className="text-muted-foreground mt-2">Nous avons sélectionné ces {recommendations.length} parfums spécialement pour vous.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map(({ product, reason }) => (
                  <div key={product.id} className="flex flex-col bg-muted/20 rounded-xl overflow-hidden shadow-sm">
                    <ProductCard product={product} />
                    <div className="p-4 bg-primary/5 border-t border-primary/10 flex-grow">
                      <p className="text-sm text-foreground/80 italic leading-relaxed">
                        "{reason}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 mb-4 text-center">
                <Button onClick={handleReset} variant="outline" className="rounded-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Refaire le test
                </Button>
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {isComplete && !isLoading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center py-12"
            >
              <div className="text-destructive mb-4 text-5xl">⚠️</div>
              <h3 className="text-xl font-medium mb-2">Oups...</h3>
              <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
              <Button onClick={handleReset} variant="default">
                Recommencer
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
