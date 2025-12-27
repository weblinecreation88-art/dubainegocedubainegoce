
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBrands, getBestsellers, getGenderCategories } from '@/lib/data';
import { ProductCard } from '@/components/product/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Boutique - Découvrez nos Collections',
  description: 'Explorez nos collections de parfums de Dubaï par genre, marque ou découvrez nos best-sellers. Trouvez votre fragrance idéale chez Dubainegoce.',
};

export default function ShopPage() {
  const brands = getBrands().slice(0, 6); // Limite aux 6 premières marques pour la vitrine
  const bestsellers = getBestsellers().slice(0, 8);
  const genders = getGenderCategories();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-secondary text-secondary-foreground py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
            <Image
                src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766492582/elegant-perfume-bottle-with-ai-generated-splash-of-water_e39slh.jpg"
                alt="Bannière de la boutique de parfums"
                fill
                className="object-cover"
                sizes="100vw"
                priority
                data-ai-hint="perfume splash elegant"
            />
             <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white">Notre Boutique</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Un univers de senteurs authentiques et de trésors olfactifs vous attend.
          </p>
        </div>
      </section>

      {/* Gender Categories Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center mb-12">Explorer par Genre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {genders.map((gender) => (
              <Link href={`/shop/all?genders=${gender.name}`} key={gender.id}>
                <Card className="overflow-hidden group relative text-center rounded-lg h-full">
                  <div className="relative w-full h-80">
                    <Image
                      src={gender.imageUrl}
                      alt={gender.displayName}
                      data-ai-hint={gender.imageHint}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
                    <h3 className="text-3xl font-headline text-white">{gender.displayName}</h3>
                     <Button variant="link" className="text-white mt-2 group">
                        Voir la sélection
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
          <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-3xl font-headline">Nos Incontournables</h2>
                    <p className="text-muted-foreground mt-2">Les parfums plébiscités par notre communauté.</p>
                  </div>
                   <Button asChild className="hidden md:flex">
                        <Link href="/shop/all?sort=bestsellers">
                            Voir tous les best-sellers
                        </Link>
                    </Button>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {bestsellers.map((product, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1 h-full">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
      )}

      {/* Brands Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center">
                <h2 className="text-3xl font-headline">Les Grandes Maisons</h2>
                <p className="text-muted-foreground mt-2">Découvrez les créateurs derrière nos fragrances d'exception.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 mt-12">
                {brands.map((brand) => (
                    <Link href={`/shop/all?brands=${brand.name}`} key={brand.id}>
                        <Card className="p-4 flex items-center justify-center h-48 transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
                            <div className="relative w-full h-24">
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* CTA to all products */}
       <section className="py-16 md:py-24 bg-card text-center">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline">Explorez l'Intégralité de Notre Collection</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Plus de 100 références vous attendent. Utilisez nos filtres pour affiner votre recherche et trouver le parfum qui vous ressemble.
            </p>
            <Button asChild size="lg" className="mt-8 group">
                <Link href="/shop/all">
                    Voir tous les produits
                     <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </Button>
         </div>
       </section>

    </div>
  );
}
