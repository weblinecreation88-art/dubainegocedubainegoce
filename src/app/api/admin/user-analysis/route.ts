import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';

/**
 * API Endpoint pour analyser une tentative d'achat utilisateur
 * Utilisation: GET /api/admin/user-analysis?userId=XXX&apiKey=YOUR_KEY
 */

export const dynamic = 'force-dynamic';

interface UserAnalysis {
  userId: string;
  userEmail?: string;
  cartData?: {
    items: any[];
    totalValue: number;
    createdAt?: string;
  };
  abandonedCarts: {
    count: number;
    latestCart?: any;
    recoveryAttempts: number;
  };
  orders: {
    totalOrders: number;
    totalSpent: number;
    lastOrder?: any;
    averageOrderValue: number;
  };
  checkoutAttempts: {
    failed: number;
    pending: number;
    details?: any[];
  };
  recommendations: string[];
  status: 'active' | 'abandoned' | 'completed' | 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    // Authentification
    const apiKey = request.nextUrl.searchParams.get('apiKey');
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
    }

    const analysis: UserAnalysis = {
      userId,
      abandonedCarts: { count: 0, recoveryAttempts: 0 },
      orders: { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 },
      checkoutAttempts: { failed: 0, pending: 0 },
      recommendations: [],
      status: 'unknown'
    };

    // 1. Récupérer les informations utilisateur
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      analysis.userEmail = userData?.email;
    }

    // 2. Vérifier les paniers abandonnés
    const abandonedCartsSnapshot = await firestore
      .collection('abandoned_carts')
      .where('userId', '==', userId)
      .get();

    analysis.abandonedCarts.count = abandonedCartsSnapshot.size;
    if (abandonedCartsSnapshot.size > 0) {
      const latestCart = abandonedCartsSnapshot.docs.sort((a, b) => {
        const dateA = new Date(a.data().createdAt).getTime();
        const dateB = new Date(b.data().createdAt).getTime();
        return dateB - dateA;
      })[0];

      analysis.abandonedCarts.latestCart = {
        value: latestCart.data().cartValue,
        items: latestCart.data().cartSnapshot?.length || 0,
        createdAt: latestCart.data().createdAt,
        emailsSent: latestCart.data().emailsSent
      };

      // Compter les emails de relance envoyés
      if (latestCart.data().emailsSent?.day3) analysis.abandonedCarts.recoveryAttempts++;
      if (latestCart.data().emailsSent?.day7) analysis.abandonedCarts.recoveryAttempts++;
    }

    // 3. Récupérer les commandes
    const ordersSnapshot = await firestore
      .collection('users')
      .doc(userId)
      .collection('orders')
      .get();

    analysis.orders.totalOrders = ordersSnapshot.size;

    if (ordersSnapshot.size > 0) {
      let totalSpent = 0;
      let latestOrder = null;
      let latestDate = 0;

      ordersSnapshot.docs.forEach(orderDoc => {
        const orderData = orderDoc.data();
        totalSpent += orderData.totalAmount || 0;

        const orderDate = new Date(orderData.orderDate).getTime();
        if (orderDate > latestDate) {
          latestDate = orderDate;
          latestOrder = {
            id: orderDoc.id,
            amount: orderData.totalAmount,
            date: orderData.orderDate,
            status: orderData.status,
            itemCount: orderData.orderItems?.length || 0
          };
        }
      });

      analysis.orders.totalSpent = parseFloat(totalSpent.toFixed(2));
      analysis.orders.averageOrderValue = parseFloat(
        (totalSpent / ordersSnapshot.size).toFixed(2)
      );
      analysis.orders.lastOrder = latestOrder;
    }

    // 4. Vérifier les tentatives de paiement (via Stripe webhooks ou logs)
    // Note: Ceci dépend de comment vous loggez les tentatives de paiement
    const checkoutLogsRef = firestore
      .collection('checkout_logs')
      .where('userId', '==', userId);

    try {
      const logsSnapshot = await checkoutLogsRef.get();

      logsSnapshot.docs.forEach(log => {
        const logData = log.data();
        if (logData.status === 'failed') {
          analysis.checkoutAttempts.failed++;
        } else if (logData.status === 'pending') {
          analysis.checkoutAttempts.pending++;
        }
      });
    } catch (e) {
      // Collection peut ne pas exister
      console.log('Checkout logs not available');
    }

    // 5. Déterminer le statut
    if (analysis.orders.totalOrders > 0) {
      analysis.status = 'completed';
    } else if (analysis.abandonedCarts.count > 0) {
      analysis.status = 'abandoned';
    } else {
      analysis.status = 'active';
    }

    // 6. Générer les recommandations
    generateRecommendations(analysis);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('User analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze user' },
      { status: 500 }
    );
  }
}

function generateRecommendations(analysis: UserAnalysis): void {
  if (analysis.status === 'abandoned') {
    analysis.recommendations.push('🔴 Panier abandonné - Envoyer email de relance immédiate');

    if (analysis.abandonedCarts.recoveryAttempts === 0) {
      analysis.recommendations.push('📧 Aucun email de recovery envoyé - Déclencher manuellement');
    }

    if (
      analysis.abandonedCarts.latestCart &&
      analysis.abandonedCarts.latestCart.value > 100
    ) {
      analysis.recommendations.push(
        `💰 Panier de haute valeur (${analysis.abandonedCarts.latestCart.value}€) - Priorité haute`
      );
    }
  }

  if (analysis.checkoutAttempts.failed > 0) {
    analysis.recommendations.push(
      `⚠️ ${analysis.checkoutAttempts.failed} tentative(s) de paiement échouée(s) - Vérifier erreur de paiement`
    );
  }

  if (analysis.orders.totalOrders === 0 && analysis.abandonedCarts.count === 0) {
    analysis.recommendations.push(
      '👤 Utilisateur nouveau - Envoyer email de bienvenue / première visite'
    );
  }

  if (analysis.orders.totalOrders > 1) {
    analysis.recommendations.push(
      '⭐ Client régulier - Offrir programme de fidélité / réduction'
    );
  }

  if (analysis.abandonedCarts.count > 2) {
    analysis.recommendations.push(
      '🛒 Plusieurs paniers abandonnés - Analyser barrière à la conversion'
    );
  }
}

export async function POST(request: NextRequest) {
  // Optionnel: Endpoint pour déclencher manuellement une action
  try {
    const apiKey = request.headers.get('authorization')?.split(' ')[1];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action, email } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action required' },
        { status: 400 }
      );
    }

    // Actions possibles: send_recovery_email, create_discount, contact_support
    const result = {
      userId,
      action,
      status: 'pending',
      message: `Action '${action}' déclenché pour l'utilisateur ${userId}`
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
