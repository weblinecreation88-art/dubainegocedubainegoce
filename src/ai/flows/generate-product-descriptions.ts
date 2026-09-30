
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating product descriptions for perfumes,
 * optimized for a Rank Math SEO score of 90+.
 *
 * @interface GenerateSeoDescriptionInput - Defines the input schema.
 * @interface GenerateSeoDescriptionOutput - Defines the output schema.
 * @function generateSeoDescription - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the perfume.'),
  brand: z.string().describe('The brand of the perfume.'),
  targetAudience: z.string().describe('Target audience (e.g., Homme, Femme, Unisexe).'),
  webContext: z.string().describe('Context from the web about the perfume.'),
  language: z.string().describe('The output language (e.g., fr-FR, en-US).'),
});

type GenerateSeoDescriptionInput = z.infer<typeof GenerateSeoDescriptionInputSchema>;

const GenerateSeoDescriptionOutputSchema = z.object({
    focusKeyword: z.string().describe('The main keyword for SEO, should be "{{productName}} {{brand}}".'),
    title: z.string().describe('SEO-optimized title starting with the focus keyword and containing a power word.'),
    shortDescription: z.string().describe('SEO meta description of about 155 characters containing the focus keyword.'),
    longDescription: z.string().describe('Product description of about 250 words, structured for SEO with a keyword density of ~1%.'),
    category: z.string().describe('The product category based on the target audience (Homme, Femme, or Unisexe).'),
});

type GenerateSeoDescriptionOutput = z.infer<typeof GenerateSeoDescriptionOutputSchema>;

export async function generateProductDescriptions(
  input: GenerateSeoDescriptionInput
): Promise<GenerateSeoDescriptionOutput> {
  return generateSeoDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoDescriptionPrompt',
  input: {schema: GenerateSeoDescriptionInputSchema},
  output: {schema: GenerateSeoDescriptionOutputSchema},
  prompt: `
# Rôle et Objectif
Tu es un expert SEO Rank Math et un copywriter spécialisé en parfumerie. Ton objectif est de créer une fiche produit parfaitement optimisée en suivant des règles SEO strictes pour le parfum "{{productName}}" de la marque "{{brand}}". Le mot-clé principal est impérativement "{{productName}} {{brand}}".
La langue de sortie doit impérativement être le **français (fr-FR)**. Ignore la variable 'language' si elle est fournie et produis toujours du contenu en français.

# Contexte des Données
- Nom du parfum: {{productName}}
- Marque: {{brand}}
- Public cible (si connu): {{targetAudience}}
- Contexte Web: """{{webContext}}"""

# Instructions Détaillées (Règles SEO Impératives)

1.  **focusKeyword**:
    *   Doit être exactement: "{{productName}} {{brand}}".

2.  **title**:
    *   **Règle 1**: Doit commencer IMPERATIVEMENT par le mot-clé principal: "{{productName}} {{brand}}".
    *   **Règle 2**: Doit contenir un "Power Word" (mot puissant) en français pour augmenter le taux de clic. Choisis-en un dans cette liste : Incroyable, Ultime, Exclusif, Essentiel, Nouveau, Garanti, Éprouvé, Révolutionnaire, Secret, Magique.
    *   Exemple de format valide: "{{productName}} {{brand}} : Le Guide Ultime du Parfum Iconique"

3.  **shortDescription (Méta Description SEO)**:
    *   **Règle 1**: Doit contenir le mot-clé principal "{{productName}} {{brand}}".
    *   **Règle 2**: La longueur doit être d'environ 155 caractères.
    *   Exemple: "Découvrez {{productName}} {{brand}}, une fragrance audacieuse aux notes de... Laissez-vous séduire par ce parfum inoubliable, parfait pour..."

4.  **longDescription**:
    *   **Règle 1**: Doit commencer par une phrase contenant le mot-clé principal "{{productName}} {{brand}}".
    *   **Règle 2**: Le contenu total doit faire environ 250 mots.
    *   **Règle 3**: La densité du mot-clé principal "{{productName}} {{brand}}" doit être d'environ 1% (soit 2 à 3 mentions dans le texte).
    *   **Règle 4**: Doit être structurée en paragraphes distincts, séparés par deux sauts de ligne (\\n\\n). Chaque paragraphe doit avoir un titre en gras : "**Introduction**", "**Pour qui ?**", et "**Dans quelles occasions ?**".

5.  **category**:
    *   Doit être basé sur le public cible fourni : '{{targetAudience}}'. Les valeurs possibles sont "Homme", "Femme", ou "Unisexe".
  `,
});

const generateSeoDescriptionFlow = ai.defineFlow(
  {
    name: 'generateSeoDescriptionFlow',
    inputSchema: GenerateSeoDescriptionInputSchema,
    outputSchema: GenerateSeoDescriptionOutputSchema,
  },
  async input => {
    // Force language to French regardless of input
    const frenchInput = { ...input, language: 'fr-FR' };
    const {output} = await prompt(frenchInput);
    return output!;
  }
);
