import { getProducts } from '@/lib/data';
import { Product } from '@/lib/types';
import fs from 'fs';
import path from 'path';

function generateProductFeed() {
  const products = getProducts();

  let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>DubaiNegoce Product Feed</title>
<link>https://dubainegoce.fr</link>
<description>Flux de produits pour Google Merchant Center</description>
`;

  products.forEach((product: Product) => {
    // Ensure the product has at least one image
    if (product.images && product.images.length > 0) {
      const productUrl = `https://dubainegoce.fr/parfum/${product.slug}`;
      const imageUrl = product.images[0];

      xml += `<item>
        <g:id>${product.id}</g:id>
        <g:title>${product.name}</g:title>
        <g:description>${product.shortDescription}</g:description>
        <g:link>${productUrl}</g:link>
        <g:image_link>${imageUrl}</g:image_link>
        <g:brand>${product.brand.name}</g:brand>
        <g:price>${product.price.toFixed(2)} EUR</g:price>
        <g:condition>new</g:condition>
        <g:availability>${product.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
        <g:gtin></g:gtin> // Placeholder for GTIN, if you have one
        <g:mpn>${product.id}</g:mpn>
        <g:google_product_category>Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne</g:google_product_category>
      </item>`;
    }
  });

  xml += `</channel>
</rss>`;

  const filePath = path.join(process.cwd(), 'public', 'product-feed.xml');
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`Product feed generated at ${filePath}`);
}

generateProductFeed();

