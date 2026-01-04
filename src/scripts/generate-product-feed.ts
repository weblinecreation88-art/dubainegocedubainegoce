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
        <g:gtin></g:gtin> <!-- Replace with actual GTIN if available -->
        <g:mpn>${product.id}</g:mpn> <!-- Consider using a real MPN if product.id is not it -->
        <g:identifier_exists>${product.gtin || product.mpn || product.id ? 'true' : 'false'}</g:identifier_exists>
        <g:gender>${product.gender === 'mixte' ? 'unisex' : product.gender}</g:gender>
        <g:product_type>${product.family}</g:product_type>
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

