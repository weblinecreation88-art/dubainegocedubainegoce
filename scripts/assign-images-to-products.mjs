/**
 * Assigne les images locales téléchargées aux produits dans data.ts
 * Remplace le champ "images" pour chaque produit trouvé.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'src', 'lib', 'data.ts');
const RAPPORT_FILE = path.join(__dirname, '..', 'public', 'images-parfums', '_rapport.json');

// Mapping VÉRIFIÉ : nom produit dans data.ts → fichier image local
// Seuls les produits dont l'image est visuellement CONFIRMÉE sont inclus.
// Les cas douteux (image d'un autre produit retournée par le moteur de recherche) sont exclus.
const VERIFIED_MAPPING = {
  // Maison Alhambra — confirmés
  'Woody Oud':                '/images-parfums/maison-alhambra-woody-oud.webp',
  'The Tux':                  '/images-parfums/maison-alhambra-the-tux.webp',
  'Glacier Pour Homme':       '/images-parfums/maison-alhambra-glacier-pour-homme.webp',
  'Toscano Leather':          '/images-parfums/maison-alhambra-toscano-leather.webp',
  'Jean Lowe Matière':        '/images-parfums/maison-alhambra-jean-lowe-matiere.webp',
  'Glacier Le Noir':          '/images-parfums/maison-alhambra-glacier-le-noir.webp',
  'Kismet for Women':         '/images-parfums/maison-alhambra-kismet-for-women.webp',
  'Perseus':                  '/images-parfums/maison-alhambra-perseus.webp',
  'Versencia Crystal':        '/images-parfums/maison-alhambra-versencia-crystal.webp',
  'Avant':                    '/images-parfums/maison-alhambra-avant.webp',
  'Opera Noir':               '/images-parfums/maison-alhambra-opera-noir.webp',
  'So Candid':                '/images-parfums/maison-alhambra-so-candid.webp',
  'Jean Lowe Nouveau':        '/images-parfums/maison-alhambra-jean-lowe-nouveau.webp',
  'Jean Lowe Ombre':          '/images-parfums/maison-alhambra-jean-lowe-ombre.webp',
  'Kismet Angel':             '/images-parfums/maison-alhambra-kismet-angel.webp',
  'Jorge Di Profumo':         '/images-parfums/maison-alhambra-jorge-di-profumo.webp',
  'Porto Neroli':             '/images-parfums/maison-alhambra-porto-neroli.webp',
  'Karat':                    '/images-parfums/maison-alhambra-karat.webp',
  'Infini Rose':              '/images-parfums/maison-alhambra-infini-rose.webp',
  'Rose Petals':              '/images-parfums/maison-alhambra-rose-petals.webp',
  'Baroque Rouge Extrait':    '/images-parfums/maison-alhambra-baroque-rouge-extrait.webp',
  'Jean Lowe Immortal':       '/images-parfums/maison-alhambra-jean-lowe-immortal.webp',
  'Jean Lowe Noir':           '/images-parfums/maison-alhambra-jean-lowe-noir.webp',
  'Kismet Moscow':            '/images-parfums/maison-alhambra-kismet-moscow.webp',
  'La Vita Bella':            '/images-parfums/maison-alhambra-la-vita-bella.webp',
  'Tobacco Touch':            '/images-parfums/maison-alhambra-tobacco-touch.webp',
  'Yeah':                     '/images-parfums/maison-alhambra-yeah.webp',
  'Salvo Intense':            '/images-parfums/maison-alhambra-salvo-intense.webp',
  'Léonie':                   '/images-parfums/maison-alhambra-leonie.webp',

  // Lattafa — confirmés
  'Ramz Silver':              '/images-parfums/lattafa-ramz-silver.webp',
  'Ramz Gold':                '/images-parfums/lattafa-ramz-gold.webp',
  'Raghba':                   '/images-parfums/lattafa-raghba.webp',
  "Qaa'ed":                   '/images-parfums/lattafa-qaa-ed.webp',
  'Ana Abiyedh Rouge':        '/images-parfums/lattafa-ana-abiyedh-rouge.webp',
  'Ejaazi':                   '/images-parfums/lattafa-ejaazi.webp',
  'Maahir':                   '/images-parfums/lattafa-maahir.webp',
  'Asad':                     '/images-parfums/lattafa-asad.webp',
  'Ana Abiyedh':              '/images-parfums/lattafa-ana-abiyedh.webp',
  'Ajwad':                    '/images-parfums/lattafa-ajwad.webp',
  'Maahir Black Edition':     '/images-parfums/lattafa-maahir-black-edition.webp',
  'Maahir Legacy':            '/images-parfums/lattafa-maahir-legacy.webp',
  'Sakeena':                  '/images-parfums/lattafa-sakeena.jpg',
  'Mayar':                    '/images-parfums/lattafa-mayar.webp',
  'Tharwah Gold':             '/images-parfums/lattafa-tharwah-gold.webp',
  'Confidential Private Gold':'/images-parfums/lattafa-confidential-private-gold.webp',
  'Eternal Oud':              '/images-parfums/lattafa-eternal-oud.webp',
  'Ameer Al Oudh Intense Oud':'/images-parfums/lattafa-ameer-al-oudh-intense-oud.webp',
  'Teriaq':                   '/images-parfums/lattafa-teriaq.webp',
  'Yara':                     '/images-parfums/lattafa-yara.webp',
  'Yara Candy':               '/images-parfums/lattafa-yara-candy.webp',
  'Yara Moi':                 '/images-parfums/lattafa-yara-moi.webp',
  'Najdia':                   '/images-parfums/lattafa-najdia.webp',
  'Oud Mood':                 '/images-parfums/lattafa-oud-mood.webp',
  'Badee Al Oud (Oud for Glory)': '/images-parfums/lattafa-badee-al-oud.webp',
  'Éclaire':                  '/images-parfums/lattafa-eclair.webp',

  // Fragrance World — confirmés
  'A King':                   '/images-parfums/fragrance-world-a-king.webp',
  'K King':                   '/images-parfums/fragrance-world-k-king.webp',
  'J':                        '/images-parfums/fragrance-world-j.webp',
  'Queen Q':                  '/images-parfums/fragrance-world-queen-q.webp',
  'Pose As Rose':             '/images-parfums/fragrance-world-pose-as-rose.webp',
  'Dark As Wood':             '/images-parfums/fragrance-world-dark-as-wood.webp',
  'Pure Passion':             '/images-parfums/fragrance-world-pure-passion.webp',
  'Cuir Leather':             '/images-parfums/fragrance-world-cuir-leather.webp',
  'Invicto':                  '/images-parfums/fragrance-world-invicto.webp',
  'Cocktail Intense':         '/images-parfums/fragrance-world-cocktail-intense.webp',
  'Spectre Ghost':            '/images-parfums/fragrance-world-spectre-ghost.webp',
  'Suits':                    '/images-parfums/fragrance-world-suits.webp',
  'Fresh as Citrus':          '/images-parfums/fragrance-world-fresh-as-citrus.webp',

  // French Avenue — confirmés
  'Aether Extrait':           '/images-parfums/french-avenue-aether-extrait.webp',
  'Lumière Elle':             '/images-parfums/french-avenue-lumiere-elle.webp',
  'Sweet Paradise':           '/images-parfums/french-avenue-sweet-paradise.webp',
  'Royal Blend Nero':         '/images-parfums/french-avenue-royal-blend-nero.webp',
  'After Effect':             '/images-parfums/french-avenue-after-effect.webp',
  'Glorious Oud':             '/images-parfums/french-avenue-glorious-oud.webp',
  'Liquid Brun':              '/images-parfums/french-avenue-liquid-brun.webp',

  // Autres marques — confirmés
  'Andaleeb':                 '/images-parfums/asdaaf-andaleeb.webp',
  'Pistachio':                '/images-parfums/ard-al-zaafaran-pistachio.webp',
  'Bint Hooran Rose Passion': '/images-parfums/ard-al-zaafaran-bint-hooran-rose-passion.webp',
};

function updateDataFile() {
  console.log('📖 Lecture de data.ts...');
  const lines = fs.readFileSync(DATA_FILE, 'utf8').split('\n');
  let updated = 0;
  let skipped = 0;

  // Pour chaque produit à mettre à jour, on cherche sa ligne "name" puis
  // la prochaine ligne "images" dans le même bloc (dans les 200 lignes suivantes)
  for (const [productName, localPath] of Object.entries(VERIFIED_MAPPING)) {
    const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Chercher la ligne exacte avec ce nom de produit
    const nameRegex = new RegExp(`"name":\\s*"${escapedName}"\\s*,?\\s*$`);

    let nameLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (nameRegex.test(lines[i])) {
        nameLineIdx = i;
        break;
      }
    }

    if (nameLineIdx === -1) {
      skipped++;
      console.log(`  ⚠️  "${productName}" — nom non trouvé`);
      continue;
    }

    // Chercher la ligne "images": [...] dans les 200 lignes suivantes (avant la fermeture du bloc)
    let found = false;
    for (let i = nameLineIdx + 1; i < Math.min(nameLineIdx + 200, lines.length); i++) {
      const line = lines[i];
      // Détecter fin du bloc produit (ligne avec juste "}" ou "},")
      if (/^\s*\},?\s*$/.test(line) && line.trim().length <= 2) {
        break; // sorti du bloc, arrêter
      }
      // Chercher la ligne "images": [...]
      if (/"images"\s*:\s*\[/.test(line)) {
        // Remplacer le contenu du tableau
        lines[i] = line.replace(/"images"\s*:\s*\[[^\]]*\]/, `"images": ["${localPath}"]`);
        updated++;
        found = true;
        console.log(`  ✅ ${productName} → ${localPath}`);
        break;
      }
    }

    if (!found) {
      skipped++;
      console.log(`  ⚠️  "${productName}" — champ images non trouvé après la ligne name`);
    }
  }

  fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Mis à jour : ${updated} produits`);
  console.log(`⚠️  Ignorés   : ${skipped} produits`);
  console.log('📝 data.ts sauvegardé.');
}

updateDataFile();
