#!/usr/bin/env node

/**
 * Script SÉCURISÉ: Merge les métadonnées enrichies (metaTitle + metaDescription)
 * Garde l'intégrité de data.ts, ne remplace que les champs de metadata
 */

import fs from 'fs';

console.log('\n🔧 MERGE SÉCURISÉ: Métadonnées enrichies\n');

// Lire les fiches enrichies
const enriched = JSON.parse(fs.readFileSync('enriched-products-all-141.json', 'utf-8'));

console.log(`📊 Chargé ${enriched.length} fiches enrichies`);
console.log(`⚠️  ATTENTION: Script en mode SÉCURISÉ (metadata only)\n`);

// Lire data.ts
let dataContent = fs.readFileSync('src/lib/data.ts', 'utf-8');

let replacedCount = 0;

// Pour chaque fiche enrichie, remplacer JUSTE metaTitle + metaDescription
enriched.forEach((enrichedProduct, index) => {
  const id = enrichedProduct.id;
  
  // Pattern pour trouver les métadonnées de ce produit
  // Cherche: "id": "1798" ... "metaTitle": "..." "metaDescription": "..."
  const metaTitlePattern = new RegExp(
    `("id":\s*"${id}"[^}]*?"metaTitle":\s*)"[^"]*"`,
    'g'
  );
  
  const metaDescPattern = new RegExp(
    `("id":\s*"${id}"[^}]*?"metaDescription":\s*)"[^"]*"`,
    'g'
  );

  // Remplacer metaTitle
  if (metaTitlePattern.test(dataContent)) {
    dataContent = dataContent.replace(
      metaTitlePattern,
      `$1"${enrichedProduct.metaTitle.replace(/"/g, '\\"')}"` 
    );
    replacedCount++;
  }

  // Remplacer metaDescription  
  if (metaDescPattern.test(dataContent)) {
    dataContent = dataContent.replace(
      metaDescPattern,
      `$1"${enrichedProduct.metaDescription.replace(/"/g, '\\"')}"` 
    );
    replacedCount++;
  }

  if ((index + 1) % 30 === 0) {
    console.log(`✓ Traité ${index + 1}/${enriched.length} fiches...`);
  }
});

// Sauvegarder le fichier modifié (SAFE: backup d'abord)
const backupPath = 'src/lib/data.ts.backup';
fs.copyFileSync('src/lib/data.ts', backupPath);
console.log(`\n💾 Backup créé: ${backupPath}`);

fs.writeFileSync('src/lib/data.ts', dataContent);

console.log(`\n✅ ${replacedCount} métadonnées remplacées`);
console.log(`✅ Fichier sauvegardé: src/lib/data.ts\n`);

console.log('Prochaines étapes:');
console.log('1. npm run build  (vérifier compilation)');
console.log('2. git diff src/lib/data.ts  (vérifier changements)');
console.log('3. Si OK: commit + push\n');
