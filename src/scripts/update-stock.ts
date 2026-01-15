/**
 * Script to update stock for all products in Firestore
 * Sets stock to 100 for all products to fix Google Merchant Center inventory issues
 *
 * Usage: npx tsx src/scripts/update-stock.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function updateProductStock() {
  try {
    console.log('🚀 Starting stock update for all products...');

    // Get all products from Firestore
    const productsSnapshot = await db.collection('products').get();

    if (productsSnapshot.empty) {
      console.log('⚠️  No products found in Firestore');
      return;
    }

    console.log(`📦 Found ${productsSnapshot.size} products`);

    let updatedCount = 0;
    const batch = db.batch();

    // Update each product
    productsSnapshot.forEach((doc) => {
      const productRef = db.collection('products').doc(doc.id);
      batch.update(productRef, {
        stock: 100,
        updatedAt: new Date()
      });
      updatedCount++;
    });

    // Commit the batch
    await batch.commit();

    console.log(`✅ Successfully updated stock for ${updatedCount} products`);
    console.log('📊 All products now have stock: 100');
    console.log('✨ Google Merchant Center should now see all products as "in stock"');

  } catch (error) {
    console.error('❌ Error updating stock:', error);
    throw error;
  }
}

// Run the script
updateProductStock()
  .then(() => {
    console.log('🎉 Stock update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
