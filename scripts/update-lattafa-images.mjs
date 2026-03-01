/**
 * Script: update-lattafa-images.mjs (v3)
 * Scrape lattafa-usa.com → télécharge images → met à jour data.ts via numéro de ligne
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE = path.join(ROOT, 'src', 'lib', 'data.ts');

// ─── HTTP Helpers ─────────────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      timeout: 20000,
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchJson(res.headers.location).then(resolve).catch(reject); return;
      }
      let d = ''; res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { resolve({}); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject); return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Matching ─────────────────────────────────────────────────────────────────

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\blattafa\b/gi, '')
    .replace(/\bpride\b/gi, '')
    .replace(/\bmixte\b/gi, '')
    .replace(/\b\d+\s*ml\b/gi, '')
    .replace(/\b(3\s*pcs?|gift\s*set|set|all\s*over\s*spray|perfume\s*mist|air\s*freshner|bundle|collection|deo|spray|elixir)\b/gi, '')
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (na === nb) return 1.0;
  if (na.startsWith(nb) && nb.length > 4) return 0.93;
  if (nb.startsWith(na) && na.length > 4) return 0.93;
  if (na.includes(nb) && nb.length > 4) return 0.85;
  if (nb.includes(na) && na.length > 4) return 0.85;
  const wa = na.split(' ').filter(w => w.length > 2);
  const wb = nb.split(' ').filter(w => w.length > 2);
  const inter = wa.filter(w => wb.includes(w));
  const union = new Set([...wa, ...wb]);
  if (union.size === 0) return 0;
  return inter.length / union.size;
}

function findBestMatch(productName, shopifyProducts) {
  let best = null, bestScore = 0;
  for (const sp of shopifyProducts) {
    // Exclure gift sets, sprays, etc. sauf si le produit cherché en est un
    const isVariant = /gift\s*set|3\s*pcs|bundle|spray|mist|freshner|deo|collection\s+\d/i.test(sp.title);
    if (isVariant) continue;
    const score = similarity(productName, sp.title);
    if (score > bestScore) { bestScore = score; best = sp; }
  }
  return bestScore >= 0.45 ? { product: best, score: bestScore } : null;
}

// ─── Parsing line-by-line de data.ts ──────────────────────────────────────────

function extractLattafaProducts(lines) {
  const products = [];
  let currentName = null;
  let currentSlug = null;
  let isLattafa = false;
  let imagesFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const nameMatch = line.match(/"name":\s*"([^"]+)"/);
    if (nameMatch) {
      currentName = nameMatch[1];
      currentSlug = null;
      isLattafa = false;
      imagesFound = false;
    }

    if (currentName && !currentSlug) {
      const slugMatch = line.match(/"slug":\s*"([^"]+)"/);
      if (slugMatch) currentSlug = slugMatch[1];
    }

    if (currentName && !isLattafa) {
      if (line.includes("brands.find(b => b.name === 'Lattafa')")) isLattafa = true;
    }

    if (currentName && isLattafa && currentSlug && !imagesFound) {
      const imgMatch = line.match(/"images":\s*(\[[^\]]+\])/);
      if (imgMatch) {
        imagesFound = true;
        const urlMatches = [...imgMatch[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
        products.push({
          name: currentName,
          slug: currentSlug,
          images: urlMatches,
          lineIndex: i,       // ← numéro de ligne exact dans data.ts
          originalLine: line, // ← ligne originale pour remplacement précis
        });
      }
    }
  }

  return products;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Mise à jour des images Lattafa (v3 - remplacement par numéro de ligne)');
  console.log('📡 Source: lattafa-usa.com\n');

  // 1. Shopify API
  console.log('⬇️  Récupération des produits Shopify...');
  let shopifyProducts = [];
  let page = 1;
  while (true) {
    const data = await fetchJson(
      `https://www.lattafa-usa.com/collections/all/products.json?limit=250&page=${page}`
    );
    if (!data.products || data.products.length === 0) break;
    shopifyProducts = shopifyProducts.concat(data.products);
    if (data.products.length < 250) break;
    page++;
    await sleep(500);
  }
  console.log(`✅ ${shopifyProducts.length} produits Shopify récupérés\n`);

  // 2. Lire data.ts
  const rawContent = fs.readFileSync(DATA_FILE, 'utf8');
  let lines = rawContent.split('\n');
  const lattafaProducts = extractLattafaProducts(lines);
  console.log(`✅ ${lattafaProducts.length} produits Lattafa dans data.ts\n`);

  const results = { updated: [], notFound: [], errors: [] };

  // 3. Traiter chaque produit
  for (const product of lattafaProducts) {
    const hasLocal = product.images[0]?.startsWith('/images-parfums/');
    const icon = hasLocal ? '💾' : '🌐';

    const match = findBestMatch(product.name, shopifyProducts);

    if (!match) {
      console.log(`${icon} ❌ No match: "${product.name}"`);
      results.notFound.push(product.name);
      continue;
    }

    const sp = match.product;
    const imgUrl = sp.images?.[0]?.src;
    if (!imgUrl) {
      console.log(`${icon} ⚠️  No img: "${product.name}"`);
      results.notFound.push(product.name);
      continue;
    }

    console.log(`${icon} [${(match.score * 100).toFixed(0)}%] "${product.name}" → "${sp.title}"`);

    const localFilename = `${product.slug}.png`;
    const localPath = path.join(IMAGES_DIR, localFilename);
    const localUrl = `/images-parfums/${localFilename}`;

    try {
      await downloadFile(imgUrl, localPath);

      // ✅ Remplacement direct par numéro de ligne
      const oldLine = lines[product.lineIndex];
      const newLine = oldLine.replace(/"images":\s*\[[^\]]+\]/, `"images": ["${localUrl}"]`);

      if (newLine !== oldLine) {
        lines[product.lineIndex] = newLine;
        results.updated.push({ name: product.name, to: localUrl, line: product.lineIndex + 1 });
        console.log(`   ✅ Ligne ${product.lineIndex + 1} mise à jour → ${localUrl}`);
      } else {
        console.log(`   ⚠️  Ligne inchangée (déjà à jour?) ligne ${product.lineIndex + 1}`);
      }

      await sleep(250);
    } catch (err) {
      console.log(`   ❌ ${err.message}`);
      results.errors.push({ name: product.name, error: err.message });
    }
  }

  // 4. Sauvegarder data.ts
  if (results.updated.length > 0) {
    fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
    console.log(`\n💾 data.ts sauvegardé — ${results.updated.length} lignes modifiées`);
  }

  // 5. Rapport
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT');
  console.log('='.repeat(60));
  console.log(`✅ Mis à jour: ${results.updated.length}`);
  console.log(`❌ Sans match: ${results.notFound.length}`);
  console.log(`⚠️  Erreurs:   ${results.errors.length}`);

  if (results.updated.length > 0) {
    console.log('\n📋 Mis à jour:');
    results.updated.forEach(r => console.log(`   L.${r.line} ✓ ${r.name}`));
  }
  if (results.notFound.length > 0) {
    console.log('\n🔍 Non trouvés (pas dans lattafa-usa.com):');
    results.notFound.forEach(n => console.log(`   - ${n}`));
  }
  if (results.errors.length > 0) {
    console.log('\n❌ Erreurs:');
    results.errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`));
  }
}

main().catch(err => { console.error('💥', err); process.exit(1); });
