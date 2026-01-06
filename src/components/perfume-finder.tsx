
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { runRecommendPerfumes } from '@/app/actions';
import { getProductBySlug } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  preferences: z
    .string()
    .min(10, {
      message: 'Veuillez décrire vos préférences plus en détail.',
    })
    .describe("User's scent preferences"),
  pastPerfumes: z
    .string()
    .min(2, {
      message: 'Veuillez indiquer au moins un achat antérieur.',
    })
    .describe('Perfumes the user has previously used'),
});

type RecommendedProduct = {
  product: Product;
  reason: string;
};

export function PerfumeFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: '',
      pastPerfumes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    setError(null);
    try {
      const result = await runRecommendPerfumes(values);
      if (result && result.recommendations) {
        const productDetails = result.recommendations
          .map(rec => {
            const product = getProductBySlug(rec.slug);
            return product ? { product, reason: rec.reason } : null;
          })
          .filter((p): p is RecommendedProduct => p !== null);
          
        setRecommendations(productDetails);
      } else {
         setError("Nous n'avons pas pu trouver de recommandations pour le moment.");
      }
    } catch (e) {
      console.error(e);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 p-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Décrivez-nous votre parfum idéal</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vos préférences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: J'aime les parfums floraux, mais avec une note boisée et un peu sucrée. J'apprécie la vanille et le jasmin."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Décrivez les types de senteurs que vous aimez.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastPerfumes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vos anciens parfums</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Dior - Sauvage, Lattafa - Asad, Chanel - Bleu"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Listez quelques parfums que vous avez aimés (ou non).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  'Obtenir mes recommandations'
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Nos recommandations</h2>
            {isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            )}
            {recommendations.length > 0 && (
                 <div className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recommendations.map(({ product, reason }) => (
                        <div key={product.id} className="flex flex-col">
                          <ProductCard product={product} />
                          <div className="p-4 bg-muted border border-t-0 rounded-b-lg flex-grow">
                             <p className="text-sm text-muted-foreground italic">"{reason}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
            )}
            {error && (
                 <div className="text-center text-destructive flex items-center justify-center h-full">
                    <p>{error}</p>
                 </div>
            )}
            {!isLoading && recommendations.length === 0 && !error && (
                <div className="text-center text-muted-foreground flex items-center justify-center h-full">
                    <p>Vos recommandations apparaîtront ici.</p>
                </div>
            )}
        </div>
    </div>
  );
}
