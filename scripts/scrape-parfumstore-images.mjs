/**
 * Script de scraping des images depuis parfumstore.ma
 * Pour chaque parfum de data.ts, cherche l'image sur le site et la télécharge.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images-parfums');
const DELAY_MS = 800; // délai entre requêtes pour ne pas surcharger le serveur
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
};

// Liste des 143 parfums (nom, marque)
const PARFUMS = [
  { name: 'Woody Oud', brand: 'Maison Alhambra' },
  { name: 'The Tux', brand: 'Maison Alhambra' },
  { name: 'Ramz Silver', brand: 'Lattafa' },
  { name: 'Ramz Gold', brand: 'Lattafa' },
  { name: 'Raghba', brand: 'Lattafa' },
  { name: "Qaa'ed", brand: 'Lattafa' },
  { name: 'Ana Abiyedh Rouge', brand: 'Lattafa' },
  { name: 'Fakhar Black', brand: 'Lattafa' },
  { name: 'Fakhar Rose Gold', brand: 'Lattafa' },
  { name: 'Ejaazi', brand: 'Lattafa' },
  { name: 'Yeah', brand: 'Maison Alhambra' },
  { name: 'Maahir', brand: 'Lattafa' },
  { name: 'Confidential Platinum', brand: 'Lattafa' },
  { name: 'Asad', brand: 'Lattafa' },
  { name: 'Fakhar Wasam', brand: 'Lattafa' },
  { name: 'Glacier Pour Homme', brand: 'Maison Alhambra' },
  { name: 'Grise', brand: 'Maison Alhambra' },
  { name: "Safwaan L'autre Musk", brand: 'Lattafa' },
  { name: 'Badee Al Oud', brand: 'Lattafa' },
  { name: 'Oud Mood', brand: 'Lattafa' },
  { name: 'Velvet Oud', brand: 'Lattafa' },
  { name: 'Ana Abiyedh', brand: 'Lattafa' },
  { name: "Safwaan L'autre Oud", brand: 'Lattafa' },
  { name: 'My Rose Sublime', brand: 'Lattafa' },
  { name: 'Toscano Leather', brand: 'Maison Alhambra' },
  { name: 'Jean Lowe Matiere', brand: 'Maison Alhambra' },
  { name: 'Glacier Le Noir', brand: 'Maison Alhambra' },
  { name: 'Infini Oud', brand: 'Maison Alhambra' },
  { name: 'La Vita Bella', brand: 'Maison Alhambra' },
  { name: 'Minerva', brand: 'Maison Alhambra' },
  { name: 'Kismet for Women', brand: 'Maison Alhambra' },
  { name: 'Perseus', brand: 'Maison Alhambra' },
  { name: 'Al Noble Safeer', brand: 'Lattafa' },
  { name: 'Versencia Crystal', brand: 'Maison Alhambra' },
  { name: 'Ameer Al Oudh Intense Oud', brand: 'Lattafa' },
  { name: 'Najdia', brand: 'Lattafa' },
  { name: 'Ajwad', brand: 'Lattafa' },
  { name: 'Salvo Intense', brand: 'Maison Alhambra' },
  { name: 'Maahir Black Edition', brand: 'Lattafa' },
  { name: 'Tabac', brand: 'Maison Alhambra' },
  { name: 'Kismet Moscow', brand: 'Maison Alhambra' },
  { name: 'Niche Royal Rouge', brand: 'Maison Alhambra' },
  { name: 'Al Noble Wazeer', brand: 'Lattafa' },
  { name: 'Galatea', brand: 'Maison Alhambra' },
  { name: 'Avant', brand: 'Maison Alhambra' },
  { name: 'Opera Noir', brand: 'Maison Alhambra' },
  { name: 'Hercules', brand: 'Maison Alhambra' },
  { name: 'Olivia Blossom', brand: 'Maison Alhambra' },
  { name: 'Majd Al Sultan', brand: 'Asdaaf' },
  { name: 'Maahir Legacy', brand: 'Lattafa' },
  { name: 'Pure Oudi', brand: 'Lattafa' },
  { name: 'Oud Mood Reminiscence', brand: 'Lattafa' },
  { name: 'Musk Mood', brand: 'Lattafa' },
  { name: 'Sakeena', brand: 'Lattafa' },
  { name: 'Mayar', brand: 'Lattafa' },
  { name: 'Andaleeb', brand: 'Asdaaf' },
  { name: 'So Candid', brand: 'Maison Alhambra' },
  { name: 'Come Moiselle', brand: 'Maison Alhambra' },
  { name: 'Jean Lowe Nouveau', brand: 'Maison Alhambra' },
  { name: 'Jean Lowe Ombre', brand: 'Maison Alhambra' },
  { name: 'Kismet Angel', brand: 'Maison Alhambra' },
  { name: 'Tharwah Gold', brand: 'Lattafa' },
  { name: 'A King', brand: 'Fragrance World' },
  { name: 'K King', brand: 'Fragrance World' },
  { name: 'J', brand: 'Fragrance World' },
  { name: 'Queen Q', brand: 'Fragrance World' },
  { name: 'Pose As Rose', brand: 'Fragrance World' },
  { name: 'Dark As Wood', brand: 'Fragrance World' },
  { name: 'Jorge Di Profumo', brand: 'Maison Alhambra' },
  { name: 'Porto Neroli', brand: 'Maison Alhambra' },
  { name: "L'Intrude", brand: 'Maison Alhambra' },
  { name: 'Confidential Private Gold', brand: 'Lattafa' },
  { name: 'Francique 107.9', brand: 'Fragrance World' },
  { name: 'Karat', brand: 'Maison Alhambra' },
  { name: 'Eternal Oud', brand: 'Lattafa' },
  { name: 'Francique 63.55', brand: 'Fragrance World' },
  { name: 'Infini Rose', brand: 'Maison Alhambra' },
  { name: 'By Saffron', brand: 'Maison Alhambra' },
  { name: 'Lovely Cherie', brand: 'Maison Alhambra' },
  { name: 'Rose Petals', brand: 'Maison Alhambra' },
  { name: 'Fresh as Citrus', brand: 'Fragrance World' },
  { name: 'Victorioso Victory', brand: 'Maison Alhambra' },
  { name: 'Baroque Rouge Extrait', brand: 'Maison Alhambra' },
  { name: 'Musk Vanille', brand: 'Maison Alhambra' },
  { name: 'Jean Lowe Immortal', brand: 'Maison Alhambra' },
  { name: 'Black Afgano', brand: 'Fragrance World' },
  { name: 'Optimystic Blanc', brand: 'Fragrance World' },
  { name: 'Optimystic Noir', brand: 'Fragrance World' },
  { name: 'Mocha Wood', brand: 'Fragrance World' },
  { name: 'Tour De Havana', brand: 'Fragrance World' },
  { name: 'Extreme Aoud', brand: 'Fragrance World' },
  { name: 'Absolute Oud Magnificent 7', brand: 'Fragrance World' },
  { name: 'Intro Aftermath', brand: 'Fragrance World' },
  { name: 'Pure Passion', brand: 'Fragrance World' },
  { name: 'Cuir Leather', brand: 'Fragrance World' },
  { name: 'Invicto', brand: 'Fragrance World' },
  { name: 'Tudor', brand: 'Paris Corner' },
  { name: 'Oud Highness', brand: 'PriveZarah' },
  { name: 'Zaffiro Regale', brand: 'Maison Alhambra' },
  { name: 'Cocktail Intense', brand: 'Fragrance World' },
  { name: 'Teriaq', brand: 'Lattafa' },
  { name: 'Tempete', brand: 'Jacques Yves' },
  { name: 'The Artist No.1', brand: 'Maison Alhambra' },
  { name: 'Spectre Ghost', brand: 'Fragrance World' },
  { name: 'Zaffiro Collection Crafted Oud', brand: 'Maison Alhambra' },
  { name: 'Suits', brand: 'Fragrance World' },
  { name: 'Jean Lowe Noir', brand: 'Maison Alhambra' },
  { name: 'Yara', brand: 'Lattafa' },
  { name: 'Amber Neroli', brand: 'Fragrance World' },
  { name: 'Tobacco Touch', brand: 'Maison Alhambra' },
  { name: 'Irida Extrait', brand: 'French Avenue' },
  { name: 'Aether Extrait', brand: 'French Avenue' },
  { name: 'Lumiere Garcon', brand: 'French Avenue' },
  { name: 'Lumiere Elle', brand: 'French Avenue' },
  { name: 'Sweet Paradise', brand: 'French Avenue' },
  { name: 'Royal Blend Nero', brand: 'French Avenue' },
  { name: 'Azzure Aoud', brand: 'French Avenue' },
  { name: 'After Effect', brand: 'French Avenue' },
  { name: 'Glorious Oud', brand: 'French Avenue' },
  { name: 'Kenzie Marshmallow', brand: 'French Avenue' },
  { name: 'Kenzie Candid Vanilla', brand: 'French Avenue' },
  { name: 'Liquid Brun', brand: 'French Avenue' },
  { name: 'Eclair', brand: 'Lattafa' },
  { name: 'Pistachio', brand: 'Ard Al Zaafaran' },
  { name: 'Ithra Mango', brand: 'Ard Al Zaafaran' },
  { name: 'Ithra Cotton Candy', brand: 'Ard Al Zaafaran' },
  { name: 'Vanilla Latte', brand: 'Gulf Orchid' },
  { name: 'Yara Candy', brand: 'Lattafa' },
  { name: 'Yara Moi', brand: 'Lattafa' },
  { name: 'Fleur de Coton', brand: 'Sublime' },
  { name: 'Bint Hooran Rose Passion', brand: 'Ard Al Zaafaran' },
  { name: "L'Immensité", brand: 'Maison Alhambra' },
  { name: 'Omniyat', brand: 'Surrati' },
  { name: 'Killer', brand: 'Loui Martin' },
  { name: 'Good Girl by Killer', brand: 'Loui Martin' },
  { name: 'Verato White Musk', brand: 'MIRADA' },
  { name: 'Leonie', brand: 'Maison Alhambra' },
  { name: 'Qandeel', brand: 'Ard Al Zaafaran' },
  { name: 'Mirada Perla', brand: 'MIRADA' },
  { name: 'Fondue Tropical', brand: 'Hamidi' },
  { name: 'Kenzie Pistachio', brand: 'Fragrance World' },
];

// ─── Utilitaires ────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // supprime accents
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const lib = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: HEADERS,
      timeout: 15000,
    };
    const req = lib.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchHtml(res.headers.location).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const lib = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: { ...HEADERS, 'Accept': 'image/webp,image/png,image/jpeg,*/*' },
      timeout: 20000,
    };
    const req = lib.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ─── Logique principale ──────────────────────────────────────────────────────

