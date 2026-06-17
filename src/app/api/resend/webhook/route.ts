
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  const resendWebhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!resendWebhookSecret) {
    console.error('!!! ERREUR FATALE: La variable d\'environnement RESEND_WEBHOOK_SECRET n\'est pas configurée sur le serveur.');
    return NextResponse.json({ error: 'Configuration du serveur incomplète.' }, { status: 500 });
  }

  // Resend signe ses webhooks via Svix : svix-id / svix-timestamp / svix-signature
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  const body = await req.text();

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('[Webhook Resend] ERREUR: En-têtes de signature manquants.');
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });
  }

  try {
    const webhook = new Webhook(resendWebhookSecret);
    const payload = webhook.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type?: string };

    console.log(`[Webhook Resend] Événement reçu : ${payload.type || 'unknown'}`);

    // Ici, vous pouvez ajouter une logique pour traiter les différents types d'événements
    // switch (payload.type) {
    //   case 'email.delivered':
    //     // Logique pour marquer un email comme livré dans votre base de données
    //     break;
    //   case 'email.bounced':
    //     // Logique pour gérer un email qui n'a pas pu être livré
    //     break;
    //   default:
    //     console.log(`[Webhook Resend] Événement non géré : ${payload.type}`);
    // }

  } catch (err: any) {
    console.error(`[Webhook Resend] ERREUR de vérification de signature : ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }


  return NextResponse.json({ received: true });
}
