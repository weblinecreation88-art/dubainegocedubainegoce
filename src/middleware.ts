import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. Sitemap legacy WordPress (sitemap_index.xml -> sitemap.xml)
  if (pathname === '/sitemap_index.xml' || pathname === '/sitemap_index.xml/') {
    return NextResponse.redirect(new URL('/sitemap.xml', request.url), { status: 301 });
  }

  // 2. Requêtes WordPress par post_type
  if (url.searchParams.get('post_type') === 'product') {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }
  if (url.searchParams.get('post_type') === 'blocks') {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // 3. Ancienne boutique WooCommerce (/boutique et /boutique/...)
  if (pathname === '/boutique' || pathname.startsWith('/boutique/')) {
    const brand = url.searchParams.get('brand') || url.searchParams.get('brands');
    if (brand) {
      const lower = brand.toLowerCase();
      if (lower.includes('lattafa')) return NextResponse.redirect(new URL('/shop/marque/lattafa', request.url), { status: 301 });
      if (lower.includes('alhambra')) return NextResponse.redirect(new URL('/shop/marque/maison-alhambra', request.url), { status: 301 });
      if (lower.includes('fragrance')) return NextResponse.redirect(new URL('/shop/marque/fragrance-world', request.url), { status: 301 });
    }
    const family = url.searchParams.get('families') || url.searchParams.get('family');
    if (family) {
      const cleanFam = family.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (cleanFam.includes('oud')) return NextResponse.redirect(new URL('/shop/famille/oud', request.url), { status: 301 });
      if (cleanFam.includes('boise')) return NextResponse.redirect(new URL('/shop/famille/boise', request.url), { status: 301 });
      if (cleanFam.includes('gourmand')) return NextResponse.redirect(new URL('/shop/famille/gourmand', request.url), { status: 301 });
      if (cleanFam.includes('floral')) return NextResponse.redirect(new URL('/shop/famille/floral', request.url), { status: 301 });
      if (cleanFam.includes('oriental')) return NextResponse.redirect(new URL('/shop/famille/oriental', request.url), { status: 301 });
    }
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // 4. Étiquettes produits WooCommerce (/etiquette-produit/...)
  if (pathname.startsWith('/etiquette-produit/')) {
    if (pathname.includes('french-avenue')) {
      return NextResponse.redirect(new URL('/shop/marque/french-avenue', request.url), { status: 301 });
    }
    if (pathname.includes('floral')) {
      return NextResponse.redirect(new URL('/shop/famille/floral', request.url), { status: 301 });
    }
    if (pathname.includes('parfum-femme')) {
      return NextResponse.redirect(new URL('/shop/genre/femme', request.url), { status: 301 });
    }
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // 5. Anciens articles de blog & landing pages WooCommerce
  if (pathname.startsWith('/best-sellers-homme') || pathname.startsWith('/meilleurs-parfums-orientaux-homme')) {
    return NextResponse.redirect(new URL('/shop/genre/homme', request.url), { status: 301 });
  }
  if (pathname.startsWith('/best-sellers-femme')) {
    return NextResponse.redirect(new URL('/shop/genre/femme', request.url), { status: 301 });
  }
  if (pathname.startsWith('/top-5-parfums-mixtes')) {
    return NextResponse.redirect(new URL('/blog/top-5-lattafa-2025', request.url), { status: 301 });
  }
  if (pathname.startsWith('/top-5-parfums-femme')) {
    return NextResponse.redirect(new URL('/blog/parfums-orientaux-femme-2026', request.url), { status: 301 });
  }
  if (pathname.startsWith('/alternatives-parfums-luxe')) {
    return NextResponse.redirect(new URL('/blog/dupes-parfums-luxe', request.url), { status: 301 });
  }
  if (pathname.startsWith('/les-meilleures-notes-oud')) {
    return NextResponse.redirect(new URL('/blog/guide-parfum-oud', request.url), { status: 301 });
  }
  if (pathname.startsWith('/nos-tops-parfums')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }
  if (pathname.startsWith('/contact-2')) {
    return NextResponse.redirect(new URL('/contact', request.url), { status: 301 });
  }
  if (pathname.startsWith('/suivez-nous')) {
    return NextResponse.redirect(new URL('/about', request.url), { status: 301 });
  }

  // 6. Anciennes URLs de produits WooCommerce
  if (pathname.startsWith('/eau-de-parfum-')) {
    const slug = pathname.replace(/^\/eau-de-parfum-/, '').replace(/\/$/, '');
    return NextResponse.redirect(new URL(`/parfum/${slug}`, request.url), { status: 301 });
  }
  if (pathname.startsWith('/produit/')) {
    const slugMatch = pathname.match(/^\/produit\/([^/?]+)/);
    if (slugMatch) {
      const productSlug = slugMatch[1];
      return NextResponse.redirect(new URL(`/parfum/${productSlug}`, request.url), { status: 301 });
    }
  }

  // 7. Anciens paniers & catégories
  if (pathname.startsWith('/panier/') || pathname === '/panier') {
    return NextResponse.redirect(new URL('/cart', request.url), { status: 301 });
  }
  if (pathname.startsWith('/categorie-produit/')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // 8. Taxonomies WP diverses
  if (pathname.startsWith('/genre/') ||
      pathname.startsWith('/tag/') ||
      pathname.startsWith('/marque/') ||
      pathname.startsWith('/collection/') ||
      pathname.startsWith('/fruite/') ||
      pathname.startsWith('/category/')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  if (pathname.startsWith('/parfums-de-dubai') ||
      pathname.startsWith('/parfums-lattafa') ||
      pathname.startsWith('/parfums-maison-alhambra') ||
      pathname.startsWith('/parfums-')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // 9. Pages dupliquées WordPress
  if (pathname.startsWith('/cart-2') ||
      pathname.startsWith('/checkout-2') ||
      pathname.startsWith('/my-account-2') ||
      pathname.startsWith('/accueil-2') ||
      pathname.startsWith('/perfume-finder') ||
      pathname.startsWith('/test2') ||
      pathname.startsWith('/f-a-q')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  if (pathname.startsWith('/mon-compte/') || pathname.startsWith('/mon-compte')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // 10. Fichiers et flux techniques WordPress (évite le gaspillage de crawl)
  if (pathname.startsWith('/wp-admin') ||
      pathname.startsWith('/wp-content') ||
      pathname.startsWith('/wp-json') ||
      pathname.startsWith('/wp-login') ||
      pathname === '/xmlrpc.php' ||
      pathname === '/feed' ||
      pathname === '/feed/' ||
      pathname.endsWith('/feed') ||
      pathname.endsWith('/feed/')) {
    return new NextResponse(null, { status: 410 });
  }

  // 11. Nettoyage des paramètres d'URL WooCommerce (évite les boucles de redirection)
  if (url.searchParams.has('p') ||
      url.searchParams.has('page_id') ||
      url.searchParams.has('attachment_id') ||
      url.searchParams.has('product_cat') ||
      url.searchParams.has('product_tag') ||
      url.searchParams.has('add-to-cart') ||
      url.searchParams.has('remove_item') ||
      url.searchParams.has('wc-ajax') ||
      url.searchParams.has('_wpnonce')) {
    return NextResponse.redirect(new URL(pathname === '/' ? '/shop' : pathname, request.url), { status: 301 });
  }

  const response = NextResponse.next();
  if (/^\/(account|admin|cart|checkout|login|signup|wishlist)(\/|$)/.test(pathname) || url.searchParams.has('q')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
