/**
 * Script de génération automatique des fiches produits SEO
 *
 * Ce script génère des descriptions optimisées SEO pour tous les parfums
 * et sauvegarde les données dans Firestore.
 *
 * Usage: npx tsx src/scripts/generate-seo-descriptions.ts
 */

const admin = require('firebase-admin');
const { initializeApp, cert, getApps, getApp } = admin;
const { getFirestore } = require('firebase-admin/firestore');
type Firestore = ReturnType<typeof getFirestore>;

// ============================================================
// CONFIGURATION ET TYPES
// ============================================================

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: { name: string };
  gender: 'homme' | 'femme' | 'mixte';
  family: string;
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  price: number;
  volumeMl: number;
  tags: string[];
  images: string[];
}

interface SEOData {
  focusKeyword: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  imageAlts: string[];
  category: string;
  pyramidOlfactive: {
    tete: string[];
    coeur: string[];
    fond: string[];
  };
  occasions: string[];
  conseils: string;
  caracteristiques: {
    intensite: string;
    tenue: string;
    sillage: string;
    saison: string[];
  };
}

// ============================================================
// DONNÉES DE RÉFÉRENCE POUR LA GÉNÉRATION
// ============================================================

const POWER_WORDS = [
  'Incroyable', 'Ultime', 'Exclusif', 'Essentiel', 'Nouveau',
  'Garanti', 'Éprouvé', 'Révolutionnaire', 'Secret', 'Magique',
  'Envoûtant', 'Captivant', 'Inoubliable', 'Somptueux', 'Exquis'
];

const NOTES_PAR_FAMILLE: Record<string, { tete: string[]; coeur: string[]; fond: string[] }> = {
  'Boisé': {
    tete: ['bergamote', 'citron', 'poivre noir', 'gingembre', 'cardamome', 'lavande'],
    coeur: ['cèdre', 'vétiver', 'iris', 'géranium', 'cuir', 'encens'],
    fond: ['bois de santal', 'patchouli', 'mousse de chêne', 'ambre', 'musc', 'vanille']
  },
  'Oriental': {
    tete: ['safran', 'cardamome', 'bergamote', 'poivre rose', 'cannelle', 'gingembre'],
    coeur: ['rose', 'jasmin', 'oud', 'encens', 'ambre', 'cuir'],
    fond: ['vanille', 'musc', 'bois de santal', 'benjoin', 'labdanum', 'ambre gris']
  },
  'Fruité': {
    tete: ['pomme', 'poire', 'cassis', 'framboise', 'ananas', 'bergamote', 'citron'],
    coeur: ['rose', 'pivoine', 'jasmin', 'muguet', 'freesia', 'magnolia'],
    fond: ['musc blanc', 'cèdre', 'patchouli', 'vanille', 'ambre', 'bois de cashmeran']
  },
  'Floral': {
    tete: ['bergamote', 'poire', 'cassis', 'litchi', 'mandarine', 'feuille de violette'],
    coeur: ['rose', 'jasmin', 'pivoine', 'tubéreuse', 'ylang-ylang', 'iris', 'muguet'],
    fond: ['musc', 'patchouli', 'cèdre', 'ambre', 'vanille', 'bois de santal']
  },
  'Frais': {
    tete: ['citron', 'bergamote', 'pamplemousse', 'mandarine', 'menthe', 'romarin'],
    coeur: ['lavande', 'géranium', 'jasmin', 'notes marines', 'thé vert'],
    fond: ['cèdre', 'musc blanc', 'ambre gris', 'vétiver', 'mousse']
  },
  'Chypré': {
    tete: ['bergamote', 'citron', 'galbanum', 'cassis', 'aldéhydes'],
    coeur: ['rose', 'jasmin', 'ylang-ylang', 'clou de girofle', 'poivre'],
    fond: ['mousse de chêne', 'patchouli', 'labdanum', 'musc', 'ciste', 'vétiver']
  },
  'Gourmand': {
    tete: ['bergamote', 'orange', 'café', 'cardamome', 'noisette'],
    coeur: ['vanille', 'caramel', 'cacao', 'praline', 'tonka', 'amande'],
    fond: ['musc', 'bois de santal', 'benjoin', 'vanille', 'ambre']
  },
  'Cuir': {
    tete: ['safran', 'bergamote', 'poivre', 'cardamome', 'gingembre'],
    coeur: ['cuir', 'iris', 'violette', 'rose', 'oud'],
    fond: ['oud', 'musc', 'ambre', 'patchouli', 'vétiver', 'bois de santal']
  }
};

