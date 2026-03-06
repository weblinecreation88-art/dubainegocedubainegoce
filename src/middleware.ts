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
      return NextResponse.redirect(new URL(`/parfum/${productSlug}`, request.url), { status: 307 });
    }
  }

  if (url.pathname.startsWith('/panier/')) {
    // Remove all query params and redirect to /cart
    return NextResponse.redirect(new URL('/cart', request.url), { status: 307 });
  }

  if (url.pathname.startsWith('/categorie-produit/')) {
    return NextResponse.redirect(new URL('/shop', request.url), { status: 307 });
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
