/**
 * Script pour exporter les données SEO au format Firestore
 *
 * Génère un fichier JSON formaté pour l'import dans Firebase Console
 *
 * Usage: node src/scripts/export-for-firestore.js
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🚀 Export des données SEO au format Firestore...\n');

  // Lire le fichier SEO généré
  const seoPath = path.join(process.cwd(), 'seo-output.json');
  if (!fs.existsSync(seoPath)) {
    console.error('❌ Fichier seo-output.json introuvable. Exécutez d\'abord generate-seo-descriptions.js');
    return;
  }

  const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
  console.log(`📦 ${seoData.length} fiches SEO chargées\n`);

  // Format pour Firestore
  const firestoreData = {};

  for (const item of seoData) {
    firestoreData[item.id] = {
      seo: item.seoData,
      slug: item.slug,
      name: item.name,
      updatedAt: new Date().toISOString()
    };
  }

  // Sauvegarder
  const outputPath = path.join(process.cwd(), 'firestore-products-seo.json');
  fs.writeFileSync(outputPath, JSON.stringify(firestoreData, null, 2));
  console.log(`✅ Export terminé: ${outputPath}`);
  console.log(`\n📋 Pour importer dans Firebase Console:`);
  console.log(`   1. Allez dans Firebase Console > Firestore`);
  console.log(`   2. Collection "products" > Import documents`);
  console.log(`   3. Uploadez le fichier firestore-products-seo.json`);
}

main();
