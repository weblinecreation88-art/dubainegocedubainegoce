/**
 * Correction globale de TOUTES les erreurs d'attribution d'images
 * Pour Fragrance World, Maison Alhambra, Lattafa, Asdaaf, French Avenue
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const IMG_DIR    = path.join(ROOT, 'public', 'images-parfums');
const DATA_FILE  = path.join(ROOT, 'src', 'lib', 'data.ts');

const LOCAL = 'C:/Users/abder/OneDrive/Images/images';
const FLACONS   = `${LOCAL}/Flacons_Parfum_Fond_Blanc`;
const IDENTIFIES = `${LOCAL}/Parfums_Identifiés`;
const ALHAM2    = `${LOCAL}/ALHAMABRA 2`;
const PHOTO1    = `${LOCAL}/Photoroom`;
const PHOTO2    = `${LOCAL}/Photoroom (2)`;
const PHOTO3    = `${LOCAL}/Photoroom (3)`;
const PHOTO4    = `${LOCAL}/Photoroom (4)`;
const ALHAM_GRIS = `${ALHAM2}/images avec fond gris/alhambra`;
const ALHAM_NEW  = `${ALHAM2}/images avec fond gris/Nouveau dossier`;

// Mapping complet  slug → { src, ext }
const FIXES = [
  // ── FRAGRANCE WORLD ────────────────────────────────────────────────────────
  {
    slug: 'amber-neroli-fragrance-world',
    src: `${PHOTO1}/Amber___Neroli_Eau_De_Parfum_By_Fragrance_World_80ml_2_7_Fl_Oz-1-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'cocktail-intense-fragrance-world',
    src: `${PHOTO1}/Cocktail_Intense_Eau_De_Parfum_100ml_Original_By_Fragrance_World-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'dark-as-wood-fragrance-world',
    src: `${IDENTIFIES}/dark-as-wood-fragrance-world.png`,
    ext: 'png',
  },
  {
    slug: 'pose-as-rose-fragrance-world',
    // 419KB high quality
    src: `${IDENTIFIES}/pose-of-rose.png`,
    ext: 'png',
  },
  {
    slug: 'queen-q-fragrance-world',
    src: `${IDENTIFIES}/queen-of-hearts-fragrance-world-100ml.png`,
    ext: 'png',
  },

  // ── MAISON ALHAMBRA ────────────────────────────────────────────────────────
  {
    slug: 'by-saffron-maison-alhambra',
    src: `${ALHAM2}/BY SAFFONE.png`,
    ext: 'png',
  },
  {
    slug: 'maison-alhambra-by-saffron',
    src: `${ALHAM2}/BY SAFFONE.png`,
    ext: 'png',
  },
  {
    slug: 'lovely-cherie-maison-alhambra',
    src: `${PHOTO1}/Alhambra_lovely_cherie-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'maison-alhambra-lovely-cherie',
    src: `${PHOTO1}/Alhambra_lovely_cherie-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'musk-vanille-maison-alhambra',
    src: `${FLACONS}/musk-vanille-100ml-maison-alhambra.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'maison-alhambra-musk-vanille',
    src: `${FLACONS}/musk-vanille-100ml-maison-alhambra.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'zaffiro-regale-maison-alhambra-unisex',
    src: `${PHOTO1}/Maison_Alhambra_Zaffiro_Collection_Regale_Edp_Eau_De_Parfum_For_Unisex___100_Ml-1-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'zaffiro-collection-crafted-oud-maison-alhambra',
    src: `${PHOTO2}/Zaffiro_Crafted_Oud_Edp_Perfume_By_Maison_Alhambra_100_Ml_niche_Uae_Version_-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'jean-lowe-nouveau-maison-alhambra',
    src: `${PHOTO2}/Maison_Alhambra_Jean_Lowe_Nouveau_Eau_De_Parfum_Spray__3_4_Ounce__unisex_-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'olivia-blossom-maison-alhambra',
    src: `${PHOTO2}/OLIVIA-Photoroom.jpg`,
    ext: 'jpg',
  },

  // ── LATTAFA / ASDAAF ───────────────────────────────────────────────────────
  {
    slug: 'pure-oudi-lattafa',
    src: `${PHOTO2}/Pure_Oudi_Eau_De_Parfum_100ml_Lattafa-Photoroom.jpg`,
    ext: 'jpg',
  },
  {
    slug: 'majd-al-sultan-asdaaf',
    src: `${PHOTO4}/Lattafa___Majdal_Sultan_Brown_100ML_Eau_de_parfum_homme-1-Photoroom-Photoroom.jpg`,
    ext: 'jpg',
  },
];

let lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
let updatedCount = 0;
let errors = [];

for (const fix of FIXES) {
  if (!fs.existsSync(fix.src)) {
    errors.push(`❌ Source manquante: ${path.basename(fix.src)} (slug: ${fix.slug})`);
    continue;
  }

  const destFile = `${fix.slug}.${fix.ext}`;
  const destPath = path.join(IMG_DIR, destFile);
  const newUrl   = `/images-parfums/${destFile}`;

  // Supprimer les anciens fichiers avec d'autres extensions
  for (const ext of ['png','jpg','jpeg','webp']) {
    const old = path.join(IMG_DIR, `${fix.slug}.${ext}`);
    if (old !== destPath && fs.existsSync(old)) {
      fs.unlinkSync(old);
    }
  }

  // Copier la bonne image
  fs.copyFileSync(fix.src, destPath);
  const kb = Math.round(fs.statSync(destPath).size / 1024);

  // Mettre à jour data.ts
  let found = false;
  let currentSlug = '';
  for (let i = 0; i < lines.length; i++) {
    const sM = lines[i].match(/\"slug\":\s*\"([^\"]+)\"/);
    if (sM) currentSlug = sM[1];
    const iM = lines[i].match(/\"images\":\s*\[\"([^\"]+)\"\]/);
    if (iM && currentSlug === fix.slug) {
      const newLine = lines[i].replace(/"images":\s*\[[^\]]+\]/, `"images": ["${newUrl}"]`);
      if (newLine !== lines[i]) { lines[i] = newLine; updatedCount++; }
      found = true;
      break;
    }
  }

  if (found) {
    console.log(`✅ ${fix.slug} → ${destFile} (${kb}KB)`);
  } else {
    errors.push(`⚠️  Slug introuvable dans data.ts: ${fix.slug}`);
  }
}

if (updatedCount > 0) {
  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
  console.log(`\n💾 data.ts — ${updatedCount} lignes mises à jour`);
}

if (errors.length) {
  console.log('\n--- Erreurs ---');
  errors.forEach(e => console.log(e));
}

// Vérification finale des doublons restants
console.log('\n📊 Doublons résiduels:');
const byHash = {};
for (const f of fs.readdirSync(IMG_DIR)) {
  const fp = path.join(IMG_DIR, f);
  const hash = require('crypto').createHash('md5').update(fs.readFileSync(fp)).digest('hex');
  if (!byHash[hash]) byHash[hash] = [];
  byHash[hash].push(f);
}
let dupFound = false;
for (const [hash, files] of Object.entries(byHash)) {
  if (files.length > 1) {
    // Only show if they have different prefixes (not just slug variants)
    const basenames = files.map(f => f.replace(/\.[^.]+$/, ''));
    const hasDiffProduct = basenames.some(a => basenames.some(b => a !== b && !a.includes(b) && !b.includes(a)));
    if (hasDiffProduct) {
      console.log(`  ❌ ENCORE IDENTIQUES: ${files.join(' == ')}`);
      dupFound = true;
    }
  }
}
if (!dupFound) console.log('  ✅ Aucun doublon suspect détecté');
