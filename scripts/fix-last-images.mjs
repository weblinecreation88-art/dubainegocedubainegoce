/**
 * Cherche dans TOUTES les collections emiratesoud.co.uk les produits manquants
 * (peu importe la marque dans data.ts)
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
    https.get({ hostname: u.hostname, path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, timeout: 20000 },
    res => {
      let d = ''; res.setEncoding('utf8');
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    }).on('error', reject).on('timeout', () => { reject(new Error('Timeout')); });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({ hostname: u.hostname, path: u.pathname + u.search,
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
    }).on('error', reject).on('timeout', () => { reject(new Error('Timeout')); });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getAll(col) {
  let all = [], page = 1;
  while (true) {
    const d = await fetchJson(`https://emiratesoud.co.uk/collections/${col}/products.json?limit=250&page=${page}`);
    if (!d.products || !d.products.length) break;
    all = all.concat(d.products);
    if (d.products.length < 250) break;
    page++; await sleep(400);
  }
  return all;
}

console.log('⬇️  Récupération de toutes les collections...');
const ma = await getAll('maison-alhambra');
const fw = await getAll('fragrance-world');
const fa = await getAll('french-avenue');
const ALL = [...ma, ...fw, ...fa];
// dédupliquer par id
const seen = new Set();
const allUniq = ALL.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
console.log(`✅ Total unique: ${allUniq.length} produits\n`);

// Correspondances manuelles pour les restants
// slug → mot-clé de recherche dans emiratesoud
const MANUAL = [
  // Fragrance World
  { slug: 'tour-de-havana-fragrance-world',        kw: 'havana'          },
  { slug: 'black-afgano-fragrance-world',           kw: 'afgano'          },
  { slug: 'francique-107-9-fragrance-world',        kw: 'francique'       },
  { slug: 'francique-63-55-fragrance-world',        kw: 'francique'       },
  { slug: 'kenzie-pistachio-100ml',                 kw: 'pistachio'       },
  // French Avenue
  { slug: 'francique-107-9-french-avenue',          kw: 'francique'       },
  { slug: 'francique-63-55-french-avenue',          kw: 'francique'       },
  // Maison Alhambra
  { slug: 'minerva-maison-alhambra',                kw: 'minerva'         },
  // Autres marques
  { slug: 'majd-al-sultan-asdaaf',                  kw: 'majd'            },
  { slug: 'tudor-paris-corner',                     kw: 'tudor'           },
  { slug: 'tempete-jacques-yves',                   kw: 'tempete'         },
  { slug: 'ithra-mango-ard-al-zaafaran',            kw: 'mango'           },
  { slug: 'ithra-cotton-candy-ard-al-zaafaran',     kw: 'cotton candy'    },
  { slug: 'vanilla-latte-gulf-orchid',              kw: 'vanilla latte'   },
  { slug: 'fleur-de-coton-sublime',                 kw: 'fleur'           },
  { slug: 'omniyat-surrati',                        kw: 'omniyat'         },
  { slug: 'killer-loui-martin',                     kw: 'killer'          },
  { slug: 'good-girl-by-killer-loui-martin',        kw: 'killer'          },
  { slug: 'verato-white-musk-mirada',               kw: 'white musk'      },
  { slug: 'qandeel-ard-al-zaafaran',                kw: 'qandeel'         },
  { slug: 'mirada-perla-mirada',                    kw: 'mirada'          },
  { slug: 'fondue-tropical-hamidi',                 kw: 'fondue'          },
];

let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;

for (const m of MANUAL) {
  // Chercher dans le catalogue
  const sp = allUniq.find(p => p.title.toLowerCase().includes(m.kw.toLowerCase()));

  if (!sp) {
    console.log(`❌ "${m.kw}" — introuvable sur emiratesoud.co.uk`);
    continue;
  }

  const imgUrl = sp.images?.[0]?.src;
  if (!imgUrl) { console.log(`⚠️  Pas d'image: ${sp.title}`); continue; }

  // Trouver la ligne dans data.ts
  let lineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"slug": "${m.slug}"`)) {
      for (let j = i; j < Math.min(i + 60, lines.length); j++) {
        if (lines[j].includes('"images"') && lines[j].includes('http')) {
          lineIdx = j; break;
        }
      }
      break;
    }
  }

  if (lineIdx === -1) {
    console.log(`💾 Pas d'image externe pour slug: ${m.slug} (déjà local ou non trouvé)`);
    continue;
  }

  const localFilename = `${m.slug}.png`;
  const localPath = path.join(IMAGES_DIR, localFilename);
  const localUrl  = `/images-parfums/${localFilename}`;

  console.log(`🔍 "${m.slug}" → "${sp.title}"`);
  try {
    await downloadFile(imgUrl, localPath);
    const newLine = lines[lineIdx].replace(/"images":\s*\[[^\]]+\]/, `"images": ["${localUrl}"]`);
    if (newLine !== lines[lineIdx]) {
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
console.log(`\n📊 Images externes restantes dans data.ts: ${remaining}`);

const nonLocal = [];
lines.forEach((line, i) => {
  if (line.includes('"images"') && line.includes('http')) {
    nonLocal.push(`  L.${i+1}: ${line.trim().substring(0, 90)}`);
  }
});
if (nonLocal.length) {
  console.log('\nRestantes:');
  nonLocal.forEach(l => console.log(l));
}
