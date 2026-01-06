
'use server';

import { generateProductDescriptions } from '@/ai/flows/generate-product-descriptions';
import { recommendPerfumes } from '@/ai/flows/recommend-perfumes';
import { answerFaq } from '@/ai/flows/faq-chatbot';
import type { Product, Order, OrderItem, ShippingMethod, CartItem } from '@/lib/types';
import { getProducts } from '@/lib/data';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/sendgrid';
import { firestore } from '@/firebase/server';
import { z } from 'zod';

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

type RecommendPerfumesInput = { preferences: string; pastPerfumes: string; };
type RecommendPerfumesOutput = { recommendations: { slug: string; reason: string; }[]; };

type AnswerFaqInput = { question: string; };
type AnswerFaqOutput = { answer: string; };


// Initialisation de Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';


export async function runGenerateProductDescriptions(
  input: GenerateSeoDescriptionInput
): Promise<GenerateSeoDescriptionOutput> {
  return await generateProductDescriptions(input);
}

export async function runRecommendPerfumes(
  input: RecommendPerfumesInput
): Promise<RecommendPerfumesOutput> {
  return await recommendPerfumes(input);
}

export async function runAnswerFaq(
  input: AnswerFaqInput
): Promise<AnswerFaqOutput> {
  return await answerFaq(input);
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
export async function processSuccessfulOrder(sessionId: string): Promise<{ success: boolean; message?: string }> {
    if (!stripeSecretKey) {
        console.error("[processSuccessfulOrder] ERREUR: La clé secrète Stripe (STRIPE_SECRET_KEY) est manquante.");
        throw new Error("La configuration de Stripe est incomplète sur le serveur.");
    }
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

        const userId = session.metadata?.userId;
        const shippingMethod = session.metadata?.shippingMethod as ShippingMethod['id'] | undefined;

        if (!userId) {
            console.error(`[processSuccessfulOrder] ERREUR: UserID manquant dans les métadonnées de la session Stripe ${sessionId}.`);
            return { success: false, message: "Données utilisateur manquantes pour la commande." };
        }
        
        const invoice = session.invoice as Stripe.Invoice;
        const lineItems = session.line_items?.data || [];

        const orderData: Order = {
            id: session.id,
            userId: userId,
            orderDate: new Date().toISOString(),
            totalAmount: (session.amount_total ?? 0) / 100,
            status: 'completed',
            shippingMethod: shippingMethod,
            orderItems: lineItems.map(item => {
                const product = item.price?.product as Stripe.Product;
                 return {
                    productId: product.metadata.productId || 'unknown',
                    quantity: item.quantity || 0,
                    itemPrice: (item.price?.unit_amount ?? 0) / 100,
                    name: product.name,
                    image: product.images[0] || ''
                };
            }),
            stripeSessionId: session.id,
        };

        const orderRef = firestore.collection('users').doc(userId).collection('orders').doc(session.id);
        await orderRef.set(orderData);
        console.log(`[processSuccessfulOrder] Commande ${session.id} enregistrée dans Firestore pour l'utilisateur ${userId}.`);

        // --- Début de la logique d'envoi d'e-mail ---
        console.log("[processSuccessfulOrder] Préparation de l'envoi d'e-mail via SendGrid.");
        const userEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || 'Client(e)';

        if (!userEmail) {
            console.error(`[processSuccessfulOrder] ERREUR: Adresse e-mail du client manquante pour la session ${sessionId}. E-mail non envoyé.`);
        } else {
            try {
                console.log(`[processSuccessfulOrder] Tentative d'envoi d'email à ${userEmail}...`);
                const emailResult = await sendOrderConfirmationEmail(
                    userEmail,
                    customerName,
                    session.id,
                    orderData.orderItems,
                    orderData.totalAmount,
                    invoice?.invoice_pdf || undefined
                );

                if (emailResult.success) {
                    console.log(`[processSuccessfulOrder] Email de confirmation envoyé avec succès à ${userEmail} pour la session ${sessionId}.`);
                } else {
                    console.error(`[processSuccessfulOrder] ERREUR lors de l'envoi de l'e-mail à ${userEmail}:`, emailResult.error);
                    return { success: true, message: `Commande enregistrée, mais l'envoi de l'e-mail a échoué: ${emailResult.error}` };
                }
            } catch (emailError: any) {
                console.error(`[processSuccessfulOrder] ERREUR lors de l'envoi de l'e-mail via SendGrid à ${userEmail}:`, emailError);
                return { success: true, message: `Commande enregistrée, mais l'envoi de l'e-mail a échoué: ${emailError.message}` };
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
 * Abonne un utilisateur à la newsletter.
 * TODO: Implémenter avec SendGrid Marketing Campaigns API si besoin
 */
export async function subscribeToNewsletter(
  prevState: any,
  formData: FormData
): Promise<{ message: string; error?: boolean }> {
  console.log("Newsletter: Fonctionnalité en cours de migration vers SendGrid.");

  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
      error: true,
    };
  }

  const { email } = validatedFields.data;

  // Pour l'instant, on enregistre simplement dans Firestore
  try {
    if (!firestore) {
      throw new Error("Firestore n'est pas configuré.");
    }

    await firestore.collection('newsletter_subscribers').doc(email).set({
      email: email,
      subscribedAt: new Date().toISOString(),
      status: 'active'
    });

    console.log(`[Newsletter] Email ${email} ajouté à la liste d'abonnés.`);
    return { message: "Merci ! Vous êtes bien inscrit(e) à notre newsletter." };
  } catch (e: any) {
    console.error('Erreur lors de l\'inscription à la newsletter:', e);

    // Gérer le cas où l'email existe déjà
    if (e.code === 6) { // ALREADY_EXISTS
      return { message: "Vous êtes déjà inscrit(e) à notre newsletter !" };
    }

    return { message: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.', error: true };
  }
}
