import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { renderWelcomeEmail } from '@/lib/email-templates/welcome-new-user';
import { getProducts } from '@/lib/data';

/**
 * API Endpoint pour envoyer un email de bienvenue aux nouveaux utilisateurs
 * POST /api/auth/send-welcome-email
 *
 * Body:
 * {
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "userId": "firebase-user-id"
 * }
 */

export const dynamic = 'force-dynamic';



/**
 * Sélectionner les 3 meilleurs produits du moment
 * Critères: Best-sellers + nouveautés + nota haute
 */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

/** Les e-mails exigent des URLs absolues pour les images. */
function absoluteImage(src?: string): string {
  if (!src) return `${APP_URL}/dubainegoce.png`;
  return src.startsWith('http') ? src : `${APP_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

function getFeaturedProducts() {
  const allProducts = getProducts();

  // Trier par: bestsellers d'abord, puis notés, puis nouveautés
  const featured = allProducts
    .filter(p => p.price === 35 && p.stock > 0) // Parfums à 35€ disponibles
    .sort((a, b) => {
      // 1. Best-sellers en premier
      if (a.isBestseller !== b.isBestseller) {
        return a.isBestseller ? -1 : 1;
      }
      // 2. Note élevée
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      // 3. Nouveautés
      if (a.isNew !== b.isNew) {
        return a.isNew ? -1 : 1;
      }
      return 0;
    })
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      brand: p.brand.name,
      image: absoluteImage(p.images[0]),
      price: p.price,
      slug: p.slug,
      shortDescription: p.shortDescription
    }));

  return featured;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, userId } = body;

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'email and name required' },
        { status: 400 }
      );
    }

    // Seul l'utilisateur qui vient de s'inscrire peut declencher son e-mail :
    // sans cela, n'importe qui pourrait faire envoyer des e-mails par le site.
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
    }
    try {
      const { auth } = await import('@/firebase/server');
      const decoded = await auth.verifyIdToken(idToken);
      if ((decoded.email || '').toLowerCase() !== String(email).toLowerCase()) {
        return NextResponse.json({ error: 'Adresse e-mail non autorisée.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
    }

    // Récupérer les produits à présenter
    const featuredProducts = getFeaturedProducts();

    // Créer l'email
    const emailHtml = renderWelcomeEmail(name, email, featuredProducts);

    // Envoyer via Brevo
    const result = await sendEmail({
      to: email,
      subject: `🎉 Bienvenue ${name}, dans la communauté DubaiNegoce!`,
      html: emailHtml,
      fromName: 'DubaiNegoce 🌹',
      replyTo: 'contact@dubainegoce.fr',
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: `Email de bienvenue envoyé à ${email}`,
      emailId: result.messageId,
      user: {
        name,
        email,
        userId
      },
      featuredProducts: featuredProducts.map(p => ({
        name: p.name,
        brand: p.brand,
        price: p.price
      }))
    });
  } catch (error) {
    console.error('Send welcome email error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint pour vérifier les produits en vedette
 * GET /api/auth/send-welcome-email?preview=true
 */
export async function GET(request: NextRequest) {
  try {
    const preview = request.nextUrl.searchParams.get('preview');

    if (preview === 'true') {
      const featuredProducts = getFeaturedProducts();

      return NextResponse.json({
        featured_products: featuredProducts,
        count: featuredProducts.length
      });
    }

    return NextResponse.json(
      { message: 'Use POST to send welcome email, GET with ?preview=true to see featured products' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get preview' },
      { status: 500 }
    );
  }
}