const OCCASIONS_PAR_GENRE: Record<string, string[]> = {
  'homme': [
    'réunions professionnelles', 'soirées élégantes', 'rendez-vous galants',
    'occasions spéciales', 'usage quotidien au bureau', 'événements formels'
  ],
  'femme': [
    'soirées glamour', 'rendez-vous romantiques', 'journées au bureau',
    'occasions festives', 'moments de détente', 'cérémonies importantes'
  ],
  'mixte': [
    'toutes les occasions', 'sorties en couple', 'événements mondains',
    'usage quotidien', 'moments spéciaux', 'voyages et escapades'
  ]
};

const CONSEILS_PAR_FAMILLE: Record<string, string[]> = {
  'Boisé': [
    'Appliquez sur les points de pulsation pour une diffusion optimale.',
    'Idéal pour les saisons fraîches, automne et hiver.',
    'Se marie parfaitement avec une tenue habillée ou décontractée chic.'
  ],
  'Oriental': [
    'Une à deux pulvérisations suffisent grâce à sa puissance olfactive.',
    'Parfait pour les soirées d\'automne et d\'hiver.',
    'Laissez le parfum se développer sur votre peau avant de juger.'
  ],
  'Fruité': [
    'Idéal pour le printemps et l\'été, apporte fraîcheur et légèreté.',
    'Peut être appliqué généreusement pour un effet pétillant.',
    'Parfait pour les journées ensoleillées et les brunchs.'
  ],
  'Floral': [
    'Se porte aussi bien de jour que de nuit.',
    'Appliquez sur les poignets et derrière les oreilles.',
    'Idéal du printemps à l\'été pour un effet romantique.'
  ],
  'Frais': [
    'Parfait pour les journées chaudes et l\'activité sportive.',
    'Peut être réappliqué dans la journée pour maintenir la fraîcheur.',
    'Idéal comme parfum de bureau ou de tous les jours.'
  ],
  'Chypré': [
    'Un parfum sophistiqué pour les connaisseurs.',
    'Convient particulièrement aux mi-saisons.',
    'Se bonifie avec le temps sur la peau.'
  ],
  'Gourmand': [
    'Parfait pour les saisons froides et les soirées.',
    'Une à deux pulvérisations suffisent, le sillage est puissant.',
    'Idéal pour créer une aura de mystère et de sensualité.'
  ],
  'Cuir': [
    'Réservé aux grandes occasions et aux soirées.',
    'Un parfum de caractère qui ne laisse pas indifférent.',
    'Se développe magnifiquement tout au long de la journée.'
  ]
};

const INTENSITE_PAR_FAMILLE: Record<string, string> = {
  'Boisé': 'Modérée à intense',
  'Oriental': 'Intense',
  'Fruité': 'Légère à modérée',
  'Floral': 'Modérée',
  'Frais': 'Légère',
  'Chypré': 'Modérée à intense',
  'Gourmand': 'Intense',
  'Cuir': 'Très intense'
};

const TENUE_PAR_FAMILLE: Record<string, string> = {
  'Boisé': '6 à 8 heures',
  'Oriental': '8 à 12 heures',
  'Fruité': '4 à 6 heures',
  'Floral': '5 à 7 heures',
  'Frais': '3 à 5 heures',
  'Chypré': '6 à 8 heures',
  'Gourmand': '8 à 10 heures',
  'Cuir': '10 à 12 heures'
};

