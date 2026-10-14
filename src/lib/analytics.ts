// Suivi GA4 envoyé directement via gtag.js (sans dépendre d'une balise GA4 dans GTM).
// Les événements sont aussi poussés dans le dataLayer pour les balises GTM existantes.

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || 'G-HM2MMVGBP7';

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
};

export type EcommerceParams = {
  currency?: 'EUR';
  value?: number;
  transaction_id?: string | null;
  tax?: number;
  shipping?: number;
  affiliation?: string;
  items: AnalyticsItem[];
};

const isInternalHost = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || /^192\.168\./.test(hostname);

export function trackEcommerce(event: string, ecommerce: EcommerceParams) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];

  // GTM : on vide l'objet ecommerce précédent avant d'en pousser un nouveau.
  w.dataLayer.push({ ecommerce: null });
  w.dataLayer.push({ event, ecommerce });

  if (isInternalHost(window.location.hostname)) return;
  // Même mécanisme que gtag() : la commande est mise en file si gtag.js n'est pas encore chargé.
  const gtag = typeof w.gtag === 'function' ? w.gtag : function () { w.dataLayer.push(arguments); };
  gtag('event', event, { currency: 'EUR', ...ecommerce, send_to: GA4_MEASUREMENT_ID });
}
