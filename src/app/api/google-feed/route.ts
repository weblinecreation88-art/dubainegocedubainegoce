import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function mapGender(gender: string): string {
    switch (gender) {
        case 'homme': return 'male';
        case 'femme': return 'female';
        case 'mixte': return 'unisex';
        default: return 'unisex';
    }
}

export async function GET() {
    const products = getProducts();

    // Filter out products without a price or without a valid image
    const validProducts = products.filter(
        (p) =>
            p.price !== undefined &&
            p.price !== null &&
            p.price > 0 &&
            Array.isArray(p.images) &&
            p.images.length > 0 &&
            p.images[0] !== ''
    );

    const items = validProducts
        .map((product) => {
            const image = product.images?.[0] ?? '';
            const productUrl = `${SITE_URL}/parfum/${product.slug}`;
            const priceFormatted = `${product.price.toFixed(2)} EUR`;
            const brand = product.brand?.name ?? 'DubaïNégoce';
            const gender = mapGender(product.gender ?? 'mixte');
            const title = escapeXml(product.name);
            const description = escapeXml(
                product.shortDescription?.replace(/<[^>]*>/g, '') ?? product.name
            );
            const availability = 'in_stock'; // Toujours en stock pour Google Merchant

            return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:price>${priceFormatted}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:gender>${gender}</g:gender>
      <g:product_type>Parfums &amp; Cosmétiques &gt; Parfums</g:product_type>
      <g:google_product_category>2915</g:google_product_category>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Colissimo</g:service>
        <g:price>5.99 EUR</g:price>
      </g:shipping>
    </item>`;
        })
        .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DubaïNégoce - Parfums Orientaux</title>
    <link>${SITE_URL}</link>
    <description>Boutique en ligne de parfums orientaux de luxe - DubaïNégoce</description>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
