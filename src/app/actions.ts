
'use server';

import { generateProductDescriptions } from '@/ai/flows/generate-product-descriptions';
import { answerFaq } from '@/ai/flows/faq-chatbot';
import type { Product, Order, OrderItem, ShippingMethod, CartItem } from '@/lib/types';
import { getProducts } from '@/lib/data';
import { recommendPerfumes, type AdvisorAnswers, type AdvisorRecommendation } from '@/lib/perfume-advisor';
import Stripe from 'stripe';
import { sendEmail, isEmailConfigured } from '@/lib/email';
import { z } from 'zod';

// NOTE: firestore is NOT imported at module level to prevent firebase-admin from being bundled into client code.
// It will be dynamically imported inside functions that need it.

// Re-defining types here as they can't be imported from "use server" files
type GenerateSeoDescriptionInput = {
  productName: string;
  brand: string;
  targetAudience: string;
  webContext: string;
  language: string;
};
type GenerateSeoDescriptionOutput = {
  focusKeyword: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
};

type AnswerFaqInput = { question: string; };
type AnswerFaqOutput = { answer: string; };


// Les e-mails transactionnels partent via Brevo (voir src/lib/email.ts).

// Initialisation de Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';


export async function runGenerateProductDescriptions(
  input: GenerateSeoDescriptionInput
): Promise<GenerateSeoDescriptionOutput> {
  return await generateProductDescriptions(input);
}

export async function runRecommendPerfumes(
  answers: AdvisorAnswers
): Promise<AdvisorRecommendation[]> {
  return recommendPerfumes(answers);
}

export async function runAnswerFaq(
  input: AnswerFaqInput
): Promise<AnswerFaqOutput> {
  console.log('[runAnswerFaq] Question reçue:', input.question);
  console.log('[runAnswerFaq] Clé API présente:', !!process.env.GOOGLE_GENAI_API_KEY);
  try {
    const result = await answerFaq(input);
    console.log('[runAnswerFaq] Réponse générée avec succès');
    return result;
  } catch (error: any) {
    console.error('[runAnswerFaq] ERREUR:', error.message || error);
    if (error.stack) console.error(error.stack);
    throw new Error(error.message || "Erreur lors de la génération de la réponse");
  }
}


export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) {
    return [];
  }

  const products = getProducts();
  const lowerCaseQuery = query.toLowerCase();

  return products.filter(product => {
    const inName = product.name.toLowerCase().includes(lowerCaseQuery);
    const inBrand = product.brand.name.toLowerCase().includes(lowerCaseQuery);
    const inFamily = product.family.toLowerCase().includes(lowerCaseQuery);
    const inTags = product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery));

    return inName || inBrand || inFamily || inTags;
  });
}

/**
 * Traite une commande réussie : enregistre dans Firestore et envoie un e-mail.
 */
/** Le panier abandonne d'un client qui vient de payer ne doit plus etre relance. */
async function markAbandonedCartConverted(firestore: any, email?: string) {
  if (!email) return;
  try {
    const docId = `${email.replace(/[^a-zA-Z0-9]/g, '_')}_current`;
    const ref = firestore.collection('abandoned_carts').doc(docId);
    const snap = await ref.get();
    if (snap.exists) {
      await ref.update({ status: 'recovered', recoveredAt: new Date().toISOString() });
    }
  } catch (e) {
    console.warn('[markAbandonedCartConverted] Mise à jour impossible :', e);
  }
}

