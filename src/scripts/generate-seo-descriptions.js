/**
 * Script de génération automatique des fiches produits SEO
 *
 * Ce script génère des descriptions optimisées SEO pour tous les parfums
 * et sauvegarde les données dans Firestore.
 *
 * Usage: node src/scripts/generate-seo-descriptions.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ============================================================
// DONNÉES DE RÉFÉRENCE POUR LA GÉNÉRATION
// ============================================================

const POWER_WORDS = [
  'Incroyable', 'Ultime', 'Exclusif', 'Essentiel', 'Nouveau',
  'Garanti', 'Éprouvé', 'Révolutionnaire', 'Secret', 'Magique',
  'Envoûtant', 'Captivant', 'Inoubliable', 'Somptueux', 'Exquis'
];

const NOTES_PAR_FAMILLE = {
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
  },
  'Ambré': {
    tete: ['safran', 'bergamote', 'épices', 'cannelle', 'cardamome'],
    coeur: ['ambre', 'encens', 'rose', 'jasmin', 'labdanum'],
    fond: ['vanille', 'musc', 'benjoin', 'oud', 'bois de santal']
  },
  'Épicé': {
    tete: ['poivre', 'cardamome', 'gingembre', 'bergamote', 'safran'],
    coeur: ['cannelle', 'clou de girofle', 'cumin', 'rose', 'cuir'],
    fond: ['ambre', 'musc', 'oud', 'vanille', 'patchouli']
  }
};

const OCCASIONS_PAR_GENRE = {
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

const CONSEILS_PAR_FAMILLE = {
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
  ],
  'Ambré': [
    'Idéal pour les soirées et les occasions spéciales.',
    'Une fragrance enveloppante qui laisse une trace mémorable.',
    'Parfait pour les mois les plus froids.'
  ],
  'Épicé': [
    'Un parfum audacieux pour les personnalités affirmées.',
    'Se porte de préférence le soir ou lors d\'événements marquants.',
    'Sillage puissant, à utiliser avec parcimonie.'
  ]
};

const INTENSITE_PAR_FAMILLE = {
  'Boisé': 'Modérée à intense',
  'Oriental': 'Intense',
  'Fruité': 'Légère à modérée',
  'Floral': 'Modérée',
  'Frais': 'Légère',
  'Chypré': 'Modérée à intense',
  'Gourmand': 'Intense',
  'Cuir': 'Très intense',
  'Ambré': 'Intense',
  'Épicé': 'Intense à très intense'
};

const TENUE_PAR_FAMILLE = {
  'Boisé': '6 à 8 heures',
  'Oriental': '8 à 12 heures',
  'Fruité': '4 à 6 heures',
  'Floral': '5 à 7 heures',
  'Frais': '3 à 5 heures',
  'Chypré': '6 à 8 heures',
  'Gourmand': '8 à 10 heures',
  'Cuir': '10 à 12 heures',
  'Ambré': '8 à 12 heures',
  'Épicé': '8 à 10 heures'
};

const SILLAGE_PAR_FAMILLE = {
  'Boisé': 'Modéré, proche de la peau',
  'Oriental': 'Puissant, enveloppant',
  'Fruité': 'Léger, aérien',
  'Floral': 'Modéré, élégant',
  'Frais': 'Discret, rafraîchissant',
  'Chypré': 'Modéré à puissant',
  'Gourmand': 'Puissant, addictif',
  'Cuir': 'Très puissant, marquant',
  'Ambré': 'Puissant, sensuel',
  'Épicé': 'Très puissant, percutant'
};

const SAISONS_PAR_FAMILLE = {
  'Boisé': ['Automne', 'Hiver'],
  'Oriental': ['Automne', 'Hiver'],
  'Fruité': ['Printemps', 'Été'],
  'Floral': ['Printemps', 'Été'],
  'Frais': ['Printemps', 'Été'],
  'Chypré': ['Printemps', 'Automne'],
  'Gourmand': ['Automne', 'Hiver'],
  'Cuir': ['Automne', 'Hiver'],
  'Ambré': ['Automne', 'Hiver'],
  'Épicé': ['Automne', 'Hiver']
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================

function getRandomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getGenderLabel(gender) {
  switch (gender) {
    case 'homme': return 'Homme';
    case 'femme': return 'Femme';
    case 'mixte': return 'Unisexe';
    default: return 'Unisexe';
  }
}

function getGenderPhrase(gender) {
  switch (gender) {
    case 'homme': return 'les hommes modernes et audacieux';
    case 'femme': return 'les femmes élégantes et raffinées';
    case 'mixte': return 'tous ceux qui recherchent l\'excellence';
    default: return 'les amateurs de parfums d\'exception';
  }
}

function getFamilyNotes(family) {
  return NOTES_PAR_FAMILLE[family] || NOTES_PAR_FAMILLE['Oriental'];
}

// ============================================================
// GÉNÉRATEUR SEO PRINCIPAL
// ============================================================

function generateSEOData(product) {
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
    tags: [...new Set(tags)],
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
) {
  const genderPhrase = getGenderPhrase(gender);
  const genderLabel = getGenderLabel(gender);

  // Paragraphe Introduction (avec focus keyword en début)
  const intro = `<h2>Introduction</h2>

<p><strong>${focusKeyword}</strong> est une création olfactive exceptionnelle signée ${brandName}. Ce parfum ${family.toLowerCase()} incarne l'élégance et la sophistication, offrant une expérience sensorielle unique. Dès les premières notes, vous serez transporté dans un univers de raffinement où chaque ingrédient a été minutieusement sélectionné pour créer une harmonie parfaite.</p>

<h3>Pyramide Olfactive</h3>

<p>La pyramide olfactive de <strong>${name}</strong> s'ouvre sur des notes de tête vibrantes de <strong>${notesTop.join(', ')}</strong>, créant une première impression mémorable. Le cœur révèle ensuite des accords de <strong>${notesHeart.join(', ')}</strong>, apportant profondeur et caractère à cette composition. Enfin, le fond somptueux de <strong>${notesBase.join(', ')}</strong> assure une tenue remarquable et un sillage envoûtant.</p>`;

  // Paragraphe "Pour qui ?"
  const pourQui = `<h2>Pour qui ?</h2>

<p><strong>${focusKeyword}</strong> a été conçu pour ${genderPhrase}. Ce parfum ${genderLabel.toLowerCase()} s'adresse à ceux qui apprécient les fragrances de qualité et souhaitent affirmer leur personnalité avec distinction. Son intensité ${caracteristiques.intensite.toLowerCase()} et son sillage ${caracteristiques.sillage.toLowerCase()} en font le compagnon idéal pour marquer les esprits.</p>

<p>Avec une tenue de <strong>${caracteristiques.tenue}</strong>, cette eau de parfum vous accompagne du matin au soir sans nécessiter de retouche. ${conseils}</p>`;

  // Paragraphe "Dans quelles occasions ?"
  const occasionsText = `<h2>Dans quelles occasions ?</h2>

<p>Cette fragrance ${family.toLowerCase()} de ${brandName} excelle particulièrement lors des ${occasions.join(', ')}. Les saisons idéales pour porter <strong>${name}</strong> sont ${caracteristiques.saison.join(' et ').toLowerCase()}, où ses notes se révèlent dans toute leur splendeur.</p>

<p>Que vous recherchiez un parfum signature pour le quotidien ou une fragrance d'exception pour les moments importants, <strong>${focusKeyword}</strong> saura répondre à vos attentes les plus exigeantes. Laissez-vous séduire par cette création qui allie tradition orientale et modernité.</p>`;

  return `${intro}

${pourQui}

${occasionsText}`;
}

// ============================================================
// FIREBASE ET SAUVEGARDE
// ============================================================

function getFirestoreInstance() {
  if (admin.apps.length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } catch (error) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
        throw error;
      }
    } else {
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found. Running in local mode without Firestore.');
      return null;
    }
  }

  return admin.firestore();
}

async function saveBatchToFirestore(firestore, products) {
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
// EXTRACTION DES PRODUITS DEPUIS data.ts
// ============================================================

function extractProductsFromDataFile() {
  const dataPath = path.join(__dirname, '../lib/data.ts');
  const content = fs.readFileSync(dataPath, 'utf8');

  // Extraire les produits en utilisant regex
  const productsMatch = content.match(/const products: Product\[\] = \[([\s\S]*?)\];\s*export/);

  if (!productsMatch) {
    console.error('Cannot find products array in data.ts');
    return [];
  }

  // Parse les produits manuellement
  const products = [];
  const productBlocks = productsMatch[1].split(/\},\s*\{/);

  for (let i = 0; i < productBlocks.length; i++) {
    let block = productBlocks[i];
    if (!block.startsWith('{')) block = '{' + block;
    if (!block.endsWith('}')) block = block + '}';

    try {
      // Extraire les champs essentiels
      const id = block.match(/"id":\s*"([^"]+)"/)?.[1];
      const name = block.match(/"name":\s*"([^"]+)"/)?.[1];
      const slug = block.match(/"slug":\s*"([^"]+)"/)?.[1];
      const brandMatch = block.match(/brands\.find\(b => b\.name === '([^']+)'\)/);
      const brandName = brandMatch?.[1] || 'Unknown';
      const gender = block.match(/"gender":\s*"([^"]+)"/)?.[1] || 'mixte';
      const family = block.match(/"family":\s*"([^"]+)"/)?.[1] || 'Oriental';
      const volumeMl = parseInt(block.match(/"volumeMl":\s*(\d+)/)?.[1] || '100');
      const price = parseFloat(block.match(/"price":\s*([\d.]+)/)?.[1] || '35');

      // Extraire les notes si présentes
      const topNotesMatch = block.match(/"topNotes":\s*\[([^\]]*)\]/);
      const heartNotesMatch = block.match(/"heartNotes":\s*\[([^\]]*)\]/);
      const baseNotesMatch = block.match(/"baseNotes":\s*\[([^\]]*)\]/);

      const topNotes = topNotesMatch ? topNotesMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) : [];
      const heartNotes = heartNotesMatch ? heartNotesMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) : [];
      const baseNotes = baseNotesMatch ? baseNotesMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) : [];

      if (id && name) {
        products.push({
          id,
          name,
          slug,
          brand: { name: brandName },
          gender,
          family,
          volumeMl,
          price,
          topNotes: topNotes || [],
          heartNotes: heartNotes || [],
          baseNotes: baseNotes || []
        });
      }
    } catch (e) {
      // Skip malformed blocks
    }
  }

  return products;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('🚀 Démarrage de la génération des fiches SEO...\n');

  // Extraire les produits
  const products = extractProductsFromDataFile();

  console.log(`📦 ${products.length} produits trouvés\n`);

  if (products.length === 0) {
    console.error('❌ Aucun produit trouvé. Vérifiez le fichier data.ts');
    return;
  }

  // Initialiser Firestore (optionnel)
  let firestore = null;
  try {
    firestore = getFirestoreInstance();
    if (firestore) {
      console.log('✅ Connexion Firestore établie\n');
    }
  } catch (error) {
    console.warn('⚠️ Impossible de se connecter à Firestore. Les données seront exportées en JSON uniquement.\n');
  }

  const results = [];
  const batchSize = 50;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    console.log(`📝 [${i + 1}/${products.length}] Génération SEO pour: ${product.name} (${product.brand.name})`);

    const seoData = generateSEOData(product);
    results.push({ id: product.id, name: product.name, slug: product.slug, seoData });

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

    // Sauvegarder par batch dans Firestore
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

  // Sauvegarder le reste dans Firestore
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

  // Exporter en JSON
  const outputPath = path.join(process.cwd(), 'seo-output.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`📄 Résultats exportés vers ${outputPath}`);
}

// Exécuter
main().catch(console.error);
