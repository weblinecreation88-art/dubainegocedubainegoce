import { NextResponse } from 'next/server';
import { getProducts, computeShippingCost, shippingMethods } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** Converts a relative /images-parfums/... path to an absolute URL */
function toAbsoluteUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function mapGender(gender: string): string {
    switch (gender) {
        case 'homme': return 'male';
        case 'femme': return 'female';
        case 'mixte': return 'unisex';
        default: return 'unisex';
    }
}


function formatPrice(price: number): string {
    return `${price.toFixed(2)} EUR`;
}

// ─── Route ──────────────────────────────────────────────────────────────────

export async function GET() {
    const products = getProducts();

    const validProducts = products.filter(
        (p) =>
            p.price != null &&
            p.price > 0 &&
            Array.isArray(p.images) &&
            p.images.length > 0 &&
            p.images[0] !== ''
    );

    const items = validProducts
        .map((product) => {
            const productUrl  = escapeXml(`${SITE_URL}/parfum/${product.slug}`);
            const mainImage   = escapeXml(toAbsoluteUrl(product.images[0]));
            const brandName   = escapeXml(product.brand?.name ?? 'DubaïNégoce');
            const gender      = mapGender(product.gender ?? 'mixte');

            // ── Title: "Nom du produit – Marque | Xml EDP"
            const title = escapeXml(
                `${product.name}${product.volumeMl ? ` ${product.volumeMl}ml` : ''}`
            );

            // ── Description: strip HTML tags from shortDescription
            const description = escapeXml(
                (product.shortDescription ?? product.name).replace(/<[^>]*>/g, '')
            );

            // ── Shipping costs use the same one-item rule as checkout
            const shipping = shippingMethods.map(method => `      <g:shipping>
        <g:country>FR</g:country>
        <g:service>${escapeXml(method.name)}</g:service>
        <g:price>${formatPrice(computeShippingCost(method.id, 'FR', 1, product.price))}</g:price>
      </g:shipping>`).join('\n');

            // ── Additional images (up to 9 extra allowed by Google)
            const additionalImages = (product.images.slice(1, 10) ?? [])
                .map((img) => `      <g:additional_image_link>${escapeXml(toAbsoluteUrl(img))}</g:additional_image_link>`)
                .join('\n');

            // ── Olfactory notes for product highlights
            const allNotes = [
                ...(product.topNotes ?? []),
                ...(product.heartNotes ?? []),
                ...(product.baseNotes ?? []),
            ];
            const highlights = allNotes
                .slice(0, 10)
                .map((note) => `      <g:product_highlight>${escapeXml(note)}</g:product_highlight>`)
                .join('\n');

            // ── Product details (volume + fragrance family)
            const details = [
                product.volumeMl
                    ? `      <g:product_detail>\n        <g:section_name>Caractéristiques</g:section_name>\n        <g:attribute_name>Volume</g:attribute_name>\n        <g:attribute_value>${product.volumeMl} ml</g:attribute_value>\n      </g:product_detail>`
                    : '',
                product.family
                    ? `      <g:product_detail>\n        <g:section_name>Caractéristiques</g:section_name>\n        <g:attribute_name>Famille olfactive</g:attribute_name>\n        <g:attribute_value>${escapeXml(product.family)}</g:attribute_value>\n      </g:product_detail>`
                    : '',
            ].filter(Boolean).join('\n');

            // ── Custom labels for Google Ads campaign segmentation
            // label_0 = famille olfactive  |  label_1 = genre
            // label_2 = statut            |  label_3 = tranche de prix
            // label_4 = marque
            const priceRange =
                product.price <= 25 ? 'moins-25' :
                product.price <= 40 ? '25-40' :
                product.price <= 60 ? '40-60' : 'plus-60';

            const statusLabel = product.isBestseller
                ? 'bestseller'
                : product.isNew
                ? 'nouveaute'
                : 'standard';

            return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${mainImage}</g:image_link>
${additionalImages ? additionalImages + '\n' : ''}      <g:price>${formatPrice(product.price)}</g:price>
      <g:availability>${product.stock > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${brandName}</g:brand>
      <g:gender>${gender}</g:gender>
      <g:product_type>Parfums &amp; Cosmétiques &gt; Parfums &gt; Eaux de parfum</g:product_type>
      <g:google_product_category>2915</g:google_product_category>

${details ? details + '\n' : ''}${highlights ? highlights + '\n' : ''}      <g:custom_label_0>${escapeXml(product.family ?? '')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(product.gender ?? 'mixte')}</g:custom_label_1>
      <g:custom_label_2>${statusLabel}</g:custom_label_2>
      <g:custom_label_3>${priceRange}</g:custom_label_3>
      <g:custom_label_4>${brandName}</g:custom_label_4>
${shipping}
    </item>`;
        })
        .join('');

    const now = new Date().toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DubaïNégoce - Parfums Orientaux de Dubaï</title>
    <link>${SITE_URL}</link>
    <description>Boutique en ligne de parfums orientaux de luxe – Lattafa, Maison Alhambra, Fragrance World</description>
    <lastBuildDate>${now}</lastBuildDate>
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
