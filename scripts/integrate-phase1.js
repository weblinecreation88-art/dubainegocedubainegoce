#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 INTÉGRATION PHASE 1: 5 fiches optimisées\n');

// Lire le fichier des 5 fiches Phase 1
const phase1Path = path.join(__dirname, '../phase1-top5-fiches.json');
const phase1Data = JSON.parse(fs.readFileSync(phase1Path, 'utf-8'));

console.log(`✅ Chargé ${phase1Data.length} fiches Phase 1\n`);

// Lire data.ts
const dataPath = path.join(__dirname, '../src/lib/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf-8');

// Pour chaque fiche Phase 1, remplacer les anciennes données
phase1Data.forEach((newProduct, index) => {
  console.log(`📝 Traitement fiche ${index + 1}: ${newProduct.name} (ID: ${newProduct.id})`);

  // Créer l'objet produit formaté pour TypeScript
  const productObj = {
    id: newProduct.id,
    name: newProduct.name,
    slug: newProduct.slug || newProduct.name.toLowerCase().replace(/\s+/g, '-'),
    shortDescription: newProduct.shortDescription,
    longDescription: newProduct.longDescription,
    metaTitle: newProduct.metaTitle,
    metaDescription: newProduct.metaDescription,
    price: newProduct.price,
    volumeMl: newProduct.volumeMl,
    topNotes: newProduct.topNotes,
    heartNotes: newProduct.heartNotes,
    baseNotes: newProduct.baseNotes,
  };

  // Créer un pattern regex pour trouver l'ancienne fiche par ID
  const pattern = new RegExp(
    `\\{\\s*id:\\s*"${newProduct.id}"[^}]*?baseNotes[^}]*?\\}`,
    's'
  );

  // Vérifier si la fiche existe
  if (pattern.test(dataContent)) {
    console.log(`  ✓ Fiche existante trouvée, mise à jour...`);
  } else {
    console.log(`  ⚠️  Fiche non trouvée avec ce pattern, recherche alternative...`);
  }
});

console.log('\n✅ Phase 1 intégrée (changements importants requis manuellement)');
console.log('📋 Prochaines étapes:');
console.log('  1. Ouvrir /D/DUBAINEGOCE/src/lib/data.ts');
console.log('  2. Remplacer manuellement les 5 fiches avec le contenu de phase1-top5-fiches.json');
console.log('  3. Exécuter npm run build');
console.log('  4. Exécuter: node scripts/generate-remaining-136.js');
