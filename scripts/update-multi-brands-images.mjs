/**
 * update-multi-brands-images.mjs
 * Scrape emiratesoud.co.uk (Shopify) → télécharge images → met à jour data.ts
 * Marques: Maison Alhambra, Fragrance World, French Avenue
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE  = path.join(ROOT, 'src', 'lib', 'data.ts');

// ─── Collections à scraper ────────────────────────────────────────────────────
const COLLECTIONS = [
  { slug: 'maison-alhambra',  brand: 'Maison Alhambra' },
  { slug: 'fragrance-world',  brand: 'Fragrance World'  },
  { slug: 'french-avenue',    brand: 'French Avenue'    },
];

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      timeout: 25000,
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        fetchJson(res.headers.location).then(resolve).catch(reject); return;
      }
      let d = ''; res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
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
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000,
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Normalisation pour matching ──────────────────────────────────────────────
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\bmaison\s+alhambra\b/gi, '')
    .replace(/\bfragrance\s+world\b/gi, '')
    .replace(/\bfrench\s+avenue\b/gi, '')
    .replace(/\bby\s+fragrance\s+world\b/gi, '')
    .replace(/\b(perfume|edp|eau\s+de\s+parfum|extrait|de\s+parfum)\b/gi, '')
    .replace(/\b\d+\s*ml\b/gi, '')
    .replace(/\b(3\s*pcs?|gift\s*set|set|all\s*over\s*spray|mist|bundle|sample|deo)\b/gi, '')
    .replace(/[''`'']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a, b) {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (na === nb) return 1.0;
  if (na.length > 3 && nb === na) return 1.0;
  if (na.startsWith(nb) && nb.length > 4) return 0.92;
  if (nb.startsWith(na) && na.length > 4) return 0.92;
  if (na.includes(nb) && nb.length > 5) return 0.85;
  if (nb.includes(na) && na.length > 5) return 0.85;
  const wa = na.split(' ').filter(w => w.length > 2);
  const wb = nb.split(' ').filter(w => w.length > 2);
  if (!wa.length || !wb.length) return 0;
  const inter = wa.filter(w => wb.includes(w));
  const union = new Set([...wa, ...wb]);
  return inter.length / union.size;
}

function findBestMatch(productName, shopifyProducts) {
  let best = null, bestScore = 0;
  for (const sp of shopifyProducts) {
    // Ignorer les variants (gift set, sample, spray, mist...)
    if (/\b(gift\s*set|\d\s*pcs|sample|spray|mist)\b/i.test(sp.title)) continue;
    const score = similarity(productName, sp.title);
    if (score > bestScore) { bestScore = score; best = sp; }
  }
  return bestScore >= 0.45 ? { product: best, score: bestScore } : null;
}

// ─── Parsing de data.ts ligne par ligne ───────────────────────────────────────
function extractProductsWithExternalImages(lines, targetBrands) {
  const products = [];
  let name = null, slug = null, brand = null, imagesFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const nm = line.match(/"name":\s*"([^"]+)"/);
    if (nm) { name = nm[1]; slug = null; brand = null; imagesFound = false; }

    if (name && !slug) {
      const sl = line.match(/"slug":\s*"([^"]+)"/);
      if (sl) slug = sl[1];
    }

    if (name && !brand) {
      const br = line.match(/brands\.find\(b => b\.name === '([^']+)'\)/);
      if (br) brand = br[1];
    }

    if (name && brand && slug && !imagesFound) {
      const im = line.match(/"images":\s*(\[[^\]]+\])/);
      if (im) {
        imagesFound = true;
        const isTargetBrand = targetBrands.includes(brand);
        const urls = [...im[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
        const hasExternal = urls.some(u => u.startsWith('http'));

        if (isTargetBrand && hasExternal) {
          products.push({ name, slug, brand, images: urls, lineIndex: i });
        }
      }
    }
  }
  return products;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Mise à jour images multi-marques');
  console.log('📡 Source: emiratesoud.co.uk\n');

  // 1. Récupérer tous les produits des 3 collections
  const allShopify = {};
  for (const col of COLLECTIONS) {
    console.log(`⬇️  Récupération ${col.brand}...`);
    let products = [], page = 1;
    while (true) {
      const d = await fetchJson(
        `https://emiratesoud.co.uk/collections/${col.slug}/products.json?limit=250&page=${page}`
      );
      if (!d.products?.length) break;
      products = products.concat(d.products);
      if (d.products.length < 250) break;
      page++;
      await sleep(400);
    }
    allShopify[col.brand] = products;
    console.log(`   ✅ ${products.length} produits trouvés`);
  }
  console.log();

  // 2. Lire data.ts
  let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
  const targetBrands = COLLECTIONS.map(c => c.brand);
  const products = extractProductsWithExternalImages(lines, targetBrands);
  console.log(`📋 ${products.length} produits avec images externes trouvés dans data.ts\n`);

  products.forEach(p =>
    console.log(`   🌐 [${p.brand}] ${p.name} → ${p.images[0]?.substring(0, 55)}`)
  );
  console.log();

  const results = { updated: [], notFound: [], errors: [] };

  // 3. Traiter chaque produit
  for (const product of products) {
    const shopifyList = allShopify[product.brand] || [];
    const match = findBestMatch(product.name, shopifyList);

    if (!match) {
      console.log(`❌ No match: [${product.brand}] "${product.name}"`);
      results.notFound.push(`[${product.brand}] ${product.name}`);
      continue;
    }

    const sp = match.product;
    const imgUrl = sp.images?.[0]?.src;
    if (!imgUrl) {
      console.log(`⚠️  No image: "${product.name}"`);
      results.notFound.push(`[${product.brand}] ${product.name}`);
      continue;
    }

    console.log(`[${(match.score*100).toFixed(0)}%] "${product.name}" → "${sp.title}"`);

    const localFilename = `${product.slug}.png`;
    const localPath = path.join(IMAGES_DIR, localFilename);
    const localUrl  = `/images-parfums/${localFilename}`;

    try {
      await downloadFile(imgUrl, localPath);

      // Remplacement direct par numéro de ligne
      const oldLine = lines[product.lineIndex];
      const newLine = oldLine.replace(/"images":\s*\[[^\]]+\]/, `"images": ["${localUrl}"]`);

      if (newLine !== oldLine) {
        lines[product.lineIndex] = newLine;
        results.updated.push({ name: product.name, brand: product.brand, to: localUrl, line: product.lineIndex + 1 });
        console.log(`   ✅ L.${product.lineIndex + 1} → ${localUrl}`);
      } else {
        console.log(`   ⚠️  Ligne inchangée (L.${product.lineIndex + 1})`);
      }

      await sleep(300);
    } catch (err) {
      console.log(`   ❌ ${err.message}`);
      results.errors.push({ name: product.name, error: err.message });
    }
  }

  // 4. Sauvegarder
  if (results.updated.length > 0) {
    fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
    console.log(`\n💾 data.ts sauvegardé — ${results.updated.length} lignes modifiées`);
  }

  // 5. Rapport
  console.log('\n' + '='.repeat(65));
  console.log('📊 RAPPORT FINAL');
  console.log('='.repeat(65));
  console.log(`✅ Mis à jour:  ${results.updated.length}`);
  console.log(`❌ Sans match:  ${results.notFound.length}`);
  console.log(`⚠️  Erreurs:    ${results.errors.length}`);

  if (results.updated.length > 0) {
    console.log('\n📋 Mis à jour:');
    results.updated.forEach(r =>
      console.log(`   L.${r.line} [${r.brand}] ✓ ${r.name}`)
    );
  }
  if (results.notFound.length > 0) {
    console.log('\n🔍 Sans match:');
    results.notFound.forEach(n => console.log(`   - ${n}`));
  }
  if (results.errors.length > 0) {
    console.log('\n❌ Erreurs:');
    results.errors.forEach(e => console.log(`   - ${e.name}: ${e.error}`));
  }

  // Bilan final des images externes restantes
  const finalContent = lines.join('\n');
  const remaining = (finalContent.match(/"images":\s*\["https?:/g) || []).length;
  console.log(`\n📊 Images externes restantes dans data.ts: ${remaining}`);
}

main().catch(err => { console.error('💥', err); process.exit(1); });