async function searchProductUrl(name, brand) {
  const query = encodeURIComponent(`${name} ${brand}`);
  const searchUrl = `https://parfumstore.ma/?s=${query}&post_type=product`;
  const html = await fetchHtml(searchUrl);

  // Extraire le premier lien produit
  const match = html.match(/href="(https:\/\/parfumstore\.ma\/produit\/[^"\/]+\/?)"/);
  if (match) return match[1];

  // Essai avec juste le nom
  const query2 = encodeURIComponent(name);
  const searchUrl2 = `https://parfumstore.ma/?s=${query2}&post_type=product`;
  const html2 = await fetchHtml(searchUrl2);
  const match2 = html2.match(/href="(https:\/\/parfumstore\.ma\/produit\/[^"\/]+\/?)"/);
  return match2 ? match2[1] : null;
}

function extractMainImage(html) {
  // Chercher les images wp-content/uploads sans suffixe de taille (-300x300, -700x700, etc.)
  const allImages = [...html.matchAll(/src="(https:\/\/parfumstore\.ma\/wp-content\/uploads\/[^"]+\.(?:webp|jpg|jpeg|png))"/g)]
    .map(m => m[1]);

  // Filtrer : exclure logo, thumbnails et images avec suffixe de taille
  const productImages = allImages.filter(url => {
    if (url.includes('logo') || url.includes('parfumstore.ma-logo')) return false;
    if (url.includes('download-')) return false;
    if (/-\d+x\d+\./.test(url)) return false; // exclure -700x700 etc.
    if (url.includes('note-')) return false; // exclure les notes olfactives
    return true;
  });

  return productImages[0] || null;
}

