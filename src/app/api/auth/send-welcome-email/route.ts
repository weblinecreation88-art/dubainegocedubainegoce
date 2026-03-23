import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
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

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }
  return new Resend(apiKey);
}

/**
 * Sélectionner les 3 meilleurs produits du moment
 * Critères: Best-sellers + nouveautés + nota haute
 */
function getFeaturedProducts() {
  const allProducts = getProducts();

  // Trier par: bestsellers d'abord, puis notés, puis nouveautés
  const featured = allProducts
    .filter(p => p.price === 35) // Tous les parfums à 35€
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
      image: p.images[0] || 'https://picsum.photos/seed/parfum/400/400',
      price: p.price,
      slug: p.slug,
      shortDescription: p.shortDescription
    }));

  return featured.length > 0
    ? featured
    : // Fallback si pas assez de produits
      [
        {
          name: 'Woody Oud 80ml',
          brand: 'Maison Alhambra',
          image: 'https://picsum.photos/seed/woody-oud/400/400',
          price: 35,
          slug: 'woody-oud-80-ml-maison-alhambra',
          shortDescription: 'Essence boisée captivante'
        },
        {
          name: 'Lattafa Premium',
          brand: 'Lattafa',
          image: 'https://picsum.photos/seed/lattafa/400/400',
          price: 35,
          slug: 'asad-lattafa',
          shortDescription: 'Prestige oriental'
        },
        {
          name: 'Fragrance World',
          brand: 'Fragrance World',
          image: 'https://picsum.photos/seed/fragrance/400/400',
          price: 35,
          slug: 'fragrance-world-classic',
          shortDescription: 'Charme intemporel'
        }
      ];
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

    // Vérifier que c'est une demande interne (optionnel, pour la sécurité)
    const authHeader = request.headers.get('authorization');
    const isValidRequest =
      authHeader?.startsWith('Bearer ') ||
      request.headers.get('x-internal-request') === 'true';

    // Vous pouvez ajouter une vérification supplémentaire si vous le souhaitez
    // Pour l'instant, on laisse ouvert pour l'inscription

    // Récupérer les produits à présenter
    const featuredProducts = getFeaturedProducts();

    // Créer l'email
    const emailHtml = renderWelcomeEmail(name, email, featuredProducts);

    // Envoyer via Resend
    const resend = getResendClient();
    const fromEmail = process.env.FROM_EMAIL || 'bienvenue@dubainegoce.fr';

    const result = await resend.emails.send({
      from: `DubaiNegoce 🌹 <${fromEmail}>`,
      to: [email],
      subject: `🎉 Bienvenue ${name}, dans la communauté DubaiNegoce!`,
      html: emailHtml,
      replyTo: 'contact@dubainegoce.fr'
    });

    if (!(result as any).id) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: `Email de bienvenue envoyé à ${email}`,
      emailId: (result as any).id,
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
