import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { priceOrder, resolveBuyer, ALLOWED_COUNTRIES } from '@/lib/order-pricing';

/**
 * Crée la session Stripe Checkout côté serveur.
 *
 * Les prix et les frais de port sont recalculés ici à partir du catalogue :
 * ce que le client envoie (un id + une quantité) ne peut pas influencer le montant.
 * Les coordonnées de livraison déjà saisies ou enregistrées par le client sont
 * directement attachées au Customer Stripe afin d'éviter toute double saisie sur Stripe.
 */
export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[api/stripe/checkout] STRIPE_SECRET_KEY manquante.');
    return NextResponse.json({ error: 'Configuration de paiement indisponible.' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  // --- Acheteur : compte connecté (jeton Firebase vérifié) ou invité ---
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
  const rawPhone = (customer?.phone || '').trim();
  // Stripe limite le champ phone à 20 caractères maximum
  const phone = rawPhone.slice(0, 20);

  if (!email) {
    return NextResponse.json({ error: 'Adresse e-mail manquante.' }, { status: 400 });
  }

  // --- Prix, stock et frais de port recalculés depuis le catalogue serveur ---
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
        tax_behavior: 'inclusive',
        product_data: {
          name: product.name,
          images: image ? [image] : [],
          metadata: { productId: product.id },
          tax_code: 'txcd_99999999', // Biens physiques standards (parfumerie)
        },
      },
    };
  });

  const shippingLabel =
    shippingMethod === 'colissimo'
      ? 'Colissimo — livraison à domicile'
      : `Mondial Relay — ${pickupPoint?.name || 'point relais'}`;

  const stripe = new Stripe(stripeSecretKey);

  const hasCompleteAddress = Boolean(
    customer?.address?.trim() &&
    customer?.postalCode?.trim() &&
    customer?.city?.trim()
  );

  // Réutilisation ou création du client Stripe avec ses coordonnées déjà enregistrées
  // pour que Stripe Checkout ne redemande ni l'adresse, ni le téléphone.
  let customerId: string | undefined;
  if (email) {
    try {
      const customerName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim();
      const addressPayload: Stripe.AddressParam | undefined = hasCompleteAddress
        ? {
            line1: customer!.address!.trim(),
            postal_code: customer!.postalCode!.trim(),
            city: customer!.city!.trim(),
            country: country || 'FR',
          }
        : undefined;

      const shippingPayload: Stripe.CustomerCreateParams.Shipping | undefined =
        hasCompleteAddress && customerName
          ? {
              name: customerName,
              phone: phone || undefined,
              address: addressPayload!,
            }
          : undefined;

      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        const updated = await stripe.customers.update(existingCustomers.data[0].id, {
          name: customerName || undefined,
          phone: phone || undefined,
          ...(addressPayload ? { address: addressPayload } : {}),
          ...(shippingPayload ? { shipping: shippingPayload } : {}),
        });
        customerId = updated.id;
      } else {
        const created = await stripe.customers.create({
          email,
          name: customerName || undefined,
          phone: phone || undefined,
          address: addressPayload,
          shipping: shippingPayload,
        });
        customerId = created.id;
      }
    } catch (e) {
      console.warn('[api/stripe/checkout] Erreur synchronisation client Stripe :', e);
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      ...(customerId
        ? {
            customer: customerId,
            customer_update: {
              address: 'auto',
              name: 'auto',
            },
          }
        : { customer_email: email }),
      // On ne redemande l'adresse et le téléphone sur Stripe QUE s'ils n'ont pas déjà été fournis sur le site
      ...(!hasCompleteAddress
        ? {
            phone_number_collection: { enabled: true },
            shipping_address_collection: {
              allowed_countries: [
                ...ALLOWED_COUNTRIES,
              ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
            },
          }
        : {}),
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shippingCost === 0 ? `${shippingLabel} — offerte` : shippingLabel,
            fixed_amount: { amount: Math.round(shippingCost * 100), currency: 'eur' },
            tax_behavior: 'inclusive',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: { enabled: true },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&total=${orderTotal.toFixed(2)}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userId,
        email,
        phone: rawPhone,
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
      throw new Error("Stripe n'a pas retourné d'URL de paiement.");
    }

    console.log(
      `[api/stripe/checkout] Session ${session.id} créée pour ${
        userId === 'guest' ? `l'invité ${email}` : `l'utilisateur ${userId}`
      }.`
    );
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('[api/stripe/checkout] Échec de création de la session :', error);
    return NextResponse.json(
      { error: error.message || 'Impossible de démarrer le paiement.' },
      { status: 500 }
    );
  }
}
