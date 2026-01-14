/**
 * Script pour uploader les données SEO vers Firestore
 *
 * Ce script lit seo-output.json et sauvegarde les données SEO
 * dans la collection 'products' de Firestore.
 *
 * Usage:
 * 1. Définir FIREBASE_SERVICE_ACCOUNT_KEY en variable d'environnement
 * 2. Exécuter: node src/scripts/upload-seo-to-firestore.js
 *
 * Alternative: Utiliser l'interface Firebase Console pour importer le JSON
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Upload des données SEO vers Firestore...\n');

  // Lire le fichier SEO généré
  const seoPath = path.join(process.cwd(), 'seo-output.json');
  if (!fs.existsSync(seoPath)) {
    console.error('❌ Fichier seo-output.json introuvable. Exécutez d\'abord generate-seo-descriptions.js');
    return;
  }

  const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
  console.log(`📦 ${seoData.length} fiches SEO chargées\n`);

  // Initialiser Firebase Admin
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY non défini.');
    console.log('\n📋 Pour définir la clé:');
    console.log('   Windows PowerShell:');
    console.log('   $env:FIREBASE_SERVICE_ACCOUNT_KEY = \'{"type":"service_account",...}\'');
    console.log('\n   Windows CMD:');
    console.log('   set FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}');
    console.log('\n   Linux/Mac:');
    console.log('   export FIREBASE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'');
    console.log('\n💡 Vous pouvez aussi exporter le JSON et l\'importer manuellement dans Firebase Console.');
    return;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialisé\n');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Firebase:', error.message);
    return;
  }

  const firestore = admin.firestore();
  const batchSize = 50;
  let uploadedCount = 0;

  // Upload par batch
  for (let i = 0; i < seoData.length; i += batchSize) {
    const batch = firestore.batch();
    const batchItems = seoData.slice(i, i + batchSize);

    for (const item of batchItems) {
      const docRef = firestore.collection('products').doc(item.id);
      batch.set(docRef, {
        seo: item.seoData,
        slug: item.slug,
        name: item.name,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    try {
      await batch.commit();
      uploadedCount += batchItems.length;
      console.log(`💾 Batch ${Math.floor(i / batchSize) + 1} uploadé (${uploadedCount}/${seoData.length})`);
    } catch (error) {
      console.error(`❌ Erreur batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    }
  }

  console.log(`\n✅ Upload terminé ! ${uploadedCount} produits mis à jour dans Firestore`);
}

main().catch(console.error);