export async function processSuccessfulOrder(sessionId: string): Promise<{ success: boolean; message?: string }> {
  if (!stripeSecretKey) {
    console.error("[processSuccessfulOrder] ERREUR: La clé secrète Stripe (STRIPE_SECRET_KEY) est manquante.");
    throw new Error("La configuration de Stripe est incomplète sur le serveur.");
  }

  // Dynamically import firestore to prevent it from being bundled into client code
  const { firestore } = await import('@/firebase/server');

  if (!firestore) {
    console.error("[processSuccessfulOrder] ERREUR: La configuration de Firestore est incomplète sur le serveur.");
    throw new Error("La configuration de Firestore est incomplète sur le serveur.");
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    console.log(`[processSuccessfulOrder] Récupération de la session Stripe: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product', 'customer', 'invoice']
    });
    console.log("[processSuccessfulOrder] Session Stripe récupérée avec succès.");

    if (session.payment_status !== 'paid') {
      console.log(`[processSuccessfulOrder] Le paiement pour la session ${sessionId} n'est pas confirmé ('${session.payment_status}'). Commande non traitée.`);
      return { success: false, message: "Le paiement n'a pas été confirmé." };
    }

    const metadata = session.metadata || {};
    // Commande invitee : rangee sous users/guest/orders pour rester visible dans
    // le back-office (collectionGroup 'orders') et expediable comme les autres.
    const userId = metadata.userId || 'guest';
    const shippingMethod = metadata.shippingMethod as ShippingMethod['id'] | undefined;

    const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(session.id);

    // Idempotence : le webhook et la page de succès peuvent tous deux appeler cette fonction.
    // Si la commande existe déjà, on ne la réécrit pas et on ne renvoie pas un second e-mail.
    const existingOrder = await orderRef.get();
    if (existingOrder.exists) {
      console.log(`[processSuccessfulOrder] Commande ${session.id} déjà enregistrée. Traitement ignoré (idempotence).`);
      return { success: true, message: 'Commande déjà traitée.' };
    }

    const invoice = session.invoice as Stripe.Invoice;
    const lineItems = session.line_items?.data || [];
    const details = session.customer_details;

    // Le téléphone vient de Stripe (phone_number_collection) et, à défaut, du formulaire du site.
    const customerPhone = details?.phone || metadata.phone || '';
    const stripeAddress = details?.address;

    const shippingCost = metadata.shippingCost ? parseFloat(metadata.shippingCost) : undefined;

    const orderData: Order = {
      id: session.id,
      userId: userId,
      orderDate: new Date().toISOString(),
      totalAmount: (session.amount_total ?? 0) / 100,
      status: 'completed',
      shippingMethod: shippingMethod,
      customerEmail: details?.email || metadata.email || '',
      customerName: details?.name || metadata.customerName || '',
      customerPhone: customerPhone,
      shippingCost: Number.isFinite(shippingCost as number) ? shippingCost : undefined,
      shippingAddress: {
        line1: stripeAddress?.line1 || metadata.addressLine || '',
        line2: stripeAddress?.line2 || '',
        postalCode: stripeAddress?.postal_code || metadata.addressPostalCode || '',
        city: stripeAddress?.city || metadata.addressCity || '',
        country: stripeAddress?.country || metadata.country || '',
      },
      orderItems: lineItems
        .filter(item => {
          const product = item.price?.product as Stripe.Product;
          return product?.metadata?.productId !== 'shipping';
        })
        .map(item => {
          const product = item.price?.product as Stripe.Product;
          return {
            productId: product?.metadata?.productId || 'unknown',
            quantity: item.quantity || 0,
            itemPrice: (item.price?.unit_amount ?? 0) / 100,
            name: product?.name || item.description || 'Article',
            image: product?.images?.[0] || ''
          };
        }),
      stripeSessionId: session.id,
    };

    if (metadata.pickupPointId) {
      orderData.pickupPoint = {
        id: metadata.pickupPointId,
        name: metadata.pickupPointName || '',
        address: metadata.pickupPointAddress || '',
        postalCode: metadata.pickupPointPostalCode || '',
        city: metadata.pickupPointCity || '',
      };
    }

    await orderRef.set(orderData);
    console.log(`[processSuccessfulOrder] Commande ${session.id} enregistrée dans Firestore pour l'utilisateur ${userId}.`);

    await markAbandonedCartConverted(firestore, orderData.customerEmail);

    // --- Début de la logique d'envoi d'e-mail ---
    console.log("[processSuccessfulOrder] Préparation de l'envoi d'e-mail via Brevo.");
    if (!isEmailConfigured()) {
      console.warn("[processSuccessfulOrder] AVERTISSEMENT: BREVO_API_KEY manquante. E-mail de confirmation non envoyé.");
    } else {
      const userEmail = orderData.customerEmail;
      const customerName = orderData.customerName || 'Client(e)';

      if (!userEmail) {
        console.error(`[processSuccessfulOrder] ERREUR: Adresse e-mail du client manquante pour la session ${sessionId}. E-mail non envoyé.`);
      } else {
        const itemsHtml = orderData.orderItems.map(item => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.itemPrice.toFixed(2)} €</td>
                    </tr>
                `).join('');

        const invoiceLinkHtml = invoice?.invoice_pdf ?
          `<p>Vous pouvez télécharger votre facture ici : <a href="${invoice.invoice_pdf}">Télécharger la facture</a></p>` : '';

        // Récapitulatif de livraison : mode choisi, point relais ou adresse, téléphone.
        const addr = orderData.shippingAddress;
        const deliveryLines: string[] = [];

        if (orderData.shippingMethod === 'mondial-relay') {
          deliveryLines.push('<strong>Mode de livraison :</strong> Mondial Relay (point relais)');
          if (orderData.pickupPoint) {
            const pp = orderData.pickupPoint;
            deliveryLines.push(
              `<strong>Point relais :</strong> ${pp.name}<br/>${[pp.address, [pp.postalCode, pp.city].filter(Boolean).join(' ')].filter(Boolean).join('<br/>')}`
            );
          }
        } else if (orderData.shippingMethod === 'colissimo') {
          deliveryLines.push('<strong>Mode de livraison :</strong> Colissimo (livraison à domicile)');
        }

        if (addr && (addr.line1 || addr.city)) {
          deliveryLines.push(
            `<strong>Adresse de livraison :</strong><br/>${[addr.line1, addr.line2, [addr.postalCode, addr.city].filter(Boolean).join(' '), addr.country].filter(Boolean).join('<br/>')}`
          );
        }

        if (orderData.customerPhone) {
          deliveryLines.push(`<strong>Téléphone :</strong> ${orderData.customerPhone}`);
        }

        const deliveryHtml = deliveryLines.length
          ? `<div style="margin: 20px 0; padding: 16px; background: #f7f7f7; border-radius: 6px;">
                       <h2 style="margin-top:0; font-size: 16px;">Livraison</h2>
                       <p style="margin: 0; line-height: 1.6;">${deliveryLines.join('<br/><br/>')}</p>
                     </div>`
          : '';

        const shippingRowHtml = typeof orderData.shippingCost === 'number'
          ? `<p style="margin: 4px 0;">Frais de livraison : ${orderData.shippingCost.toFixed(2)} €</p>`
          : '';


        const emailHtml = `
                    <h1>Confirmation de votre commande</h1>
                    <p>Bonjour ${customerName},</p>
                    <p>Merci pour votre achat chez DubaiNegoce. Voici le récapitulatif de votre commande <strong>#${session.id.substring(0, 8)}</strong>.</p>
                    <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                        <thead>
                            <tr><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Produit</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantité</th><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Prix unitaire</th></tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                    ${shippingRowHtml}
                    <p><strong>Montant total : ${orderData.totalAmount.toFixed(2)} €</strong></p>
                    ${deliveryHtml}
                    ${invoiceLinkHtml}
                    <p>Vous recevrez un autre e-mail lorsque votre commande sera expédiée.</p>
                    <p>L'équipe DubaiNegoce</p>
                `;

        console.log(`[processSuccessfulOrder] Tentative d'envoi d'email à ${userEmail}...`);
        const emailResult = await sendEmail({
          to: userEmail,
          subject: `Confirmation de votre commande DubaiNegoce #${session.id.substring(0, 8)}`,
          html: emailHtml,
        });

        if (emailResult.success) {
          console.log(`[processSuccessfulOrder] Email de confirmation envoyé avec succès à ${userEmail} pour la session ${sessionId}.`);
        } else {
          // Ne pas bloquer le succès de la commande pour une erreur d'email :
          // le paiement est encaissé et la commande est déjà enregistrée.
          console.error(`[processSuccessfulOrder] ERREUR lors de l'envoi de l'e-mail à ${userEmail}: ${emailResult.error}`);
          return { success: true, message: `Commande enregistrée, mais l'envoi de l'e-mail a échoué: ${emailResult.error}` };
        }
      }
    }

    return { success: true };

  } catch (error: any) {
    console.error('[processSuccessfulOrder] ERREUR CRITIQUE lors du traitement de la commande:', error);
    return { success: false, message: error.message || 'Erreur serveur interne.' };
  }
}


