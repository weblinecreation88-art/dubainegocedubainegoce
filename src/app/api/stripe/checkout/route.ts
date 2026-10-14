import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { priceOrder, resolveBuyer, ALLOWED_COUNTRIES } from '@/lib/order-pricing';

/**
 * Crée la session Stripe Checkout côté serveur.
 *
 * Les prix et les frais de port sont recalculés ici à partir du catalogue :
 * ce que le client envoie (un id + une quantité) ne peut pas influencer le montant.
 */
export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[api/stripe/checkout] STRIPE_SECRET_KEY manquante.');
    return NextResponse.json({ error: 'Configuration de paiement indisponible.' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  // --- Acheteur : compte connecte (jeton Firebase verifie) ou invite ---
  // On ne fait jamais confiance a un uid poste par le navigateur.
  const buyer = await resolveBuyer(req.headers.get('authorization'));
  if ('error' in buyer) {
    return NextResponse.json({ error: buyer.error }, { status: 401 });
  }
  const userId = buyer.userId;
  const tokenEmail = buyer.email;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { items, customer, pickupPoint } = body as {
    items?: Array<{ id: string; quantity: number }>;
    customer?: {
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      address?: string;
      postalCode?: string;
      city?: string;
      country?: string;
      shippingMethod?: 'colissimo' | 'mondial-relay';
    };
    pickupPoint?: {
      id?: string;
      name?: string;
      address?: string;
      postalCode?: string;
      city?: string;
    } | null;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Votre panier est vide.' }, { status: 400 });
  }

  const email = (customer?.email || tokenEmail || '').trim();
  const phone = (customer?.phone || '').trim();

  if (!email) {
    return NextResponse.json({ error: 'Adresse e-mail manquante.' }, { status: 400 });
  }

  // --- Prix, stock et frais de port recalcules depuis le catalogue serveur ---
  const priced = priceOrder(items, customer?.shippingMethod, customer?.country);
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: priced.status });
  }
  const { shippingMethod, country, shippingCost, total: orderTotal } = priced;

  if (shippingMethod === 'mondial-relay' && !pickupPoint?.id) {
    return NextResponse.json({ error: 'Veuillez sélectionner un point relais.' }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.lines.map(({ product, quantity }) => {
    const rawImage = product.images?.[0];
    const image = rawImage ? (rawImage.startsWith('http') ? rawImage : `${appUrl}${rawImage}`) : undefined;
    return {
      quantity,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          images: image ? [image] : [],
          metadata: { productId: product.id },
        },
      },
    };
  });

  const shippingLabel =
    shippingMethod === 'colissimo'
      ? 'Colissimo — livraison à domicile'
      : `Mondial Relay — ${pickupPoint?.name || 'point relais'}`;

  if (shippingCost > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(shippingCost * 100),
        product_data: {
          name: shippingLabel,
          metadata: { productId: 'shipping' },
        },
      },
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      allow_promotion_codes: true,
      // Le téléphone remonte désormais dans session.customer_details.phone
      phone_number_collection: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&total=${orderTotal.toFixed(2)}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userId,
        email,
        phone,
        shippingMethod,
        shippingCost: shippingCost.toFixed(2),
        country,
        customerName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
        addressLine: customer?.address || '',
        addressPostalCode: customer?.postalCode || '',
        addressCity: customer?.city || '',
        pickupPointId: pickupPoint?.id || '',
        pickupPointName: pickupPoint?.name || '',
        pickupPointAddress: pickupPoint?.address || '',
        pickupPointPostalCode: pickupPoint?.postalCode || '',
        pickupPointCity: pickupPoint?.city || '',
      },
    });

    if (!session.url) {
      throw new Error('Stripe n\'a pas retourné d\'URL de paiement.');
    }

    console.log(`[api/stripe/checkout] Session ${session.id} créée pour ${userId === 'guest' ? `l'invité ${email}` : `l'utilisateur ${userId}`}.`);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[api/stripe/checkout] Échec de création de la session :', error);
    return NextResponse.json(
      { error: error.message || 'Impossible de démarrer le paiement.' },
      { status: 500 }
    );
  }
}
