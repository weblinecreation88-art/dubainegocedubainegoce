import { NextRequest, NextResponse } from 'next/server';

// Points relais statiques pour demonstration
// En production, tu peux utiliser l'API Mondial Relay avec tes identifiants
const MOCK_RELAY_POINTS: Record<string, Array<{
  Num: string;
  LgAdr1: string;
  LgAdr3: string;
  CP: string;
  Ville: string;
  Pays: string;
}>> = {
  // Paris et region parisienne
  '75': [
    { Num: 'FR-75001', LgAdr1: 'TABAC LE MARAIS', LgAdr3: '45 Rue de Rivoli', CP: '75001', Ville: 'PARIS', Pays: 'FR' },
    { Num: 'FR-75002', LgAdr1: 'RELAY SENTIER', LgAdr3: '12 Rue du Sentier', CP: '75002', Ville: 'PARIS', Pays: 'FR' },
    { Num: 'FR-75003', LgAdr1: 'PRESSING TEMPLE', LgAdr3: '78 Rue du Temple', CP: '75003', Ville: 'PARIS', Pays: 'FR' },
    { Num: 'FR-75004', LgAdr1: 'PHARMACIE BASTILLE', LgAdr3: '23 Rue Saint-Antoine', CP: '75004', Ville: 'PARIS', Pays: 'FR' },
    { Num: 'FR-75005', LgAdr1: 'TABAC LATIN', LgAdr3: '56 Boulevard Saint-Michel', CP: '75005', Ville: 'PARIS', Pays: 'FR' },
  ],
  '92': [
    { Num: 'FR-92100', LgAdr1: 'RELAY BOULOGNE', LgAdr3: '15 Avenue Jean-Baptiste Clement', CP: '92100', Ville: 'BOULOGNE-BILLANCOURT', Pays: 'FR' },
    { Num: 'FR-92200', LgAdr1: 'TABAC NEUILLY', LgAdr3: '34 Avenue Charles de Gaulle', CP: '92200', Ville: 'NEUILLY-SUR-SEINE', Pays: 'FR' },
    { Num: 'FR-92300', LgAdr1: 'PRESSING LEVALLOIS', LgAdr3: '89 Rue Aristide Briand', CP: '92300', Ville: 'LEVALLOIS-PERRET', Pays: 'FR' },
  ],
  '93': [
    { Num: 'FR-93100', LgAdr1: 'RELAY MONTREUIL', LgAdr3: '67 Rue de Paris', CP: '93100', Ville: 'MONTREUIL', Pays: 'FR' },
    { Num: 'FR-93200', LgAdr1: 'TABAC SAINT-DENIS', LgAdr3: '23 Avenue du President Wilson', CP: '93200', Ville: 'SAINT-DENIS', Pays: 'FR' },
  ],
  '94': [
    { Num: 'FR-94100', LgAdr1: 'RELAY SAINT-MAUR', LgAdr3: '12 Avenue de la Republique', CP: '94100', Ville: 'SAINT-MAUR-DES-FOSSES', Pays: 'FR' },
    { Num: 'FR-94200', LgAdr1: 'PRESSING IVRY', LgAdr3: '45 Avenue Georges Gosnat', CP: '94200', Ville: 'IVRY-SUR-SEINE', Pays: 'FR' },
  ],
  // Lyon
  '69': [
    { Num: 'FR-69001', LgAdr1: 'TABAC BELLECOUR', LgAdr3: '15 Place Bellecour', CP: '69002', Ville: 'LYON', Pays: 'FR' },
    { Num: 'FR-69002', LgAdr1: 'RELAY PART-DIEU', LgAdr3: '34 Rue de la Part-Dieu', CP: '69003', Ville: 'LYON', Pays: 'FR' },
    { Num: 'FR-69003', LgAdr1: 'PRESSING CROIX-ROUSSE', LgAdr3: '78 Grande Rue de la Croix-Rousse', CP: '69004', Ville: 'LYON', Pays: 'FR' },
  ],
  // Marseille
  '13': [
    { Num: 'FR-13001', LgAdr1: 'RELAY VIEUX-PORT', LgAdr3: '45 Quai du Port', CP: '13001', Ville: 'MARSEILLE', Pays: 'FR' },
    { Num: 'FR-13002', LgAdr1: 'TABAC CANEBIERE', LgAdr3: '23 La Canebiere', CP: '13001', Ville: 'MARSEILLE', Pays: 'FR' },
    { Num: 'FR-13003', LgAdr1: 'PRESSING CASTELLANE', LgAdr3: '12 Place Castellane', CP: '13006', Ville: 'MARSEILLE', Pays: 'FR' },
  ],
  // Bordeaux
  '33': [
    { Num: 'FR-33001', LgAdr1: 'RELAY GRANDS HOMMES', LgAdr3: '18 Place des Grands Hommes', CP: '33000', Ville: 'BORDEAUX', Pays: 'FR' },
    { Num: 'FR-33002', LgAdr1: 'TABAC VICTOIRE', LgAdr3: '45 Place de la Victoire', CP: '33000', Ville: 'BORDEAUX', Pays: 'FR' },
  ],
  // Toulouse
  '31': [
    { Num: 'FR-31001', LgAdr1: 'RELAY CAPITOLE', LgAdr3: '12 Place du Capitole', CP: '31000', Ville: 'TOULOUSE', Pays: 'FR' },
    { Num: 'FR-31002', LgAdr1: 'TABAC JEAN JAURES', LgAdr3: '67 Allee Jean Jaures', CP: '31000', Ville: 'TOULOUSE', Pays: 'FR' },
  ],
  // Nantes
  '44': [
    { Num: 'FR-44001', LgAdr1: 'RELAY COMMERCE', LgAdr3: '23 Place du Commerce', CP: '44000', Ville: 'NANTES', Pays: 'FR' },
    { Num: 'FR-44002', LgAdr1: 'TABAC GRASLIN', LgAdr3: '45 Place Graslin', CP: '44000', Ville: 'NANTES', Pays: 'FR' },
  ],
  // Lille
  '59': [
    { Num: 'FR-59001', LgAdr1: 'RELAY GRAND PLACE', LgAdr3: '15 Place du General de Gaulle', CP: '59000', Ville: 'LILLE', Pays: 'FR' },
    { Num: 'FR-59002', LgAdr1: 'TABAC REPUBLIQUE', LgAdr3: '34 Place de la Republique', CP: '59000', Ville: 'LILLE', Pays: 'FR' },
  ],
  // Strasbourg
  '67': [
    { Num: 'FR-67001', LgAdr1: 'RELAY KLEBER', LgAdr3: '12 Place Kleber', CP: '67000', Ville: 'STRASBOURG', Pays: 'FR' },
    { Num: 'FR-67002', LgAdr1: 'TABAC CATHEDRALE', LgAdr3: '45 Place de la Cathedrale', CP: '67000', Ville: 'STRASBOURG', Pays: 'FR' },
  ],
  // Nice
  '06': [
    { Num: 'FR-06001', LgAdr1: 'RELAY MASSENA', LgAdr3: '23 Place Massena', CP: '06000', Ville: 'NICE', Pays: 'FR' },
    { Num: 'FR-06002', LgAdr1: 'TABAC PROMENADE', LgAdr3: '67 Promenade des Anglais', CP: '06000', Ville: 'NICE', Pays: 'FR' },
  ],
  // Montpellier
  '34': [
    { Num: 'FR-34001', LgAdr1: 'RELAY COMEDIE', LgAdr3: '15 Place de la Comedie', CP: '34000', Ville: 'MONTPELLIER', Pays: 'FR' },
    { Num: 'FR-34002', LgAdr1: 'TABAC POLYGONE', LgAdr3: '34 Centre Commercial Le Polygone', CP: '34000', Ville: 'MONTPELLIER', Pays: 'FR' },
  ],
};

