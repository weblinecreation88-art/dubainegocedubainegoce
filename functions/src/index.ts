import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import { stringify } from 'csv-stringify';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

// Constants
const MERCHANT_ID = "5079397995"; // Votre ID Merchant Center
const BASE_PRODUCT_URL = "https://dubainegoce.fr/produit/";
const GOOGLE_PRODUCT_CATEGORY = "Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne";
const BUCKET_NAME = admin.app().options.storageBucket || 'dubainegoce-back-296a4.appspot.com'; // Remplacez par le nom de votre bucket si différent
const FILE_PATH = 'feeds/dubainegoce-produits.txt';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Prix en MAD
  images: Array<{ url: string }>;
  brand: string;
  gtin?: string; // Global Trade Item Number
  availability: string; // e.g., 'in stock', 'out of stock'
  condition: string; // e.g., 'new', 'used'
  type: string; // e.g., 'parfum', 'cosmetic'
}

export const generateGoogleFeed = functions.https.onCall(async (data, context) => {
  // Optional: check authentication if needed
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }

  console.log("Starting Google Merchant Center feed generation...");

  try {
    // 1. Fetch products from Firestore
    const productsSnapshot = await db.collection('products').get();
    const products: Product[] = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().title || '',
      description: doc.data().description || '',
      price: doc.data().price || 0,
      images: doc.data().images || [],
      brand: doc.data().brand || '',
      gtin: doc.data().gtin || '',
      availability: doc.data().availability || 'in stock',
      condition: doc.data().condition || 'new',
      type: doc.data().type || 'parfum',
    }));

    let exportedProductsCount = 0;
    const records = [];

    // CSV Headers
    records.push([
      'id', 'title', 'description', 'link', 'image_link', 'price', 'condition', 'availability', 'brand', 'gtin', 'google_product_category'
    ]);

    // 2. Map product data to Google Merchant Center attributes
    for (const product of products) {
      // Basic validation: skip products without image or essential info
      if (!product.images || product.images.length === 0 || !product.name || !product.price) {
        console.warn(`Skipping product ${product.id} due to missing essential data.`);
        continue;
      }

      const productLink = `${BASE_PRODUCT_URL}${product.id}`;
      const imageLink = product.images[0].url;
      const priceFormatted = `${product.price.toFixed(2)} MAD`; // Assuming price is in MAD

      records.push([
        product.id,
        product.name,
        product.description,
        productLink,
        imageLink,
        priceFormatted,
        product.condition,
        product.availability,
        product.brand,
        product.gtin || '', // Use GTIN if available, otherwise empty
        GOOGLE_PRODUCT_CATEGORY,
      ]);
      exportedProductsCount++;
    }

    // 3. Generate CSV string
    const csvString = await new Promise<string>((resolve, reject) => {
      stringify(records, (err, result) => {
        if (err) reject(err);
        resolve(result || '');
      });
    });

    // 4. Upload to Firebase Storage
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(FILE_PATH);

    await file.save(csvString, {
      metadata: {
        contentType: 'text/plain',
      },
    });

    // Make the file publicly readable (if you want direct access without signed URLs)
    await file.makePublic();

    const publicUrl = file.publicUrl();

    console.log(`Feed generated successfully. Exported ${exportedProductsCount} products. Public URL: ${publicUrl}`);

    return { success: true, message: `Feed generated successfully. Exported ${exportedProductsCount} products.`, publicUrl: publicUrl };
  } catch (error: any) {
    console.error("Error generating feed:", error);
    throw new functions.https.HttpsError('internal', 'Failed to generate product feed.', error.message);
  }
});
