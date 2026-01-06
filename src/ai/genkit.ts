import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Configuration Gemini avec vérification de la clé API
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn('[Genkit] AVERTISSEMENT: GEMINI_API_KEY non définie. Le générateur IA sera désactivé.');
}

export const ai = genkit({
  plugins: geminiApiKey ? [
    googleAI({
      apiKey: geminiApiKey,
    })
  ] : [],
  model: geminiApiKey ? 'googleai/gemini-2.5-flash' : undefined,
});
