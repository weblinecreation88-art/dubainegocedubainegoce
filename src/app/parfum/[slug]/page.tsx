

import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Star, Truck, ShieldCheck, RotateCcw, Package, Flame } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductImage } from '@/components/product/product-image';
import { JsonLd } from '@/components/seo/json-ld';
import { ProductPageClient } from './product-page-client';

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

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
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

  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]">
              <ProductImage
                alt={product.name}
                images={product.images}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
                priority
              />
              {/* Stock badge on image */}
              {product.stock <= 7 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] uppercase tracking-widest px-3 py-1 font-luxury-body">
                  {product.stock <= 3 ? `Plus que ${product.stock} en stock !` : 'Stock limité'}
                </div>
              )}
            </div>
            {/* Social proof under image */}
            <div className="mt-4 flex items-center justify-center gap-6 text-black/40">
              <span className="text-[10px] font-luxury-body uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" /> 100% Authentique
              </span>
              <span className="text-[10px] font-luxury-body uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-[#D4AF37]" /> Expédié sous 48h
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand + Name */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-luxury-body mb-1">{product.brand.name}</p>
              <h1 className="text-3xl md:text-4xl font-luxury-headline font-bold text-black">{product.name}</h1>
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-black/10'}`} />
                  ))}
                </div>
                <span className="text-sm text-black/40 font-luxury-body">{product.rating.toFixed(1)} · Avis vérifiés</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/shop?families=${product.family}`}>
                <span className="text-[9px] uppercase tracking-wider text-black/50 border border-black/10 px-3 py-1 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors font-luxury-body">
                  {product.family}
                </span>
              </Link>
              <Link href={`/shop?genders=${product.gender}`}>
                <span className="text-[9px] uppercase tracking-wider text-black/50 border border-black/10 px-3 py-1 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors font-luxury-body capitalize">
                  {product.gender}
                </span>
              </Link>
              {product.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[9px] uppercase tracking-wider text-black/30 border border-black/5 px-3 py-1 font-luxury-body">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-base text-black/60 font-luxury-body leading-relaxed">{product.shortDescription}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-luxury-headline text-black">{product.price.toFixed(2)} €</span>
              {product.volumeMl > 0 && (
                <span className="text-sm text-black/30 font-luxury-body">/ {product.volumeMl}ml</span>
              )}
            </div>

            {/* Shipping countdown (client-side) */}
            <ProductPageClient />

            {/* Add to Cart */}
            <AddToCartButton product={product} size="lg" className="w-full bg-black text-white hover:bg-[#D4AF37] hover:text-white rounded-none h-14 font-luxury-body text-[10px] uppercase tracking-[0.3em] transition-all duration-300 border-none">
              Ajouter au panier — {product.price.toFixed(2)} €
            </AddToCartButton>

            {/* Reassurance */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center border border-black/5 p-3 hover:border-[#D4AF37]/40 transition-colors">
                <Truck className="h-5 w-5 mx-auto mb-1.5 text-[#D4AF37]" />
                <p className="text-[9px] uppercase tracking-wider text-black/60 font-luxury-body leading-tight">Livraison<br />48h</p>
              </div>
              <div className="text-center border border-black/5 p-3 hover:border-[#D4AF37]/40 transition-colors">
                <ShieldCheck className="h-5 w-5 mx-auto mb-1.5 text-[#D4AF37]" />
                <p className="text-[9px] uppercase tracking-wider text-black/60 font-luxury-body leading-tight">100%<br />Authentique</p>
              </div>
              <div className="text-center border border-black/5 p-3 hover:border-[#D4AF37]/40 transition-colors">
                <RotateCcw className="h-5 w-5 mx-auto mb-1.5 text-[#D4AF37]" />
                <p className="text-[9px] uppercase tracking-wider text-black/60 font-luxury-body leading-tight">Retour<br />14 jours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description + Pyramide + Infos */}
        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent border-b border-black/5">
              <TabsTrigger value="description" className="rounded-none text-[10px] uppercase tracking-[0.2em] font-luxury-body data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent">
                Description
              </TabsTrigger>
              <TabsTrigger value="pyramide" className="rounded-none text-[10px] uppercase tracking-[0.2em] font-luxury-body data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent">
                Pyramide Olfactive
              </TabsTrigger>
              <TabsTrigger value="infos" className="rounded-none text-[10px] uppercase tracking-[0.2em] font-luxury-body data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:bg-transparent">
                Infos & Usage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-8">
              <div className="prose prose-sm max-w-none font-luxury-body text-black/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
            </TabsContent>

            <TabsContent value="pyramide" className="py-8">
              {hasOlfactoryPyramid ? (
                <div className="max-w-lg mx-auto">
                  <p className="text-center text-[10px] uppercase tracking-[0.3em] text-black/40 font-luxury-body mb-8">
                    Composition olfactive
                  </p>
                  {/* Visual pyramid */}
                  <div className="space-y-4">
                    {product.topNotes && product.topNotes.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="w-32 shrink-0">
                          <div className="h-1 bg-[#D4AF37]/30 mb-2"></div>
                          <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body">Notes de tête</p>
                          <p className="text-[8px] text-black/30 font-luxury-body">(0–30 min)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.topNotes.map((note, i) => (
                            <span key={i} className="text-[10px] border border-black/10 px-3 py-1.5 font-luxury-body text-black/70 bg-[#F9F9F9]">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.heartNotes && product.heartNotes.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="w-32 shrink-0">
                          <div className="h-1 bg-[#D4AF37]/60 mb-2"></div>
                          <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body">Notes de cœur</p>
                          <p className="text-[8px] text-black/30 font-luxury-body">(30 min–3h)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.heartNotes.map((note, i) => (
                            <span key={i} className="text-[10px] border border-black/10 px-3 py-1.5 font-luxury-body text-black/70 bg-[#F9F9F9]">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.baseNotes && product.baseNotes.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="w-32 shrink-0">
                          <div className="h-1 bg-[#D4AF37] mb-2"></div>
                          <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body">Notes de fond</p>
                          <p className="text-[8px] text-black/30 font-luxury-body">(3h+)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.baseNotes.map((note, i) => (
                            <span key={i} className="text-[10px] border border-black/10 px-3 py-1.5 font-luxury-body text-black/70 bg-[#F9F9F9]">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-black/40 font-luxury-body py-8">Pyramide olfactive non disponible pour ce produit.</p>
              )}
            </TabsContent>

            <TabsContent value="infos" className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body">Caractéristiques</p>
                  <div className="space-y-2 text-sm font-luxury-body text-black/60">
                    {product.volumeMl > 0 && <p><span className="text-black/40">Volume :</span> {product.volumeMl}ml</p>}
                    <p><span className="text-black/40">Famille olfactive :</span> {product.family}</p>
                    <p><span className="text-black/40">Genre :</span> <span className="capitalize">{product.gender}</span></p>
                    <p><span className="text-black/40">Origine :</span> Dubaï, Importé directement</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-luxury-body">Conseils d'utilisation</p>
                  <div className="space-y-2 text-sm font-luxury-body text-black/60">
                    <p>Vaporiser sur les points de chaleur : poignets, cou, décolleté.</p>
                    <p>Pour une tenue optimale, appliquer sur peau hydratée.</p>
                    <p>Conserver à l'abri de la lumière et de la chaleur.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body">Dans le même esprit</span>
              <h2 className="text-3xl md:text-4xl font-luxury-headline text-black">VOUS POURRIEZ AUSSI AIMER</h2>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.shortDescription,
        brand: {
          '@type': 'Brand',
          name: product.brand.name,
        },
        offers: {
          '@type': 'Offer',
          url: `https://dubainegoce.fr/parfum/${product.slug}`,
          priceCurrency: 'EUR',
          price: product.price,
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      }} />
    </div>
  );
}
