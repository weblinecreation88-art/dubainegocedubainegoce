import type { Order } from '@/lib/types';

const CARRIERS = {
  colissimo: {
    label: 'Colissimo',
    delay: '2 à 3 jours ouvrés',
    trackingUrl: (n: string) =>
      `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  },
  'mondial-relay': {
    label: 'Mondial Relay',
    delay: '3 à 5 jours ouvrés',
    trackingUrl: (n: string) =>
      `https://www.mondialrelay.fr/suivi-de-colis/?NumColis=${encodeURIComponent(n)}`,
  },
} as const;

export function getTrackingUrl(carrier: string | undefined, trackingNumber: string): string {
  const c = CARRIERS[(carrier || 'colissimo') as keyof typeof CARRIERS] || CARRIERS.colissimo;
  return c.trackingUrl(trackingNumber);
}

/**
 * E-mail annoncant l'expedition d'une commande.
 * Le message de confirmation promet cet envoi ("Vous recevrez un autre e-mail
 * lorsque votre commande sera expediee") : il doit partir a chaque expedition.
 */
export function renderOrderShippedEmail(
  order: Order,
  trackingNumber: string,
  appUrl = 'https://dubainegoce.fr'
): string {
  const carrierKey = (order.carrier || order.shippingMethod || 'colissimo') as keyof typeof CARRIERS;
  const carrier = CARRIERS[carrierKey] || CARRIERS.colissimo;
  const trackingUrl = carrier.trackingUrl(trackingNumber);
  const customerName = order.customerName?.split(' ')[0] || 'Bonjour';
  const orderRef = order.id.substring(0, 8);

  const itemsHtml = (order.orderItems || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.name}" width="56" height="56" style="border-radius:6px;vertical-align:middle;margin-right:12px;object-fit:cover;" />`
                : ''
            }
            <span style="vertical-align:middle;font-size:15px;color:#222;">${item.name}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;color:#666;font-size:14px;white-space:nowrap;">
            x${item.quantity}
          </td>
        </tr>`
    )
    .join('');

  // Adresse de livraison, ou point relais choisi le cas echeant.
  const pp = order.pickupPoint;
  const addr = order.shippingAddress;
  const destination = pp?.name
    ? [pp.name, pp.address, [pp.postalCode, pp.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join('<br/>')
    : [
        order.customerName,
        addr?.line1,
        addr?.line2,
        [addr?.postalCode, addr?.city].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join('<br/>');

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f6f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Votre commande #${orderRef} vient de partir — suivez-la en un clic.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f3;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">

        <tr>
          <td style="background:#1a1a1a;padding:28px 32px;text-align:center;">
            <div style="color:#c9a227;font-size:12px;letter-spacing:3px;text-transform:uppercase;">DubaiNegoce</div>
            <div style="color:#ffffff;font-size:22px;margin-top:10px;font-weight:600;">Votre commande est en route</div>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;color:#222;line-height:1.6;">
              ${customerName}, bonne nouvelle&nbsp;: votre colis vient d'être remis à
              <strong>${carrier.label}</strong>.
            </p>

            <div style="background:#faf9f7;border:1px solid #ece9e4;border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
              <div style="font-size:12px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1px;">Numéro de suivi</div>
              <div style="font-size:20px;font-weight:700;color:#1a1a1a;font-family:monospace;margin:8px 0 16px;letter-spacing:1px;">${trackingNumber}</div>
              <a href="${trackingUrl}" style="display:inline-block;background:#c9a227;color:#1a1a1a;text-decoration:none;padding:13px 30px;border-radius:6px;font-weight:600;font-size:15px;">
                Suivre mon colis
              </a>
              <div style="font-size:13px;color:#8a8a8a;margin-top:14px;">Livraison estimée sous ${carrier.delay}</div>
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr><td colspan="2" style="font-size:13px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Votre commande #${orderRef}</td></tr>
              ${itemsHtml}
            </table>

            <div style="background:#faf9f7;border-radius:8px;padding:16px;margin-top:8px;">
              <div style="font-size:12px;color:#8a8a8a;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                ${pp?.name ? 'Point relais' : 'Adresse de livraison'}
              </div>
              <div style="font-size:14px;color:#333;line-height:1.6;">${destination}</div>
            </div>

            <p style="margin:26px 0 0;font-size:14px;color:#666;line-height:1.6;">
              Le suivi peut mettre quelques heures avant d'afficher les premières informations,
              le temps que le transporteur enregistre le colis.
            </p>

            <p style="margin:20px 0 0;font-size:14px;color:#666;line-height:1.6;">
              Une question&nbsp;? Répondez simplement à cet e-mail, nous vous répondrons.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#faf9f7;padding:22px 32px;text-align:center;border-top:1px solid #ece9e4;">
            <a href="${appUrl}/shop" style="color:#c9a227;text-decoration:none;font-size:14px;font-weight:600;">Découvrir nos nouveautés</a>
            <div style="font-size:12px;color:#9a9a9a;margin-top:14px;line-height:1.6;">
              DubaiNegoce — Parfums d'exception<br/>
              <a href="${appUrl}" style="color:#9a9a9a;">dubainegoce.fr</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
