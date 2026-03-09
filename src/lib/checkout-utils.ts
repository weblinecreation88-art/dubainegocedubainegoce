/**
 * Checkout calculation utilities
 * Handles VAT, shipping costs, and total calculations
 */

export const VAT_RATE = 0.20; // 20% VAT in France/EU

/**
 * Calculate VAT amount (20% of subtotal)
 */
export function calculateVAT(subtotal: number): number {
  return Math.round(subtotal * VAT_RATE * 100) / 100;
}

/**
 * Calculate complete order total
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number
): {
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
} {
  const vat = calculateVAT(subtotal);
  const total = subtotal + vat + shippingCost;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    shipping: Math.round(shippingCost * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Validate postal code format (basic)
 */
export function validatePostalCode(postalCode: string, country: string): boolean {
  const patterns: Record<string, RegExp> = {
    FR: /^\d{5}$/,           // 5 digits for France
    DE: /^\d{5}$/,           // 5 digits for Germany
    BE: /^\d{4}$/,           // 4 digits for Belgium
    NL: /^\d{4}\s?[A-Z]{2}$/, // Format: 1234 AB
    LU: /^\d{4}$/,           // 4 digits for Luxembourg
    CH: /^\d{4}$/,           // 4 digits for Switzerland
  };

  const pattern = patterns[country];
  if (!pattern) return true; // No validation for unknown countries

  return pattern.test(postalCode.trim().toUpperCase());
}

/**
 * Get shipping method display name
 */
export function getShippingMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    'colissimo': '📦 Colissimo (Livraison à domicile)',
    'mondial-relay': '🛒 Mondial Relay (Point relais)',
  };
  return labels[method] || method;
}

/**
 * Get delivery timeframe
 */
export function getDeliveryTimeframe(method: string, country: string): string {
  if (method === 'colissimo' && country === 'FR') {
    return '48h en France métropolitaine';
  }
  if (method === 'mondial-relay') {
    return '4-7 jours ouvrables';
  }
  return '7-10 jours';
}
