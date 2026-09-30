import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TOP_BESTSELLERS = [
  {
    name: 'Tobacco Touch',
    brand: 'Maison Alhambra',
    price: 35,
    slug: 'tobacco-touch-maison-alhambra-unisex',
    image: 'https://res.cloudinary.com/db2ljqpdt/image/upload/v1771702458/Tobacco_Touch_Maison_Alhambra_eqk69s.jpg',
  },
  {
    name: 'Grise',
    brand: 'Maison Alhambra',
    price: 35,
    slug: 'grise-maison-alhambra-unisex',
    image: 'https://res.cloudinary.com/db2ljqpdt/image/upload/v1771702459/Grise_Maison_Alhambra_d18uxh.jpg',
  },
  {
    name: 'Porto Neroli',
    brand: 'Maison Alhambra',
    price: 35,
    slug: 'porto-neroli-maison-alhambra',
    image: 'https://res.cloudinary.com/db2ljqpdt/image/upload/v1771702457/Porto_Neroli_Maison_Alhambra_e8r40f.jpg',
  },
  {
    name: 'Lovely Chèrie',
    brand: 'Maison Alhambra',
    price: 35,
    slug: 'lovely-cherie-maison-alhambra',
    image: 'https://res.cloudinary.com/db2ljqpdt/image/upload/v1771702457/Lovely_Cherie_Maison_Alhambra_ndb0x0.jpg',
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Code 404 & Titre */}
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-3">Erreur 404</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Cette page s'est évaporée...</h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
          Le parfum ou la page recherchée n'existe plus ou a changé d'adresse. Laissez-vous inspirer par nos créations d'exception.
        </p>

        {/* CTA principaux */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop/all" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Voir toute la boutique
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>

        {/* Nos Best-Sellers (Conversion immédiate) */}
        <div className="text-left border-t pt-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-headline font-bold">Nos Best-Sellers les plus plébiscités</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TOP_BESTSELLERS.map((perfume) => (
              <Link
                key={perfume.slug}
                href={`/parfum/${perfume.slug}`}
                className="group border rounded-lg overflow-hidden bg-card hover:border-accent transition-colors flex flex-col"
              >
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={perfume.image}
                    alt={perfume.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{perfume.brand}</p>
                    <p className="font-semibold text-sm line-clamp-1 group-hover:text-accent transition-colors">
                      {perfume.name}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-accent mt-2">{perfume.price.toFixed(2)} € TTC</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Raccourcis collections */}
        <div className="w-full max-w-md mx-auto mt-16 text-left">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Explorer par marque ou genre</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: 'Maison Alhambra', href: '/shop/marque/maison-alhambra' },
              { label: 'Parfums Lattafa', href: '/shop/marque/lattafa' },
              { label: 'Pour Femme', href: '/shop/genre/femme' },
              { label: 'Pour Homme', href: '/shop/genre/homme' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 border rounded-md text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
              >
                {label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