async function processParfum(parfum, index, total) {
  const { name, brand } = parfum;
  const slug = slugify(`${brand}-${name}`);

  // Vérifier si déjà téléchargé
  const extensions = ['webp', 'jpg', 'jpeg', 'png'];
  for (const ext of extensions) {
    const existingPath = path.join(OUTPUT_DIR, `${slug}.${ext}`);
    if (fs.existsSync(existingPath)) {
      console.log(`[${index}/${total}] ⏭  DÉJÀ PRÉSENT: ${name} (${brand})`);
      return { name, brand, status: 'skipped', file: existingPath };
    }
  }

  try {
    // 1. Trouver la page produit
    const productUrl = await searchProductUrl(name, brand);
    if (!productUrl) {
      console.log(`[${index}/${total}] ❌ NON TROUVÉ: ${name} (${brand})`);
      return { name, brand, status: 'not_found' };
    }

    await sleep(400);

    // 2. Récupérer le HTML de la page produit
    const productHtml = await fetchHtml(productUrl);

    // 3. Extraire l'image principale
    const imageUrl = extractMainImage(productHtml);
    if (!imageUrl) {
      console.log(`[${index}/${total}] ⚠️  PAS D'IMAGE: ${name} — ${productUrl}`);
      return { name, brand, status: 'no_image', url: productUrl };
    }

    // 4. Déterminer l'extension
    const ext = imageUrl.split('.').pop().split('?')[0];
    const filename = `${slug}.${ext}`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // 5. Télécharger
    await downloadImage(imageUrl, filepath);
    console.log(`[${index}/${total}] ✅ OK: ${name} (${brand}) → ${filename}`);
    return { name, brand, status: 'ok', file: filename, imageUrl };

  } catch (err) {
    console.log(`[${index}/${total}] ❌ ERREUR: ${name} (${brand}) — ${err.message}`);
    return { name, brand, status: 'error', error: err.message };
  }
}

