'use client';

import { Star, Quote } from 'lucide-react';
import Link from 'next/link';

const reviews = [
  {
    name: 'Sonia M.',
    city: 'Paris',
    rating: 5,
    product: 'Yara — Lattafa',
    comment: 'Je suis tombée amoureuse de ce parfum dès la première vaporisation. Tenue incroyable, plus de 8h sur ma peau. Et le prix... franchement imbattable par rapport aux grandes marques.',
    date: 'Janvier 2025',
  },
  {
    name: 'Karim B.',
    city: 'Lyon',
    rating: 5,
    product: 'Khamrah — Lattafa',
    comment: 'Livraison ultra rapide, parfum reçu en 48h nickel. Le flacon est magnifique, le parfum dure toute la journée. Mon entourage me demande tous ce que je porte. Top !!',
    date: 'Décembre 2024',
  },
  {
    name: 'Yasmine D.',
    city: 'Marseille',
    rating: 5,
    product: 'Zaffiro Regale — Alhambra',
    comment: 'Service client impeccable, à l\'écoute et là pour vous tout au long du processus. Le parfum est exactement comme décrit, oriental et envoûtant. Je recommande vivement.',
    date: 'Février 2025',
  },
  {
    name: 'Thomas L.',
    city: 'Bordeaux',
    rating: 5,
    product: 'Asad — Lattafa',
    comment: 'Rapport qualité/prix au top ! J\'ai testé beaucoup de parfums orientaux, celui-là est dans mon top 3. Vendeur aimable et courtois, et livraison super rapide.',
    date: 'Janvier 2025',
  },
];

export function CustomerReviewsSection() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body">Ils nous font confiance</span>
          <h2 className="text-4xl md:text-5xl font-luxury-headline text-black">CE QUE DISENT NOS CLIENTS</h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>

          {/* Global rating */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span className="text-lg font-luxury-headline text-black">4.9/5</span>
            <span className="text-sm text-black/40 font-luxury-body">· +150 avis vérifiés</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {reviews.map((review, i) => (
            <div key={i} className="bg-[#F9F9F9] p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-black/70 font-luxury-body leading-relaxed italic flex-grow">
                "{review.comment}"
              </p>

              {/* Product */}
              <div className="border-t border-black/5 pt-3">
                <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body mb-1">
                  {review.product}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-luxury-headline text-black">{review.name}</p>
                    <p className="text-[10px] text-black/40 font-luxury-body">{review.city} · {review.date}</p>
                  </div>
                  {/* Verified badge */}
                  <span className="text-[8px] uppercase tracking-wider bg-green-50 text-green-600 px-2 py-1 border border-green-100">
                    ✓ Vérifié
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Google Reviews */}
        <div className="text-center mt-12">
          <Link
            href="https://g.page/r/CYfNDXizM9KSEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-luxury-body text-black/50 hover:text-[#D4AF37] transition-colors border-b border-black/10 pb-1"
          >
            Voir tous les avis Google →
          </Link>
        </div>
      </div>
    </section>
  );
}
