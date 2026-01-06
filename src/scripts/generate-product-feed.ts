// src/scripts/generate-product-feed.ts
import { getProducts } from '../lib/data';
import { create } from 'xmlbuilder2';
import { writeFileSync } from 'fs';
import path from 'path';

const generateProductFeed = () => {
  console.log('Starting product feed generation...');

  const products = getProducts();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rss', { 'xmlns:g': 'http://base.google.com/ns/1.0', version: '2.0' })
      .ele('channel')
        .ele('title').txt('DubaiNegoce Product Feed').up()
        .ele('link').txt(siteUrl).up()
        .ele('description').txt('Flux de produits pour Google Merchant Center').up();

  products.forEach(product => {
    const item = root.ele('item');
    item.ele('g:id').txt(product.id).up();
    item.ele('g:title').txt(product.name).up();
    item.ele('g:description').txt(product.shortDescription).up();
    item.ele('g:link').txt(`${siteUrl}/parfum/${product.slug}`).up();
    
    if (product.images && product.images.length > 0) {
      item.ele('g:image_link').txt(product.images[0]).up();
    }

    item.ele('g:brand').txt(product.brand.name).up();
    item.ele('g:price').txt(`${product.price.toFixed(2)} EUR`).up();
    item.ele('g:condition').txt('new').up();
    item.ele('g:availability').txt(product.stock > 0 ? 'in stock' : 'out of stock').up();
    
    // Google requires either GTIN or MPN + Brand. 
    // Providing MPN as product.id as a fallback.
    item.ele('g:gtin').txt('').up(); // Add real GTIN if you have it
    item.ele('g:mpn').txt(product.id).up();
    item.ele('g:identifier_exists').txt('yes').up();

    if (product.gender) {
        // Map your gender to Google's accepted values
        const gender = product.gender === 'mixte' ? 'unisex' : product.gender;
        item.ele('g:gender').txt(gender).up();
    }

    if (product.family) {
      item.ele('g:product_type').txt(product.family).up();
    }

    item.ele('g:google_product_category').txt('Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne').up();
  });

  const xml = root.end({ prettyPrint: true });
  const outputPath = path.join(process.cwd(), 'public', 'product-feed5.xml');
  
  try {
    writeFileSync(outputPath, xml, 'utf8');
    console.log(`✅ Product feed generated successfully at ${outputPath}`);
    console.log(`✅ Total products included: ${products.length}`);
  } catch (error) {
    console.error('❌ Error writing product feed file:', error);
  }
};

generateProductFeed();