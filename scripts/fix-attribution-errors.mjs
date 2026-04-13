/**
 * Corrige les erreurs d'attribution dans Fragrance World et French Avenue
 * - Copies les bonnes images depuis le dossier local de l'utilisateur
 * - Met à jour data.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE  = path.join(ROOT, 'src', 'lib', 'data.ts');

const LOCAL_IMAGES = 'C:/Users/abder/OneDrive/Images/images';
const FLACONS_DIR = path.join(LOCAL_IMAGES, 'Flacons_Parfum_Fond_Blanc');
const IDENTIFIES_DIR = path.join(LOCAL_IMAGES, 'Parfums_Identifiés');

// Correspondances : slug → { src: chemin source, ext: extension cible }
const FIXES = [
  // ── Fragrance World ──────────────────────────────────────────────────
  {
    slug: 'francique-107-9-fragrance-world',
    src: path.join(FLACONS_DIR, 'FRANCIQUE_107_9 (1).png'),
    destExt: 'png',
  },
  {
    slug: 'francique-63-55-fragrance-world',
    src: path.join(FLACONS_DIR, 'FRANCIQUE_63_55.png'),
    destExt: 'png',
  },
  {
    slug: 'optimystic-blanc-fragrance-world',
    src: path.join(FLACONS_DIR, 'optimystic-blanc-de-fragrance-world.jpg'),
    destExt: 'jpg',
  },
  {
    slug: 'optimystic-noir-fragrance-world',
    src: path.join(IDENTIFIES_DIR, 'fragrance_world_optimystic_black_eau_de_parfum_3_3oz_100ml_for_men_intense_-1.png'),
    destExt: 'png',
  },
  {
    slug: 'tour-de-havana-fragrance-world',
    src: path.join(IDENTIFIES_DIR, 'fragrance_world_tour_de_havana_-1.png'),
    destExt: 'png',
  },
  // Kenzie Marshmallow 100ml (était la même image que Candid Vanilla — erreur)
  // On utilise la version French Avenue (même produit, bon visuel)
  {
    slug: 'kenzie-marshmallow-100ml',
    // On va copier depuis kenzie-marshmallow-french-avenue.png (déjà dans images-parfums)
    srcFromImagesDir: 'kenzie-marshmallow-french-avenue.png',
    destExt: 'png',
  },
  // Kenzie Candid Vanilla 100ml (était identique à Marshmallow — erreur)
  {
    slug: 'kenzie-candid-vanilla-100ml',
    src: path.join(IDENTIFIES_DIR, 'vanilla_so_sweet_100ml_edp_by_fragrance_world_uae-1.jpg'),
    destExt: 'jpg',
  },

  // ── French Avenue ─────────────────────────────────────────────────────
  {
    slug: 'francique-107-9-french-avenue',
    src: path.join(LOCAL_IMAGES, 'francique-107-9-frenchavenue.png'),
    destExt: 'png',
  },
  {
    slug: 'francique-63-55-french-avenue',
    src: path.join(LOCAL_IMAGES, 'francique_63-55_hq.png'),
    destExt: 'png',
  },
  {
    slug: 'irida-extrait-french-avenue',
    src: path.join(FLACONS_DIR, 'extrait-irida-par-french-avenue.png'),
    destExt: 'png',
  },
];

let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;

for (const fix of FIXES) {
  // Déterminer la source
  let srcPath;
  if (fix.srcFromImagesDir) {
    srcPath = path.join(IMAGES_DIR, fix.srcFromImagesDir);
  } else {
    srcPath = fix.src;
  }

  if (!fs.existsSync(srcPath)) {
    console.log(`❌ Source introuvable: ${srcPath}`);
    continue;
  }

  const destFilename = `${fix.slug}.${fix.destExt}`;
  const destPath = path.join(IMAGES_DIR, destFilename);
  const newUrl = `/images-parfums/${destFilename}`;

  // Trouver la ligne dans data.ts
  let lineIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"slug": "${fix.slug}"`)) {
      for (let j = i; j < Math.min(i + 60, lines.length); j++) {
        if (lines[j].includes('"images"')) {
          lineIdx = j; break;
        }
      }
      break;
    }
  }

  if (lineIdx === -1) {
    console.log(`⚠️  Slug introuvable dans data.ts: ${fix.slug}`);
    continue;
  }

  // Supprimer les anciens fichiers avec d'autres extensions si nécessaire
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const old = path.join(IMAGES_DIR, `${fix.slug}.${ext}`);
    if (old !== destPath && fs.existsSync(old)) {
      fs.unlinkSync(old);
      console.log(`   🗑  Supprimé: ${fix.slug}.${ext}`);
    }
  }

  // Copier la bonne image
  fs.copyFileSync(srcPath, destPath);
  const size = fs.statSync(destPath).size;
  console.log(`✅ [${fix.slug}]`);
  console.log(`   src : ${path.basename(srcPath)} (${(size/1024).toFixed(0)}KB)`);
  console.log(`   dest: ${newUrl}`);

  // Mettre à jour la ligne dans data.ts
  const newLine = lines[lineIdx].replace(/"images":\s*\[[^\]]+\]/, `"images": ["${newUrl}"]`);
  if (newLine !== lines[lineIdx]) {
    lines[lineIdx] = newLine;
    updatedCount++;
  } else {
    console.log(`   ⚠️  Ligne non modifiée (déjà à jour?)`);
  }
  console.log('');
}

if (updatedCount > 0) {
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  console.log(`💾 data.ts sauvegardé — ${updatedCount} lignes modifiées`);
} else {
  console.log('Aucune modification de data.ts nécessaire.');
}

// Vérification finale : duplicates restants
const slugsToCheck = [
  ['optimystic-blanc-fragrance-world', 'optimystic-noir-fragrance-world'],
  ['kenzie-marshmallow-100ml', 'kenzie-candid-vanilla-100ml'],
];
console.log('\n📊 Vérification des doublons:');
for (const [a, b] of slugsToCheck) {
  const aFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(a + '.'));
  const bFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(b + '.'));
  if (aFiles.length && bFiles.length) {
    const aHash = Buffer.from(fs.readFileSync(path.join(IMAGES_DIR, aFiles[0]))).toString('hex').substring(0, 16);
    const bHash = Buffer.from(fs.readFileSync(path.join(IMAGES_DIR, bFiles[0]))).toString('hex').substring(0, 16);
    const same = aHash === bHash;
    console.log(`  ${same ? '❌ ENCORE IDENTIQUES' : '✅ OK différents'}: ${a} vs ${b}`);
  }
}
