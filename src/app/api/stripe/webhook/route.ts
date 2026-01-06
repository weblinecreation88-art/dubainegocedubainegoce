
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { buffer } from 'node:stream/consumers';
import { processSuccessfulOrder } from '@/app/actions';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error('!!! ERREUR FATALE: Les variables d\'environnement Stripe (STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET) ne sont pas configurées sur le serveur.');
    return NextResponse.json({ error: 'Configuration du serveur incomplète.' }, { status: 500 });
  }
  
  const body = await buffer(req.body as any);
  const sig = headers().get('stripe-signature') as string;
  const stripe = new Stripe(stripeSecretKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`[Webhook Stripe] Événement reçu et vérifié : ${event.type}`);
  } catch (err: any) {
    console.error(`[Webhook Stripe] ERREUR de vérification de la signature : ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Gérer l'événement
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Webhook Stripe] Traitement de checkout.session.completed pour la session : ${session.id}`);
      
      try {
        const result = await processSuccessfulOrder(session.id);
        if (!result.success) {
          console.error(`[Webhook Stripe] Échec du traitement de la commande pour la session ${session.id}: ${result.message}`);
          return NextResponse.json({ error: `Échec du traitement de la commande: ${result.message}` }, { status: 500 });
        } else {
          console.log(`[Webhook Stripe] Commande pour la session ${session.id} traitée avec succès.`);
        }
      } catch (error: any) {
        console.error(`[Webhook Stripe] ERREUR CRITIQUE lors du traitement de la commande pour la session ${session.id}:`, error);
        return NextResponse.json({ error: 'Erreur interne lors du traitement de la commande.' }, { status: 500 });
      }
      break;
    }
    
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const sessionId = (invoice as any).checkout_session;

      if(typeof sessionId === 'string') {
        console.log(`[Webhook Stripe] Traitement de invoice.payment_succeeded pour la session : ${sessionId}`);
        try {
          const result = await processSuccessfulOrder(sessionId);
          if (!result.success) {
            console.error(`[Webhook Stripe] Échec du traitement de la commande (via facture) pour la session ${sessionId}: ${result.message}`);
            return NextResponse.json({ error: `Échec du traitement de la commande: ${result.message}` }, { status: 500 });
          } else {
            console.log(`[Webhook Stripe] Commande (via facture) pour la session ${sessionId} traitée avec succès.`);
          }
        } catch (error: any) {
          console.error(`[Webhook Stripe] ERREUR CRITIQUE lors du traitement de la commande (via facture) pour la session ${sessionId}:`, error);
          return NextResponse.json({ error: 'Erreur interne lors du traitement de la commande.' }, { status: 500 });
        }
      } else {
         console.warn(`[Webhook Stripe] Événement invoice.payment_succeeded reçu sans ID de session de checkout. Facture ID: ${invoice.id}`);
      }
      break;
    }

    default:
      console.log(`[Webhook Stripe] Événement non géré : ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
