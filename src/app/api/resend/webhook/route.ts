
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('!!! ERREUR FATALE: La variable d\'environnement RESEND_API_KEY n\'est pas configurée sur le serveur.');
    return NextResponse.json({ error: 'Configuration du serveur incomplète.' }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);
  const signature = req.headers.get('resend-signature');
  const body = await req.text();

  // Log la signature pour debugging
  if (!signature) {
    console.warn('[Webhook Resend] AVERTISSEMENT: Aucune signature fournie (normal pour les tests).');
  }

  try {
    const payload = JSON.parse(body);
    console.log(`[Webhook Resend] Événement reçu : ${payload.type || 'unknown'}`);

    // Traiter les différents types d'événements
    switch (payload.type) {
      case 'contact.created':
        console.log(`[Webhook Resend] Nouveau contact créé : ${payload.data?.email}`);
        break;

      case 'email.sent':
        console.log(`[Webhook Resend] Email envoyé avec succès`);
        break;

      case 'email.delivered':
        console.log(`[Webhook Resend] Email délivré avec succès`);
        break;

      case 'email.bounced':
        console.log(`[Webhook Resend] Email rebondi - Email: ${payload.data?.email || 'unknown'}`);
        // TODO: Marquer l'email comme invalide dans la base de données
        break;

      case 'email.complained':
        console.log(`[Webhook Resend] Plainte spam reçue`);
        // TODO: Désabonner automatiquement cet email
        break;

      case 'email.opened':
        console.log(`[Webhook Resend] Email ouvert`);
        break;

      case 'email.clicked':
        console.log(`[Webhook Resend] Lien cliqué dans l'email`);
        break;

      default:
        console.log(`[Webhook Resend] Événement non géré : ${payload.type}`);
    }

  } catch (err: any) {
    console.error(`[Webhook Resend] ERREUR lors du parsing : ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
