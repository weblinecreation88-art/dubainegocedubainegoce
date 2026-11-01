import { getBrandPath } from '@/lib/catalog-urls';
import { getProductBySlug, getProducts, computeShippingCost } from '@/lib/data';
import { getSmartRelatedProducts } from '@/lib/product-recommendations';
import { permanentRedirect } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Truck, ShieldCheck, RotateCcw, Check, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { ProductActions } from '@/components/product/product-actions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ProductGallery } from '@/components/product/product-gallery';
import { JsonLd } from '@/components/seo/json-ld';
import { StickyMobileAddToCart } from '@/components/product/sticky-mobile-add-to-cart';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Parfums de Dubaï | Dubaï Négoce',
      robots: { index: false, follow: true },
    };
  }

  const imageUrl = product.images.length > 0 ? product.images[0] : `${SITE_URL}/og-image.png`;
  const fullUrl = `${SITE_URL}/parfum/${product.slug}`;
  const enrichedDescription = `${product.metaDescription} | Eau de Parfum ${product.volumeMl}ml | ${product.price.toFixed(2)} € TTC | Livraison Colissimo offerte dès 3 parfums.`;

  const keywords = [
    product.name,
    product.brand.name,
    product.family,
    product.gender,
    ...product.tags.slice(0, 3),
    'parfum dubaï',
    'dubainegoce',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    title: product.metaTitle,
    description: enrichedDescription,
    keywords,
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
    robots: {
      index: true,
      follow: true,
      googleBot: 'index, follow, max-image-preview:large',
    },
  };
}

