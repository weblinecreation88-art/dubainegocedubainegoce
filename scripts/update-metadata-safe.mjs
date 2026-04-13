#!/usr/bin/env node

import fs from 'fs';

console.log('\n🔄 MISE À JOUR SÉCURISÉE: Métadonnées optimisées\n');

// Lire les fiches enrichies
const enriched = JSON.parse(fs.readFileSync('enriched-products-all-141.json', 'utf-8'));

// Créer une map ID → métadonnées
const metaMap = new Map();
enriched.forEach(p => {
  metaMap.set(p.id, {
    metaTitle: p.metaTitle.replace(/"/g, '\\"'),
    metaDescription: p.metaDescription.replace(/"/g, '\\"')
  });
});

console.log(`📊 Chargé ${enriched.length} fiches enrichies`);

// Lire data.ts
let dataContent = fs.readFileSync('src/lib/data.ts', 'utf-8');

let count = 0;

// Pour chaque ID, remplacer les métadonnées
metaMap.forEach((meta, id) => {
  // Pattern: "metaTitle": "..." juste après le produit avec cet ID
  const oldMetaTitlePattern = new RegExp(
    `("id":\s*"${id}"[^]*?)"metaTitle":\s*"[^"]*"`,
    ''
  );
  
  const oldMetaDescPattern = new RegExp(
    `("id":\s*"${id}"[^]*?)"metaDescription":\s*"[^"]*"`,
    ''
  );

  // Test si l'ID existe
  if (dataContent.includes(`"id": "${id}"`)) {
    // Remplacer metaTitle
    dataContent = dataContent.replace(
      new RegExp(`("id":\s*"${id}"[^}]+?)"metaTitle":\s*"[^"]*"`, 's'),
      `$1"metaTitle": "${meta.metaTitle}"`
    );

    // Remplacer metaDescription
    dataContent = dataContent.replace(
      new RegExp(`("id":\s*"${id}"[^}]+?)"metaDescription":\s*"[^"]*"`, 's'),
      `$1"metaDescription": "${meta.metaDescription}"`
    );

    count++;
  }
});

console.log(`✅ ${count} produits mis à jour\n`);

// Sauvegarder
const backupPath = 'src/lib/data.ts.backup';
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync('src/lib/data.ts', backupPath);
  console.log(`💾 Backup: ${backupPath}`);
}

fs.writeFileSync('src/lib/data.ts', dataContent);
console.log(`📝 Fichier sauvegardé: src/lib/data.ts\n`);
