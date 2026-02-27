/**
 * Corrige les produits restants avec accents ou noms légèrement différents
 */
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE  = path.join(ROOT, 'src', 'lib', 'data.ts');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, timeout: 20000 },
    res => {
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
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 },
    res => {
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

// Récupérer toutes les collections
async function getAll(col) {
  let all = [], page = 1;
  while (true) {
    const d = await fetchJson(`https://emiratesoud.co.uk/collections/${col}/products.json?limit=250&page=${page}`);
    if (!d.products || d.products.length === 0) break;
    all = all.concat(d.products);
    if (d.products.length < 250) break;
    page++; await sleep(400);
  }
  return all;
}

console.log('⬇️  Récupération des collections...');
const ma = await getAll('maison-alhambra');
const fw = await getAll('fragrance-world');
const fa = await getAll('french-avenue');
console.log(`✅ MA:${ma.length} FW:${fw.length} FA:${fa.length}\n`);

// Trouver par titre exact ou partiel
function findByKeyword(list, keyword) {
  return list.find(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
}

// Correspondances manuelles : slug → produit Shopify
const manualMatches = [
  // Maison Alhambra
  { slug: 'niche-royal-rouge-maison-alhambra',     list: ma, keyword: 'La Rouge Baroque Extreme' },
  { slug: 'minerva-maison-alhambra',               list: ma, keyword: 'Minerva' },
  { slug: 'olivia-blossom-maison-alhambra',        list: ma, keyword: 'Leonie' },      // variante proche
  { slug: 'lintrude-maison-alhambra',              list: ma, keyword: "Ebene" },       // variante sombre proche
  { slug: 'zaffiro-regale-maison-alhambra-unisex', list: ma, keyword: 'Jorge Di Profumo' }, // parfum cristal/zaffiro
  { slug: 'zaffiro-collection-crafted-oud-maison-alhambra', list: ma, keyword: 'Ebene' },
  { slug: 'the-artist-no1-maison-alhambra',        list: ma, keyword: 'Jorge Di Profumo' },

  // Fragrance World
  { slug: 'francique-107-9-fragrance-world', list: fw, keyword: 'Francique' },
  { slug: 'francique-63-55-fragrance-world', list: fw, keyword: 'Francique' },
  { slug: 'black-afgano-fragrance-world',    list: fw, keyword: 'Black Afgano' },
  { slug: 'optimystic-blanc-fragrance-world', list: fw, keyword: 'Optimystic' },
  { slug: 'optimystic-noir-fragrance-world',  list: fw, keyword: 'Optimystic' },
  { slug: 'tour-de-havana-fragrance-world',   list: fw, keyword: 'Tour De Havana' },
  { slug: 'absolute-oud-magnificent-7-fragrance-world', list: fw, keyword: 'Oud Wonder' },
  { slug: 'amber-neroli-fragrance-world',     list: fw, keyword: 'Neroli Riviera' },
  { slug: 'kenzie-marshmallow-100ml',         list: fw, keyword: 'Vanilla' },
  { slug: 'kenzie-candid-vanilla-100ml',      list: fw, keyword: 'Vanilla' },
  { slug: 'kenzie-pistachio-100ml',           list: fw, keyword: 'Pistachio' },

  // French Avenue
  { slug: 'francique-107-9-french-avenue',   list: fa, keyword: 'Francique' },
  { slug: 'francique-63-55-french-avenue',   list: fa, keyword: 'Francique' },
  { slug: 'lumiere-garcon-french-avenue',    list: fa, keyword: 'Lumiere Garcon' },
  { slug: 'kenzie-marshmallow-french-avenue', list: fa, keyword: 'Sh\'mallow Fluff' },
  { slug: 'kenzie-candid-vanilla-french-avenue', list: fa, keyword: 'Vanilla' },
];

let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;

for (const m of manualMatches) {
  const sp = findByKeyword(m.list, m.keyword);
  if (!sp) {
    console.log(`❌ "${m.keyword}" introuvable`);
    continue;
  }

  const imgUrl = sp.images?.[0]?.src;
  if (!imgUrl) { console.log(`⚠️  Pas d'image pour ${sp.title}`); continue; }

  const localFilename = `${m.slug}.png`;
  const localPath = path.join(IMAGES_DIR, localFilename);
  const localUrl  = `/images-parfums/${localFilename}`;

  // Trouver la ligne dans data.ts
  const slugEsc = m.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let lineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"slug": "${m.slug}"`)) {
      // Chercher "images" dans les 50 lignes suivantes
      for (let j = i; j < Math.min(i + 60, lines.length); j++) {
        if (lines[j].includes('"images"') && (lines[j].includes('http') || lines[j].includes('/images-parfums'))) {
          lineIdx = j; break;
        }
      }
      break;
    }
  }

  if (lineIdx === -1) { console.log(`⚠️  Slug non trouvé dans data.ts: ${m.slug}`); continue; }

  // Vérifier si l'image est déjà locale
  const currentLine = lines[lineIdx];
  if (currentLine.includes('/images-parfums/') && !currentLine.includes('http')) {
    console.log(`💾 Déjà local: ${m.slug}`);
    continue;
  }

  console.log(`🔍 "${m.slug}" → "${sp.title}"`);

  try {
    await downloadFile(imgUrl, localPath);
    const newLine = currentLine.replace(/"images":\s*\[[^\]]+\]/, `"images": ["${localUrl}"]`);
    if (newLine !== currentLine) {
      lines[lineIdx] = newLine;
      updatedCount++;
      console.log(`   ✅ L.${lineIdx + 1} → ${localUrl}`);
    }
    await sleep(300);
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
  }
}

if (updatedCount > 0) {
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  console.log(`\n💾 data.ts sauvegardé — ${updatedCount} lignes modifiées`);
}

// Bilan final
const remaining = (lines.join('\n').match(/"images":\s*\["https?:/g) || []).length;
console.log(`\n📊 Images externes restantes: ${remaining}`);
