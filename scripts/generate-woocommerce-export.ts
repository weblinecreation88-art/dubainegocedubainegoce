import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getProducts } from '../src/lib/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_URL = 'https://dubainegoce.fr';

// Charger le mapping Cloudinary
const mappingPath = join(__dirname, '..', 'cloudinary_mapping.json');
const cloudinaryMapping: Record<string, string> = JSON.parse(readFileSync(mappingPath, 'utf-8'));

// Résoudre l'URL image : Cloudinary si dispo, sinon URL absolue
const resolveImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Extraire le nom de fichier sans extension
    const filename = imagePath.split('/').pop() ?? '';
    const nameNoExt = filename.replace(/\.[^.]+$/, '');
    if (cloudinaryMapping[nameNoExt]) return cloudinaryMapping[nameNoExt];
    return `${APP_URL}${imagePath}`;
};
const TODAY = '2026-03-01 00:00:00';

const products = getProducts();

// Échapper une valeur pour CSV : entoure de guillemets et double les guillemets internes
const csv = (val: string | number | undefined | null): string => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
};

const headers = [
    'post_title', 'post_name', 'post_parent', 'ID', 'post_content', 'post_excerpt',
    'post_status', 'post_password', 'menu_order', 'post_date', 'post_author', 'comment_status',
    'sku', 'parent_sku', 'children', 'downloadable', 'virtual', 'stock',
    'regular_price', 'sale_price', 'weight', 'length', 'width', 'height',
    'tax_class', 'visibility', 'stock_status', 'backorders', 'sold_individually',
    'low_stock_amount', 'manage_stock', 'tax_status', 'upsell_ids', 'crosssell_ids',
    'purchase_note', 'sale_price_dates_from', 'sale_price_dates_to', 'download_limit',
    'download_expiry', 'product_url', 'button_text', 'images', 'downloadable_files',
    'product_page_url', 'meta:total_sales', 'meta:_global_unique_id',
    'tax:product_brand', 'tax:product_type', 'tax:product_visibility',
    'tax:product_cat', 'tax:product_tag', 'tax:product_shipping_class', 'tax:pos_product_visibility'
];

const rows: string[] = [headers.join(',')];

for (const p of products) {
    // Image URL Cloudinary
    const imageUrl = resolveImageUrl(p.images?.[0] ?? '');

    // Tags: "Brand,Family"
    const brandName = p.brand?.name ?? '';
    const family = p.family ?? '';
    const tagValue = brandName && family ? `${brandName},${family}` : (brandName || family);

    const fields = [
        csv(p.name),                                          // post_title
        csv(p.slug),                                          // post_name
        '',                                                   // post_parent
        csv(p.id),                                            // ID
        csv(p.longDescription ?? p.shortDescription ?? ''),   // post_content
        csv(p.shortDescription ?? ''),                        // post_excerpt
        'publish',                                            // post_status
        '',                                                   // post_password
        '0',                                                  // menu_order
        csv(TODAY),                                           // post_date
        '1',                                                  // post_author
        'open',                                               // comment_status
        csv(p.slug),                                          // sku
        '',                                                   // parent_sku
        '',                                                   // children
        'no',                                                 // downloadable
        'no',                                                 // virtual
        '',                                                   // stock
        csv(p.price ?? 35),                                   // regular_price
        '',                                                   // sale_price
        '',                                                   // weight
        '',                                                   // length
        '',                                                   // width
        '',                                                   // height
        '',                                                   // tax_class
        '',                                                   // visibility
        'instock',                                            // stock_status
        'no',                                                 // backorders
        'no',                                                 // sold_individually
        '',                                                   // low_stock_amount
        'no',                                                 // manage_stock
        'taxable',                                            // tax_status
        '',                                                   // upsell_ids
        '',                                                   // crosssell_ids
        '',                                                   // purchase_note
        '',                                                   // sale_price_dates_from
        '',                                                   // sale_price_dates_to
        '0',                                                  // download_limit
        "'-1",                                                // download_expiry
        '',                                                   // product_url
        '',                                                   // button_text
        csv(imageUrl),                                        // images
        '',                                                   // downloadable_files
        csv(`${APP_URL}/parfum/${p.slug}/`),                  // product_page_url
        '0',                                                  // meta:total_sales
        '',                                                   // meta:_global_unique_id
        '',                                                   // tax:product_brand
        'simple',                                             // tax:product_type
        '',                                                   // tax:product_visibility
        csv(family),                                          // tax:product_cat
        csv(tagValue),                                        // tax:product_tag
        'perfume',                                            // tax:product_shipping_class
        '',                                                   // tax:pos_product_visibility
    ];

    rows.push(fields.join(','));
}

const outputPath = join(__dirname, '..', 'woocommerce_products_export.csv');
writeFileSync(outputPath, rows.join('\n'), 'utf-8');

console.log(`✅ CSV WooCommerce généré avec succès !`);
console.log(`📄 Fichier : ${outputPath}`);
console.log(`📊 Produits exportés : ${products.length}`);
