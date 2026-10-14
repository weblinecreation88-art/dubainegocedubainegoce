import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/data';

/** Best-sellers disponibles, tires du catalogue (jamais de lien vers une fiche absente). */
function getTopBestsellers() {
  const inStock = getProducts().filter((p) => p.stock > 0 && p.images?.[0]);
  const best = inStock.filter((p) => p.isBestseller);
  return (best.length >= 4 ? best : [...best, ...inStock.filter((p) => !p.isBestseller)]).slice(0, 4);
}

export default function NotFound() {
  const bestsellers = getTopBestsellers();

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-3">Erreur 404</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Cette page s&apos;est évaporée...</h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
          Le parfum ou la page recherchée n&apos;existe plus ou a changé d&apos;adresse. Laissez-vous inspirer par nos
          créations d&apos;exception.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop/all" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Voir toute la boutique
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>

        {bestsellers.length > 0 && (
          <div className="text-left border-t pt-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-headline font-bold">Nos best-sellers les plus plébiscités</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestsellers.map((perfume) => (
                <Link
                  key={perfume.id}
                  href={`/parfum/${perfume.slug}`}
                  className="group border rounded-lg overflow-hidden bg-card hover:border-accent transition-colors flex flex-col"
                >
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={perfume.images[0]}
                      alt={perfume.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{perfume.brand?.name}</p>
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
        )}

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
