#!/usr/bin/env node

/**
 * Générateur JSON pour 141 fiches produits enrichies
 * Crée descriptions optimisées E-E-A-T pour tous les parfums
 */

const fs = require('fs');
const path = require('path');

// Lire data.ts pour extraire les produits existants
const dataPath = path.join(__dirname, '../src/lib/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

// Fonction pour générer meta description
function generateMetaDesc(product) {
  const rating = (product.rating || 4.5).toFixed(1);
  const base = `${product.name} : eau de parfum ${product.family} | ⭐${rating}/5 | ${product.volumeMl}ml | ${product.price.toFixed(0)}€`;
  return base.substring(0, 155);
}

// Fonction pour générer meta title
function generateMetaTitle(product) {
  const benefit = product.family || 'Parfum';
  const title = `${product.name} | ${product.brand.name} | ${benefit}`;
  return title.substring(0, 60);
}

// Fonction pour générer longDescription HTML
function generateLongDesc(product) {
  const topNotes = (product.topNotes || []).slice(0,3).join(', ') || 'Variées';
  const heartNotes = (product.heartNotes || []).slice(0,3).join(', ') || 'Variées';
  const baseNotes = (product.baseNotes || []).slice(0,3).join(', ') || 'Variées';
  
  return `<section class='fragrance-intro'><p><strong>${product.name} par ${product.brand.name}</strong> est une eau de parfum ${product.family.toLowerCase()} de ${product.volumeMl}ml à ${product.price}€. Une fragrance authentique et accessible pour tous les amateurs de parfumerie de niche.</p></section><section class='pyramid'><h3>Pyramide Olfactive</h3><p><strong>Notes de Tête:</strong> ${topNotes}</p><p><strong>Notes de Cœur:</strong> ${heartNotes}</p><p><strong>Notes de Fond:</strong> ${baseNotes}</p></section><section class='characteristics'><h3>Caractéristiques</h3><p>Famille: <strong>${product.family}</strong> | Genre: <strong>${product.gender}</strong> | Volume: <strong>${product.volumeMl}ml</strong></p></section><section class='faq'><h3>Questions Fréquentes</h3><p><strong>Q: Quelle tenue?</strong><br>R: Environ 6-8 heures selon votre type de peau.</p><p><strong>Q: Jour ou soirée?</strong><br>R: Cette fragrance est polyvalente.</p><p><strong>Q: Authentique?</strong><br>R: Oui, garantie 100% authentique.</p></section>`;
}

// Parser les produits de data.ts (approche simple: chercher les patterns)
const productIds = new Set();
const idMatches = dataContent.match(/"id":\s*"([^"]+)"/g) || [];
idMatches.forEach(match => {
  const id = match.match(/"id":\s*"([^"]+)"/)[1];
  productIds.add(id);
});

console.log(`\n📊 Trouvé ${productIds.size} produits uniques dans data.ts\n`);

// Créer des produits enrichis (mock pour demo)
const enrichedProducts = [];
let count = 0;

// Parser chaque produit depuis data.ts (approche basique)
// Chercher patterns: id, name, brand, family, price, volumeMl, rating

const productPattern = /\{\s*id:\s*"([^"]+)"[^}]*?"name":\s*"([^"]+)"[^}]*?"brand":\s*brands\.find[^,]*"([^"]+)"[^}]*?"family":\s*"([^"]+)"[^}]*?"price":\s*(\d+)[^}]*?"volumeMl":\s*(\d+)[^}]*?"rating":\s*([\d.]+)/gs;

let match;
while ((match = productPattern.exec(dataContent)) !== null && enrichedProducts.length < 141) {
  const product = {
    id: match[1],
    name: match[2],
    brandName: match[3],
    family: match[4],
    price: parseInt(match[5]),
    volumeMl: parseInt(match[6]),
    rating: parseFloat(match[7]) || 4.5,
  };

  enrichedProducts.push({
    ...product,
    metaTitle: generateMetaTitle(product),
    metaDescription: generateMetaDesc(product),
    longDescription: generateLongDesc(product),
  });

  count++;
}

console.log(`✅ Enrichi ${enrichedProducts.length} produits\n`);

// Sauvegarder en JSON
const outputPath = path.join(__dirname, '../enriched-products-141.json');
fs.writeFileSync(outputPath, JSON.stringify(enrichedProducts.slice(0, 141), null, 2));

console.log(`📁 Sauvegardé: ${outputPath}`);
console.log(`📊 Total: ${enrichedProducts.length} fiches\n`);

// Afficher échantillon des 10 premiers
console.log('📋 ÉCHANTILLON: 10 PREMIERS PRODUITS\n');
console.log('='.repeat(80));

enrichedProducts.slice(0, 10).forEach((p, i) => {
  console.log(`\n${i + 1}. ${p.name} (ID: ${p.id})`);
  console.log(`   Brand: ${p.brandName}`);
  console.log(`   Meta Title: ${p.metaTitle}`);
  console.log(`   Meta Desc: ${p.metaDescription}`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Prêt pour intégration! ${enrichedProducts.length} fiches enrichies`);
