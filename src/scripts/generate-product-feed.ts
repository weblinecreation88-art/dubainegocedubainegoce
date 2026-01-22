// src/scripts/generate-product-feed.ts
import { getProducts } from '../lib/data';
import { create } from 'xmlbuilder2';
import { writeFileSync } from 'fs';
import path from 'path';

const generateProductFeed = () => {
  console.log('Starting product feed generation...');

  const products = getProducts();
  const siteUrl = 'https://dubainegoce.fr';

  let productsWithMissingPrice = 0;
  let productsWithNoStock = 0;

  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rss', { 'xmlns:g': 'http://base.google.com/ns/1.0', version: '2.0' })
      .ele('channel')
        .ele('title').txt('DubaiNegoce Product Feed').up()
        .ele('link').txt(siteUrl).up()
        .ele('description').txt('Flux de produits pour Google Merchant Center').up();

  products.forEach(product => {
    // Verifier le prix
    if (!product.price || product.price <= 0) {
      console.warn(`⚠️ Product ${product.id} (${product.name}) has no price!`);
      productsWithMissingPrice++;
      return; // Skip products without price
    }

    const item = root.ele('item');

    // ID unique du produit
    item.ele('g:id').txt(product.id).up();

    // Titre
    item.ele('g:title').txt(product.name).up();

    // Description
    item.ele('g:description').txt(product.shortDescription || product.name).up();

    // Lien vers la page produit
    item.ele('g:link').txt(`${siteUrl}/parfum/${product.slug}`).up();

    // Image principale
    if (product.images && product.images.length > 0) {
      item.ele('g:image_link').txt(product.images[0]).up();

      // Images additionnelles (max 10)
      product.images.slice(1, 10).forEach(img => {
        item.ele('g:additional_image_link').txt(img).up();
      });
    }

    // Marque
    item.ele('g:brand').txt(product.brand?.name || 'DubaiNegoce').up();

    // Prix (format requis: "XX.XX EUR")
    item.ele('g:price').txt(`${product.price.toFixed(2)} EUR`).up();

    // Condition
    item.ele('g:condition').txt('new').up();

    // === DONNEES D'INVENTAIRE (TRES IMPORTANT) ===
    const stockQuantity = product.stock || 0;

    // Disponibilite
    if (stockQuantity > 0) {
      item.ele('g:availability').txt('in_stock').up();
    } else {
      item.ele('g:availability').txt('out_of_stock').up();
      productsWithNoStock++;
    }

    // Quantite en stock (requis pour l'inventaire)
    item.ele('g:quantity').txt(String(stockQuantity)).up();

    // === IDENTIFIANTS PRODUIT ===
    // MPN (Manufacturer Part Number) - utilise l'ID produit
    item.ele('g:mpn').txt(product.id).up();

    // GTIN vide si non disponible
    // item.ele('g:gtin').txt('').up();

    // Indiquer que les identifiants existent
    item.ele('g:identifier_exists').txt('true').up();

    // Genre
    if (product.gender) {
      let gender = 'unisex';
      if (product.gender === 'homme') gender = 'male';
      else if (product.gender === 'femme') gender = 'female';
      else if (product.gender === 'mixte') gender = 'unisex';
      item.ele('g:gender').txt(gender).up();
    }

    // Type de produit
    if (product.family) {
      item.ele('g:product_type').txt(`Parfums > ${product.family}`).up();
    }

    // Categorie Google
    item.ele('g:google_product_category').txt('469').up(); // 469 = Perfume & Cologne

    // Shipping (livraison)
    const shipping = item.ele('g:shipping');
    shipping.ele('g:country').txt('FR').up();
    shipping.ele('g:service').txt('Standard').up();
    shipping.ele('g:price').txt('4.90 EUR').up();
  });

  const xml = root.end({ prettyPrint: true });

  // Sauvegarder a la racine du projet
  const outputPath = path.join(process.cwd(), 'public', 'product-feed.xml');

  try {
    writeFileSync(outputPath, xml, 'utf8');
    console.log(`\n✅ Product feed generated successfully at ${outputPath}`);
    console.log(`✅ Total products included: ${products.length - productsWithMissingPrice}`);
    console.log(`⚠️ Products skipped (no price): ${productsWithMissingPrice}`);
    console.log(`📦 Products out of stock: ${productsWithNoStock}`);
  } catch (error) {
    console.error('❌ Error writing product feed file:', error);
  }
};

generateProductFeed();
