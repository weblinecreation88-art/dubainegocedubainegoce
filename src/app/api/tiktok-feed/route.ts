import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

function escapeXml(str: string): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

const CLOUDINARY_CLOUD = 'dzntnjtkc';

function toAbsoluteUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// TikTok ne supporte pas WebP — conversion automatique via Cloudinary fetch
function toTikTokImageUrl(path: string): string {
    const absolute = toAbsoluteUrl(path);
    if (!absolute.toLowerCase().endsWith('.webp')) return absolute;
    // Cloudinary fetch : convertit n'importe quelle image distante en JPG
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/f_jpg,q_90/${encodeURIComponent(absolute)}`;
}

export async function GET() {
    const products = getProducts();

    const validProducts = products.filter(
        (p) =>
            p.price != null &&
            p.price > 0 &&
            p.stock > 0 &&
            Array.isArray(p.images) &&
            p.images.length > 0 &&
            p.images[0] !== ''
    );

    const items = validProducts.map((product) => {
        const productUrl = `${SITE_URL}/parfum/${product.slug}`;
        const mainImage = toTikTokImageUrl(product.images[0]);
        const brandName = product.brand?.name ?? 'DubaïNégoce';

        // TikTok title: max 255 chars
        const title = `${product.name}${product.volumeMl ? ` ${product.volumeMl}ml` : ''}`.slice(0, 255);

        // Strip HTML from description
        const description = (product.shortDescription ?? product.name)
            .replace(/<[^>]*>/g, '')
            .slice(0, 5000);

        // Additional images (TikTok supports up to 9)
        const additionalImages = (product.images.slice(1, 9) ?? [])
            .map(img => `      <g:additional_image_link>${escapeXml(toTikTokImageUrl(img))}</g:additional_image_link>`)
            .join('\n');

        // Gender mapping
        const genderMap: Record<string, string> = {
            homme: 'male',
            femme: 'female',
            mixte: 'unisex',
        };
        const gender = genderMap[product.gender ?? 'mixte'] ?? 'unisex';

        // Manufacturer mapping for TikTok compliance (EU cosmetics)
        const manufacturerMap: Record<string, string> = {
            'Lattafa': 'Lattafa Perfumes - Dubai, UAE',
            'Maison Alhambra': 'Maison Alhambra - Dubai, UAE',
            'Fragrance World': 'Fragrance World - Dubai, UAE',
            'French Avenue': 'French Avenue - Dubai, UAE',
            'Asdaaf': 'Asdaaf - Dubai, UAE',
            'Ard Al Zaafaran': 'Ard Al Zaafaran - Dubai, UAE',
            'Paris Corner': 'Paris Corner - Dubai, UAE',
            'Gulf Orchid': 'Gulf Orchid - Dubai, UAE',
            'Hamidi': 'Hamidi - Dubai, UAE',
            'MIRADA': 'Mirada - Dubai, UAE',
            'Loui Martin': 'Loui Martin - Dubai, UAE',
            'Surrati': 'Surrati - Dubai, UAE',
        };
        const manufacturer = manufacturerMap[brandName] ?? `${brandName} - Dubai, UAE`;

        // TikTok product category (Fragrances = 2915)
        return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
${additionalImages ? additionalImages + '\n' : ''}      <g:price>${product.price.toFixed(2)} EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(brandName)}</g:brand>
      <g:gender>${gender}</g:gender>
      <g:google_product_category>2915</g:google_product_category>
      <g:product_type>Parfums &amp; Cosmétiques &gt; Parfums</g:product_type>
      <g:identifier_exists>false</g:identifier_exists>
      <g:manufacturer>${escapeXml(manufacturer)}</g:manufacturer>
      <g:custom_label_0>${escapeXml(product.brand?.name ?? '')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(product.gender ?? 'mixte')}</g:custom_label_1>
      <g:custom_label_2>${product.isBestseller ? 'bestseller' : product.isNew ? 'nouveaute' : 'standard'}</g:custom_label_2>
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DubaïNégoce - Parfums Orientaux</title>
    <link>${SITE_URL}</link>
    <description>Parfums orientaux authentiques de Dubaï - Lattafa, Maison Alhambra, Fragrance World</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