const SILLAGE_PAR_FAMILLE: Record<string, string> = {
  'Boisé': 'Modéré, proche de la peau',
  'Oriental': 'Puissant, enveloppant',
  'Fruité': 'Léger, aérien',
  'Floral': 'Modéré, élégant',
  'Frais': 'Discret, rafraîchissant',
  'Chypré': 'Modéré à puissant',
  'Gourmand': 'Puissant, addictif',
  'Cuir': 'Très puissant, marquant'
};

const SAISONS_PAR_FAMILLE: Record<string, string[]> = {
  'Boisé': ['Automne', 'Hiver'],
  'Oriental': ['Automne', 'Hiver'],
  'Fruité': ['Printemps', 'Été'],
  'Floral': ['Printemps', 'Été'],
  'Frais': ['Printemps', 'Été'],
  'Chypré': ['Printemps', 'Automne'],
  'Gourmand': ['Automne', 'Hiver'],
  'Cuir': ['Automne', 'Hiver']
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getGenderLabel(gender: string): string {
  switch (gender) {
    case 'homme': return 'Homme';
    case 'femme': return 'Femme';
    case 'mixte': return 'Unisexe';
    default: return 'Unisexe';
  }
}

function getGenderPhrase(gender: string): string {
  switch (gender) {
    case 'homme': return 'les hommes modernes et audacieux';
    case 'femme': return 'les femmes élégantes et raffinées';
    case 'mixte': return 'tous ceux qui recherchent l\'excellence';
    default: return 'les amateurs de parfums d\'exception';
  }
}

function getFamilyNotes(family: string): { tete: string[]; coeur: string[]; fond: string[] } {
  return NOTES_PAR_FAMILLE[family] || NOTES_PAR_FAMILLE['Oriental'];
}

// ============================================================
// GÉNÉRATEUR SEO PRINCIPAL
// ============================================================

function generateSEOData(product: Product): SEOData {
  const { name, brand, gender, family } = product;
  const brandName = brand.name;
  const focusKeyword = `${name} ${brandName}`;

  // Power word aléatoire
  const powerWord = getRandomElement(POWER_WORDS);

  // Notes olfactives
  const familyNotes = getFamilyNotes(family);
  const notesTop = product.topNotes?.length ? product.topNotes : getRandomElements(familyNotes.tete, 3);
  const notesHeart = product.heartNotes?.length ? product.heartNotes : getRandomElements(familyNotes.coeur, 3);
  const notesBase = product.baseNotes?.length ? product.baseNotes : getRandomElements(familyNotes.fond, 3);

  // Occasions
  const occasions = getRandomElements(OCCASIONS_PAR_GENRE[gender] || OCCASIONS_PAR_GENRE['mixte'], 3);

  // Conseils
  const conseilsList = CONSEILS_PAR_FAMILLE[family] || CONSEILS_PAR_FAMILLE['Oriental'];
  const conseils = getRandomElement(conseilsList);

  // Caractéristiques
  const caracteristiques = {
    intensite: INTENSITE_PAR_FAMILLE[family] || 'Modérée',
    tenue: TENUE_PAR_FAMILLE[family] || '6 à 8 heures',
    sillage: SILLAGE_PAR_FAMILLE[family] || 'Modéré',
    saison: SAISONS_PAR_FAMILLE[family] || ['Toutes saisons']
  };

  // ---- TITLE (commence par focus keyword + power word) ----
  const title = `${focusKeyword} : Le Guide ${powerWord} du Parfum ${family}`;

  // ---- META TITLE (60 caractères max) ----
  const metaTitle = `${focusKeyword} | Parfum ${family} ${getGenderLabel(gender)}`.slice(0, 60);

  // ---- SHORT DESCRIPTION / META DESCRIPTION (155 caractères) ----
  const shortDescBase = `Découvrez ${focusKeyword}, une fragrance ${family.toLowerCase()} aux notes de ${notesTop[0]} et ${notesHeart[0]}. Laissez-vous séduire par ce parfum ${getRandomElement(['inoubliable', 'envoûtant', 'captivant'])}.`;
  const shortDescription = shortDescBase.slice(0, 155);

  // ---- LONG DESCRIPTION (250 mots, ~1% keyword density = 2-3 mentions) ----
  const longDescription = generateLongDescription(
    focusKeyword,
    name,
    brandName,
    gender,
    family,
    notesTop,
    notesHeart,
    notesBase,
    occasions,
    conseils,
    caracteristiques
  );

  // ---- TAGS SEO ----
  const tags = [
    name.toLowerCase(),
    brandName.toLowerCase(),
    `parfum ${family.toLowerCase()}`,
    `parfum ${gender}`,
    `eau de parfum ${brandName.toLowerCase()}`,
    ...notesTop.slice(0, 2),
    ...notesBase.slice(0, 2),
    'parfum oriental',
    'parfum dubai',
    'parfum pas cher'
  ];

  // ---- IMAGE ALTS ----
  const imageAlts = [
    `${name} ${brandName} - Parfum ${family} ${getGenderLabel(gender)}`,
    `Flacon ${name} de ${brandName}`,
    `${focusKeyword} - Eau de Parfum ${product.volumeMl}ml`
  ];

  return {
    focusKeyword,
    title,
    shortDescription,
    longDescription,
    metaTitle,
    metaDescription: shortDescription,
    tags: [...new Set(tags)], // Remove duplicates
    imageAlts,
    category: getGenderLabel(gender),
    pyramidOlfactive: {
      tete: notesTop,
      coeur: notesHeart,
      fond: notesBase
    },
    occasions,
    conseils,
    caracteristiques
  };
}

function generateLongDescription(
  focusKeyword: string,
  name: string,
  brandName: string,
  gender: string,
  family: string,
  notesTop: string[],
  notesHeart: string[],
  notesBase: string[],
  occasions: string[],
  conseils: string,
  caracteristiques: { intensite: string; tenue: string; sillage: string; saison: string[] }
): string {
  const genderPhrase = getGenderPhrase(gender);
  const genderLabel = getGenderLabel(gender);

  // Paragraphe Introduction (avec focus keyword en début)
  const intro = `**Introduction**

${focusKeyword} est une création olfactive exceptionnelle signée ${brandName}. Ce parfum ${family.toLowerCase()} incarne l'élégance et la sophistication, offrant une expérience sensorielle unique. Dès les premières notes, vous serez transporté dans un univers de raffinement où chaque ingrédient a été minutieusement sélectionné pour créer une harmonie parfaite.

La pyramide olfactive de ${name} s'ouvre sur des notes de tête vibrantes de ${notesTop.join(', ')}, créant une première impression mémorable. Le cœur révèle ensuite des accords de ${notesHeart.join(', ')}, apportant profondeur et caractère à cette composition. Enfin, le fond somptueux de ${notesBase.join(', ')} assure une tenue remarquable et un sillage envoûtant.`;

  // Paragraphe "Pour qui ?"
  const pourQui = `**Pour qui ?**

${focusKeyword} a été conçu pour ${genderPhrase}. Ce parfum ${genderLabel.toLowerCase()} s'adresse à ceux qui apprécient les fragrances de qualité et souhaitent affirmer leur personnalité avec distinction. Son intensité ${caracteristiques.intensite.toLowerCase()} et son sillage ${caracteristiques.sillage.toLowerCase()} en font le compagnon idéal pour marquer les esprits.

Avec une tenue de ${caracteristiques.tenue}, cette eau de parfum vous accompagne du matin au soir sans nécessiter de retouche. ${conseils}`;

  // Paragraphe "Dans quelles occasions ?"
  const occasionsText = `**Dans quelles occasions ?**

Cette fragrance ${family.toLowerCase()} de ${brandName} excelle particulièrement lors des ${occasions.join(', ')}. Les saisons idéales pour porter ${name} sont ${caracteristiques.saison.join(' et ').toLowerCase()}, où ses notes se révèlent dans toute leur splendeur.

Que vous recherchiez un parfum signature pour le quotidien ou une fragrance d'exception pour les moments importants, ${focusKeyword} saura répondre à vos attentes les plus exigeantes. Laissez-vous séduire par cette création qui allie tradition orientale et modernité.`;

  return `${intro}

${pourQui}

${occasionsText}`;
}

// ============================================================
// FIREBASE ET SAUVEGARDE
// ============================================================

function getFirestoreInstance(): Firestore {
  // Initialize Firebase Admin if not already done
  if (getApps().length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        initializeApp({
          credential: cert(serviceAccount)
        });
      } catch (error) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
        throw error;
      }
    } else {
      // For Google Cloud environments
      initializeApp();
    }
  }

  return getFirestore(getApp());
}

