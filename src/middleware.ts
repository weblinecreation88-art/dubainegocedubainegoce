import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Handle old WordPress URLs with query parameters
  // /produit/slug/?add-to-cart=xxx → /parfum/slug
  // /panier/?remove_item=xxx → /cart
  // /categorie-produit/xxx → /shop

  if (url.pathname.startsWith('/produit/')) {
    const slugMatch = url.pathname.match(/^\/produit\/([^/?]+)/);
    if (slugMatch) {
      const productSlug = slugMatch[1];
      return NextResponse.redirect(new URL(`/parfum/${productSlug}`, request.url), { status: 301 });
    }
  }

  if (url.pathname.startsWith('/panier/') || url.pathname === '/panier') {
    return NextResponse.redirect(new URL('/cart', request.url), { status: 301 });
  }

  if (url.pathname.startsWith('/categorie-produit/')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // WordPress taxonomy: /genre/, /tag/, /marque/, /fruite/, /category/
  if (url.pathname.startsWith('/genre/') ||
      url.pathname.startsWith('/tag/') ||
      url.pathname.startsWith('/marque/') ||
      url.pathname.startsWith('/collection/') ||
      url.pathname.startsWith('/fruite/') ||
      url.pathname.startsWith('/category/')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // Old WordPress brand/listing pages → shop
  if (url.pathname.startsWith('/parfums-de-dubai') ||
      url.pathname.startsWith('/parfums-lattafa') ||
      url.pathname.startsWith('/parfums-maison-alhambra') ||
      url.pathname.startsWith('/parfums-') ) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 301 });
  }

  // WordPress duplicate/old pages → home
  if (url.pathname.startsWith('/cart-2') ||
      url.pathname.startsWith('/checkout-2') ||
      url.pathname.startsWith('/my-account-2') ||
      url.pathname.startsWith('/accueil-2') ||
      url.pathname.startsWith('/perfume-finder') ||
      url.pathname.startsWith('/test2') ||
      url.pathname.startsWith('/f-a-q') ||
      url.pathname.startsWith('/blog/')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // WordPress account/checkout pages
  if (url.pathname.startsWith('/mon-compte/') ||
      url.pathname.startsWith('/mon-compte')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // WordPress system files
  if (url.pathname.startsWith('/wp-admin') ||
      url.pathname.startsWith('/wp-content') ||
      url.pathname.startsWith('/wp-json') ||
      url.pathname.startsWith('/wp-login') ||
      url.pathname.startsWith('/feed') ||
      url.pathname.startsWith('/xmlrpc.php') ||
      url.pathname.startsWith('/sitemap')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // WordPress query-based URLs: /?p=xxx, /?page_id=xxx, /?product_cat=xxx, /?add-to-cart=xxx
  if (url.searchParams.has('p') ||
      url.searchParams.has('page_id') ||
      url.searchParams.has('product_cat') ||
      url.searchParams.has('product_tag') ||
      url.searchParams.has('add-to-cart') ||
      url.searchParams.has('remove_item')) {
    return NextResponse.redirect(new URL(url.pathname, request.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
