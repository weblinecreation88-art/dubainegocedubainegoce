/**
 * Checkout calculation utilities
 * Handles VAT, shipping costs, and total calculations
 */

export const VAT_RATE = 0.20; // 20% VAT in France/EU

/**
 * Calculate VAT amount INCLUDED in the price (products are already TTC at 35€)
 * Formula: VAT = (Price TTC / 1.20) * 0.20
 */
export function calculateVATIncluded(subtotal: number): number {
  return Math.round((subtotal / 1.2) * VAT_RATE * 100) / 100;
}

/**
 * Calculate complete order total
 * Products are already TTC (35€), so we don't add VAT - just show it for transparency
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingCost: number
): {
  subtotalHT: number;
  vat: number;
  subtotalTTC: number;
  shipping: number;
  total: number;
} {
  // Subtotal is already TTC, calculate VAT included
  const vatIncluded = calculateVATIncluded(subtotal);
  const subtotalHT = Math.round((subtotal - vatIncluded) * 100) / 100;

  // Shipping is usually HT, add VAT to it as well
  const shippingVAT = Math.round((shippingCost / 1.2) * VAT_RATE * 100) / 100;
  const shippingTTC = shippingCost + shippingVAT;
  const totalVAT = vatIncluded + shippingVAT;

  const total = subtotal + shippingTTC;

  return {
    subtotalHT: subtotalHT,
    vat: Math.round(totalVAT * 100) / 100,
    subtotalTTC: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shippingTTC * 100) / 100,
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

/**
 * Format shipping details with weight breakdown
 * Note: Each perfume bottle = 750g
 */
export function formatShippingDetail(method: string, weight: number, cost: number, country?: string): string {
  const weightKg = (weight / 1000).toFixed(2);
  const numBottles = Math.round(weight / 750);

  if (method === 'colissimo') {
    return `Colissimo (${numBottles} flacon${numBottles > 1 ? 's' : ''}, ${weightKg}kg)`;
  }

  if (method === 'mondial-relay') {
    // Determine weight bracket for pricing
    let bracket = '10kg+';
    if (weight <= 250) bracket = '≤250g';
    else if (weight <= 500) bracket = '250-500g';
    else if (weight <= 750) bracket = '≤750g';
    else if (weight <= 1000) bracket = '750g-1kg';
    else if (weight <= 2000) bracket = '1-2kg';
    else if (weight <= 4000) bracket = '2-4kg';
    else if (weight <= 5000) bracket = '4-5kg';
    else if (weight <= 7000) bracket = '5-7kg';
    else if (weight <= 10000) bracket = '7-10kg';

    return `Mondial Relay (${numBottles} flacon${numBottles > 1 ? 's' : ''} • ${bracket})`;
  }

  return `${method} (${numBottles} flacon${numBottles > 1 ? 's' : ''})`;
}
