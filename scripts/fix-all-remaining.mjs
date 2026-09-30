/**
 * Cherche dans TOUT emiratesoud.co.uk + hamidi.ae les produits restants
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
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, timeout: 25000 },
    res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        fetchJson(res.headers.location).then(resolve).catch(reject); return;
      }
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

async function getAllPages(host, collectionPath) {
  let all = [], page = 1;
  while (true) {
    const d = await fetchJson(`https://${host}${collectionPath}?limit=250&page=${page}`);
    if (!d.products || !d.products.length) break;
    all = all.concat(d.products);
    if (d.products.length < 250) break;
    page++; await sleep(400);
  }
  return all;
}

// Récupérer tout emiratesoud.co.uk (toutes collections connues)
console.log('⬇️  Récupération emiratesoud.co.uk (all collections)...');
const ema = await getAllPages('emiratesoud.co.uk', '/collections/maison-alhambra/products.json');
const efw = await getAllPages('emiratesoud.co.uk', '/collections/fragrance-world/products.json');
const efa = await getAllPages('emiratesoud.co.uk', '/collections/french-avenue/products.json');
const eall = await getAllPages('emiratesoud.co.uk', '/collections/all/products.json');

// Hamidi
console.log('⬇️  Récupération hamidi.ae...');
const hamidi = await getAllPages('www.hamidi.ae', '/products.json');

const seen = new Set();
const ALL = [...ema, ...efw, ...efa, ...eall, ...hamidi].filter(p => {
  if (seen.has(p.id)) return false; seen.add(p.id); return true;
});
console.log(`✅ Total unique: ${ALL.length} produits\n`);

// Produits restants à trouver (slug → mot-clés)
const REMAINING = [
  { slug: 'minerva-maison-alhambra',             kws: ['minerva']                        },
  { slug: 'majd-al-sultan-asdaaf',               kws: ['majd', 'sultan']                 },
  { slug: 'francique-107-9-fragrance-world',     kws: ['francique', 'francique 107']     },
  { slug: 'francique-63-55-fragrance-world',     kws: ['francique', 'francique 63']      },
  { slug: 'black-afgano-fragrance-world',        kws: ['afgano', 'black afgano']          },
  { slug: 'tour-de-havana-fragrance-world',      kws: ['havana', 'tour de havana']       },
  { slug: 'tudor-paris-corner',                  kws: ['tudor']                          },
  { slug: 'francique-107-9-french-avenue',       kws: ['francique', 'francique 107']     },
  { slug: 'francique-63-55-french-avenue',       kws: ['francique', 'francique 63']      },
  { slug: 'ithra-mango-ard-al-zaafaran',         kws: ['ithra', 'mango', 'ard mango']   },
  { slug: 'ithra-cotton-candy-ard-al-zaafaran',  kws: ['ithra', 'cotton candy']          },
  { slug: 'vanilla-latte-gulf-orchid',           kws: ['vanilla latte', 'gulf orchid']  },
  { slug: 'omniyat-surrati',                     kws: ['omniyat', 'surrati']             },
  { slug: 'killer-loui-martin',                  kws: ['killer']                         },
  { slug: 'good-girl-by-killer-loui-martin',     kws: ['killer', 'good girl']            },
  { slug: 'verato-white-musk-mirada',            kws: ['verato', 'mirada white']         },
  { slug: 'qandeel-ard-al-zaafaran',             kws: ['qandeel']                        },
  { slug: 'mirada-perla-mirada',                 kws: ['mirada perla', 'perla']          },
  { slug: 'fondue-tropical-hamidi',              kws: ['fondue tropical']                },
];

let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;

for (const item of REMAINING) {
  // Chercher dans tous les produits
  let sp = null;
  for (const kw of item.kws) {
    sp = ALL.find(p => p.title.toLowerCase().includes(kw.toLowerCase()));
    if (sp) break;
  }

  if (!sp) {
    console.log(`❌ Non trouvé: ${item.slug}`);
    continue;
  }

  const imgUrl = sp.images?.[0]?.src;
  if (!imgUrl) { console.log(`⚠️  Pas d'image: ${sp.title}`); continue; }

  // Trouver la ligne images dans data.ts
  let lineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"slug": "${item.slug}"`)) {
      for (let j = i; j < Math.min(i + 60, lines.length); j++) {
        if (lines[j].includes('"images"') && lines[j].includes('http')) {
          lineIdx = j; break;
        }
      }
      break;
    }
  }

  if (lineIdx === -1) {
    console.log(`💾 Déjà local ou slug introuvable: ${item.slug}`);
    continue;
  }

  const localFilename = `${item.slug}.png`;
  const localPath = path.join(IMAGES_DIR, localFilename);
  const localUrl  = `/images-parfums/${localFilename}`;

  console.log(`🔍 "${item.slug}" → "${sp.title}"`);
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

const remaining = (lines.join('\n').match(/"images":\s*\["https?:/g) || []).length;
console.log(`\n📊 Images externes restantes: ${remaining}`);
const nonLocal = [];
lines.forEach((line, i) => {
  if (line.includes('"images"') && line.includes('http'))
    nonLocal.push(`  L.${i+1}: ${line.trim().substring(0,80)}`);
});
if (nonLocal.length) { console.log('\nRestantes:'); nonLocal.forEach(l => console.log(l)); }
