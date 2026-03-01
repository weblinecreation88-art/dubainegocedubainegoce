/**
 * Renomme les fichiers images locaux pour qu'ils correspondent
 * exactement au slug du produit dans data.ts.
 * Met à jour le champ "images" en conséquence.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE  = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images-parfums');

function main() {
  console.log('📖 Lecture de data.ts...\n');
  const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');

  let renamed  = 0;
  let skipped  = 0;
  let noImage  = 0;

  // On parcourt les lignes et on regroupe : slug + images par produit
  // Stratégie : quand on trouve "slug": "...", on mémorise le slug,
  // quand on trouve "images": ["/images-parfums/..."], on fait le rename.

  let currentSlug = null;

  for (let i = 0; i < lines.length; i++) {
    const slugMatch = lines[i].match(/"slug"\s*:\s*"([^"]+)"/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      continue;
    }

    const imgMatch = lines[i].match(/"images"\s*:\s*\["(\/images-parfums\/([^"]+))"\]/);
    if (imgMatch && currentSlug) {
      const currentRelPath = imgMatch[1];            // /images-parfums/lattafa-ramz-silver.webp
      const currentFilename = imgMatch[2];           // lattafa-ramz-silver.webp
      const ext = path.extname(currentFilename);     // .webp
      const newFilename = `${currentSlug}${ext}`;   // ramz-silver-lattafa.webp
      const newRelPath  = `/images-parfums/${newFilename}`;

      if (currentFilename === newFilename) {
        // Déjà bien nommé
        skipped++;
        console.log(`  ⏭  ${currentFilename} (déjà correct)`);
        currentSlug = null;
        continue;
      }

      const oldPath = path.join(IMAGES_DIR, currentFilename);
      const newPath = path.join(IMAGES_DIR, newFilename);

      if (!fs.existsSync(oldPath)) {
        noImage++;
        console.log(`  ❌ Fichier introuvable: ${currentFilename}`);
        currentSlug = null;
        continue;
      }

      // Renommer le fichier physique
      fs.renameSync(oldPath, newPath);

      // Mettre à jour la ligne dans data.ts
      lines[i] = lines[i].replace(currentRelPath, newRelPath);

      renamed++;
      console.log(`  ✅ ${currentFilename}  →  ${newFilename}`);
      currentSlug = null;
    }
  }

  // Sauvegarder data.ts
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Renommés      : ${renamed}`);
  console.log(`⏭  Déjà corrects : ${skipped}`);
  console.log(`❌ Fichier absent : ${noImage}`);
  console.log('📝 data.ts mis à jour.');
}

main();