// Fonction pour generer des points relais basés sur le code postal
function generateRelayPoints(postalCode: string) {
  const departement = postalCode.substring(0, 2);

  // Si on a des points pour ce departement, les retourner
  if (MOCK_RELAY_POINTS[departement]) {
    return MOCK_RELAY_POINTS[departement];
  }

  // Sinon, generer des points generiques
  const city = getCityFromPostalCode(postalCode);
  return [
    { Num: `FR-${postalCode}-1`, LgAdr1: `RELAY ${city.toUpperCase()}`, LgAdr3: '12 Rue du Commerce', CP: postalCode, Ville: city, Pays: 'FR' },
    { Num: `FR-${postalCode}-2`, LgAdr1: `TABAC ${city.toUpperCase()}`, LgAdr3: '45 Avenue de la Gare', CP: postalCode, Ville: city, Pays: 'FR' },
    { Num: `FR-${postalCode}-3`, LgAdr1: `PRESSING ${city.toUpperCase()}`, LgAdr3: '78 Boulevard Principal', CP: postalCode, Ville: city, Pays: 'FR' },
  ];
}

function getCityFromPostalCode(postalCode: string): string {
  // Mapping simple des codes postaux vers les villes
  const cityMap: Record<string, string> = {
    '75': 'Paris',
    '13': 'Marseille',
    '69': 'Lyon',
    '31': 'Toulouse',
    '33': 'Bordeaux',
    '44': 'Nantes',
    '59': 'Lille',
    '67': 'Strasbourg',
    '06': 'Nice',
    '34': 'Montpellier',
    '35': 'Rennes',
    '76': 'Rouen',
    '51': 'Reims',
    '21': 'Dijon',
    '37': 'Tours',
    '42': 'Saint-Etienne',
    '63': 'Clermont-Ferrand',
    '29': 'Brest',
    '87': 'Limoges',
    '45': 'Orleans',
  };

  const dept = postalCode.substring(0, 2);
  return cityMap[dept] || 'Votre Ville';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cp = searchParams.get('cp');

  if (!cp || cp.length < 5) {
    return NextResponse.json({ error: 'Code postal invalide' }, { status: 400 });
  }

  try {
    const points = generateRelayPoints(cp);

    return NextResponse.json({
      success: true,
      points: points,
      count: points.length
    });
  } catch (error) {
    console.error('Erreur recherche points relais:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