const newsletterSchema = z.object({
  email: z.string().email({ message: "Veuillez fournir une adresse email valide." }),
});

/**
 * Abonne un utilisateur à la newsletter dans Firestore.
 */
export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
): Promise<{ message: string; error?: boolean }> {
  // Dynamically import firestore to prevent it from being bundled into client code
  const { firestore } = await import('@/firebase/server');

  if (!firestore) {
    console.error("Firestore n'est pas configuré.");
    return {
      message: "Le service de newsletter n'est pas disponible pour le moment.",
      error: true,
    };
  }

  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
      error: true,
    };
  }

  const email = validatedFields.data.email.toLowerCase();

  try {
    const subsRef = firestore.collection('newsletter_subscriptions');
    const existing = await subsRef.where('email', '==', email).get();

    if (!existing.empty) {
      return { message: "Vous êtes déjà inscrit(e) à notre newsletter !" };
    }

    await subsRef.add({
      email,
      subscribedAt: new Date().toISOString(),
      source: 'website_form'
    });

    return { message: "Merci ! Vous êtes bien inscrit(e) à notre newsletter." };
  } catch (e: any) {
    console.error('Erreur lors de l\'inscription à la newsletter Firestore:', e);
    return { message: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.', error: true };
  }
}

/**
 * Tracks abandoned cart for email reminders (Day 3 and Day 7)
 */
