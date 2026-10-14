import { getProducts, computeShippingCost } from '@/lib/data';
import type { Product } from '@/lib/types';

/**
 * Calcul serveur du montant d'une commande, partage par Stripe et PayPal.
 *
 * Le navigateur n'envoie que des identifiants et des quantites : prix, stock et
 * frais de port sont toujours recalcules ici a partir du catalogue, pour que le
 * montant encaisse ne puisse pas etre manipule.
 */

export const ALLOWED_COUNTRIES = ['FR', 'BE', 'LU', 'NL', 'DE', 'CH'] as const;

export type IncomingItem = { id: string; quantity: number };

export type PricedLine = { product: Product; quantity: number };

export type PricedOrder = {
  ok: true;
  lines: PricedLine[];
  totalQuantity: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: 'colissimo' | 'mondial-relay';
  country: string;
};

export type PricingError = { ok: false; status: number; error: string };

const round2 = (n: number) => Math.round(n * 100) / 100;

export function priceOrder(
  items: unknown,
  shippingMethodInput: unknown,
  countryInput: unknown
): PricedOrder | PricingError {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, status: 400, error: 'Votre panier est vide.' };
  }

  const shippingMethod = shippingMethodInput === 'colissimo' ? 'colissimo' : 'mondial-relay';
  const country = String(countryInput || 'FR').toUpperCase();
  if (!(ALLOWED_COUNTRIES as readonly string[]).includes(country)) {
    return { ok: false, status: 400, error: 'Pays de livraison non desservi.' };
  }

  const catalog = getProducts();
  const lines: PricedLine[] = [];
  let totalQuantity = 0;
  let subtotal = 0;

  for (const raw of items as IncomingItem[]) {
    const quantity = Math.floor(Number(raw?.quantity));
    if (!raw?.id || !Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
      return { ok: false, status: 400, error: 'Panier invalide.' };
    }

    const product = catalog.find((p) => p.id === raw.id);
    if (!product) {
      return { ok: false, status: 400, error: "Un article de votre panier n'est plus disponible." };
    }
    if (product.stock <= 0) {
      return { ok: false, status: 409, error: `${product.name} est en rupture de stock.` };
    }
    if (quantity > product.stock) {
      return {
        ok: false,
        status: 409,
        error: `Il ne reste que ${product.stock} exemplaire(s) de ${product.name}.`,
      };
    }

    lines.push({ product, quantity });
    totalQuantity += quantity;
    subtotal += product.price * quantity;
  }

  subtotal = round2(subtotal);
  const shippingCost = round2(computeShippingCost(shippingMethod, country, totalQuantity, subtotal));

  return {
    ok: true,
    lines,
    totalQuantity,
    subtotal,
    shippingCost,
    total: round2(subtotal + shippingCost),
    shippingMethod,
    country,
  };
}

/** Identifie l'acheteur si un jeton Firebase est fourni ; sinon commande invitee. */
export async function resolveBuyer(
  authorizationHeader: string | null
): Promise<{ userId: string; email?: string } | { error: string }> {
  const header = authorizationHeader || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!idToken) return { userId: 'guest' };

  try {
    const { auth } = await import('@/firebase/server');
    const decoded = await auth.verifyIdToken(idToken);
    return { userId: decoded.uid, email: decoded.email };
  } catch {
    return { error: 'Session expirée, veuillez vous reconnecter.' };
  }
}
