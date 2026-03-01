

import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductImage } from '@/components/product/product-image';
import { ProductPageClient } from './product-page-client';
import { RotateCcw } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const products = getProducts();
  return products.map(product => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  const imageUrl = product.images.length > 0 ? product.images[0] : 'https://picsum.photos/seed/placeholder/800/800';
  const fullUrl = `${SITE_URL}/parfum/${product.slug}`;

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: fullUrl,
      siteName: 'Dubai Negoce',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle,
      description: product.metaDescription,
      images: [imageUrl],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);
  const hasOlfactoryPyramid = product.topNotes || product.heartNotes || product.baseNotes;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.metaDescription || product.shortDescription,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://dubainegoce.fr/parfum/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Dubai Negoce',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: Math.floor(product.rating * 5) + 1, // Simulé pour l'affichage SEO
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container mx-auto max-w-6xl px-4 pt-6 pb-2">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/shop/all" className="hover:text-foreground transition-colors">Boutique</Link>
          <span>/</span>
          <Link href={`/shop/all?brands=${encodeURIComponent(product.brand.name)}`} className="hover:text-foreground transition-colors">{product.brand.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
              <ProductImage
                alt={`Parfum ${product.brand.name} ${product.name} - Dubai Negoce`}
                images={product.images}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand.name}</p>
              <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link href={`/shop/all?families=${product.family}`}><Badge variant="secondary">{product.family}</Badge></Link>
                <Link href={`/shop/all?genders=${product.gender}`}><Badge variant="secondary" className="capitalize">{product.gender}</Badge></Link>
                {product.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </div>

            <p className="text-lg text-muted-foreground">{product.shortDescription}</p>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">{product.price.toFixed(2)} €</span>
              {product.volumeMl > 0 && <span className="text-sm text-muted-foreground">/ {product.volumeMl}ml</span>}
            </div>

            {/* Stock urgency */}
            {product.stock > 0 && product.stock <= 7 && (
              <div className={`text-sm font-medium px-3 py-2 rounded border ${product.stock <= 3 ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                {product.stock <= 3 ? `⚠️ Plus que ${product.stock} en stock !` : '⏳ Stock limité — commandez vite'}
              </div>
            )}

            {/* Shipping countdown & Tracking */}
            <ProductPageClient product={product} />

            <AddToCartButton product={product} size="lg" className="w-full">
              Ajouter au panier — {product.price.toFixed(2)} €
            </AddToCartButton>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center border rounded-lg p-3 hover:border-primary transition-colors">
                <Truck className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground leading-tight">Livraison<br />48h</p>
              </div>
              <div className="text-center border rounded-lg p-3 hover:border-primary transition-colors">
                <ShieldCheck className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground leading-tight">100%<br />Authentique</p>
              </div>
              <div className="text-center border rounded-lg p-3 hover:border-primary transition-colors">
                <RotateCcw className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground leading-tight">Retour<br />14 jours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sticky top-[104px] md:top-[132px] z-40">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="additional-info">Infos complémentaires</TabsTrigger>
              <TabsTrigger value="reviews">Avis</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div className="prose prose-invert max-w-none product-description" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
              {hasOlfactoryPyramid && (
                <>
                  <h3 className="font-headline text-xl mt-6 mb-4">Pyramide Olfactive</h3>
                  <ul className="space-y-2">
                    {product.topNotes && product.topNotes.length > 0 && <li><strong>Notes de tête :</strong> {product.topNotes.join(', ')}</li>}
                    {product.heartNotes && product.heartNotes.length > 0 && <li><strong>Notes de cœur :</strong> {product.heartNotes.join(', ')}</li>}
                    {product.baseNotes && product.baseNotes.length > 0 && <li><strong>Notes de fond :</strong> {product.baseNotes.join(', ')}</li>}
                  </ul>
                </>
              )}
            </TabsContent>
            <TabsContent value="additional-info" className="py-6">
              <div className="space-y-2">
                <p><strong>Poids :</strong> environ 750g (colis compris)</p>
                <p><strong>Dimensions :</strong> non spécifiées</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="font-semibold text-lg">Nos clients nous font confiance</p>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Découvrez l'ensemble de nos avis vérifiés directement sur Trustpilot — la plateforme de référence.
                </p>
                <a
                  href="https://fr.trustpilot.com/review/dubainegoce.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Voir tous nos avis Trustpilot →
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-headline text-center mb-12">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
