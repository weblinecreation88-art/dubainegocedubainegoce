'use server';
/**
 * @fileOverview This file defines a Genkit flow for an FAQ chatbot.
 * The chatbot answers questions based on a provided FAQ context about the DubaiNegoce store.
 * It is configured to be secure and only respond to relevant questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const faqContext = `
    "Vos parfums sont-ils authentiques ?" : "Oui, absolument. Nous nous approvisionnons directement auprès des distributeurs officiels à Dubaï pour garantir que chaque parfum que nous vendons est 100% authentique. La confiance et la transparence sont nos priorités."
    "Qu'est-ce qu'un 'dupe' ?" : "Un 'dupe' est un parfum inspiré d'une fragrance de luxe très connue. Les maisons de parfum de Dubaï sont expertes dans la création de dupes de haute qualité qui capturent l'essence de l'original à une fraction du prix, souvent avec une performance (tenue et sillage) excellente."
    "Pourquoi vos prix sont-ils fixés à 35€ ?" : "Nous croyons que le luxe doit être accessible. En important en grande quantité et en optimisant nos coûts, nous sommes en mesure de proposer un prix juste et fixe sur une large sélection de nos parfums. Cela vous permet de découvrir de nouvelles fragrances sans vous ruiner."
    "Quels sont les délais de livraison ?" : "Nous expédions nos commandes en 48h. Nous proposons deux options : Mondial Relay (3-5 jours ouvrés, gratuit) et Colissimo (2-3 jours ouvrés, 5,90€)."
    "Proposez-vous des retours ?" : "Oui, vous disposez d'un délai de 14 jours après réception pour nous retourner un produit, à condition qu'il soit encore sous blister et n'ait pas été utilisé. Les frais de retour sont à votre charge."
    "Comment puis-je suivre ma commande ?" : "Dès que votre commande est expédiée, vous recevrez un email contenant votre numéro de suivi. Vous pourrez ainsi suivre l'acheminement de votre colis en temps réel."
`;

const AnswerFaqInputSchema = z.object({
  question: z.string().describe('The user\'s question about the DubaiNegoce store.'),
});
type AnswerFaqInput = z.infer<typeof AnswerFaqInputSchema>;

const AnswerFaqOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\'s question.'),
});
type AnswerFaqOutput = z.infer<typeof AnswerFaqOutputSchema>;

export async function answerFaq(input: AnswerFaqInput): Promise<AnswerFaqOutput> {
  return answerFaqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: { schema: AnswerFaqInputSchema },
  output: { schema: AnswerFaqOutputSchema },
  prompt: `Tu es un assistant virtuel pour la boutique de parfums DubaiNegoce.
  Ta seule et unique mission est de répondre aux questions des clients en te basant STRICTEMENT sur le contexte suivant.
  Ne réponds à AUCUNE question qui sort de ce cadre. La réponse doit IMPÉRATIVEMENT être en français.

  CONTEXTE FAQ :
  ${faqContext}

  Règles strictes :
  1. Si la question ne concerne pas DubaiNegoce, ses produits, sa politique (livraison, retour, etc.), réponds : "Je suis désolé, je ne peux répondre qu'aux questions concernant la boutique DubaiNegoce."
  2. Ne génère jamais de contenu inapproprié, offensant ou dangereux.
  3. Formule des réponses courtes, claires et directes en français.
  4. Ne mentionne jamais que tu es une IA. Agis comme un expert du service client.

  Question du client : "{{question}}"

  Réponds à la question en utilisant uniquement les informations ci-dessus et en français.`,
  config: {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ]
  }
});

const answerFaqFlow = ai.defineFlow(
  {
    name: 'answerFaqFlow',
    inputSchema: AnswerFaqInputSchema,
    outputSchema: AnswerFaqOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
