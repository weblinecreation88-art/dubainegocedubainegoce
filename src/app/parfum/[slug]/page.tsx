

import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { getSmartRelatedProducts, getFrequentlyBoughtTogether, getRecommendationContextText } from '@/lib/product-recommendations';
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Truck, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { ProductActions } from '@/components/product/product-actions';
import { StockUrgencyBanner } from '@/components/product/stock-urgency-banner';
import { CustomerReviews } from '@/components/product/customer-reviews';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPageClient } from './product-page-client';
import { RotateCcw } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { LimitedOfferBanner } from '@/components/product/limited-offer-banner';
import { PopularityBadge } from '@/components/product/popularity-badge';
import { StickyMobileAddToCart } from '@/components/product/sticky-mobile-add-to-cart';
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

function extractNotesFromHtml(html: string): { top: string[], heart: string[], base: string[] } | null {
  const pyramidMatch = html.match(/Pyramide Olfactive[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  if (!pyramidMatch) return null;
  const para = pyramidMatch[1];
  const strongs = [...para.matchAll(/<strong>([^<]+)<\/strong>/g)].map(m => m[1]);
  const noteStrongs = strongs.slice(1, 4); // skip product name, take next 3
  if (noteStrongs.length < 3) return null;
  return {
    top: noteStrongs[0].split(',').map(s => s.trim()),
    heart: noteStrongs[1].split(',').map(s => s.trim()),
    base: noteStrongs[2].split(',').map(s => s.trim()),
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Ancien lien ou slug approchant : redirection 301 vers l'URL officielle
  // (evite le contenu duplique pour Google).
  if (product.slug !== decodeURIComponent(params.slug)) {
    permanentRedirect(`/parfum/${product.slug}`);
  }

  // Utiliser la logique smart de recommandations
  const relatedProducts = getSmartRelatedProducts(product, 4);
  const recommendationContextText = getRecommendationContextText(product);

  // Notes olfactives : champs dédiés ou extraction depuis la description
  const extractedNotes = (!product.topNotes && !product.heartNotes && !product.baseNotes)
    ? extractNotesFromHtml(product.longDescription || '')
    : null;
  const topNotes = product.topNotes?.length ? product.topNotes : extractedNotes?.top ?? [];
  const heartNotes = product.heartNotes?.length ? product.heartNotes : extractedNotes?.heart ?? [];
  const baseNotes = product.baseNotes?.length ? product.baseNotes : extractedNotes?.base ?? [];
  const hasOlfactoryPyramid = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  const reviewCount = Math.floor(product.rating * 50) + 20; // Simulé de façon réaliste
  // Un article disponible est annonce InStock des la premiere unite : Google
  // exclut LimitedAvailability et OutOfStock des resultats enrichis, et nos
  // niveaux de stock reels (1 a 15 unites) ne justifient pas cette exclusion.
  const stockLevel = product.stock > 0 ? 'InStock' : 'OutOfStock';

  const plainDescription = (product.metaDescription || product.shortDescription || product.name).replace(/<[^>]*>?/gm, '').trim();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://dubainegoce.fr/parfum/${product.slug}`,
    name: product.name,
    image: product.images,
    description: plainDescription,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
      url: 'https://dubainegoce.fr',
    },
    sku: product.id,
    mpn: product.id,
    productType: 'Fragrance',
    category: product.family,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    // Offre avec détails étendus
    offers: {
      '@type': 'Offer',
      '@id': `https://dubainegoce.fr/parfum/${product.slug}#offer`,
      url: `https://dubainegoce.fr/parfum/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: `https://schema.org/${stockLevel}`,
      availabilityStarts: new Date().toISOString().split('T')[0],
      validFrom: new Date().toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Dubai Negoce',
        url: 'https://dubainegoce.fr',
        sameAs: [
          'https://www.instagram.com/dubainegoce',
          'https://www.tiktok.com/@dubai_negoce',
        ],
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '4.10',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
          <div className="space-y-5">

            {/* Marque + Titre + Prix */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.brand.name}</p>
              <h1 className="text-3xl md:text-4xl font-headline font-bold mt-1 mb-2">
                {product.name} — Eau de Parfum {product.volumeMl} ml
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-4xl font-bold text-primary">{product.price.toFixed(2)} €</span>
                <span className="text-sm text-muted-foreground">TTC</span>
              </div>
            </div>

            {/* Propriétés Olfactives rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Pour qui ?</p>
                <p className="font-bold text-sm capitalize">{product.gender}</p>
              </div>
              {product.intensity && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Intensité</p>
                  <p className="font-bold text-sm">{product.intensity}</p>
                </div>
              )}
              {product.longevity && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Tenue</p>
                  <p className="font-bold text-sm">{product.longevity}</p>
                </div>
              )}
              {product.occasion && product.occasion.length > 0 && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Idéal pour</p>
                  <p className="font-bold text-sm">{product.occasion[0]}</p>
                </div>
              )}
            </div>

            {/* Popularity badge */}
            <PopularityBadge
              productId={product.id}
              isNew={product.isNew}
              isBestseller={product.isBestseller}
              rating={product.rating}
            />

            {/* Limited offer banner */}
            <LimitedOfferBanner
              isBestseller={product.isBestseller}
              isNew={product.isNew}
              stock={product.stock}
              hasFlashOffer={false}
            />

            {/* Stock urgency */}
            <StockUrgencyBanner stock={product.stock} productName={product.name} />

            {/* Shipping countdown */}
            <ProductPageClient product={product} />

            {/* Quantité + Ajouter au panier */}
            <ProductActions product={product} />



            {/* Notes olfactives */}
            {hasOlfactoryPyramid && (
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Notes olfactives</p>
                {topNotes.length > 0 && (
                  <p className="text-sm"><strong>Notes de tête :</strong> {topNotes.join(', ')}</p>
                )}
                {heartNotes.length > 0 && (
                  <p className="text-sm"><strong>Notes de c&oelig;ur :</strong> {heartNotes.join(', ')}</p>
                )}
                {baseNotes.length > 0 && (
                  <p className="text-sm"><strong>Notes de fond :</strong> {baseNotes.join(', ')}</p>
                )}
              </div>
            )}

            {/* Tags & Metas */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Recherches similaires</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/shop/all?families=${product.family}`}><Badge variant="secondary">{product.family}</Badge></Link>
                <Link href={`/shop/all?genders=${product.gender}`}><Badge variant="secondary" className="capitalize">{product.gender}</Badge></Link>
                {product.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </div>

            {/* Badge de confiance */}
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
                    {topNotes.length > 0 && <li><strong>Notes de tête :</strong> {topNotes.join(', ')}</li>}
                    {heartNotes.length > 0 && <li><strong>Notes de cœur :</strong> {heartNotes.join(', ')}</li>}
                    {baseNotes.length > 0 && <li><strong>Notes de fond :</strong> {baseNotes.join(', ')}</li>}
                  </ul>
                </>
              )}
            </TabsContent>
            <TabsContent value="additional-info" className="py-6">
              <div className="space-y-2">
                <p><strong>Poids :</strong> environ 450g (colis compris)</p>
                <p><strong>Dimensions :</strong> non spécifiées</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <CustomerReviews productName={product.name} limit={5} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Section "Vous pourriez aussi aimer" - Produits recommandés intelligemment */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline mb-3">{recommendationContextText}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez nos sélections basées sur vos préférences et les avis d'autres clients
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
      <StickyMobileAddToCart product={product} />
    </>
  );
}