export async function trackAbandonedCart(
  cartSnapshot: CartItem[],
  userEmail: string,
  userId?: string
): Promise<{ success: boolean; message?: string }> {
  // Dynamically import firestore to prevent it from being bundled into client code
  const { firestore } = await import('@/firebase/server');

  if (!firestore || cartSnapshot.length === 0) {
    return { success: false, message: 'Invalid cart or Firestore not configured' };
  }

  try {
    // ID stable = 1 doc par utilisateur (upsert) — évite les doublons Firestore
    const cleanEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const docId = `${cleanEmail}_current`;
    const cartValue = cartSnapshot.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date().toISOString();

    const ref = firestore.collection('abandoned_carts').doc(docId);
    const existing = await ref.get();

    if (existing.exists) {
      // Mettre à jour le panier existant sans écraser createdAt ni emailsSent
      await ref.update({
        userId: userId || userEmail,
        cartSnapshot: cartSnapshot.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        cartValue,
        lastActivityAt: now,
        status: 'active',
      });
    } else {
      // Nouveau panier abandonné
      await ref.set({
        userId: userId || userEmail,
        email: userEmail,
        cartSnapshot: cartSnapshot.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        cartValue,
        createdAt: now,
        lastActivityAt: now,
        emailsSent: { day1: false, day3: false, day7: false },
        status: 'active',
      });
    }

    console.log(`[trackAbandonedCart] Upserted abandoned cart for ${userEmail}`);
    return { success: true };

  } catch (error: any) {
    console.error('[trackAbandonedCart] Error tracking abandoned cart:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Filet de sécurité appelé depuis la page /checkout/success.
 *
 * Si le webhook Stripe n'est pas passé (échec réseau, 500, secret mal configuré),
 * la commande serait perdue alors que le client a bien été débité. On rejoue donc
 * le traitement ici. processSuccessfulOrder étant idempotent, un double appel
 * webhook + page de succès n'enregistre qu'une commande et n'envoie qu'un e-mail.
 */
export async function reconcileOrderFromSession(
  sessionId: string
): Promise<{ success: boolean; message?: string }> {
  if (!sessionId || !sessionId.startsWith('cs_')) {
    return { success: false, message: 'Identifiant de session invalide.' };
  }

  try {
    return await processSuccessfulOrder(sessionId);
  } catch (error: any) {
    console.error(`[reconcileOrderFromSession] Échec pour la session ${sessionId}:`, error);
    return { success: false, message: error.message || 'Erreur serveur interne.' };
  }
}
