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
 * ENHANCED with comprehensive coverage: 60+ cities across 6 countries
 * In production, this would call the actual Mondial Relay API
 */
const MOCK_PICKUP_POINTS: Record<string, MondialRelayPickupPoint[]> = {
  'FR': [ // France - 20 major cities
    // Île-de-France
    { id: 'FR001', name: 'Mondial Relay Paris Gare de Lyon', address: '20 Boulevard Diderot', postalCode: '75012', city: 'Paris', country: 'FR', distance: 0.5 },
    { id: 'FR002', name: 'Mondial Relay Paris Marais', address: '15 Rue de Turenne', postalCode: '75003', city: 'Paris', country: 'FR', distance: 1.2 },
    { id: 'FR003', name: 'Mondial Relay Paris La Défense', address: '1 Esplanade du Général de Gaulle', postalCode: '92400', city: 'Courbevoie', country: 'FR', distance: 3.8 },
    { id: 'FR010', name: 'Mondial Relay Versailles', address: '4 Rue Duplessis', postalCode: '78000', city: 'Versailles', country: 'FR', distance: 2.5 },
    // Rhône-Alpes
    { id: 'FR004', name: 'Mondial Relay Lyon Presqu\'île', address: '35 Rue de la République', postalCode: '69002', city: 'Lyon', country: 'FR', distance: 2.1 },
    { id: 'FR011', name: 'Mondial Relay Grenoble', address: '20 Rue Félix Poulat', postalCode: '38000', city: 'Grenoble', country: 'FR', distance: 1.8 },
    { id: 'FR012', name: 'Mondial Relay Saint-Étienne', address: '5 Place Jean Jaurès', postalCode: '42000', city: 'Saint-Étienne', country: 'FR', distance: 1.5 },
    // Provence-Alpes-Côte d'Azur
    { id: 'FR005', name: 'Mondial Relay Marseille Vieux Port', address: '3 Quai du Port', postalCode: '13002', city: 'Marseille', country: 'FR', distance: 1.5 },
    { id: 'FR013', name: 'Mondial Relay Nice', address: '7 Promenade des Anglais', postalCode: '06000', city: 'Nice', country: 'FR', distance: 2.2 },
    { id: 'FR014', name: 'Mondial Relay Cannes', address: '22 Boulevard de la Croisette', postalCode: '06400', city: 'Cannes', country: 'FR', distance: 3.1 },
    // Occitanie
    { id: 'FR006', name: 'Mondial Relay Toulouse Centre', address: '42 Rue du Taur', postalCode: '31000', city: 'Toulouse', country: 'FR', distance: 0.8 },
    { id: 'FR015', name: 'Mondial Relay Montpellier', address: '85 Rue Foch', postalCode: '34000', city: 'Montpellier', country: 'FR', distance: 1.9 },
    { id: 'FR016', name: 'Mondial Relay Bordeaux', address: '13 Rue Bouffard', postalCode: '33000', city: 'Bordeaux', country: 'FR', distance: 2.3 },
    // Grand Est
    { id: 'FR007', name: 'Mondial Relay Strasbourg Centre', address: '10 Place Kléber', postalCode: '67000', city: 'Strasbourg', country: 'FR', distance: 1.0 },
    { id: 'FR008', name: 'Mondial Relay Épinal', address: '28 Rue Saint-Christophe', postalCode: '88000', city: 'Épinal', country: 'FR', distance: 0.3 },
    { id: 'FR017', name: 'Mondial Relay Metz', address: '1 Rue Gambetta', postalCode: '57000', city: 'Metz', country: 'FR', distance: 1.3 },
    { id: 'FR018', name: 'Mondial Relay Reims', address: '8 Rue de Talleyrand', postalCode: '51100', city: 'Reims', country: 'FR', distance: 0.9 },
    // Bretagne
    { id: 'FR019', name: 'Mondial Relay Nantes', address: '6 Rue Léon Blum', postalCode: '44000', city: 'Nantes', country: 'FR', distance: 1.4 },
    { id: 'FR020', name: 'Mondial Relay Rennes', address: '12 Rue d\'Antrain', postalCode: '35000', city: 'Rennes', country: 'FR', distance: 2.0 },
  ],
  'BE': [ // Belgium - 8 cities
    { id: 'BE001', name: 'Mondial Relay Bruxelles Gare Centrale', address: 'Rue de France 3', postalCode: '1000', city: 'Bruxelles', country: 'BE', distance: 0.3 },
    { id: 'BE002', name: 'Mondial Relay Bruxelles Nord', address: 'Boulevard de Berlaimont 5', postalCode: '1030', city: 'Bruxelles', country: 'BE', distance: 1.5 },
    { id: 'BE003', name: 'Mondial Relay Anvers Centre', address: 'Meir 50', postalCode: '2000', city: 'Anvers', country: 'BE', distance: 2.1 },
    { id: 'BE004', name: 'Mondial Relay Gand', address: 'Sint-Veerleplein 5', postalCode: '9000', city: 'Gand', country: 'BE', distance: 3.2 },
    { id: 'BE005', name: 'Mondial Relay Liège', address: 'Rue Léopold 25', postalCode: '4000', city: 'Liège', country: 'BE', distance: 4.5 },
    { id: 'BE006', name: 'Mondial Relay Charleroi', address: 'Place Albert 1er', postalCode: '6000', city: 'Charleroi', country: 'BE', distance: 3.8 },
    { id: 'BE007', name: 'Mondial Relay Louvain', address: 'Naamsestraat 42', postalCode: '3000', city: 'Louvain', country: 'BE', distance: 2.3 },
    { id: 'BE008', name: 'Mondial Relay Mons', address: 'Grande Rue 12', postalCode: '7000', city: 'Mons', country: 'BE', distance: 4.2 },
  ],
  'NL': [ // Netherlands - 10 cities
    { id: 'NL001', name: 'Mondial Relay Amsterdam Centrum', address: 'Damrak 50', postalCode: '1012', city: 'Amsterdam', country: 'NL', distance: 0.7 },
    { id: 'NL002', name: 'Mondial Relay Amsterdam Zuid', address: 'Beethovenplein 10', postalCode: '1077', city: 'Amsterdam', country: 'NL', distance: 2.1 },
    { id: 'NL003', name: 'Mondial Relay Rotterdam', address: 'Coolsingel 190', postalCode: '3011', city: 'Rotterdam', country: 'NL', distance: 2.3 },
    { id: 'NL004', name: 'Mondial Relay Utrecht', address: 'Vredenburg 50', postalCode: '3511', city: 'Utrecht', country: 'NL', distance: 1.9 },
    { id: 'NL005', name: 'Mondial Relay La Haye', address: 'Buitenhof 30', postalCode: '2513', city: 'La Haye', country: 'NL', distance: 3.5 },
    { id: 'NL006', name: 'Mondial Relay Groningen', address: 'Gedempte Zuiderdiep 50', postalCode: '9711', city: 'Groningen', country: 'NL', distance: 2.8 },
    { id: 'NL007', name: 'Mondial Relay Eindhoven', address: 'Dommelstraat 15', postalCode: '5611', city: 'Eindhoven', country: 'NL', distance: 1.6 },
    { id: 'NL008', name: 'Mondial Relay Maastricht', address: 'Markt 60', postalCode: '6211', city: 'Maastricht', country: 'NL', distance: 2.4 },
    { id: 'NL009', name: 'Mondial Relay Arnhem', address: 'Rijnstraat 10', postalCode: '6811', city: 'Arnhem', country: 'NL', distance: 1.8 },
    { id: 'NL010', name: 'Mondial Relay Haarlem', address: 'Zijlsingel 55', postalCode: '2013', city: 'Haarlem', country: 'NL', distance: 1.3 },
  ],
  'DE': [ // Germany - 12 cities
    { id: 'DE001', name: 'Mondial Relay Berlin Hauptbahnhof', address: 'Europaplatz 1', postalCode: '10557', city: 'Berlin', country: 'DE', distance: 0.6 },
    { id: 'DE002', name: 'Mondial Relay Berlin Mitte', address: 'Friedrichstrasse 165', postalCode: '10117', city: 'Berlin', country: 'DE', distance: 1.2 },
    { id: 'DE003', name: 'Mondial Relay Munich', address: 'Bahnhofstr. 1', postalCode: '80335', city: 'Munich', country: 'DE', distance: 1.8 },
    { id: 'DE004', name: 'Mondial Relay Cologne', address: 'Domstr. 2', postalCode: '50667', city: 'Cologne', country: 'DE', distance: 2.4 },
    { id: 'DE005', name: 'Mondial Relay Frankfurt', address: 'Mainzer Str. 1', postalCode: '60311', city: 'Francfort', country: 'DE', distance: 3.1 },
    { id: 'DE006', name: 'Mondial Relay Hamburg', address: 'Möhlendamm 25', postalCode: '20457', city: 'Hambourg', country: 'DE', distance: 2.7 },
    { id: 'DE007', name: 'Mondial Relay Düsseldorf', address: 'Königstrasse 14', postalCode: '40212', city: 'Düsseldorf', country: 'DE', distance: 1.9 },
    { id: 'DE008', name: 'Mondial Relay Stuttgart', address: 'Markstrasse 1', postalCode: '70180', city: 'Stuttgart', country: 'DE', distance: 2.5 },
    { id: 'DE009', name: 'Mondial Relay Dortmund', address: 'Immermannstr. 1', postalCode: '44135', city: 'Dortmund', country: 'DE', distance: 1.4 },
    { id: 'DE010', name: 'Mondial Relay Essen', address: 'Huyssenallee 1', postalCode: '45128', city: 'Essen', country: 'DE', distance: 1.7 },
    { id: 'DE011', name: 'Mondial Relay Leipzig', address: 'Brandenburger Str. 1', postalCode: '04103', city: 'Leipzig', country: 'DE', distance: 2.2 },
    { id: 'DE012', name: 'Mondial Relay Dresden', address: 'Postplatz 1', postalCode: '01069', city: 'Dresde', country: 'DE', distance: 3.0 },
  ],
  'LU': [ // Luxembourg - 3 cities
    { id: 'LU001', name: 'Mondial Relay Luxembourg Ville Centre', address: 'Place Guillaume II', postalCode: '1648', city: 'Luxembourg', country: 'LU', distance: 0.4 },
    { id: 'LU002', name: 'Mondial Relay Esch-sur-Alzette', address: 'Rue de la Gare 50', postalCode: '4018', city: 'Esch-sur-Alzette', country: 'LU', distance: 2.7 },
    { id: 'LU003', name: 'Mondial Relay Differdange', address: 'Avenue de la Gare 12', postalCode: '4537', city: 'Differdange', country: 'LU', distance: 3.2 },
  ],
  'CH': [ // Switzerland - 10 cities
    // German-speaking Switzerland
    { id: 'CH001', name: 'Mondial Relay Zurich Centre', address: 'Bahnhofstrasse 100', postalCode: '8001', city: 'Zurich', country: 'CH', distance: 0.5 },
    { id: 'CH002', name: 'Mondial Relay Bâle', address: 'Centralbahnplatz 14', postalCode: '4002', city: 'Bâle', country: 'CH', distance: 2.0 },
    { id: 'CH003', name: 'Mondial Relay Berne', address: 'Bahnhofplatz 10', postalCode: '3011', city: 'Berne', country: 'CH', distance: 1.3 },
    { id: 'CH006', name: 'Mondial Relay Lucerne', address: 'Bahnhofstrasse 45', postalCode: '6002', city: 'Lucerne', country: 'CH', distance: 1.8 },
    { id: 'CH007', name: 'Mondial Relay Saint-Gall', address: 'Marktgasse 20', postalCode: '9001', city: 'Saint-Gall', country: 'CH', distance: 2.4 },
    // French-speaking Switzerland
    { id: 'CH004', name: 'Mondial Relay Genève', address: 'Rue du Mont-Blanc 10', postalCode: '1201', city: 'Genève', country: 'CH', distance: 3.2 },
    { id: 'CH005', name: 'Mondial Relay Lausanne', address: 'Place de la Gare 15', postalCode: '1001', city: 'Lausanne', country: 'CH', distance: 2.6 },
    { id: 'CH008', name: 'Mondial Relay Neuchâtel', address: 'Rue de la Gare 15', postalCode: '2000', city: 'Neuchâtel', country: 'CH', distance: 2.1 },
    // Italian-speaking Switzerland
    { id: 'CH009', name: 'Mondial Relay Lugano', address: 'Via Nassa 25', postalCode: '6900', city: 'Lugano', country: 'CH', distance: 3.5 },
    { id: 'CH010', name: 'Mondial Relay Bellinzona', address: 'Piazza Nosetto 2', postalCode: '6500', city: 'Bellinzona', country: 'CH', distance: 2.9 },
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

    // Filter by postal code if provided (mock filter based on postal code prefixes)
    if (postalCode) {
      const firstTwoDigits = postalCode.substring(0, 2);

      if (countryCode === 'FR') {
        // Map French postal code prefixes to regions (comprehensive coverage)
        const frenchMapping: Record<string, string[]> = {
          // Île-de-France
          '75': ['FR001', 'FR002', 'FR003'], // Paris
          '77': ['FR003', 'FR001'],          // Seine-et-Marne
          '78': ['FR010', 'FR003'],          // Yvelines (Versailles area)
          '91': ['FR003', 'FR010'],          // Essonne
          '92': ['FR003'],                   // Hauts-de-Seine
          '93': ['FR003'],                   // Seine-Saint-Denis
          '94': ['FR003'],                   // Val-de-Marne
          '95': ['FR003'],                   // Val-d'Oise
          // Rhône-Alpes & Auvergne
          '69': ['FR004', 'FR011', 'FR012'], // Lyon + surrounding
          '38': ['FR011', 'FR004'],          // Grenoble
          '42': ['FR012', 'FR004'],          // Saint-Étienne
          '73': ['FR011'],                   // Savoie
          '74': ['FR011'],                   // Haute-Savoie
          '01': ['FR004'],                   // Ain
          '03': ['FR012'],                   // Allier
          '07': ['FR011'],                   // Ardèche
          '26': ['FR011'],                   // Drôme
          '39': ['FR004'],                   // Jura
          '63': ['FR012'],                   // Puy-de-Dôme
          // Provence-Alpes-Côte d'Azur
          '13': ['FR005', 'FR014'],          // Marseille + Bouches-du-Rhône
          '06': ['FR013'],                   // Nice + Alpes-Maritimes
          '83': ['FR013', 'FR014'],          // Var
          '84': ['FR005'],                   // Vaucluse
          '04': ['FR013'],                   // Alpes-de-Haute-Provence
          '05': ['FR013'],                   // Hautes-Alpes
          // Occitanie
          '31': ['FR006', 'FR015'],          // Toulouse
          '34': ['FR015', 'FR005'],          // Montpellier
          '30': ['FR015'],                   // Gard
          '12': ['FR006'],                   // Aveyron
          '48': ['FR006'],                   // Lozère
          '81': ['FR006'],                   // Tarn
          '82': ['FR006'],                   // Tarn-et-Garonne
          '09': ['FR006'],                   // Ariège
          '66': ['FR015'],                   // Pyrénées-Orientales
          '11': ['FR015'],                   // Aude
          // Nouvelle-Aquitaine
          '33': ['FR016'],                   // Bordeaux
          '24': ['FR016'],                   // Dordogne
          '40': ['FR016'],                   // Landes
          '47': ['FR016'],                   // Lot-et-Garonne
          '64': ['FR016'],                   // Pyrénées-Atlantiques
          '17': ['FR016'],                   // Charente-Maritime
          '16': ['FR016'],                   // Charente
          '19': ['FR016'],                   // Corrèze
          '23': ['FR016'],                   // Creuse
          '79': ['FR016'],                   // Deux-Sèvres
          '86': ['FR016'],                   // Vienne
          '87': ['FR016'],                   // Haute-Vienne
          // Grand Est
          '67': ['FR007', 'FR008', 'FR017'],  // Strasbourg + Alsace
          '68': ['FR007'],                   // Haut-Rhin
          '88': ['FR008', 'FR007', 'FR017'], // Épinal + Vosges
          '54': ['FR017', 'FR007', 'FR008'], // Lorraine (Metz area)
          '55': ['FR017'],                   // Meuse
          '51': ['FR018'],                   // Marne (Reims)
          '08': ['FR018'],                   // Ardennes
          '10': ['FR018'],                   // Aube
          '52': ['FR018'],                   // Haute-Marne
          // Bourgogne-Franche-Comté
          '21': ['FR004'],                   // Côte-d'Or
          '25': ['FR004'],                   // Doubs
          '39': ['FR004'],                   // Jura
          '71': ['FR004'],                   // Saône-et-Loire
          '89': ['FR004'],                   // Yonne
          '90': ['FR004'],                   // Territoire de Belfort
          // Pays de la Loire & Bretagne
          '44': ['FR019', 'FR020'],          // Nantes
          '49': ['FR019'],                   // Maine-et-Loire
          '53': ['FR020'],                   // Mayenne
          '72': ['FR019'],                   // Sarthe
          '85': ['FR019'],                   // Vendée
          '35': ['FR020'],                   // Rennes
          '22': ['FR020'],                   // Côtes-d'Armor
          '29': ['FR020'],                   // Finistère
          '56': ['FR020'],                   // Morbihan
        };

        const mappedIds = frenchMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        }
      } else if (countryCode === 'BE') {
        // Map Belgian postal code prefixes to regions
        const belgianMapping: Record<string, string[]> = {
          '10': ['BE001', 'BE002'],   // Brussels
          '20': ['BE003'],             // Antwerp
          '30': ['BE007'],             // Louvain
          '40': ['BE005'],             // Liège
          '50': ['BE004'],             // Gand
          '60': ['BE006'],             // Charleroi
          '70': ['BE008'],             // Mons
          '90': ['BE002'],             // Waremme area
        };

        const mappedIds = belgianMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        } else {
          points = points.slice(0, 3); // Return top 3 if no mapping
        }
      } else if (countryCode === 'NL') {
        // Map Dutch postal code prefixes to regions
        const dutchMapping: Record<string, string[]> = {
          '10': ['NL001', 'NL002'],   // Amsterdam
          '20': ['NL010'],             // Haarlem area
          '30': ['NL005'],             // The Hague
          '31': ['NL003'],             // Rotterdam
          '35': ['NL004'],             // Utrecht
          '36': ['NL009'],             // Arnhem
          '37': ['NL004'],             // Utrecht area
          '38': ['NL007'],             // Eindhoven
          '67': ['NL003'],             // South Holland
          '97': ['NL006'],             // Groningen
          '99': ['NL008'],             // Maastricht
        };

        const mappedIds = dutchMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        } else {
          points = points.slice(0, 3);
        }
      } else if (countryCode === 'DE') {
        // Map German postal code prefixes to regions
        const germanMapping: Record<string, string[]> = {
          '10': ['DE001', 'DE002'],   // Berlin
          '20': ['DE006'],             // Hamburg
          '30': ['DE006'],             // North Germany
          '40': ['DE007'],             // Düsseldorf
          '50': ['DE004'],             // Cologne
          '60': ['DE005'],             // Frankfurt
          '70': ['DE008'],             // Stuttgart
          '80': ['DE003'],             // Munich
          '90': ['DE011'],             // Leipzig
          '01': ['DE012'],             // Dresden
          '44': ['DE009'],             // Dortmund
          '45': ['DE010'],             // Essen
        };

        const mappedIds = germanMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        } else {
          points = points.slice(0, 3);
        }
      } else if (countryCode === 'LU') {
        // Map Luxembourg postal code prefixes to regions
        const luxembourgMapping: Record<string, string[]> = {
          '16': ['LU001'],   // Luxembourg City
          '40': ['LU002'],   // Esch-sur-Alzette
          '45': ['LU003'],   // Differdange
          '97': ['LU001'],   // South Luxembourg
        };

        const mappedIds = luxembourgMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        } else {
          points = points.slice(0, 2);
        }
      } else if (countryCode === 'CH') {
        // Map Swiss postal code prefixes to regions
        const swissMapping: Record<string, string[]> = {
          '80': ['CH001', 'CH006'],   // Zurich + Lucerne
          '40': ['CH002'],             // Basel
          '30': ['CH003'],             // Bern
          '20': ['CH008'],             // Neuchâtel
          '12': ['CH004'],             // Geneva
          '10': ['CH005'],             // Lausanne
          '90': ['CH007'],             // St. Gallen
          '69': ['CH001'],             // Zurich area
          '65': ['CH009', 'CH010'],   // Ticino
        };

        const mappedIds = swissMapping[firstTwoDigits];
        if (mappedIds) {
          points = points.filter(p => mappedIds.includes(p.id));
        } else {
          points = points.slice(0, 3);
        }
      }
    }

    // If no postal code provided, return all points for the country
    return points.length > 0 ? points : MOCK_PICKUP_POINTS[countryCode] || [];

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
