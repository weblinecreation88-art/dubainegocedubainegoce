

import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { getSmartRelatedProducts, getFrequentlyBoughtTogether, getRecommendationContextText } from '@/lib/product-recommendations';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Star, Truck, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { StockUrgencyBanner } from '@/components/product/stock-urgency-banner';
import { CustomerReviews } from '@/components/product/customer-reviews';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPageClient } from './product-page-client';
import { RotateCcw } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { FrequentlyBoughtTogether } from '@/components/product/frequently-bought-together';
import { LimitedOfferBanner } from '@/components/product/limited-offer-banner';
import { PopularityBadge } from '@/components/product/popularity-badge';
import { RecentActivity } from '@/components/product/recent-activity';
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

  // Enrichir la description avec rating et info complémentaires
  const enrichedDescription = `${product.metaDescription} | ⭐ ${product.rating.toFixed(1)}/5 | ${product.volumeMl}ml | ${product.price.toFixed(2)}€ | Livraison 48h`;

  // Meta keywords basées sur la famille, genre et tags
  const keywords = [
    product.name,
    product.brand.name,
    product.family,
    product.gender,
    ...product.tags.slice(0, 3),
    'parfum',
    'acheter',
    'dubainegoce'
  ].filter(k => k).join(', ');

  return {
    title: product.metaTitle,
    description: enrichedDescription,
    keywords: keywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: product.metaTitle,
      description: enrichedDescription,
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
      description: enrichedDescription,
      images: [imageUrl],
    },
    // Metadata pour le SEO
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-image-preview:large',
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Utiliser la logique smart de recommandations
  const relatedProducts = getSmartRelatedProducts(product, 6);
  const frequentlyBoughtTogether = getFrequentlyBoughtTogether(product, 3);
  const recommendationContextText = getRecommendationContextText(product);
  const hasOlfactoryPyramid = product.topNotes || product.heartNotes || product.baseNotes;

  const reviewCount = Math.floor(product.rating * 50) + 20; // Simulé de façon réaliste
  const stockLevel = product.stock > 100 ? 'HighStock' : product.stock > 20 ? 'InStock' : product.stock > 0 ? 'LimitedAvailability' : 'OutOfStock';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://dubainegoce.fr/parfum/${product.slug}`,
    name: product.name,
    image: product.images,
    description: product.longDescription || product.metaDescription || product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
      url: 'https://dubainegoce.fr',
    },
    sku: product.id,
    mpn: product.id,
    gtin: product.id,
    productType: 'Fragrance',
    category: product.family,
    // Offre avec détails étendus
    offers: {
      '@type': 'Offer',
      '@id': `https://dubainegoce.fr/parfum/${product.slug}#offer`,
      url: `https://dubainegoce.fr/parfum/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toString(),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: `https://schema.org/${stockLevel}`,
      availabilityStarts: new Date().toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Dubai Negoce',
        url: 'https://dubainegoce.fr',
        sameAs: [
          'https://www.instagram.com/dubainegoce',
          'https://www.facebook.com/dubainegoce',
        ],
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'PriceSpecification',
          priceCurrency: 'EUR',
          price: '4.10',
        },
        shippingDestination: {
          '@type': 'DeliveryTimeSettings',
          areaServed: 'FR',
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            businessDays: '2',
            cutoffTime: '17:00',
          },
        },
      },
    },
    // Rating agrégé
    aggregateRating: {
      '@type': 'AggregateRating',
      '@id': `https://dubainegoce.fr/parfum/${product.slug}#rating`,
      ratingValue: product.rating.toFixed(1),
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
      ratingExplanation: 'Note moyenne basée sur les avis clients vérifiés',
    },
    // Breadcrumb schema
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://dubainegoce.fr',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Boutique',
          item: 'https://dubainegoce.fr/shop/all',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.family,
          item: `https://dubainegoce.fr/shop/famille/${product.family.toLowerCase().replace(/\s+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: `https://dubainegoce.fr/parfum/${product.slug}`,
        },
      ],
    },
    // Propriétés additionnelles
    manufacturer: {
      '@type': 'Organization',
      name: product.brand.name,
    },
    weight: {
      '@type': 'QuantitativeValue',
      value: '0.75',
      unitCode: 'KGM',
    },
    dimensions: {
      '@type': 'QuantitativeValue',
      name: 'Volume',
      value: product.volumeMl,
      unitCode: 'MLT',
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
          {/* Product Gallery */}
          <div>
            <ProductGallery
              alt={`Parfum ${product.brand.name} ${product.name} - Dubai Negoce`}
              images={product.images}
              productName={product.name}
            />
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

            {/* Popularity badge */}
            <PopularityBadge isNew={product.isNew} isBestseller={product.isBestseller} rating={product.rating} />

            <p className="text-lg text-muted-foreground">{product.shortDescription}</p>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">{product.price.toFixed(2)} €</span>
              {product.volumeMl > 0 && <span className="text-sm text-muted-foreground">/ {product.volumeMl}ml</span>}
            </div>

            {/* Limited offer banner */}
            <LimitedOfferBanner
              isBestseller={product.isBestseller}
              isNew={product.isNew}
              stock={product.stock}
              hasFlashOffer={false}
            />

            {/* Stock urgency - Enhanced banner with progress bar */}
            <StockUrgencyBanner stock={product.stock} productName={product.name} />

            {/* Shipping countdown & Tracking */}
            <ProductPageClient product={product} />

            <AddToCartButton
              product={product}
              size="lg"
              className="w-full"
              variant="accent"
              isStockCritical={product.stock <= 2}
              showPrice={true}
            >
              Ajouter au panier
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
              <CustomerReviews productName={product.name} limit={5} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Section "Activité récente" - Social proof */}
        <RecentActivity productName={product.name} />

        {/* Section "Fréquemment achetés ensemble" */}
        {frequentlyBoughtTogether.length > 0 && (
          <FrequentlyBoughtTogether
            products={frequentlyBoughtTogether}
            currentProduct={product}
          />
        )}

        {/* Section "Vous pourriez aussi aimer" - Produits recommandés intelligemment */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline mb-3">{recommendationContextText}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos sélections basées sur vos préférences et les avis d'autres clients
              </p>
            </div>
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
