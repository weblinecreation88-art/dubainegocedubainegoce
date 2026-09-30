import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getProducts, getColissimoCost, getMondialRelayCost } from '../src/lib/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://dubainegoce.fr';

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

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

function estimateWeightGrams(volumeMl: number): number {
    return Math.round(volumeMl * 2.5 + 100);
}

function formatPrice(price: number): string {
    return `${price.toFixed(2)} EUR`;
}

// ─── Generate feed ───────────────────────────────────────────────────────────

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
        const weightGrams = estimateWeightGrams(product.volumeMl ?? 100);

        const title = escapeXml(
            `${product.name}${product.volumeMl ? ` ${product.volumeMl}ml` : ''}`
        );

        const description = escapeXml(
            (product.shortDescription ?? product.name).replace(/<[^>]*>/g, '')
        );

        const colissimoPrice    = formatPrice(getColissimoCost(weightGrams));
        const mondialRelayPrice = formatPrice(getMondialRelayCost(weightGrams));

        const additionalImages = (product.images.slice(1, 10) ?? [])
            .map((img) => `      <g:additional_image_link>${escapeXml(toAbsoluteUrl(img))}</g:additional_image_link>`)
            .join('\n');

        const allNotes = [
            ...(product.topNotes ?? []),
            ...(product.heartNotes ?? []),
            ...(product.baseNotes ?? []),
        ];
        const highlights = allNotes
            .slice(0, 10)
            .map((note) => `      <g:product_highlight>${escapeXml(note)}</g:product_highlight>`)
            .join('\n');

        const details = [
            product.volumeMl
                ? `      <g:product_detail>\n        <g:section_name>Caractéristiques</g:section_name>\n        <g:attribute_name>Volume</g:attribute_name>\n        <g:attribute_value>${product.volumeMl} ml</g:attribute_value>\n      </g:product_detail>`
                : '',
            product.family
                ? `      <g:product_detail>\n        <g:section_name>Caractéristiques</g:section_name>\n        <g:attribute_name>Famille olfactive</g:attribute_name>\n        <g:attribute_value>${escapeXml(product.family)}</g:attribute_value>\n      </g:product_detail>`
                : '',
        ].filter(Boolean).join('\n');

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
      <g:identifier_exists>false</g:identifier_exists>
${details ? details + '\n' : ''}${highlights ? highlights + '\n' : ''}      <g:custom_label_0>${escapeXml(product.family ?? '')}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(product.gender ?? 'mixte')}</g:custom_label_1>
      <g:custom_label_2>${statusLabel}</g:custom_label_2>
      <g:custom_label_3>${priceRange}</g:custom_label_3>
      <g:custom_label_4>${brandName}</g:custom_label_4>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Colissimo Domicile</g:service>
        <g:price>${colissimoPrice}</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Mondial Relay Point Relais</g:service>
        <g:price>${mondialRelayPrice}</g:price>
      </g:shipping>
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

// Écrire dans public/ (servi statiquement) et à la racine
const publicPath = join(__dirname, '..', 'public', 'google-feed.xml');
const rootPath   = join(__dirname, '..', 'google-feed.xml');

writeFileSync(publicPath, xml, 'utf-8');
writeFileSync(rootPath,   xml, 'utf-8');

console.log(`Feed Google Merchant genere avec succes !`);
console.log(`public/google-feed.xml : ${publicPath}`);
console.log(`google-feed.xml        : ${rootPath}`);
console.log(`Produits exportes      : ${validProducts.length} / ${products.length}`);
