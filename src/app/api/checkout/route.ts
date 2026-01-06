import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Load Stripe with secret key inside the function
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error('[Checkout API] STRIPE_SECRET_KEY is not defined!');
      return NextResponse.json(
        { error: 'Configuration du serveur incomplète' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });

    const body = await request.json();
    const { lineItems, userId, shippingMethod, totalAmount } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    // Créer la session Stripe
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: lineItems,
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH'],
      },
      invoice_creation: {
        enabled: true,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&total=${totalAmount}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userId,
        shippingMethod,
      },
    };

    // Ajouter la configuration des méthodes de paiement si définie
    if (process.env.NEXT_PUBLIC_STRIPE_PAYMENT_METHOD_CONFIG_ID) {
      sessionParams.payment_method_configuration = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_METHOD_CONFIG_ID;
    }

    // Ajouter les options de livraison pour Colissimo
    if (shippingMethod === 'colissimo' && process.env.NEXT_PUBLIC_STRIPE_SHIPPING_RATE_ID) {
      sessionParams.shipping_options = [
        { shipping_rate: process.env.NEXT_PUBLIC_STRIPE_SHIPPING_RATE_ID }
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
