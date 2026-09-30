import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { getProducts } from '../src/lib/data';

const products = getProducts();

// En-têtes CSV requis par l'utilisateur
const rows = [
    ['productName', 'brand', 'category', 'weight', 'price']
];

for (const p of products) {
    // Échapper les guillemets pour le format CSV
    const escapeCsv = (str: string | undefined | null) => {
        if (!str) return '""';
        return `"${String(str).replace(/"/g, '""')}"`;
    };

    const name = escapeCsv(p.name);
    const brand = escapeCsv(p.brand?.name);
    const category = escapeCsv(p.family);

    // Pour le poids, nous utilisons le volume (100ml = 0.1 kg)
    const weightVal = p.volumeMl ? (p.volumeMl / 1000).toString() : '';
    const weight = escapeCsv(weightVal);

    const price = escapeCsv(p.price != null ? String(p.price) : '');

    rows.push([name, brand, category, weight, price]);
}

const csv = rows.map(r => r.join(',')).join('\n');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = join(__dirname, '..', 'woocommerce_export.csv');

writeFileSync(outputPath, csv, 'utf-8');

console.log(`✅ CSV généré avec succès!`);
console.log(`📄 Fichier: ${outputPath}`);
console.log(`📊 Nombre de produits exportés: ${products.length}`);
