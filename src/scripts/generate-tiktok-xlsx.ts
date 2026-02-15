// src/scripts/generate-tiktok-xlsx.ts
import { getProducts } from '../lib/data';
import * as XLSX from 'xlsx';
import path from 'path';

const generateTikTokXLSX = () => {
    console.log('🚀 Génération de l\'export TikTok Shop (XLSX)...');

    const products = getProducts();
    const siteUrl = 'https://dubainegoce.fr';

    // En-têtes TikTok Shop France (Mapping basé sur le template officiel)
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

    const data = products.map(product => {
        // Nettoyer la description
        const cleanDescription = (product.longDescription || product.shortDescription || '')
            .replace(/<[^>]*>?/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const images = product.images || [];

        return {
            'SKU': product.id,
            'Product_Name': product.name,
            'Category': 'Santé et beauté > Parfums',
            'Brand': product.brand?.name || 'DubaiNegoce',
            'Description': cleanDescription.substring(0, 5000),
            'Price_EUR': product.price,
            'Stock': product.stock,
            'Image_URL_1': images[0] || '',
            'Image_URL_2': images[1] || '',
            'Image_URL_3': images[2] || '',
            'Package_Weight_KG': 0.75,
            'Volume_ML': product.volumeMl
        };
    });

    // Créer un classeur (Workbook)
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const outputPath = path.join(process.cwd(), 'public', 'tiktok-import.xlsx');

    try {
        XLSX.writeFile(wb, outputPath);
        console.log(`\n✅ Export TikTok XLSX généré avec succès dans : ${outputPath}`);
        console.log(`✅ Total produits : ${products.length}`);
        console.log(`ℹ️ Importez ce fichier sur : https://seller-fr.tiktok.com/product/batch/publish`);
    } catch (error) {
        console.error('❌ Erreur lors de la création du fichier XLSX :', error);
    }
};

generateTikTokXLSX();
