import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAuth } from 'firebase-admin/auth';
import { firestore } from '@/firebase/server';
import { renderMakeoverCampaignEmail } from '@/lib/email-templates/makeover-campaign';
import { getProducts } from '@/lib/data';

/**
 * API Endpoint pour envoyer la campagne "Dubai Négoce fait peau neuf"
 * à tous les utilisateurs inscrits
 *
 * POST /api/admin/send-makeover-campaign
 *
 * Headers:
 * - Authorization: Bearer {admin-token} (optionnel - vérification admin)
 *
 * Body (optionnel):
 * {
 *   "promoCode": "PNEUF5",
 *   "dryRun": false (si true, ne pas envoyer les emails)
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
 * Sélectionner les 3 parfums tendance
 * Critères: Variété de genres, notes élevées, bestsellers
 */
function getTrendyProducts() {
  const allProducts = getProducts();

  // Filtrer les produits: parfums populaires et bien notés
  const trendyProducts = allProducts
    .filter(p => p.price === 35 && p.rating >= 4.0) // Prix 35€ et bonne note
    .sort((a, b) => {
      // Priorité: bestsellers, puis rating élevé
      if (a.isBestseller !== b.isBestseller) {
        return a.isBestseller ? -1 : 1;
      }
      return b.rating - a.rating;
    })
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      brand: p.brand.name,
      image: p.images[0] || `https://picsum.photos/seed/${p.slug}/400/400`,
      price: p.price,
      slug: p.slug,
      shortDescription: p.shortDescription
    }));

  return trendyProducts.length > 0
    ? trendyProducts
    : // Fallback si pas assez de produits
      [
        {
          name: 'Creed Aventus',
          brand: 'Creed',
          image: 'https://picsum.photos/seed/creed-aventus/400/400',
          price: 35,
          slug: 'creed-aventus',
          shortDescription: 'Essence de luxe'
        },
        {
          name: 'Black Opium',
          brand: 'Yves Saint Laurent',
          image: 'https://picsum.photos/seed/black-opium/400/400',
          price: 35,
          slug: 'black-opium-ysl',
          shortDescription: 'Mystérieux et séducteur'
        },
        {
          name: 'Sauvage',
          brand: 'Dior',
          image: 'https://picsum.photos/seed/sauvage/400/400',
          price: 35,
          slug: 'sauvage-dior',
          shortDescription: 'Intemporel et élégan'
        }
      ];
}

/**
 * Récupérer tous les utilisateurs inscrits
 */
async function getAllUsers() {
  try {
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.get();

    const users: Array<{ email: string; displayName: string; userId: string }> = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        users.push({
          email: data.email,
          displayName: data.displayName || data.email.split('@')[0],
          userId: doc.id
        });
      }
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users from Firestore');
  }
}

/**
 * Logger l'email envoyé dans Firestore
 */
async function logEmailSent(
  email: string,
  type: string,
  subject: string,
  resendId: string,
  promoCode: string
) {
  try {
    await firestore.collection('emailLogs').add({
      email,
      recipient: email,
      type,
      subject,
      resendId,
      promoCode,
      status: 'sent',
      opened: false,
      clicked: false,
      sentAt: new Date(),
      campaignType: 'makeover-campaign'
    });
  } catch (error) {
    console.error('Error logging email:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { promoCode = 'PNEUF5', dryRun = false } = body;

    // Vérification basique d'autorisation (optionnel)
    const authHeader = request.headers.get('authorization');
    const isAdminRequest = authHeader?.startsWith('Bearer ') ||
                          request.headers.get('x-internal-request') === 'true';

    // Pour la sécurité, vous pouvez ajouter une vérification d'admin token
    // if (!isAdminRequest) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Récupérer tous les utilisateurs
    const users = await getAllUsers();

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No users found to send emails to',
          count: 0
        },
        { status: 400 }
      );
    }

    // Récupérer les produits tendance
    const trendyProducts = getTrendyProducts();

    // Si dryRun, juste retourner les infos sans envoyer
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        message: 'Dry run - no emails sent',
        totalUsers: users.length,
        previewUsers: users.slice(0, 3).map(u => u.email),
        promoCode,
        products: trendyProducts
      });
    }

    // Envoyer les emails
    const resend = getResendClient();
    const fromEmail = process.env.FROM_EMAIL || 'campagne@dubainegoce.fr';

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>
    };

    // Envoyer à tous les utilisateurs
    for (const user of users) {
      try {
        const emailHtml = renderMakeoverCampaignEmail(
          user.displayName,
          user.email,
          trendyProducts,
          promoCode
        );

        const result = await resend.emails.send({
          from: `Dubai Négoce 🌹 <${fromEmail}>`,
          to: [user.email],
          subject: '🎉 Dubai Négoce fait peau neuf ! Venez nous rendre visite avec -5%',
          html: emailHtml,
          replyTo: 'contact@dubainegoce.fr'
        });

        if ((result as any).id) {
          results.sent++;

          // Logger l'email
          await logEmailSent(
            user.email,
            'makeover_campaign',
            '🎉 Dubai Négoce fait peau neuf',
            (result as any).id,
            promoCode
          );
        } else {
          results.failed++;
          results.errors.push({
            email: user.email,
            error: 'Failed to send via Resend'
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: user.email,
          error: String(error)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Campaign sent successfully`,
      totalUsers: users.length,
      sent: results.sent,
      failed: results.failed,
      promoCode,
      featuredProducts: trendyProducts.map(p => ({
        name: p.name,
        brand: p.brand,
        price: p.price
      })),
      errors: results.errors.length > 0 ? results.errors : undefined
    });

  } catch (error) {
    console.error('Send makeover campaign error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send campaign',
        details: String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint pour tester/prévisualiser la campagne
 * GET /api/admin/send-makeover-campaign?preview=true
 */
export async function GET(request: NextRequest) {
  try {
    const preview = request.nextUrl.searchParams.get('preview');
    const testEmail = request.nextUrl.searchParams.get('testEmail');

    if (preview === 'true') {
      const trendyProducts = getTrendyProducts();

      // Si testEmail fourni, envoyer un test
      if (testEmail) {
        const resend = getResendClient();
        const fromEmail = process.env.FROM_EMAIL || 'campagne@dubainegoce.fr';

        const emailHtml = renderMakeoverCampaignEmail(
          'Cher client',
          testEmail,
          trendyProducts,
          'PNEUF5'
        );

        const result = await resend.emails.send({
          from: `Dubai Négoce 🌹 <${fromEmail}>`,
          to: [testEmail],
          subject: '🎉 Dubai Négoce fait peau neuf ! Venez nous rendre visite avec -5%',
          html: emailHtml,
          replyTo: 'contact@dubainegoce.fr'
        });

        return NextResponse.json({
          success: true,
          message: `Test email sent to ${testEmail}`,
          resendId: (result as any).id,
          trendyProducts
        });
      }

      // Juste retourner l'aperçu
      return NextResponse.json({
        preview: true,
        trendyProducts,
        promoCode: 'PNEUF5',
        totalUsers: 'Will be determined on send'
      });
    }

    return NextResponse.json(
      {
        message: 'Use POST to send campaign, GET with ?preview=true to see details, or GET with ?preview=true&testEmail=your@email.com to send test'
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get preview', details: String(error) },
      { status: 500 }
    );
  }
}
