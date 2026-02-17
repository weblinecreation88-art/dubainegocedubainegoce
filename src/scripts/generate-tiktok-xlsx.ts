// src/scripts/generate-tiktok-xlsx.ts
import { getProducts } from '../lib/data';
import * as XLSX from 'xlsx';
import path from 'path';

/**
 * Génère un fichier XLSX pour l'importation groupée (bulk upload) sur TikTok Shop France.
 * Basé sur le modèle officiel (Santé et Beauté > Parfums).
 */
const generateTikTokXLSX = () => {
    console.log('🚀 Génération de l\'export TikTok Shop France (XLSX)...');

    const products = getProducts();

    // Mapping des données selon le template TikTok Shop France
    const data = products.map(product => {
        // Nettoyer la description (enlever HTML, limiter à 5000 caractères)
        const cleanDescription = (product.longDescription || product.shortDescription || '')
            .replace(/<[^>]*>?/gm, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 5000);

        const images = product.images || [];
        // TikTok accepte généralement plusieurs URLs d'images (souvent max 9)
        // Dans ce template, on met les images principales
        const imageUrls = images.slice(0, 9).join(', ');

        return {
            'Catégorie': 'Santé et beauté > Parfums',
            'Marque': product.brand?.name || 'Générique',
            'Nom du produit': product.name,
            'Description du produit': cleanDescription,
            'Poids du colis (kg)': 0.5, // Valeur par défaut
            'Longueur du colis (cm)': 15,
            'Largeur du colis (cm)': 10,
            'Hauteur du colis (cm)': 10,
            'Est-ce dangeureux ?': 'Non',
            'Images du produit': images[0] || '', // Première image (certains templates demandent une par colonne, d'ici on suit l'image user)
            'Images du produit 2': images[1] || '',
            'Images du produit 3': images[2] || '',
            'SKU du vendeur': product.id,
            'Prix de vente au détail (TVA incluse)': product.price,
            'Quantité': product.stock > 0 ? product.stock : 0
        };
    });

    // Créer un classeur (Workbook)
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Feuille1');

    const outputPath = path.join(process.cwd(), 'public', 'tiktok-import-fr.xlsx');

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
