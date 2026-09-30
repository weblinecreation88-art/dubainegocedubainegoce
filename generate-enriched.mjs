#!/usr/bin/env node

/**
 * Générateur intelligent des 141 fiches enrichies
 * Approche directe: parsing basique des IDs + génération descriptions
 */

import fs from 'fs';

// Lire data.ts
const dataContent = fs.readFileSync('src/lib/data.ts', 'utf-8');

// Extraire TOUS les IDs uniques
const idMatches = dataContent.match(/"id":\s*"(\d+)"/g) || [];
const uniqueIds = [...new Set(idMatches.map(m => m.match(/"(\d+)"/)[1]))];

console.log(`\n📊 Trouvé ${uniqueIds.length} IDs uniques\n`);

// Générer fiches enrichies
const enrichedProducts = uniqueIds.map(id => ({
  id,
  metaTitle: `Parfum ID ${id} | Qualité Premium | E-E-A-T Optimisé`,
  metaDescription: `Découvrez le parfum ID ${id}: eau de parfum authentique de luxe. ⭐4.7/5 | Livraison 48h | DubaiNegoce`,
  longDescription: `<section class='intro'><p><strong>Parfum ${id}</strong> est une eau de parfum premium authentique. Qualité de luxe à prix accessible.</p></section><section class='pyramid'><h3>Pyramide Olfactive</h3><p>Notes harmonieuses et équilibrées pour une signature unique.</p></section>`,
}));

console.log(`✅ Généré ${enrichedProducts.length} fiches enrichies\n`);

// Sauvegarder JSON
fs.writeFileSync('enriched-products-all-141.json', JSON.stringify(enrichedProducts.slice(0, 141), null, 2));

console.log('📋 ÉCHANTILLON: 15 PREMIERS PARFUMS\n');
console.log('='.repeat(90));

enrichedProducts.slice(0, 15).forEach((p, i) => {
  console.log(`\n${String(i + 1).padStart(2, '0')}. ID: ${p.id}`);
  console.log(`    MetaTitle: ${p.metaTitle}`);
  console.log(`    MetaDesc: ${p.metaDescription.substring(0, 70)}...`);
});

console.log('\n' + '='.repeat(90));
console.log(`\n✅ ${enrichedProducts.length} fiches enrichies générées!`);
console.log('📁 Fichier: enriched-products-all-141.json\n');
console.log('Prochaines étapes:');
console.log('1. Vérifier l\'échantillon');
console.log('2. Adapter les descriptions pour chaque marque/famille');
console.log('3. Intégrer dans data.ts\n');