function extractNotesFromHtml(html: string): { top: string[]; heart: string[]; base: string[] } | null {
  const pyramidMatch = html.match(/Pyramide Olfactive[\s\S]*?<p>([\s\S]*?)<\/p>/i);
  if (!pyramidMatch) return null;
  const para = pyramidMatch[1];
  const strongs = [...para.matchAll(/<strong>([^<]+)<\/strong>/g)].map((m) => m[1]);
  const noteStrongs = strongs.slice(1, 4);
  if (noteStrongs.length < 3) return null;
  return {
    top: noteStrongs[0].split(',').map((s) => s.trim()),
    heart: noteStrongs[1].split(',').map((s) => s.trim()),
    base: noteStrongs[2].split(',').map((s) => s.trim()),
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    permanentRedirect('/shop/all');
  }

  if (product.slug !== decodeURIComponent(params.slug)) {
    permanentRedirect(`/parfum/${product.slug}`);
  }

  const relatedProducts = getSmartRelatedProducts(product, 4);

  const extractedNotes =
    !product.topNotes && !product.heartNotes && !product.baseNotes
      ? extractNotesFromHtml(product.longDescription || '')
      : null;
  const topNotes = product.topNotes?.length ? product.topNotes : extractedNotes?.top ?? [];
  const heartNotes = product.heartNotes?.length ? product.heartNotes : extractedNotes?.heart ?? [];
  const baseNotes = product.baseNotes?.length ? product.baseNotes : extractedNotes?.base ?? [];
  const hasOlfactoryPyramid = topNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0;

  const stockLevel = product.stock > 0 ? 'InStock' : 'OutOfStock';
  const plainDescription = (product.metaDescription || product.shortDescription || product.name)
    .replace(/<[^>]*>?/gm, '')
    .trim();

  const referenceCode = `DN-${product.brand.name.substring(0, 3).toUpperCase()}-${product.id.padStart(3, '0')}`;

  // JSON-LD strictement basé sur les données réelles du produit (sans faux avis générés)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://dubainegoce.fr/parfum/${product.slug}`,
    name: product.name,
    image: product.images.map(image => new URL(image, SITE_URL).href),
    description: plainDescription,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
      url: 'https://dubainegoce.fr',
    },
    sku: product.id,
    productType: 'Fragrance',
    category: product.family,
    offers: {
      '@type': 'Offer',
      '@id': `https://dubainegoce.fr/parfum/${product.slug}#offer`,
      url: `https://dubainegoce.fr/parfum/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: `https://schema.org/${stockLevel}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Dubai Negoce',
        url: 'https://dubainegoce.fr',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: computeShippingCost('colissimo', 'FR', 1, product.price).toFixed(2),
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
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
    manufacturer: {
      '@type': 'Organization',
      name: product.brand.name,
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
        name: product.brand.name,
        item: `https://dubainegoce.fr${getBrandPath(product.brand.name)}`,
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

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Fil d'Ariane encadré style PrestaShop */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#6f6559] mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-[#a8834f] font-medium transition-colors">
            Accueil
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link href="/shop/all" className="hover:text-[#a8834f] font-medium transition-colors">
            Tous les parfums
          </Link>
          <span className="text-gray-400">&gt;</span>
          <Link
            href={getBrandPath(product.brand.name)}
            className="hover:text-[#a8834f] font-medium transition-colors"
          >
            {product.brand.name}
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-[#1d1a16] truncate max-w-[260px]">{product.name}</span>
        </nav>

        {/* BLOC PRINCIPAL PRESTASHOP 3 COLONNES (se réorganise naturellement sur mobile) */}
        <div className="bg-white">
          <div className="storefront-detail-grid grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
            {/* COLONNE 1 (Gauche - 5/12) : Galerie Produit */}
            <div className="order-1 lg:col-span-5">
              <ProductGallery
                alt={`Parfum ${product.brand.name} ${product.name} - ${product.volumeMl} ml`}
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Résumé mobile avant la boîte d'achat : prix et bouton suivent directement l'image. */}
            <div className="order-2 lg:hidden">
              <Link href={getBrandPath(product.brand.name)} className="text-[11px] uppercase tracking-[0.18em] text-[#6f6559]">
                {product.brand.name}
              </Link>
              <h1 className="text-[34px] font-headline font-normal text-[#1d1a16] leading-[1.08] mt-1">{product.name}</h1>
              <p className="text-xs text-gray-600">Eau de Parfum • {product.volumeMl || 100} ml</p>
            </div>

            {/* COLONNE 2 (Centre - 4/12) : Informations Produit, Contenance, Notes & Disponibilité */}
            <div className="order-4 lg:order-2 lg:col-span-4 space-y-4">
              <div className="hidden lg:block">
                <Link
                  href={getBrandPath(product.brand.name)}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#6f6559] hover:text-[#a8834f]"
                >
                  {product.brand.name}
                </Link>
                <h1 className="text-[40px] xl:text-[46px] font-headline font-normal text-[#1d1a16] mt-2 leading-[1.05]">
                  {product.name}
                </h1>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Eau de Parfum • Flacon vaporisateur {product.volumeMl || 100} ml
                </p>
              </div>

              {/* Réf & État style PrestaShop */}
              <div className="text-xs text-[#5d564c] space-y-1.5 border-y border-[#e6ded1] py-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Référence :</span>
                  <span className="font-mono font-bold text-[#1d1a16]">{referenceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">État :</span>
                  <span className="font-bold text-[#1d1a16]">Neuf sous blister d&apos;origine</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Contenance :</span>
                  <span className="font-bold text-[#1d1a16]">{product.volumeMl || 100} ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Genre :</span>
                  <span className="font-bold text-[#1d1a16] capitalize">{product.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Famille olfactive :</span>
                  <span className="font-bold text-[#1d1a16]">{product.family}</span>
                </div>
              </div>

              {/* Extrait court */}
              {product.shortDescription && (
                <p className="text-sm text-gray-700 leading-relaxed">{product.shortDescription}</p>
              )}

              {/* Pyramide Olfactive claire */}
              {hasOlfactoryPyramid && (
                <div className="border-t border-[#e6ded1] pt-4 space-y-2.5">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#1d1a16]">
                    Pyramide Olfactive
                  </h2>
                  <div className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                    {topNotes.length > 0 && (
                      <div className="p-2 rounded bg-[#faf7f2] border border-[#e6ded1]/70">
                        <strong className="text-[#1d1a16]">Notes de tête :</strong> {topNotes.join(', ')}
                      </div>
                    )}
                    {heartNotes.length > 0 && (
                      <div className="p-2 rounded bg-[#faf7f2] border border-[#e6ded1]/70">
                        <strong className="text-[#1d1a16]">Notes de cœur :</strong> {heartNotes.join(', ')}
                      </div>
                    )}
                    {baseNotes.length > 0 && (
                      <div className="p-2 rounded bg-[#faf7f2] border border-[#e6ded1]/70">
                        <strong className="text-[#1d1a16]">Notes de fond :</strong> {baseNotes.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="border-t border-[#e6ded1] pt-3">
                <div className="flex flex-wrap gap-1.5">
                  <Link href={`/shop/all?families=${encodeURIComponent(product.family)}`}>
                    <Badge variant="secondary" className="bg-[#f3ede3] text-[#1d1a16] border border-[#e6ded1] text-xs">
                      {product.family}
                    </Badge>
                  </Link>
                  <Link href={`/shop/all?genders=${encodeURIComponent(product.gender)}`}>
                    <Badge variant="secondary" className="bg-[#f3ede3] text-[#1d1a16] border border-[#e6ded1] capitalize text-xs">
                      {product.gender}
                    </Badge>
                  </Link>
                  {product.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-[#e6ded1] text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* COLONNE 3 (Droite - 3/12) : Boîte d'achat PrestaShop & Frais de port réels */}
            <div className="order-3 lg:order-3 lg:col-span-3 space-y-4">
              <div className="storefront-buybox bg-[#faf7f2] p-5 sm:p-6 space-y-4">
                {/* Prix TTC & Disponibilité */}
                <div className="border-b border-[#e6ded1] pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <span className="whitespace-nowrap text-2xl xl:text-[28px] font-medium text-[#1d1a16]">
                        {product.price.toFixed(2)} €
                      </span>
                      <span className="text-xs text-gray-600 ml-1.5 font-semibold">TTC</span>
                    </div>
                    {product.stock > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-[#4f7a4a]">
                        <Check className="h-3 w-3 stroke-[3]" /> En stock
                      </span>
                    ) : (
                      <span className="bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded-[2px]">
                        Rupture
                      </span>
                    )}
                  </div>
                  {product.stock > 0 && product.stock <= 3 && (
                    <p className="text-xs text-amber-800 font-semibold mt-1.5">
                      Plus que {product.stock} exemplaire{product.stock > 1 ? 's' : ''} disponible{product.stock > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {/* Sélecteur de quantité + Bouton d'ajout + Favoris + Badges paiement */}
                <ProductActions product={product} />

                {product.stock <= 0 && (
                  <div className="border-t border-[#e6ded1] pt-4">
                    <p className="text-xs text-gray-700 mb-3">
                      Ce parfum est momentanément indisponible. Découvrez des alternatives disponibles de la même famille olfactive.
                    </p>
                    <Link
                      href={`/shop/all?families=${encodeURIComponent(product.family)}`}
                      className="inline-flex w-full items-center justify-center rounded-[2px] border border-[#1d1a16] bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#1d1a16] transition-colors hover:bg-[#1d1a16] hover:text-white"
                    >
                      Voir les alternatives disponibles
                    </Link>
                  </div>
                )}
              </div>

              {/* Encadré de livraison et garanties strictement conforme au panier */}
              <div className="border-t border-[#e6ded1] pt-4 space-y-3 text-xs text-[#5d564c]">
                <div className="font-bold text-[#1d1a16] uppercase tracking-wider border-b border-[#e6ded1] pb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#a8834f]" />
                  <span>Livraison &amp; Retours</span>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-[#a8834f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1d1a16]">Colissimo Domicile suivi :</strong>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        1 parfum : 7,10 € • 2 parfums : 9,59 € •{' '}
                        <strong className="text-[#46a74e]">Offert dès 3 parfums</strong>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#a8834f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1d1a16]">Parfum 100 % authentique :</strong>
                      <div className="text-[11px] text-gray-600">
                        Flacon neuf scellé sous blister d&apos;origine {product.brand.name}.
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <RotateCcw className="h-4 w-4 text-[#a8834f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1d1a16]">Retour sous 14 jours :</strong>
                      <div className="text-[11px] text-gray-600">
                        Sur produit neuf non ouvert sous son film plastique d&apos;origine.
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ONGLETS FICHE TECHNIQUE & DESCRIPTION DÉTAILLÉE */}
        <div className="mt-12 sm:mt-16 bg-white">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start gap-6 rounded-none bg-transparent p-0 h-auto border-b border-[#e6ded1] flex-wrap">
              <TabsTrigger
                value="description"
                className="rounded-none px-0 py-3 text-sm font-normal text-[#6f6559] border-b-2 border-transparent -mb-px data-[state=active]:border-[#1d1a16] data-[state=active]:bg-transparent data-[state=active]:text-[#1d1a16] data-[state=active]:shadow-none"
              >
                Description détaillée
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="rounded-none px-0 py-3 text-sm font-normal text-[#6f6559] border-b-2 border-transparent -mb-px data-[state=active]:border-[#1d1a16] data-[state=active]:bg-transparent data-[state=active]:text-[#1d1a16] data-[state=active]:shadow-none"
              >
                Caractéristiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 sm:p-8 m-0">
              <div
                className="prose max-w-none product-description text-gray-800"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            </TabsContent>

            <TabsContent value="specs" className="p-6 sm:p-8 m-0">
              <table className="w-full max-w-2xl text-sm border-collapse border border-[#e6ded1]">
                <tbody>
                  <tr className="bg-[#faf7f2]">
                    <th className="border border-[#e6ded1] p-3 text-left font-bold w-1/3">Marque</th>
                    <td className="border border-[#e6ded1] p-3">{product.brand.name}</td>
                  </tr>
                  <tr>
                    <th className="border border-[#e6ded1] p-3 text-left font-bold">Contenance</th>
                    <td className="border border-[#e6ded1] p-3">{product.volumeMl || 100} ml</td>
                  </tr>
                  <tr className="bg-[#faf7f2]">
                    <th className="border border-[#e6ded1] p-3 text-left font-bold">Concentration</th>
                    <td className="border border-[#e6ded1] p-3">Eau de Parfum (EDP)</td>
                  </tr>
                  <tr>
                    <th className="border border-[#e6ded1] p-3 text-left font-bold">Genre</th>
                    <td className="border border-[#e6ded1] p-3 capitalize">{product.gender}</td>
                  </tr>
                  <tr className="bg-[#faf7f2]">
                    <th className="border border-[#e6ded1] p-3 text-left font-bold">Famille olfactive</th>
                    <td className="border border-[#e6ded1] p-3">{product.family}</td>
                  </tr>
                  <tr>
                    <th className="border border-[#e6ded1] p-3 text-left font-bold">Conditionnement</th>
                    <td className="border border-[#e6ded1] p-3">Flacon vaporisateur neuf sous blister</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>

        {/* SECTION : VOUS POURRIEZ AUSSI AIMER */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between border-b border-[#e6ded1] pb-4 mb-8">
              <h2 className="text-[30px] sm:text-[38px] font-headline font-normal leading-none text-[#1d1a16]">
                Vous pourriez aussi aimer
              </h2>
              <Link href="/shop/all" className="text-xs font-bold uppercase tracking-wider text-[#a8834f] hover:underline">
                Voir tout le catalogue →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <StickyMobileAddToCart product={product} />
    </>
  );
}