async function main() {
  // Créer le dossier de sortie
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Dossier créé: ${OUTPUT_DIR}`);
  }

  const results = [];
  const total = PARFUMS.length;

  console.log(`\n🚀 Démarrage du scraping de ${total} parfums depuis parfumstore.ma\n`);
  console.log(`📁 Destination: ${OUTPUT_DIR}\n`);
  console.log('─'.repeat(60));

  for (let i = 0; i < PARFUMS.length; i++) {
    const result = await processParfum(PARFUMS[i], i + 1, total);
    results.push(result);

    if (result.status !== 'skipped') {
      await sleep(DELAY_MS);
    }
  }

  // Rapport final
  console.log('\n' + '═'.repeat(60));
  console.log('📊 RAPPORT FINAL');
  console.log('═'.repeat(60));

  const ok = results.filter(r => r.status === 'ok');
  const skipped = results.filter(r => r.status === 'skipped');
  const notFound = results.filter(r => r.status === 'not_found');
  const noImage = results.filter(r => r.status === 'no_image');
  const errors = results.filter(r => r.status === 'error');

  console.log(`✅ Téléchargés  : ${ok.length}`);
  console.log(`⏭  Déjà présents: ${skipped.length}`);
  console.log(`❌ Non trouvés  : ${notFound.length}`);
  console.log(`⚠️  Sans image   : ${noImage.length}`);
  console.log(`💥 Erreurs      : ${errors.length}`);
  console.log(`📦 Total        : ${total}`);

  if (notFound.length > 0) {
    console.log('\n⚠️  Parfums non trouvés:');
    notFound.forEach(r => console.log(`   - ${r.name} (${r.brand})`));
  }
  if (noImage.length > 0) {
    console.log('\n⚠️  Parfums sans image:');
    noImage.forEach(r => console.log(`   - ${r.name} (${r.brand}) → ${r.url}`));
  }

  // Sauvegarder le rapport JSON
  const reportPath = path.join(OUTPUT_DIR, '_rapport.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);
}

main().catch(console.error);
