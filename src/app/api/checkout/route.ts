import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
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
