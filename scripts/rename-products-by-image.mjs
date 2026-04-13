/**
 * Renomme le champ "name" de chaque produit pour qu'il corresponde
 * exactement au nom du fichier image (sans extension, slug → titre).
 *
 * Ex: /images-parfums/ajwad-lattafa.webp
 *  → slug: ajwad-lattafa
 *  → name: "Ajwad Lattafa"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE  = path.join(__dirname, '..', 'src', 'lib', 'data.ts');

/** Convertit un slug en titre lisible: "ajwad-lattafa" → "Ajwad Lattafa" */
function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function main() {
  console.log('📖 Lecture de data.ts...\n');
  const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
  let updated = 0;

  // Parcourir les lignes : chercher "images": ["/images-parfums/xxx.webp"]
  // puis remonter pour trouver la ligne "name": "..." dans le même bloc
  // et la remplacer.

  for (let i = 0; i < lines.length; i++) {
    const imgMatch = lines[i].match(/"images"\s*:\s*\["\/images-parfums\/([^"]+\.(webp|jpg|png))"\]/);
    if (!imgMatch) continue;

    const filename  = imgMatch[1];                       // ajwad-lattafa.webp
    const slugRaw   = filename.replace(/\.(webp|jpg|png)$/, ''); // ajwad-lattafa
    const newName   = slugToTitle(slugRaw);              // Ajwad Lattafa

    // Remonter pour trouver la ligne "name": "..." (max 100 lignes en arrière)
    let found = false;
    for (let j = i - 1; j >= Math.max(0, i - 100); j--) {
      const nameLine = lines[j];

      // Détecter début de bloc (ligne avec juste "{")
      if (/^\s*\{?\s*$/.test(nameLine) && nameLine.trim() === '{') break;

      if (/"name"\s*:\s*"[^"]+"/.test(nameLine)) {
        const oldName = nameLine.match(/"name"\s*:\s*"([^"]+)"/)?.[1];
        lines[j] = nameLine.replace(/"name"\s*:\s*"[^"]+"/, `"name": "${newName}"`);
        updated++;
        console.log(`  ✅ "${oldName}"  →  "${newName}"`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`  ⚠️  Image ${filename} — ligne name non trouvée`);
    }
  }

  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Produits renommés : ${updated}`);
  console.log('📝 data.ts sauvegardé.');
}

main();
