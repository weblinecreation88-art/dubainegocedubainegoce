// src/scripts/generate-tiktok-csv.ts
import { getProducts } from '../lib/data';
import { writeFileSync } from 'fs';
import path from 'path';

const generateTikTokCSV = () => {
    console.log('🚀 Génération de l\'export TikTok Shop...');

    const products = getProducts();
    const siteUrl = 'https://dubainegoce.fr';

    // En-têtes CSV recommandés (Mapping flexible)
    const headers = [
        'SKU',
        'Product_Name',
        'Category',
        'Brand',
        'Description',
        'Price_EUR',
        'Stock',
        'Image_URL_1',
        'Image_URL_2',
        'Image_URL_3',
        'Package_Weight_KG',
        'Volume_ML'
    ];

    const rows = products.map(product => {
        // Nettoyer la description (TikTok préfère du texte propre ou HTML simple)
        const cleanDescription = (product.longDescription || product.shortDescription || '')
            .replace(/<[^>]*>?/gm, ' ') // Enlever les balises HTML
            .replace(/\s+/g, ' ')       // Espaces multiples
            .trim();

        const images = product.images || [];

        return [
            `"${product.id}"`,
            `"${product.name.replace(/"/g, '""')}"`,
            `"Santé et beauté > Parfums"`,
            `"${(product.brand?.name || 'DubaiNegoce').replace(/"/g, '""')}"`,
            `"${cleanDescription.substring(0, 5000).replace(/"/g, '""')}"`,
            product.price,
            product.stock,
            `"${images[0] || ''}"`,
            `"${images[1] || ''}"`,
            `"${images[2] || ''}"`,
            0.75, // Poids par défaut
            product.volumeMl
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const outputPath = path.join(process.cwd(), 'public', 'tiktok-import.csv');

    try {
        writeFileSync(outputPath, csvContent, 'utf8');
        console.log(`\n✅ Export TikTok généré avec succès dans : ${outputPath}`);
        console.log(`✅ Total produits : ${products.length}`);
        console.log(`ℹ️ Importez ce fichier sur : https://seller-fr.tiktok.com/product/batch/publish`);
    } catch (error) {
        console.error('❌ Erreur lors de la création du fichier CSV :', error);
    }
};

generateTikTokCSV();
