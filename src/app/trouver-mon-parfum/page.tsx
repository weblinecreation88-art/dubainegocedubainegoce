import { Metadata } from 'next';
import { FragranceQuiz } from '@/components/quiz/fragrance-quiz';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trouver mon parfum | Dubai Negoce',
  description: 'Répondez à quelques questions pour trouver votre signature olfactive idéale parmi nos parfums orientaux à 35€.',
};

export default function TrouverMonParfumPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pt-8 pb-20">
      <div className="container max-w-4xl mx-auto px-4">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Trouver mon parfum</span>
        </nav>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-gray-900 dark:text-gray-100 mb-4">
            Quel parfum est fait pour vous ?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez votre signature olfactive en répondant à 4 questions simples.
          </p>
        </div>

        <FragranceQuiz />
      </div>
    </div>
  );
}
