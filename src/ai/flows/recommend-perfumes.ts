'use server';
/**
 * @fileOverview A Genkit flow for recommending perfumes based on user preferences.
 *
 * This flow takes user preferences and past perfumes as input, and returns a list of recommended product slugs from the existing product catalog.
 */

import { ai } from '@/ai/genkit';
import { getProducts } from '@/lib/data';
import { z } from 'genkit';

const RecommendPerfumesInputSchema = z.object({
  preferences: z.string().describe('The user\'s scent preferences (e.g., floral, woody, sweet, vanilla, jasmine).'),
  pastPerfumes: z.string().describe('A list of perfumes the user has liked or disliked in the past.'),
});

type RecommendPerfumesInput = z.infer<typeof RecommendPerfumesInputSchema>;

const RecommendedProductSchema = z.object({
    slug: z.string().describe("The unique slug of the recommended product."),
    reason: z.string().describe("A short, compelling reason why this perfume is a good match for the user, written in French.")
});

const RecommendPerfumesOutputSchema = z.object({
  recommendations: z.array(RecommendedProductSchema).describe('A list of up to 3 recommended perfume slugs from the catalog.'),
});

type RecommendPerfumesOutput = z.infer<typeof RecommendPerfumesOutputSchema>;

export async function recommendPerfumes(
  input: RecommendPerfumesInput
): Promise<RecommendPerfumesOutput> {
  return recommendPerfumesFlow(input);
}

// Prepare the product catalog data for the prompt
const productCatalog = getProducts()
  .filter(p => p.type !== 'simple' || p.family !== 'Soin') // Filter out cosmetic products
  .map(p => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand.name,
    family: p.family,
    notes: `Top: ${(p.topNotes || []).join(', ')}. Heart: ${(p.heartNotes || []).join(', ')}. Base: ${(p.baseNotes || []).join(', ')}.`,
    description: p.shortDescription
}));


const prompt = ai.definePrompt({
  name: 'recommendPerfumesPrompt',
  input: { schema: RecommendPerfumesInputSchema },
  output: { schema: RecommendPerfumesOutputSchema },
  prompt: `Tu es un conseiller expert en parfums pour DubaiNegoce. Ton objectif est de recommander le parfum parfait à un utilisateur en fonction de ses goûts.

Tu dois recommander UNIQUEMENT des parfums du catalogue fourni. Tu DOIS retourner un maximum de 3 recommandations.
Pour chaque recommandation, fournis le slug du produit et une raison courte et engageante en FRANÇAIS expliquant pourquoi c'est un bon choix.

**Préférences de l'utilisateur :**
"{{{preferences}}}"

**Anciens parfums de l'utilisateur :**
"{{{pastPerfumes}}}"

**Catalogue de parfums disponibles (format JSON) :**
${JSON.stringify(productCatalog)}

Analyse les préférences et les anciens parfums de l'utilisateur pour comprendre son profil olfactif. Identifie les notes clés, les familles de parfums et les styles qu'il apprécie. Ensuite, compare ce profil au catalogue pour trouver les meilleures recommandations. Assure-toi que toutes les raisons sont rédigées en français.`,
});

const recommendPerfumesFlow = ai.defineFlow(
  {
    name: 'recommendPerfumesFlow',
    inputSchema: RecommendPerfumesInputSchema,
    outputSchema: RecommendPerfumesOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
