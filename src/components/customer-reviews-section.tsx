'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const reviews = [
  {
    name: 'Amine Abdelhafidh',
    title: 'Commande de deux parfums',
    rating: 5,
    comment: 'Commande de deux parfums maison Alhambra (Woody oud et lovely cherry). Très bonne tenue et très bon sillage. Odeur quasi identique aux TF. Envoie rapide!',
    date: '28 Août 2024',
  },
  {
    name: 'Tristan T.',
    title: 'Un service de qualité et rapide',
    rating: 5,
    comment: 'Un service de qualité et rapide.',
    date: '15 Juin 2024',
  },
  {
    name: 'Romain',
    title: 'Envoi rapide et soigné',
    rating: 5,
    comment: 'Envoi rapide et soigné. Produit conforme. Je suis ravi, merci.',
    date: '23 Mai 2024',
  },
  {
    name: 'Diane Joliana NDANGA',
    title: 'Service client disponible',
    rating: 5,
    comment: 'Commande reçue dans les délais, et le parfum a une odeur qui dure toute la journée. Service client disponible et aimable. J’ai apprécié mon expérience et recommande fortement.',
    date: '21 Août 2024',
  },
];

export function CustomerReviewsSection() {
  return (
    <section className="py-20 bg-white dark:bg-card border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* En-tête Trustpilot */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6 text-gray-900 dark:text-white">Nos clients parlent de nous</h2>
          <div className="flex flex-col items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Excellent</span>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#00b67a] p-1.5 rounded-sm">
                  <Star className="h-6 w-6 fill-white text-white" />
                </div>
              ))}
            </div>
            <p className="text-base text-muted-foreground mt-2">
              Avis vérifiés sur{' '}
              <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline">Trustpilot</a>
              {' '}et{' '}
              <a href="https://www.trustindex.io/reviews/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 dark:text-gray-100 hover:underline">Trustindex</a>
            </p>
          </div>
        </div>

        {/* Grille des avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-gray-50 dark:bg-background border border-gray-100 dark:border-gray-800 rounded-lg p-6 flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <div key={j} className="bg-[#00b67a] p-1 rounded-sm">
                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2 leading-snug">{review.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                {review.comment}
              </p>
              <div className="pt-6 mt-auto">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.name}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <span>{review.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Avis vérifié
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://fr.trustpilot.com/review/dubainegoce.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-card text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Voir les avis sur Trustpilot
          </a>
          <a
            href="https://www.trustindex.io/reviews/dubainegoce.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-card text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Voir les avis sur Trustindex
          </a>
        </div>

      </div>
    </section>
  );
}
