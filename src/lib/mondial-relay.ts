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
  'FR': [ // France
    { id: 'FR001', name: 'Mondial Relay Paris Gare de Lyon', address: '20 Boulevard Diderot', postalCode: '75012', city: 'Paris', country: 'FR', distance: 0.5 },
    { id: 'FR002', name: 'Mondial Relay Paris Marais', address: '15 Rue de Turenne', postalCode: '75003', city: 'Paris', country: 'FR', distance: 1.2 },
    { id: 'FR003', name: 'Mondial Relay Paris La Défense', address: '1 Esplanade du Général de Gaulle', postalCode: '92400', city: 'Courbevoie', country: 'FR', distance: 3.8 },
    { id: 'FR004', name: 'Mondial Relay Lyon Presqu\'île', address: '35 Rue de la République', postalCode: '69002', city: 'Lyon', country: 'FR', distance: 2.1 },
    { id: 'FR005', name: 'Mondial Relay Marseille Vieux Port', address: '3 Quai du Port', postalCode: '13002', city: 'Marseille', country: 'FR', distance: 1.5 },
    { id: 'FR006', name: 'Mondial Relay Toulouse Centre', address: '42 Rue du Taur', postalCode: '31000', city: 'Toulouse', country: 'FR', distance: 0.8 },
  ],
  'BE': [ // Belgium
    { id: 'BE001', name: 'Mondial Relay Bruxelles Gare', address: 'Rue de France 3', postalCode: '1000', city: 'Bruxelles', country: 'BE', distance: 0.3 },
    { id: 'BE002', name: 'Mondial Relay Anvers Centre', address: 'Meir 50', postalCode: '2000', city: 'Anvers', country: 'BE', distance: 2.1 },
    { id: 'BE003', name: 'Mondial Relay Liège', address: 'Rue Léopold 25', postalCode: '4000', city: 'Liège', country: 'BE', distance: 4.5 },
    { id: 'BE004', name: 'Mondial Relay Gand', address: 'Sint-Veerleplein 5', postalCode: '9000', city: 'Gand', country: 'BE', distance: 3.2 },
  ],
  'NL': [ // Netherlands
    { id: 'NL001', name: 'Mondial Relay Amsterdam Centrum', address: 'Damrak 50', postalCode: '1012', city: 'Amsterdam', country: 'NL', distance: 0.7 },
    { id: 'NL002', name: 'Mondial Relay Rotterdam', address: 'Coolsingel 190', postalCode: '3011', city: 'Rotterdam', country: 'NL', distance: 2.3 },
    { id: 'NL003', name: 'Mondial Relay Utrecht', address: 'Vredenburg 50', postalCode: '3511', city: 'Utrecht', country: 'NL', distance: 1.9 },
    { id: 'NL004', name: 'Mondial Relay La Haye', address: 'Buitenhof 30', postalCode: '2513', city: 'La Haye', country: 'NL', distance: 3.5 },
  ],
  'DE': [ // Germany
    { id: 'DE001', name: 'Mondial Relay Berlin Hauptbahnhof', address: 'Europaplatz 1', postalCode: '10557', city: 'Berlin', country: 'DE', distance: 0.6 },
    { id: 'DE002', name: 'Mondial Relay Munich', address: 'Bahnhofstr. 1', postalCode: '80335', city: 'Munich', country: 'DE', distance: 1.8 },
    { id: 'DE003', name: 'Mondial Relay Cologne', address: 'Domstr. 2', postalCode: '50667', city: 'Cologne', country: 'DE', distance: 2.4 },
    { id: 'DE004', name: 'Mondial Relay Frankfurt', address: 'Mainzer Str. 1', postalCode: '60311', city: 'Francfort', country: 'DE', distance: 3.1 },
  ],
  'LU': [ // Luxembourg
    { id: 'LU001', name: 'Mondial Relay Luxembourg Ville', address: 'Place Guillaume II', postalCode: '1648', city: 'Luxembourg', country: 'LU', distance: 0.4 },
    { id: 'LU002', name: 'Mondial Relay Esch-sur-Alzette', address: 'Rue de la Gare 50', postalCode: '4018', city: 'Esch-sur-Alzette', country: 'LU', distance: 2.7 },
  ],
  'CH': [ // Switzerland
    { id: 'CH001', name: 'Mondial Relay Zurich Centre', address: 'Bahnhofstrasse 100', postalCode: '8001', city: 'Zurich', country: 'CH', distance: 0.5 },
    { id: 'CH002', name: 'Mondial Relay Bâle', address: 'Centralbahnplatz 14', postalCode: '4002', city: 'Bâle', country: 'CH', distance: 2.0 },
    { id: 'CH003', name: 'Mondial Relay Berne', address: 'Bahnhofplatz 10', postalCode: '3011', city: 'Berne', country: 'CH', distance: 1.3 },
    { id: 'CH004', name: 'Mondial Relay Genève', address: 'Rue du Mont-Blanc 10', postalCode: '1201', city: 'Genève', country: 'CH', distance: 3.2 },
    { id: 'CH005', name: 'Mondial Relay Lausanne', address: 'Place de la Gare 15', postalCode: '1001', city: 'Lausanne', country: 'CH', distance: 2.6 },
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
