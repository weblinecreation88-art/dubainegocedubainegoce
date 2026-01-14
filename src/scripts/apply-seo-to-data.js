/**
 * Script pour appliquer les données SEO générées au fichier data.ts
 *
 * Ce script lit seo-output.json et met à jour les produits dans data.ts
 * avec les nouvelles données SEO (shortDescription, longDescription, metaTitle, metaDescription, tags)
 *
 * Usage: node src/scripts/apply-seo-to-data.js
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🚀 Application des données SEO au fichier data.ts...\n');

  // Lire le fichier SEO généré
  const seoPath = path.join(process.cwd(), 'seo-output.json');
  if (!fs.existsSync(seoPath)) {
    console.error('❌ Fichier seo-output.json introuvable. Exécutez d\'abord generate-seo-descriptions.js');
    return;
  }

  const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
  console.log(`📦 ${seoData.length} fiches SEO chargées\n`);

  // Lire le fichier data.ts
  const dataPath = path.join(__dirname, '../lib/data.ts');
  let content = fs.readFileSync(dataPath, 'utf8');

  let updatedCount = 0;

  for (const item of seoData) {
    const { id, seoData: seo } = item;

    // Créer les patterns de recherche et de remplacement pour chaque produit
    // On va chercher le bloc du produit par son ID et mettre à jour les champs

    // Pattern pour trouver le produit par ID
    const idPattern = new RegExp(`("id":\\s*"${id}"[^}]+?)("shortDescription":\\s*"[^"]*")`, 's');
    const match = content.match(idPattern);

    if (match) {
      // On va mettre à jour les descriptions et meta dans ce bloc produit
      // Trouver le bloc complet du produit
      const productStartIndex = content.indexOf(`"id": "${id}"`);
      if (productStartIndex === -1) continue;

      // Trouver la fin du bloc produit (le prochain objet ou la fin du tableau)
      let braceCount = 0;
      let productEndIndex = productStartIndex;
      let foundStart = false;

      for (let i = productStartIndex; i < content.length; i++) {
        if (content[i] === '{') {
          if (!foundStart) foundStart = true;
          braceCount++;
        } else if (content[i] === '}') {
          braceCount--;
          if (foundStart && braceCount === 0) {
            productEndIndex = i + 1;
            break;
          }
        }
      }

      let productBlock = content.substring(productStartIndex - 10, productEndIndex);

      // Mettre à jour shortDescription
      const shortDescEscaped = seo.shortDescription.replace(/"/g, '\\"');
      productBlock = productBlock.replace(
        /"shortDescription":\s*"[^"]*"/,
        `"shortDescription": "${shortDescEscaped}"`
      );

      // Mettre à jour longDescription (attention aux caractères spéciaux HTML)
      const longDescEscaped = seo.longDescription
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      productBlock = productBlock.replace(
        /"longDescription":\s*"[^"]*"/,
        `"longDescription": "${longDescEscaped}"`
      );

      // Mettre à jour metaTitle
      productBlock = productBlock.replace(
        /"metaTitle":\s*"[^"]*"/,
        `"metaTitle": "${seo.metaTitle}"`
      );

      // Mettre à jour metaDescription
      const metaDescEscaped = seo.metaDescription.replace(/"/g, '\\"');
      productBlock = productBlock.replace(
        /"metaDescription":\s*"[^"]*"/,
        `"metaDescription": "${metaDescEscaped}"`
      );

      // Mettre à jour tags
      const tagsStr = JSON.stringify(seo.tags);
      productBlock = productBlock.replace(
        /"tags":\s*\[[^\]]*\]/,
        `"tags": ${tagsStr}`
      );

      // Remplacer le bloc dans le contenu
      content = content.substring(0, productStartIndex - 10) + productBlock + content.substring(productEndIndex);

      updatedCount++;
      if (updatedCount <= 5) {
        console.log(`✅ Produit ${id} (${item.name}) mis à jour`);
      } else if (updatedCount === 6) {
        console.log('...');
      }
    }
  }

  // Sauvegarder le fichier mis à jour
  const backupPath = path.join(__dirname, '../lib/data.ts.backup');
  fs.copyFileSync(dataPath, backupPath);
  console.log(`\n💾 Backup créé: ${backupPath}`);

  fs.writeFileSync(dataPath, content);
  console.log(`✅ Fichier data.ts mis à jour avec ${updatedCount} produits`);
}

main();
