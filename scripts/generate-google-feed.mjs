/**
 * Script de génération du flux Google Merchant Center
 * Usage: node scripts/generate-google-feed.mjs
 * Génère: google-feed.xml (à uploader sur partnerupload.google.com:19321 via SFTP)
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const SITE_URL = 'https://dubainegoce.fr';

// ─── Données produits (copiées depuis data.ts) ────────────────────────────────
const brandMap = {
    'Lattafa': 'Lattafa',
    'Maison Alhambra': 'Maison Alhambra',
    'Fragrance World': 'Fragrance World',
    'Paris Corner': 'Paris Corner',
    'Jean Couturier': 'Jean Couturier',
    'French Avenue': 'French Avenue',
    'PriveZarah': 'PriveZarah',
    'Asdaaf': 'Asdaaf',
    'Nasomatto': 'Nasomatto',
};

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
}

function mapGender(gender) {
    switch (gender) {
        case 'homme': return 'male';
        case 'femme': return 'female';
        default: return 'unisex';
    }
}

// Import dynamique des données depuis data.ts compilé
// On lit directement le fichier JS compilé ou on utilise tsx
import { createRequire } from 'module';

// Charge les données depuis le fichier data compilé
// Fallback : on re-déclare les produits ici depuis data.ts
// Pour éviter la dépendance TypeScript, utiliser: npx tsx scripts/generate-google-feed.mjs

let products = [];

try {
    // Tente de charger via tsx (si disponible)
    const dataModule = await import('../src/lib/data.ts').catch(() => null);
    if (dataModule) {
        products = dataModule.getProducts ? dataModule.getProducts() : [];
        console.log(`✅ Données chargées depuis data.ts: ${products.length} produits`);
    }
} catch (e) {
    console.error('❌ Impossible de charger data.ts directement. Utilise: npx tsx scripts/generate-google-feed.mjs');
    process.exit(1);
}

// Filtre les produits sans prix
const validProducts = products.filter(p => p.price && p.price > 0);
console.log(`📦 Produits valides avec prix: ${validProducts.length}`);

const items = validProducts.map(product => {
    const image = product.images?.[0] ?? '';
    const productUrl = `${SITE_URL}/parfum/${product.slug}`;
    const priceFormatted = `${Number(product.price).toFixed(2)} EUR`;
    const brand = product.brand?.name ?? 'DubaïNégoce';
    const gender = mapGender(product.gender ?? 'mixte');
    const title = escapeXml(product.name);
    const description = escapeXml(
        stripHtml(product.shortDescription ?? product.name).substring(0, 5000)
    );
    const availability = 'in_stock'; // Toujours en stock pour Google Merchant
    const condition = 'new';

    return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:price>${priceFormatted}</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
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
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Mondial Relay</g:service>
        <g:price>4.10 EUR</g:price>
      </g:shipping>
    </item>`;
}).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DubaïNégoce - Parfums Orientaux</title>
    <link>${SITE_URL}</link>
    <description>Boutique en ligne de parfums orientaux de luxe - DubaïNégoce</description>
${items}
  </channel>
</rss>`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'google-feed.xml');
writeFileSync(outputPath, xml, 'utf-8');

console.log(`\n✅ Flux généré avec succès!`);
console.log(`📄 Fichier: ${outputPath}`);
console.log(`📊 Nombre de produits: ${validProducts.length}`);
console.log(`\n📤 Pour uploader sur Google SFTP:`);
console.log(`   Serveur: partnerupload.google.com`);
console.log(`   Port: 19321`);
console.log(`   Fichier local: google-feed.xml`);
console.log(`\n   Commande PowerShell WinSCP (à adapter avec vos identifiants):`);
console.log(`   winscp.com /command "open sftp://VOTRE_LOGIN:VOTRE_MOT_DE_PASSE@partnerupload.google.com:19321" "put google-feed.xml /" "exit"`);
