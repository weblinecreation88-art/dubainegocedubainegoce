interface CartItem {
  name: string;
  quantity: number;
  price?: number;
  itemPrice?: number;
}

function getItemPrice(item: CartItem): number {
  return item.price ?? item.itemPrice ?? 0;
}

// ─────────────────────────────────────────────
// EMAIL J+1 — Rappel doux, sans code promo
// ─────────────────────────────────────────────
export function renderAbandonedCartDay1Email(
  customerName: string,
  cartItems: CartItem[],
  cartTotal: number,
  cartLink: string
): string {
  const itemsHtml = cartItems.map(item => {
    const price = getItemPrice(item);
    return `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 0;">
        <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a1a1a;">${item.name}</p>
        <p style="margin: 0; color: #888; font-size: 13px;">Quantité : ${item.quantity}</p>
      </td>
      <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #1a1a1a;">
        ${(price * item.quantity).toFixed(2)} €
      </td>
    </tr>
  `;}).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia,serif;">
      <div style="max-width:600px;margin:0 auto;background:#fff;">

        <!-- Header -->
        <div style="background:#1a1a1a;padding:28px 30px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:3px;font-weight:normal;">DUBAINEGOCE</h1>
          <p style="margin:6px 0 0;color:#aaa;font-size:11px;letter-spacing:2px;">PARFUMS AUTHENTIQUES DE DUBAÏ</p>
        </div>

        <!-- Body -->
        <div style="padding:40px 36px;">
          <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px;font-weight:normal;">
            Bonjour ${customerName},
          </h2>
          <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
            Vous avez laissé quelques parfums dans votre panier hier. Ils vous attendent toujours —
            et les stocks restent limités sur certaines fragrances.
          </p>

          <!-- Récap panier -->
          <div style="border:1px solid #e8e8e8;border-radius:6px;padding:20px;margin-bottom:28px;">
            <p style="margin:0 0 16px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Votre sélection</p>
            <table style="width:100%;border-collapse:collapse;">
              <tbody>
                ${itemsHtml}
                <tr>
                  <td style="padding-top:14px;font-size:15px;font-weight:bold;color:#1a1a1a;border-top:2px solid #eee;">Total</td>
                  <td style="padding-top:14px;text-align:right;font-size:15px;font-weight:bold;color:#1a1a1a;border-top:2px solid #eee;">${cartTotal.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${cartLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:16px 48px;text-decoration:none;font-size:14px;letter-spacing:2px;text-transform:uppercase;">
              Reprendre ma commande
            </a>
          </div>

          <!-- Réassurance -->
          <div style="display:flex;gap:12px;justify-content:center;text-align:center;font-size:12px;color:#888;">
            <span>✓ 100% Authentique</span>
            &nbsp;&nbsp;
            <span>✓ Livraison Colissimo 48h</span>
            &nbsp;&nbsp;
            <span>✓ Paiement sécurisé</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9f9f9;border-top:1px solid #eee;padding:20px 36px;text-align:center;font-size:11px;color:#aaa;">
          <p style="margin:0 0 6px;">© ${new Date().getFullYear()} Dubainegoce · <a href="${cartLink.split('/cart')[0]}/contact" style="color:#aaa;">Nous contacter</a></p>
          <p style="margin:0;">Vous recevez cet email car vous avez un panier en cours.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function renderAbandonedCartDay3Email(
  customerName: string,
  cartItems: CartItem[],
  cartTotal: number,
  promoCode: string,
  cartLink: string
): string {
  const itemsHtml = cartItems.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">
        <p style="margin: 0 0 5px 0; font-weight: bold;">${item.name}</p>
        <p style="margin: 0; color: #666; font-size: 14px;">
          Quantité: ${item.quantity} × ${item.itemPrice.toFixed(2)}€
        </p>
      </td>
      <td style="padding: 10px 0; text-align: right; font-weight: bold;">
        ${(item.itemPrice * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .header { background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 2px solid #d63384; }
          .header h1 { color: #d63384; margin: 0; }
          .header p { margin: 5px 0 0 0; color: #666; font-size: 12px; }
          .container { max-width: 600px; margin: 0 auto; padding: 30px 20px; }
          .promo-box { background-color: #fff3f7; border: 2px dashed #d63384; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px; }
          .promo-code { background-color: #fff; border: 1px solid #d63384; border-radius: 4px; padding: 12px 20px; font-size: 24px; font-weight: bold; color: #d63384; letter-spacing: 2px; font-family: monospace; }
          .cta-button { display: inline-block; background-color: #d63384; color: #fff; padding: 14px 40px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { padding-top: 15px; border-top: 2px solid #eee; font-size: 16px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Dubainegoce</h1>
          <p>Vos parfums de Dubaï préférés</p>
        </div>

        <div class="container">
          <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${customerName},</h2>

          <p style="margin-bottom: 20px;">
            Nous avons remarqué que vous aviez ajouté des parfums à votre panier il y a quelques jours.
          </p>

          <p style="margin-bottom: 20px; font-weight: bold; color: #d63384;">
            Bonne nouvelle! Nous vous offrons <span style="font-size: 18px;">5% de réduction</span> sur votre commande aujourd'hui.
          </p>

          <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">Votre sélection:</h3>
            <table>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td>Total:</td>
                  <td style="text-align: right;">${cartTotal.toFixed(2)}€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="promo-box">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              Utilisez ce code promo à la caisse:
            </p>
            <div class="promo-code">${promoCode}</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
              5% de réduction - Valable 7 jours
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${cartLink}" class="cta-button">Finaliser ma commande</a>
          </div>

          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            Vous hésitez? Nos parfums authentiques de Dubaï sont sélectionnés pour leur qualité exceptionnelle.
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Dubainegoce. Tous droits réservés.</p>
          <p style="margin: 0;">contact@dubainegoce.fr</p>
        </div>
      </body>
    </html>
  `;
}

export function renderAbandonedCartDay7Email(
  customerName: string,
  cartItems: CartItem[],
  cartTotal: number,
  promoCode: string,
  cartLink: string,
  discountPercentage: number = 5
): string {
  const discountAmount = (cartTotal * discountPercentage) / 100;
  const finalTotal = cartTotal - discountAmount;

  const itemsHtml = cartItems.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">
        <p style="margin: 0 0 5px 0; font-weight: bold;">${item.name}</p>
        <p style="margin: 0; color: #666; font-size: 14px;">
          ${item.quantity} × ${item.itemPrice.toFixed(2)}€
        </p>
      </td>
      <td style="padding: 10px 0; text-align: right; font-weight: bold;">
        ${(item.itemPrice * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .alert { background-color: #d63384; padding: 15px; text-align: center; color: #fff; }
          .alert p { margin: 0; font-weight: bold; font-size: 16px; }
          .header { background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 2px solid #d63384; }
          .header h1 { color: #d63384; margin: 0; }
          .header p { margin: 5px 0 0 0; color: #666; font-size: 12px; }
          .container { max-width: 600px; margin: 0 auto; padding: 30px 20px; }
          .promo-box { background-color: #d63384; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px; color: #fff; }
          .promo-code { background-color: rgba(255,255,255,0.2); border: 2px solid #fff; border-radius: 4px; padding: 12px 20px; font-size: 28px; font-weight: bold; letter-spacing: 3px; font-family: monospace; margin-bottom: 10px; }
          .cta-button { display: inline-block; background-color: #d63384; color: #fff; padding: 16px 50px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 18px; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          .total-row { padding-top: 15px; border-top: 2px solid #eee; font-size: 16px; font-weight: bold; }
          .savings { background-color: #fff3f7; border: 2px solid #d63384; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px; }
          .savings-amount { font-size: 28px; font-weight: bold; color: #d63384; }
          .social-proof { background-color: #f5f5f5; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="alert">
          <p>⏰ Dernière chance! Votre réduction expire dans 1 jour</p>
        </div>

        <div class="header">
          <h1>Dubainegoce</h1>
          <p>Vos parfums de Dubaï préférés</p>
        </div>

        <div class="container">
          <h2 style="color: #d63384; margin-bottom: 20px;">Bonjour ${customerName},</h2>

          <p style="margin-bottom: 20px; font-size: 16px; color: #d63384; font-weight: bold;">
            Vous avez oublié votre réduction de ${discountPercentage}%!
          </p>

          <p style="margin-bottom: 20px;">
            Vos parfums de Dubaï préférés sont toujours disponibles dans votre panier. Ne manquez pas cette offre exclusive qui expire <strong>demain</strong>.
          </p>

          <div class="savings">
            <p style="margin: 0 0 10px 0; color: #666;">Vous économiseriez:</p>
            <div class="savings-amount">${discountAmount.toFixed(2)}€</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              ${cartTotal.toFixed(2)}€ → <strong>${finalTotal.toFixed(2)}€</strong>
            </p>
          </div>

          <div style="background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">Votre panier:</h3>
            <table>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td>Total:</td>
                  <td style="text-align: right;">${cartTotal.toFixed(2)}€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="promo-box">
            <p style="margin: 0 0 10px 0; font-size: 14px;">
              Votre code promo (expire demain):
            </p>
            <div class="promo-code">${promoCode}</div>
            <p style="margin: 0; font-size: 12px; opacity: 0.9;">
              Ajouter le code à la caisse pour obtenir ${discountPercentage}% de réduction
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${cartLink}" class="cta-button">Commander avant que ce soit trop tard ✓</a>
          </div>

          <div class="social-proof">
            <p style="margin: 0 0 5px 0;">✓ Parfums 100% authentiques</p>
            <p style="margin: 0;">✓ Livraison rapide</p>
          </div>

          <p style="color: #666; font-size: 14px; margin-bottom: 20px; text-align: center;">
            <strong>Hésitez-vous encore?</strong><br/>
            Nos parfums offrent un excellent rapport qualité-prix avec une garantie d'authenticité.
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 5px 0;">© ${new Date().getFullYear()} Dubainegoce. Tous droits réservés.</p>
          <p style="margin: 0;">contact@dubainegoce.fr</p>
        </div>
      </body>
    </html>
  `;
}
