/**
 * Télécharge directement les images restantes depuis frenchavenue.fr
 * (elles sont valides, il faut juste les rendre locales)
 */
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE  = path.join(ROOT, 'src', 'lib', 'data.ts');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.get({
      hostname: u.hostname, path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.frenchavenue.fr/',
      },
      timeout: 30000,
    }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject); return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} for ${url}`)); return; }
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

// Lire data.ts et extraire les produits avec images frenchavenue.fr
let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;

// Identifier les lignes avec des images frenchavenue.fr ou cloudinary
const externalLines = [];
lines.forEach((line, i) => {
  if (line.includes('"images"') && (line.includes('frenchavenue.fr') || line.includes('cloudinary.com'))) {
    // Extraire l'URL(s) de l'image
    const urls = [...line.matchAll(/"(https?:\/\/[^"]+)"/g)].map(m => m[1]);
    externalLines.push({ lineIdx: i, urls, line });
  }
});

// Trouver le slug correspondant pour nommer le fichier
function findSlugForLine(lines, lineIdx) {
  // Chercher vers le haut pour trouver le slug
  for (let i = lineIdx; i >= Math.max(0, lineIdx - 60); i--) {
    const m = lines[i].match(/"slug":\s*"([^"]+)"/);
    if (m) return m[1];
  }
  return null;
}

console.log(`📋 ${externalLines.length} lignes avec images externes trouvées\n`);

for (const item of externalLines) {
  const slug = findSlugForLine(lines, item.lineIdx);
  if (!slug) { console.log(`⚠️  Pas de slug pour L.${item.lineIdx + 1}`); continue; }

  // Prendre la première URL valide
  const imgUrl = item.urls[0];
  if (!imgUrl) continue;

  // Extension du fichier source
  const ext = imgUrl.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || 'jpg';
  const localFilename = `${slug}.${ext}`;
  const localPath = path.join(IMAGES_DIR, localFilename);
  const localUrl  = `/images-parfums/${localFilename}`;

  console.log(`⬇️  L.${item.lineIdx + 1} [${slug}]`);
  console.log(`   Depuis: ${imgUrl.substring(0, 80)}`);

  try {
    await downloadFile(imgUrl, localPath);

    // Vérifier que le fichier a été téléchargé (taille > 1KB)
    const stat = fs.statSync(localPath);
    if (stat.size < 1000) {
      fs.unlinkSync(localPath);
      console.log(`   ⚠️  Fichier trop petit (${stat.size} bytes) - ignoré`);
      continue;
    }

    // Remplacer dans data.ts
    const newLine = item.line.replace(/"images":\s*\[[^\]]+\]/, `"images": ["${localUrl}"]`);
    if (newLine !== item.line) {
      lines[item.lineIdx] = newLine;
      updatedCount++;
      console.log(`   ✅ → ${localUrl} (${(stat.size/1024).toFixed(0)}KB)`);
    }
    await sleep(400);
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
  }
}

if (updatedCount > 0) {
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  console.log(`\n💾 data.ts sauvegardé — ${updatedCount} lignes modifiées`);
}

// Bilan
const remaining = (lines.join('\n').match(/"images":\s*\["https?:/g) || []).length;
console.log(`\n📊 Images externes restantes: ${remaining}`);
if (remaining > 0) {
  lines.forEach((line, i) => {
    if (line.includes('"images"') && line.includes('http'))
      console.log(`  L.${i+1}: ${line.trim().substring(0, 90)}`);
  });
}
