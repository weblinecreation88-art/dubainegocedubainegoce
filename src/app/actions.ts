
'use server';

import { generateProductDescriptions } from '@/ai/flows/generate-product-descriptions';
import { answerFaq } from '@/ai/flows/faq-chatbot';
import type { Product, Order, OrderItem, ShippingMethod, CartItem } from '@/lib/types';
import { getProducts } from '@/lib/data';
import Stripe from 'stripe';
import { Resend } from 'resend';
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


// Initialisation de Resend
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'contact@resend.woosenteur.fr'; // Default to a consistent sender
const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Initialisation de Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';


export async function runGenerateProductDescriptions(
  input: GenerateSeoDescriptionInput
): Promise<GenerateSeoDescriptionOutput> {
  return await generateProductDescriptions(input);
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

import { getServerSecret } from '@/lib/server-secrets';

/**
 * Traite une commande réussie : enregistre dans Firestore et envoie un e-mail.
 */
export async function processSuccessfulOrder(sessionId: string): Promise<{ success: boolean; message?: string }> {
  const stripeSecretKey = await getServerSecret('STRIPE_SECRET_KEY');
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

    const userId = session.metadata?.userId || 'guest';
    const shippingMethod = (session.metadata?.shippingMethod as ShippingMethod['id']) || 'colissimo';
    const userEmail = session.customer_details?.email || session.metadata?.email;
    const customerName = session.customer_details?.name || session.metadata?.customerName || 'Client';

    const invoice = session.invoice as Stripe.Invoice;
    const lineItems = session.line_items?.data || [];

    const orderData: any = {
      id: session.id,
      userId: userId,
      orderDate: new Date().toISOString(),
      createdAt: new Date(),
      totalAmount: (session.amount_total ?? 0) / 100,
      status: 'completed',
      paymentProvider: 'stripe',
      shippingMethod: shippingMethod,
      customer: {
        email: userEmail || '',
        name: customerName,
        address: session.metadata?.shippingAddress || '',
      },
      pickupPoint: session.metadata?.pickupPointName ? {
        id: session.metadata?.pickupPointId || '',
        name: session.metadata?.pickupPointName || '',
        address: session.metadata?.pickupPointAddress || '',
      } : null,
      orderItems: lineItems
        .filter(item => {
          // Filtrer les frais de port pour ne garder que les produits dans orderItems
          const prodName = (item.price?.product as Stripe.Product)?.name || item.description || '';
          return !prodName.includes('Livraison');
        })
        .map(item => {
          const product = item.price?.product as Stripe.Product;
          return {
            productId: product?.metadata?.productId || 'unknown',
            quantity: item.quantity || 0,
            itemPrice: (item.price?.unit_amount ?? 0) / 100,
            name: product?.name || item.description || 'Parfum',
            image: product?.images?.[0] || ''
          };
        }),
      stripeSessionId: session.id,
    };

    // 1. Enregistrement dans la collection globale des commandes
    await firestore.collection('orders').doc(session.id).set(orderData);
    console.log(`[processSuccessfulOrder] Commande ${session.id} enregistrée dans la collection 'orders'.`);

    // 2. Si l'utilisateur est connecté, enregistrer aussi dans son sous-dossier
    if (userId && userId !== 'guest') {
      const userOrderRef = firestore.collection('users').doc(userId).collection('orders').doc(session.id);
      await userOrderRef.set(orderData);
      console.log(`[processSuccessfulOrder] Commande ${session.id} rattachée au compte utilisateur ${userId}.`);
    }

    // 3. Marquer le panier abandonné comme converti
    if (userEmail) {
      try {
        const cleanEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
        await firestore.collection('abandoned_carts').doc(`${cleanEmail}_current`).set(
          { status: 'converted', convertedAt: new Date().toISOString() },
          { merge: true }
        );
      } catch (cartErr) {
        console.warn('[processSuccessfulOrder] Note: Impossible de mettre à jour le panier abandonné:', cartErr);
      }
    }

    // --- Début de la logique d'envoi d'e-mail ---
    const resendKey = await getServerSecret('RESEND_API_KEY');
    const senderEmail = process.env.FROM_EMAIL || 'contact@resend.woosenteur.fr';

    if (!resendKey) {
      console.warn("[processSuccessfulOrder] AVERTISSEMENT: RESEND_API_KEY non trouvée. E-mail de confirmation non envoyé.");
    } else if (!userEmail) {
      console.error(`[processSuccessfulOrder] ERREUR: Adresse e-mail du client manquante pour la session ${sessionId}. E-mail non envoyé.`);
    } else {
      const resendClient = new Resend(resendKey);
      const itemsHtml = orderData.orderItems.map((item: any) => `
                  <tr>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${Number(item.itemPrice).toFixed(2)} €</td>
                  </tr>
              `).join('');

      const invoiceLinkHtml = invoice?.invoice_pdf ?
        `<p>Vous pouvez télécharger votre facture ici : <a href="${invoice.invoice_pdf}">Télécharger la facture</a></p>` : '';

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
                  <p><strong>Montant total : ${orderData.totalAmount.toFixed(2)} €</strong></p>
                  <p>Mode de livraison : ${shippingMethod === 'colissimo' ? 'Colissimo à domicile (48h)' : 'Point Relais Mondial Relay'}</p>
                  ${invoiceLinkHtml}
                  <p>Vous recevrez un autre e-mail avec le numéro de suivi lorsque votre colis sera expédié.</p>
                  <p>L'équipe DubaiNegoce</p>
              `;

      try {
        console.log(`[processSuccessfulOrder] Tentative d'envoi d'email à ${userEmail} depuis ${senderEmail}...`);
        await resendClient.emails.send({
          from: `DubaiNegoce <${senderEmail}>`,
          to: [userEmail],
          subject: `Confirmation de votre commande DubaiNegoce #${session.id.substring(0, 8)}`,
          html: emailHtml,
        });
        console.log(`[processSuccessfulOrder] Email de confirmation envoyé avec succès à ${userEmail} pour la session ${sessionId}.`);
      } catch (emailError: any) {
        console.error(`[processSuccessfulOrder] ERREUR lors de l'envoi de l'e-mail via Resend à ${userEmail}:`, emailError);
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
