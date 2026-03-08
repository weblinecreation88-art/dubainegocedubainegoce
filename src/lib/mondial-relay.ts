/**
 * Mondial Relay API Helper
 * Fetches available relays (pickup points) for international addresses
 */

export interface MondialRelayPickupPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance in km from user address
}

/**
 * Mock pickup points for demo purposes
 * In production, this would call the actual Mondial Relay API
 */
const MOCK_PICKUP_POINTS: Record<string, MondialRelayPickupPoint[]> = {
  'BE': [ // Belgium
    { id: 'BE001', name: 'Mondial Relay Bruxelles Gare', address: 'Rue de France 3', postalCode: '1000', city: 'Bruxelles', country: 'BE' },
    { id: 'BE002', name: 'Mondial Relay Anvers Centre', address: 'Meir 50', postalCode: '2000', city: 'Anvers', country: 'BE' },
    { id: 'BE003', name: 'Mondial Relay Liège', address: 'Rue Léopold 25', postalCode: '4000', city: 'Liège', country: 'BE' },
    { id: 'BE004', name: 'Mondial Relay Gand', address: 'Sint-Veerleplein 5', postalCode: '9000', city: 'Gand', country: 'BE' },
  ],
  'NL': [ // Netherlands
    { id: 'NL001', name: 'Mondial Relay Amsterdam Centrum', address: 'Damrak 50', postalCode: '1012', city: 'Amsterdam', country: 'NL' },
    { id: 'NL002', name: 'Mondial Relay Rotterdam', address: 'Coolsingel 190', postalCode: '3011', city: 'Rotterdam', country: 'NL' },
    { id: 'NL003', name: 'Mondial Relay Utrecht', address: 'Vredenburg 50', postalCode: '3511', city: 'Utrecht', country: 'NL' },
    { id: 'NL004', name: 'Mondial Relay La Haye', address: 'Buitenhof 30', postalCode: '2513', city: 'La Haye', country: 'NL' },
  ],
  'DE': [ // Germany
    { id: 'DE001', name: 'Mondial Relay Berlin Hauptbahnhof', address: 'Europaplatz 1', postalCode: '10557', city: 'Berlin', country: 'DE' },
    { id: 'DE002', name: 'Mondial Relay Munich', address: 'Bahnhofstr. 1', postalCode: '80335', city: 'Munich', country: 'DE' },
    { id: 'DE003', name: 'Mondial Relay Cologne', address: 'Domstr. 2', postalCode: '50667', city: 'Cologne', country: 'DE' },
    { id: 'DE004', name: 'Mondial Relay Frankfurt', address: 'Mainzer Str. 1', postalCode: '60311', city: 'Francfort', country: 'DE' },
  ],
  'LU': [ // Luxembourg
    { id: 'LU001', name: 'Mondial Relay Luxembourg Ville', address: 'Place Guillaume II', postalCode: '1648', city: 'Luxembourg', country: 'LU' },
    { id: 'LU002', name: 'Mondial Relay Esch-sur-Alzette', address: 'Rue de la Gare 50', postalCode: '4018', city: 'Esch-sur-Alzette', country: 'LU' },
  ]
};

/**
 * Get available Mondial Relay pickup points for a country
 * In production, integrate with actual Mondial Relay API
 * API docs: https://api.mondialrelay.com/v1/shipment/estimation
 */
export async function getMondialRelayPickupPoints(
  countryCode: string,
  postalCode?: string
): Promise<MondialRelayPickupPoint[]> {
  try {
    // Mock implementation - replace with actual API call
    let points = MOCK_PICKUP_POINTS[countryCode] || [];

    // Filter by postal code if provided (mock filter)
    if (postalCode) {
      const firstTwoDigits = postalCode.substring(0, 2);
      // In real implementation, calculate distance or filter by actual postal code proximity
      points = points.slice(0, 2); // Return nearest 2 points for demo
    }

    return points;

    // Real implementation would be:
    /*
    const response = await fetch('https://api.mondialrelay.com/v1/shipment/estimation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MONDIAL_RELAY_API_KEY}`
      },
      body: JSON.stringify({
        country_code: countryCode,
        postal_code: postalCode,
        weight: 1000 // Example weight
      })
    });

    if (!response.ok) throw new Error('Mondial Relay API error');
    const data = await response.json();
    return data.pickup_points;
    */
  } catch (error) {
    console.error('[getMondialRelayPickupPoints] Error:', error);
    return [];
  }
}

/**
 * Get nearest pickup point for an address
 */
export function getNearestPickupPoint(
  points: MondialRelayPickupPoint[]
): MondialRelayPickupPoint | null {
  if (points.length === 0) return null;
  return points[0]; // In real implementation, calculate distance and return nearest
}

/**
 * Format pickup point display
 */
export function formatPickupPoint(point: MondialRelayPickupPoint): string {
  return `${point.name} - ${point.postalCode} ${point.city}`;
}

/**
 * Supported countries for Mondial Relay international shipping
 */
export const SUPPORTED_COUNTRIES = {
  'BE': 'Belgique',
  'NL': 'Pays-Bas',
  'DE': 'Allemagne',
  'LU': 'Luxembourg',
  'FR': 'France' // France is also supported
};

export type SupportedCountry = keyof typeof SUPPORTED_COUNTRIES;

export function isSupportedCountry(code: string): code is SupportedCountry {
  return code in SUPPORTED_COUNTRIES;
}
