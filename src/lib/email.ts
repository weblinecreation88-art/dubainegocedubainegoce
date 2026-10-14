/**
 * Envoi d'e-mails transactionnels via Brevo.
 *
 * Brevo remplace Resend : le compte Resend n'avait aucun domaine verifie, ce qui
 * limitait les envois a l'adresse du proprietaire du compte. Brevo accepte un
 * expediteur valide (adresse verifiee ou domaine authentifie) et peut donc
 * ecrire aux clients.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

// Expediteur par defaut : doit etre un expediteur verifie dans Brevo,
// sinon l'API refuse l'envoi.
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'abderelmalki@gmail.com';
const DEFAULT_FROM_NAME = process.env.FROM_NAME || 'DubaiNegoce';

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  fromEmail?: string;
  fromName?: string;
};

export type SendEmailResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}

/**
 * Envoie un e-mail transactionnel. Ne leve jamais : retourne toujours un
 * resultat, pour qu'un echec d'envoi ne fasse pas echouer l'action appelante
 * (une commande payee doit etre enregistree meme si l'e-mail part mal).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('[email] BREVO_API_KEY manquante : e-mail non envoye.');
    return { success: false, error: 'BREVO_API_KEY manquante.' };
  }

  const recipients = (Array.isArray(input.to) ? input.to : [input.to])
    .map((e) => e?.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    return { success: false, error: 'Aucun destinataire.' };
  }

  const payload: Record<string, unknown> = {
    sender: {
      email: input.fromEmail || DEFAULT_FROM_EMAIL,
      name: input.fromName || DEFAULT_FROM_NAME,
    },
    to: recipients.map((email) => ({ email })),
    subject: input.subject,
    htmlContent: input.html,
  };

  if (input.replyTo) {
    payload.replyTo = { email: input.replyTo };
  }

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    if (!response.ok) {
      console.error(`[email] Brevo a refuse l'envoi (${response.status}) : ${body}`);
      return { success: false, error: `Brevo ${response.status}: ${body}` };
    }

    let messageId: string | undefined;
    try {
      messageId = JSON.parse(body)?.messageId;
    } catch {
      // Corps non-JSON : l'envoi est accepte, on continue sans identifiant.
    }

    console.log(`[email] Envoye a ${recipients.join(', ')} (${messageId || 'sans id'})`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error("[email] Echec reseau lors de l'envoi via Brevo :", error);
    return { success: false, error: error?.message || 'Erreur reseau.' };
  }
}
