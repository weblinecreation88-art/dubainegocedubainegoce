import sgMail from '@sendgrid/mail';

// Initialisation de SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'contact@dubainegoce.fr';

if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Envoie un email via SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!sendGridApiKey) {
    console.error('[SendGrid] ERREUR: SENDGRID_API_KEY n\'est pas configurée.');
    return { success: false, error: 'SendGrid n\'est pas configuré.' };
  }

  try {
    await sgMail.send({
      to: options.to,
      from: options.from || `DubaiNegoce <${fromEmail}>`,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[SendGrid] Email envoyé avec succès à ${options.to}`);
    return { success: true };
  } catch (error: any) {
    console.error('[SendGrid] ERREUR lors de l\'envoi de l\'email:', error);
    return { success: false, error: error.message || 'Erreur d\'envoi d\'email' };
  }
}

/**
 * Envoie l'email de confirmation de commande
 */
export async function sendOrderConfirmationEmail(
  userEmail: string,
  customerName: string,
  orderId: string,
  orderItems: Array<{ name: string; quantity: number; itemPrice: number }>,
  totalAmount: number,
  invoicePdfUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: right;">${item.itemPrice.toFixed(2)} €</td>
    </tr>
  `).join('');

  const invoiceLinkHtml = invoicePdfUrl
    ? `<p style="margin: 20px 0;">Vous pouvez télécharger votre facture : <a href="${invoicePdfUrl}" style="color: #d4af37; text-decoration: none; font-weight: bold;">Télécharger la facture</a></p>`
    : '';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">DubaiNegoce</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Parfums d'Exception</p>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #d4af37; margin-top: 0;">Confirmation de votre commande</h2>
        <p>Bonjour <strong>${customerName}</strong>,</p>
        <p>Merci pour votre achat chez DubaiNegoce. Votre commande <strong>#${orderId.substring(0, 8)}</strong> a été confirmée avec succès.</p>

        <h3 style="color: #1a1f2e; margin-top: 30px; margin-bottom: 15px;">Détails de votre commande</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left; color: #1a1f2e;">Produit</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; color: #1a1f2e;">Quantité</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: right; color: #1a1f2e;">Prix unitaire</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px; color: #1a1f2e;"><strong>Montant total : ${totalAmount.toFixed(2)} €</strong></p>
        </div>

        ${invoiceLinkHtml}

        <div style="margin-top: 30px; padding: 20px; background: #fffbeb; border-left: 4px solid #d4af37; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>📦 Prochaine étape :</strong> Vous recevrez un email de confirmation d'expédition avec votre numéro de suivi dès que votre commande sera expédiée.
          </p>
        </div>

        <p style="margin-top: 30px;">Si vous avez des questions, n'hésitez pas à nous contacter à <a href="mailto:contact@dubainegoce.fr" style="color: #d4af37; text-decoration: none;">contact@dubainegoce.fr</a></p>

        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">Cordialement,<br><strong>L'équipe DubaiNegoce</strong></p>
      </div>

      <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} DubaiNegoce - Tous droits réservés
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Confirmation de votre commande DubaiNegoce #${orderId.substring(0, 8)}`,
    html: emailHtml,
  });
}
