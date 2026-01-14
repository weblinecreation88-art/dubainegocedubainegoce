/**
 * Script pour mettre à jour les descriptions SEO dans data.ts
 *
 * Usage: node src/scripts/update-data-seo.js
 */

const fs = require('fs');
const path = require('path');

function escapeForTypescript(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function main() {
  console.log('🚀 Mise à jour des descriptions SEO dans data.ts...\n');

  // Lire le fichier SEO généré
  const seoPath = path.join(process.cwd(), 'seo-output.json');
  if (!fs.existsSync(seoPath)) {
    console.error('❌ Fichier seo-output.json introuvable.');
    return;
  }

  const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
  console.log(`📦 ${seoData.length} fiches SEO chargées\n`);

  // Lire le fichier data.ts
  const dataPath = path.join(__dirname, '../lib/data.ts');
  let content = fs.readFileSync(dataPath, 'utf8');

  // Créer backup
  const backupPath = dataPath + '.backup-' + Date.now();
  fs.writeFileSync(backupPath, content);
  console.log(`💾 Backup créé: ${backupPath}\n`);

  let updatedCount = 0;

  for (const item of seoData) {
    const { id, seoData: seo } = item;

    // Chercher le produit par son ID
    const idRegex = new RegExp(`"id":\\s*"${id}"`, 'g');
    const idMatch = content.match(idRegex);

    if (!idMatch) {
      console.log(`⚠️ Produit ${id} non trouvé`);
      continue;
    }

    // Trouver la position du produit
    const idIndex = content.indexOf(`"id": "${id}"`);
    if (idIndex === -1) continue;

    // Trouver le bloc du produit (entre { et })
    let startBrace = idIndex;
    while (startBrace > 0 && content[startBrace] !== '{') {
      startBrace--;
    }

    let endBrace = idIndex;
    let braceCount = 1;
    let inString = false;
    let escapeNext = false;

    for (let i = startBrace + 1; i < content.length && braceCount > 0; i++) {
      const char = content[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }

      endBrace = i;
    }

    // Extraire le bloc produit
    let productBlock = content.substring(startBrace, endBrace + 1);
    let originalBlock = productBlock;

    // Mettre à jour shortDescription
    const shortDescEscaped = escapeForTypescript(seo.shortDescription);
    productBlock = productBlock.replace(
      /"shortDescription":\s*"[^"]*"/,
      `"shortDescription": "${shortDescEscaped}"`
    );

    // Mettre à jour longDescription
    const longDescEscaped = escapeForTypescript(seo.longDescription);
    productBlock = productBlock.replace(
      /"longDescription":\s*"<p>[^"]*<\/p>"/,
      `"longDescription": "${longDescEscaped}"`
    );
    // Alternative pattern si le premier ne marche pas
    if (productBlock === originalBlock.replace(/"shortDescription":\s*"[^"]*"/, `"shortDescription": "${shortDescEscaped}"`)) {
      productBlock = productBlock.replace(
        /"longDescription":\s*"[^"]*"/,
        `"longDescription": "${longDescEscaped}"`
      );
    }

    // Mettre à jour metaTitle
    const metaTitleEscaped = escapeForTypescript(seo.metaTitle);
    productBlock = productBlock.replace(
      /"metaTitle":\s*"[^"]*"/,
      `"metaTitle": "${metaTitleEscaped}"`
    );

    // Mettre à jour metaDescription
    const metaDescEscaped = escapeForTypescript(seo.metaDescription);
    productBlock = productBlock.replace(
      /"metaDescription":\s*"[^"]*"/,
      `"metaDescription": "${metaDescEscaped}"`
    );

    // Mettre à jour tags
    const tagsJson = JSON.stringify(seo.tags);
    productBlock = productBlock.replace(
      /"tags":\s*\[[^\]]*\]/,
      `"tags": ${tagsJson}`
    );

    // Remplacer dans le contenu
    if (productBlock !== originalBlock) {
      content = content.substring(0, startBrace) + productBlock + content.substring(endBrace + 1);
      updatedCount++;

      if (updatedCount <= 5) {
        console.log(`✅ [${updatedCount}] ${item.name} mis à jour`);
      } else if (updatedCount === 6) {
        console.log('...');
      }
    }
  }

  // Sauvegarder le fichier
  fs.writeFileSync(dataPath, content);

  console.log(`\n✅ Terminé ! ${updatedCount} produits mis à jour dans data.ts`);
}

main();
