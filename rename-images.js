const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Mapping des marques connues
const brands = [
  'Lattafa',
  'Maison Alhambra',
  'Fragrance World',
  'Jean Lowe',
  'Jean Couturier',
  'Alhambra',
  'RAVE',
  'Paris Corner',
  'Pendora Scents',
  'Nasomatto'
];

// Mots à supprimer pour nettoyer les noms
const wordsToRemove = [
  'Eau De Parfum',
  'Edp',
  'Parfum',
  'Perfume',
  'By',
  'For Women',
  'For Men',
  'For Unisex',
  'Unisex',
  '100ml',
  '80ml',
  '90ml',
  '50ml',
  '3 4oz',
  '3 4 oz',
  '600x600',
  'Spray',
  'Natural Spary',
  'Original',
  'Made In Uae',
  'Free Shipping',
  'In Box',
  'Sealed',
  'Imported',
  'Arabic'
];

function cleanAndFormatName(filename) {
  // Retirer l'extension
  let name = filename.replace('.png', '');

  // Identifier la marque
  let brand = '';
  let productName = name;

  for (let b of brands) {
    const regex = new RegExp(b.replace(/\s/g, '[_\\s]'), 'gi');
    if (regex.test(name)) {
      brand = b.toLowerCase().replace(/\s+/g, '-');
      // Retirer la marque du nom du produit
      productName = name.replace(regex, '').trim();
      break;
    }
  }

  // Nettoyer le nom du produit
  let cleanName = productName;

  // Supprimer les mots inutiles
  for (let word of wordsToRemove) {
    const regex = new RegExp(word.replace(/\s/g, '[_\\s]'), 'gi');
    cleanName = cleanName.replace(regex, '');
  }

  // Nettoyer les caractères spéciaux
  cleanName = cleanName
    .replace(/_+/g, '-')           // Underscores -> tirets
    .replace(/\s+/g, '-')          // Espaces -> tirets
    .replace(/\(.*?\)/g, '')       // Supprimer parenthèses et contenu
    .replace(/\[.*?\]/g, '')       // Supprimer crochets et contenu
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9-]/gi, '-')  // Tout sauf lettres, chiffres et tirets
    .replace(/-+/g, '-')           // Tirets multiples -> simple
    .replace(/^-+|-+$/g, '')       // Retirer tirets début/fin
    .toLowerCase();

  // Construire le nom final: nom-produit-marque.png
  if (brand) {
    return `${cleanName}-${brand}.png`;
  } else {
    return `${cleanName}.png`;
  }
}

// Fonction pour générer un mapping des renommages
function generateRenameMapping() {
  const files = fs.readdirSync(publicDir);
  const pngFiles = files.filter(f => f.endsWith('.png') && f !== 'logo dubainegoce.png');

  const mapping = {};
  const newNames = new Set();

  pngFiles.forEach((oldName, index) => {
    let newName = cleanAndFormatName(oldName);

    // Gérer les doublons
    let counter = 1;
    let uniqueName = newName;
    while (newNames.has(uniqueName)) {
      const baseName = newName.replace('.png', '');
      uniqueName = `${baseName}-${counter}.png`;
      counter++;
    }

    newNames.add(uniqueName);
    mapping[oldName] = uniqueName;
  });

  return mapping;
}

// Afficher le mapping sans renommer
const mapping = generateRenameMapping();

console.log('\n📋 PREVIEW DES RENOMMAGES:\n');
console.log('Total de fichiers à renommer:', Object.keys(mapping).length);
console.log('\nExemples (20 premiers):');

let count = 0;
for (let [oldName, newName] of Object.entries(mapping)) {
  if (count < 20) {
    console.log(`  ${oldName}`);
    console.log(`  → ${newName}\n`);
    count++;
  }
}

// Sauvegarder le mapping complet
fs.writeFileSync(
  path.join(__dirname, 'rename-mapping.json'),
  JSON.stringify(mapping, null, 2)
);

console.log('\n✅ Mapping complet sauvegardé dans: rename-mapping.json');
console.log('\n⚠️  Ceci est juste un PREVIEW. Pour renommer, exécutez: node rename-images.js --apply\n');

// Si --apply est passé en argument, effectuer le renommage
if (process.argv.includes('--apply')) {
  console.log('\n🚀 RENOMMAGE EN COURS...\n');

  let renamed = 0;
  for (let [oldName, newName] of Object.entries(mapping)) {
    const oldPath = path.join(publicDir, oldName);
    const newPath = path.join(publicDir, newName);

    try {
      fs.renameSync(oldPath, newPath);
      renamed++;
      console.log(`✓ ${oldName} → ${newName}`);
    } catch (err) {
      console.error(`✗ Erreur pour ${oldName}:`, err.message);
    }
  }

  console.log(`\n✅ ${renamed} fichiers renommés avec succès!\n`);
}