async function saveToFirestore(
  firestore: Firestore,
  productId: string,
  seoData: SEOData
): Promise<void> {
  const docRef = firestore.collection('products').doc(productId);

  await docRef.set({
    seo: seoData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

async function saveBatchToFirestore(
  firestore: Firestore,
  products: Array<{ id: string; seoData: SEOData }>
): Promise<void> {
  const batch = firestore.batch();

  for (const { id, seoData } of products) {
    const docRef = firestore.collection('products').doc(id);
    batch.set(docRef, {
      seo: seoData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  await batch.commit();
}

// ============================================================
// IMPORT DES PRODUITS ET EXÉCUTION
// ============================================================

async function main() {
  console.log('🚀 Démarrage de la génération des fiches SEO...\n');

  // Import dynamique des produits
  const dataModule = require('../lib/data');
  const products = dataModule.getProducts();

  console.log(`📦 ${products.length} produits trouvés\n`);

  // Initialiser Firestore
  let firestore: Firestore | null = null;
  try {
    firestore = getFirestoreInstance();
    console.log('✅ Connexion Firestore établie\n');
  } catch (error) {
    console.warn('⚠️ Impossible de se connecter à Firestore. Les données seront affichées uniquement.\n');
  }

  const results: Array<{ id: string; name: string; seoData: SEOData }> = [];
  const batchSize = 50;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    console.log(`📝 Génération SEO pour: ${product.name} (${product.brand.name})`);

    const seoData = generateSEOData(product as Product);
    results.push({ id: product.id, name: product.name, seoData });

    // Afficher un exemple pour les 3 premiers
    if (i < 3) {
      console.log('\n--- Aperçu SEO ---');
      console.log(`Focus Keyword: ${seoData.focusKeyword}`);
      console.log(`Title: ${seoData.title}`);
      console.log(`Meta Title (${seoData.metaTitle.length} chars): ${seoData.metaTitle}`);
      console.log(`Meta Description (${seoData.metaDescription.length} chars): ${seoData.metaDescription}`);
      console.log(`Category: ${seoData.category}`);
      console.log(`Tags: ${seoData.tags.slice(0, 5).join(', ')}...`);
      console.log(`Pyramide: T:${seoData.pyramidOlfactive.tete.join('/')} | C:${seoData.pyramidOlfactive.coeur.join('/')} | F:${seoData.pyramidOlfactive.fond.join('/')}`);
      console.log('-------------------\n');
    }

    // Sauvegarder par batch
    if (firestore && (i + 1) % batchSize === 0) {
      const batch = results.slice(i - batchSize + 1, i + 1).map(r => ({ id: r.id, seoData: r.seoData }));
      try {
        await saveBatchToFirestore(firestore, batch);
        console.log(`💾 Batch ${Math.floor(i / batchSize) + 1} sauvegardé dans Firestore`);
      } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde du batch:`, error);
      }
    }
  }

  // Sauvegarder le reste
  if (firestore) {
    const remaining = results.slice(Math.floor(products.length / batchSize) * batchSize);
    if (remaining.length > 0) {
      try {
        await saveBatchToFirestore(firestore, remaining.map(r => ({ id: r.id, seoData: r.seoData })));
        console.log(`💾 Batch final (${remaining.length} produits) sauvegardé dans Firestore`);
      } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde du batch final:`, error);
      }
    }
  }

  console.log('\n✅ Génération terminée !');
  console.log(`📊 ${results.length} fiches SEO générées`);

  // Exporter en JSON pour vérification
  const outputPath = './seo-output.json';
  const fs = require('fs');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`📄 Résultats exportés vers ${outputPath}`);
}

// Exécuter le script
main().catch(console.error);
