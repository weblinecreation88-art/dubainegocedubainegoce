

import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Star, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductImage } from '@/components/product/product-image';
import { PerfumeFinderCta } from '@/components/perfume-finder-cta';

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
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
            <ProductImage
              alt={product.name}
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
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-dubainegoce-color fill-dubainegoce-color' : 'text-muted-foreground/50'}`} />
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.toFixed(1)})</span>
            </div>
             <div className="flex flex-wrap gap-2 mt-4">
                <Link href={`/shop?families=${product.family}`}><Badge variant="secondary">{product.family}</Badge></Link>
                <Link href={`/shop?genders=${product.gender}`}><Badge variant="secondary" className="capitalize">{product.gender}</Badge></Link>
                {product.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{product.shortDescription}</p>

          <div className="flex items-baseline gap-4">
             <span className="text-4xl font-bold text-dubainegoce-color">{product.price.toFixed(2)} €</span>
             {product.volumeMl > 0 && <span className="text-sm text-muted-foreground">/ {product.volumeMl}ml</span>}
          </div>

          <AddToCartButton product={product} size="lg" className="w-full">
            Ajouter au panier
          </AddToCartButton>

          <div className="border border-dubainegoce-color/20 rounded-lg p-4 space-y-4 bg-gradient-to-br from-rose-50/30 to-pink-50/30 dark:from-rose-950/10 dark:to-pink-950/10">
            <div className="flex items-center gap-4">
                <Truck className="h-6 w-6 text-dubainegoce-color" />
                <div>
                    <p className="font-semibold">Livraison Rapide</p>
                    <p className="text-sm text-muted-foreground">Expédié en 48h, livraison Colissimo ou Mondial Relay.</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-dubainegoce-color" />
                <div>
                    <p className="font-semibold">100% Authentique</p>
                    <p className="text-sm text-muted-foreground">Produits importés directement de Dubaï.</p>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <RotateCcw className="h-6 w-6 text-dubainegoce-color" />
                <div>
                    <p className="font-semibold">Satisfait ou Remboursé</p>
                    <p className="text-sm text-muted-foreground">Retournez votre précieux sous 14 jours et nous vous remboursons.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-dubainegoce-color/10">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="additional-info">Infos complémentaires</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
             <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
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
            <p>Aucun avis pour le moment.</p>
          </TabsContent>
        </Tabs>
      </div>

       <div className="my-16">
          <PerfumeFinderCta />
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
  );
}
