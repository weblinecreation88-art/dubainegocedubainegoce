
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
                src="https://res.cloudinary.com/dzntnjtkc/image/upload/v1766911492/YARA_id3ssb.jpg"
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

      {/* Featured Best Seller Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Vidéo à gauche */}
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 flex items-center justify-center">
              <video
                src="https://res.cloudinary.com/dzntnjtkc/video/upload/v1766911628/LOVELY-Photoroom_animation_egw64l.mp4"
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Texte à droite */}
            <div className="space-y-6">
              <div>
                <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-2">Notre Best-Seller N°1</p>
                <h2 className="text-4xl md:text-5xl font-headline font-bold">LOVELY</h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Découvrez notre parfum le plus vendu, une fragrance envoûtante qui séduit par son élégance et sa sophistication.
                LOVELY capture l'essence même du luxe oriental avec ses notes délicates et raffinées.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Notes de tête</h3>
                  <p className="text-muted-foreground">Bergamote, Poire, Fleur d'Oranger</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Notes de cœur</h3>
                  <p className="text-muted-foreground">Jasmin, Rose de Damas, Pivoine</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Notes de fond</h3>
                  <p className="text-muted-foreground">Musc Blanc, Vanille, Bois de Santal</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild size="lg" className="group">
                  <Link href="/shop/all">
                    Découvrir ce parfum
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/shop/all">
                    Voir tous les best-sellers
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KAMRAH Promo Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image à gauche */}
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="https://res.cloudinary.com/db2ljqpdt/image/upload/v1764270620/Screenshot_2025-06-02-00-12-11-453_com.android.chrome-edit_1_prxl15.jpg"
                  alt="KAMRAH - Offre promotionnelle"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Texte à droite */}
              <div className="p-8 lg:p-12 space-y-6">
                <div className="inline-block">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Promotion Exclusive
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-2">KAMRAH</h2>
                  <p className="text-xl text-muted-foreground">L'élégance orientale à prix fixe</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-primary/20">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold text-primary">35€</span>
                    <span className="text-2xl text-muted-foreground line-through">49.99€</span>
                  </div>
                  <p className="text-lg font-semibold text-primary mt-2">Prix fixe - Toutes les fragrances KAMRAH</p>
                  <p className="text-sm text-muted-foreground mt-2">Profitez de cette offre exceptionnelle sur l'ensemble de la collection</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Toutes les variantes incluses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Qualité premium garantie</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">Livraison rapide</span>
                  </li>
                </ul>

                <div className="flex gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8">
                    <Link href="/shop/all?brands=Kamrah">
                      Voir les parfums KAMRAH
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Offre valable dans la limite des stocks disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZAFFIRO Collection Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Texte à gauche */}
              <div className="p-8 lg:p-12 space-y-6 order-2 lg:order-1">
                <div className="inline-block">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Collection Premium
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    ZAFFIRO
                  </h2>
                  <p className="text-xl text-muted-foreground">L'excellence olfactive à votre portée</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      35€
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">54.99€</span>
                  </div>
                  <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                    Prix fixe - Toute la collection ZAFFIRO
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Découvrez une collection raffinée inspirée des plus grandes créations
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Collection exclusive haute qualité</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Notes sophistiquées et raffinées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-muted-foreground">Tenue longue durée</span>
                  </li>
                </ul>

                <div className="flex gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/shop/all?brands=Zaffiro">
                      Découvrir ZAFFIRO
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Collection limitée - Offre spéciale</p>
              </div>

              {/* Image à droite */}
              <div className="relative h-[400px] lg:h-[500px] order-1 lg:order-2">
                <Image
                  src="https://res.cloudinary.com/dhjwimevi/image/upload/v1765748493/zaffiro-regale-for-alhambra_pqw03d.png"
                  alt="ZAFFIRO - Collection Premium"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YARA Iconic Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image à gauche */}
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="https://res.cloudinary.com/dzntnjtkc/image/upload/v1766911492/YARA_id3ssb.jpg"
                  alt="YARA - Parfum Iconique"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Texte à droite */}
              <div className="p-8 lg:p-12 space-y-6">
                <div className="inline-block">
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    Parfum Iconique
                  </span>
                </div>

                <div>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    YARA
                  </h2>
                  <p className="text-xl text-muted-foreground">Une fragrance emblématique et intemporelle</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-rose-200 dark:border-rose-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      35€
                    </span>
                    <span className="text-2xl text-muted-foreground line-through">52.99€</span>
                  </div>
                  <p className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mt-2">
                    Prix exclusif - YARA
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Un classique indémodable qui séduit depuis des années
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Fragrance florale orientale</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Sillage envoûtant et mémorable</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600"></div>
                    <span className="text-muted-foreground">Parfait pour toutes occasions</span>
                  </li>
                </ul>

                <div className="flex gap-4 pt-4">
                  <Button asChild size="lg" className="group text-lg px-8 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
                    <Link href="/shop/all?search=yara">
                      Découvrir YARA
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">* Un parfum iconique à prix exceptionnel</p>
              </div>
            </div>
          </div>
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
