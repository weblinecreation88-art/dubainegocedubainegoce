/**
 * Scraping ciblé des images manquantes pour :
 * Maison Alhambra, French Avenue, Lattafa, Paris Corner, Asdaaf
 *
 * Stratégies de recherche (par ordre) :
 *  1. URL directe via le slug du produit
 *  2. Recherche par nom + marque
 *  3. Recherche par nom seul
 *  4. Page de marque (pagination)
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import http  from 'http';
import { URL } from 'url';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images-parfums');
const DATA_FILE  = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
const DELAY_MS   = 900;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9',
};

// Slugs de pages de marques sur parfumstore.ma
const BRAND_PAGES = {
  'Maison Alhambra': 'maison-alhambra',
  'Lattafa':         'lattafa',
  'French Avenue':   'french-avenue',
  'Paris Corner':    'paris-corner',
  'Asdaaf':          'asdaaf',
};

// ─── 43 produits cibles ───────────────────────────────────────────────────────
const TARGETS = [
  { name: "Fakhar Black",             brand: "Lattafa",         slug: "fakhar-black-lattafa" },
  { name: "Fakhar Rose Gold",         brand: "Lattafa",         slug: "fakhar-rose-gold-lattafa" },
  { name: "Confidential Platinum",    brand: "Lattafa",         slug: "confidential-platinum-lattafa" },
  { name: "Fakhar Wasam",             brand: "Lattafa",         slug: "fakhar-wasam-lattafa" },
  { name: "Grise",                    brand: "Maison Alhambra", slug: "grise-maison-alhambra" },
  { name: "Safwaan L'autre Musk",     brand: "Lattafa",         slug: "safwaan-lautre-musk-lattafa" },
  { name: "Velvet Oud",               brand: "Lattafa",         slug: "velvet-oud-lattafa" },
  { name: "Safwaan L'autre Oud",      brand: "Lattafa",         slug: "safwaan-lautre-oud-lattafa" },
  { name: "My Rose Sublime",          brand: "Lattafa",         slug: "my-rose-sublime-lattafa" },
  { name: "Infini Oud",               brand: "Maison Alhambra", slug: "infini-oud-maison-alhambra-mixte" },
  { name: "Minerva",                  brand: "Maison Alhambra", slug: "minerva-maison-alhambra" },
  { name: "Al Noble Safeer",          brand: "Lattafa",         slug: "al-noble-safeer-lattafa" },
  { name: "Tabac",                    brand: "Maison Alhambra", slug: "tabac-maison-alhambra" },
  { name: "Niche Royal Rouge",        brand: "Maison Alhambra", slug: "niche-royal-rouge-maison-alhambra" },
  { name: "Al Noble Wazeer",          brand: "Lattafa",         slug: "al-noble-wazeer-lattafa" },
  { name: "Galatea",                  brand: "Maison Alhambra", slug: "galatea-maison-alhambra" },
  { name: "Hercules",                 brand: "Maison Alhambra", slug: "hercules-maison-alhambra" },
  { name: "Olivia Blossom",           brand: "Maison Alhambra", slug: "olivia-blossom-maison-alhambra" },
  { name: "Majd Al Sultan",           brand: "Asdaaf",          slug: "majd-al-sultan-asdaaf" },
  { name: "Pure Oudi",                brand: "Lattafa",         slug: "pure-oudi-lattafa" },
  { name: "Oud Mood Reminiscence",    brand: "Lattafa",         slug: "oud-mood-reminiscence-lattafa" },
  { name: "Musk Mood",                brand: "Lattafa",         slug: "musk-mood-lattafa-mixte" },
  { name: "Côme Moiselle",            brand: "Maison Alhambra", slug: "come-moiselle-maison-alhambra" },
  { name: "L'Intrude",                brand: "Maison Alhambra", slug: "lintrude-maison-alhambra" },
  { name: "By Saffron",               brand: "Maison Alhambra", slug: "by-saffron-maison-alhambra" },
  { name: "Lovely Chèrie",            brand: "Maison Alhambra", slug: "lovely-cherie-maison-alhambra" },
  { name: "Victorioso Victory",       brand: "Maison Alhambra", slug: "victorioso-victory-maison-alhambra" },
  { name: "Musk Vanille",             brand: "Maison Alhambra", slug: "musk-vanille-maison-alhambra" },
  { name: "Tudor",                    brand: "Paris Corner",    slug: "tudor-paris-corner" },
  { name: "Zaffiro Regale",           brand: "Maison Alhambra", slug: "zaffiro-regale-maison-alhambra" },
  { name: "The Artist No.1",          brand: "Maison Alhambra", slug: "the-artist-no1-maison-alhambra" },
  { name: "Zaffiro Collection Crafted Oud", brand: "Maison Alhambra", slug: "zaffiro-collection-crafted-oud-maison-alhambra" },
  { name: "Francique 107.9",          brand: "French Avenue",   slug: "francique-107-9-french-avenue" },
  { name: "Francique 63.55",          brand: "French Avenue",   slug: "francique-63-55-french-avenue" },
  { name: "Irida Extrait",            brand: "French Avenue",   slug: "irida-extrait-french-avenue" },
  { name: "Lumière Garçon",           brand: "French Avenue",   slug: "lumiere-garcon-french-avenue" },
  { name: "Azzure Aoud",              brand: "French Avenue",   slug: "azzure-aoud-french-avenue" },
  { name: "Kenzie Marshmallow",       brand: "French Avenue",   slug: "kenzie-marshmallow-french-avenue" },
  { name: "Kenzie Candid Vanilla",    brand: "French Avenue",   slug: "kenzie-candid-vanilla-french-avenue" },
  { name: "L'Immensité",              brand: "Maison Alhambra", slug: "limmensite-maison-alhambra" },
  { name: "Eclair",                   brand: "Lattafa",         slug: "eclair-lattafa-100ml" },
  { name: "Azzure Aoud (2)",          brand: "French Avenue",   slug: "azzure-aoud-100ml" },
  { name: "Zaffiro Regale (2)",       brand: "Maison Alhambra", slug: "zaffiro-regale-maison-alhambra-unisex" },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.get({ hostname: u.hostname, path: u.pathname + u.search, headers: HEADERS, timeout: 15000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchHtml(res.headers.location).then(resolve).catch(reject); return;
      }
      let d = ''; res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.get({ hostname: u.hostname, path: u.pathname + u.search, headers: { ...HEADERS, Accept: 'image/*' }, timeout: 20000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, filepath).then(resolve).catch(reject); return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const f = fs.createWriteStream(filepath);
      res.pipe(f);
      f.on('finish', () => f.close(resolve));
      f.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractMainImage(html) {
  const all = [...html.matchAll(/src="(https:\/\/parfumstore\.ma\/wp-content\/uploads\/[^"]+\.(?:webp|jpg|jpeg|png))"/g)]
    .map(m => m[1])
    .filter(u => !u.includes('logo') && !u.includes('download-') && !/-\d+x\d+\./.test(u) && !u.includes('note-') && !u.includes('parfumstore.ma-logo'));
  return all[0] || null;
}

// ─── Recherche sur parfumstore.ma ─────────────────────────────────────────────

async function tryDirectSlug(productSlug) {
  // Essayer des variantes de slug courants sur le site
  const variants = [
    `https://parfumstore.ma/produit/${productSlug}/`,
    // parfois le slug du site est juste le nom du produit
  ];
  for (const url of variants) {
    try {
      const html = await fetchHtml(url);
      if (html.includes('wp-content/uploads') && !html.includes('Page not found') && !html.includes('404')) {
        return { url, html };
      }
    } catch {}
  }
  return null;
}

async function trySearch(name, brand) {
  const queries = [
    `${name} ${brand}`,
    name,
    name.replace(/['']/g, ''),
  ];
  for (const q of queries) {
    try {
      const html = await fetchHtml(`https://parfumstore.ma/?s=${encodeURIComponent(q)}&post_type=product`);
      const match = html.match(/href="(https:\/\/parfumstore\.ma\/produit\/[^"\/]+\/?)"/);
      if (match) {
        await sleep(400);
        const productHtml = await fetchHtml(match[1]);
        return { url: match[1], html: productHtml };
      }
    } catch {}
    await sleep(300);
  }
  return null;
}

async function tryBrandPage(name, brand) {
  const brandSlug = BRAND_PAGES[brand];
  if (!brandSlug) return null;

  // Chercher sur les premières pages de la marque
  for (let page = 1; page <= 5; page++) {
    const url = page === 1
      ? `https://parfumstore.ma/${brandSlug}/`
      : `https://parfumstore.ma/${brandSlug}/page/${page}/`;
    try {
      const html = await fetchHtml(url);
      // Chercher un lien produit qui contient le nom
      const nameSlug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const productLinks = [...html.matchAll(/href="(https:\/\/parfumstore\.ma\/produit\/([^"\/]+)\/)"/g)];
      for (const [, productUrl, productSlug] of productLinks) {
        if (productSlug.includes(nameSlug) || nameSlug.split('-').filter(w => w.length > 3).every(w => productSlug.includes(w))) {
          await sleep(400);
          const productHtml = await fetchHtml(productUrl);
          return { url: productUrl, html: productHtml };
        }
      }
      // Si pas trouvé sur cette page et moins de 10 produits, on arrête
      if (!html.includes('nav-links') && page > 1) break;
    } catch {}
    await sleep(500);
  }
  return null;
}

// ─── Mise à jour de data.ts ───────────────────────────────────────────────────
function updateDataTs(productSlug, localPath) {
  const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${productSlug}"`)) {
      // Chercher "images" dans les 200 lignes suivantes
      for (let j = i + 1; j < Math.min(i + 200, lines.length); j++) {
        if (/"images"\s*:\s*\[/.test(lines[j])) {
          lines[j] = lines[j].replace(/"images"\s*:\s*\[[^\]]*\]/, `"images": ["${localPath}"]`);
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
  }
  if (updated) fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  return updated;
}

// Aussi mettre à jour le "name" pour les produits mis à jour
function updateProductName(productSlug, newName) {
  const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
  let updated = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${productSlug}"`)) {
      // Remonter pour trouver "name"
      for (let j = i - 1; j >= Math.max(0, i - 20); j--) {
        if (/"name"\s*:\s*"[^"]+"/.test(lines[j])) {
          lines[j] = lines[j].replace(/"name"\s*:\s*"[^"]+"/, `"name": "${newName}"`);
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
  }
  if (updated) fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  return updated;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function processTarget(t, idx, total) {
  const { name, brand, slug } = t;

  // Vérifier si déjà présent
  const ext = ['webp','jpg','jpeg','png'];
  for (const e of ext) {
    if (fs.existsSync(path.join(OUTPUT_DIR, `${slug}.${e}`))) {
      console.log(`[${idx}/${total}] ⏭  DÉJÀ PRÉSENT: ${name}`);
      return { ...t, status: 'skipped' };
    }
  }

  console.log(`[${idx}/${total}] 🔍 ${name} (${brand})...`);

  let result = null;

  // Stratégie 1 : slug direct
  result = await tryDirectSlug(slug);
  await sleep(300);

  // Stratégie 2 : recherche texte
  if (!result) {
    result = await trySearch(name, brand);
    await sleep(300);
  }

  // Stratégie 3 : page de marque
  if (!result) {
    result = await tryBrandPage(name, brand);
  }

  if (!result) {
    console.log(`[${idx}/${total}] ❌ NON TROUVÉ: ${name}`);
    return { ...t, status: 'not_found' };
  }

  const imageUrl = extractMainImage(result.html);
  if (!imageUrl) {
    console.log(`[${idx}/${total}] ⚠️  PAS D'IMAGE: ${name} — ${result.url}`);
    return { ...t, status: 'no_image', url: result.url };
  }

  const fileExt = imageUrl.split('.').pop().split('?')[0];
  const filename = `${slug}.${fileExt}`;
  const filepath = path.join(OUTPUT_DIR, filename);
  const localPath = `/images-parfums/${filename}`;

  try {
    await downloadImage(imageUrl, filepath);
  } catch (e) {
    console.log(`[${idx}/${total}] 💥 ERREUR DL: ${name} — ${e.message}`);
    return { ...t, status: 'error', error: e.message };
  }

  // Mettre à jour data.ts
  const slugToTitle = s => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const newName = slugToTitle(slug);
  updateDataTs(slug, localPath);
  updateProductName(slug, newName);

  console.log(`[${idx}/${total}] ✅ ${name}  →  ${filename}`);
  return { ...t, status: 'ok', file: filename, imageUrl };
}

async function main() {
  console.log(`\n🚀 Scraping de ${TARGETS.length} produits manquants\n`);
  console.log(`📁 Destination: ${OUTPUT_DIR}\n${'─'.repeat(60)}`);

  const results = [];
  for (let i = 0; i < TARGETS.length; i++) {
    const r = await processTarget(TARGETS[i], i + 1, TARGETS.length);
    results.push(r);
    if (r.status !== 'skipped') await sleep(DELAY_MS);
  }

  const ok       = results.filter(r => r.status === 'ok');
  const skipped  = results.filter(r => r.status === 'skipped');
  const notFound = results.filter(r => r.status === 'not_found');
  const errors   = results.filter(r => r.status === 'error' || r.status === 'no_image');

  console.log(`\n${'═'.repeat(60)}\n📊 RAPPORT FINAL`);
  console.log(`✅ Téléchargés   : ${ok.length}`);
  console.log(`⏭  Déjà présents : ${skipped.length}`);
  console.log(`❌ Non trouvés   : ${notFound.length}`);
  console.log(`💥 Erreurs       : ${errors.length}`);

  if (notFound.length) {
    console.log('\n❌ Non trouvés :');
    notFound.forEach(r => console.log(`   - ${r.name} (${r.brand})`));
  }

  const reportPath = path.join(OUTPUT_DIR, '_rapport-missing.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Rapport: ${reportPath}`);
}

main().catch(console.error);
