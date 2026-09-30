import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSecret } from '@/lib/server-secrets';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      email,
      customerInfo,
      shippingMethod,
      shippingCost = 0,
      total,
      pickupPoint,
      userId = 'guest',
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Le panier est vide.' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Adresse email requise.' }, { status: 400 });
    }

    const stripeSecretKey = await getServerSecret('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('[Stripe Create Session] STRIPE_SECRET_KEY non trouvée.');
      return NextResponse.json({ error: 'Configuration de paiement Stripe indisponible.' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey);

    // Préparer les line items des produits
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { id: string; name: string; price: number; quantity: number; image?: string }) => {
        const imageUrl = item.image?.startsWith('http')
          ? item.image
          : item.image
          ? `${appUrl}${item.image}`
          : undefined;

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              images: imageUrl ? [imageUrl] : [],
              metadata: {
                productId: item.id,
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      }
    );

    // Ajouter les frais de livraison s'ils sont > 0
    const shippingCostCents = Math.round(parseFloat(String(shippingCost)) * 100);
    if (shippingCostCents > 0) {
      const shippingLabel =
        shippingMethod === 'colissimo'
          ? 'Livraison à domicile Colissimo (48h)'
          : 'Livraison en Point Relais Mondial Relay';

      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: shippingLabel,
            description: pickupPoint?.name ? `Point Relais : ${pickupPoint.name}` : undefined,
          },
          unit_amount: shippingCostCents,
        },
        quantity: 1,
      });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: email,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&total=${total || ''}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userId: userId || 'guest',
        email: email,
        customerName: customerInfo ? `${customerInfo.firstName} ${customerInfo.lastName}`.trim() : '',
        shippingMethod: shippingMethod || 'colissimo',
        shippingAddress: customerInfo ? `${customerInfo.address}, ${customerInfo.postalCode || ''} ${customerInfo.city}, ${customerInfo.country}` : '',
        pickupPointId: pickupPoint?.id || '',
        pickupPointName: pickupPoint?.name || '',
        pickupPointAddress: pickupPoint?.address ? `${pickupPoint.address}, ${pickupPoint.postalCode} ${pickupPoint.city}` : '',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('[Stripe Create Session] Erreur:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création de la session de paiement.' },
      { status: 500 }
    );
  }
}
