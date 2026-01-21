# Feuille de Route - Migration DubaiNegoce vers WordPress/Elementor
## Theme: flavor starter (flavor starter Free)

---

## 1. PALETTE DE COULEURS

### Couleurs Principales
| Nom | HEX | Usage |
|-----|-----|-------|
| **Or Principal** | `#c58a3d` | Boutons, accents, titres, badges |
| **Or Fonce** | `#b67a2d` | Hover boutons, gradients |
| **Or Clair** | `#d4a053` | Gradients, highlights |
| **Noir Principal** | `#000000` | Fond hero, sections sombres |
| **Gris Fonce** | `#111827` | Fond sections alternatives |
| **Gris Moyen** | `#1f2937` | Cards, overlays |
| **Blanc** | `#ffffff` | Texte sur fond sombre |
| **Gris Texte** | `#9ca3af` | Texte secondaire |

### Configuration flavor starter
Dans **Personnaliser > Couleurs** :
- Couleur d'accentuation : `#c58a3d`
- Couleur de lien : `#c58a3d`
- Couleur de lien hover : `#b67a2d`

---

## 2. TYPOGRAPHIES

### Polices Google Fonts a Importer
```
Playfair Display (Headlines) - 400, 600, 700
Inter (Body) - 300, 400, 500, 600, 700
```

### Configuration
| Element | Police | Taille Desktop | Taille Mobile | Poids |
|---------|--------|----------------|---------------|-------|
| H1 | Playfair Display | 60px | 36px | 700 |
| H2 | Playfair Display | 48px | 32px | 700 |
| H3 | Playfair Display | 32px | 24px | 600 |
| H4 | Playfair Display | 24px | 20px | 600 |
| Body | Inter | 16px | 14px | 400 |
| Boutons | Inter | 16px | 14px | 600 |
| Badges | Inter | 12px | 11px | 700 |

---

## 3. STRUCTURE DES PAGES

### Page d'Accueil

#### Section 1: Hero (Plein Ecran)
- **Fond**: Noir avec video ou image
- **Layout**: 2 colonnes (60% texte / 40% video)
- **Elements**:
  - Badge dore "L'Ame de Dubai en Flacon" (bordure doree, fond transparent)
  - Titre H1: "Fragrances Prestigieuses d'Orient"
  - Sous-titre: Description courte
  - Badge prix "35EUR / Flacon"
  - Bouton CTA dore "Explorer la Collection"
  - Trust badges (Authentique, Livraison, Paiement)
- **Video**: https://res.cloudinary.com/db2ljqpdt/video/upload/vc_h264/v1768561379/lv_0_20260116114130_jsd1ae.mp4

#### Section 2: Statistiques
- **Fond**: Gradient noir/gris fonce
- **Layout**: 4 colonnes
- **Contenu**:
  - 150+ Essences Rares
  - 35EUR Prix Fixe
  - 3 Annees d'Expertise
  - 48-72h Livraison Rapide

#### Section 3: Explorer par Genre
- **Fond**: Blanc/clair
- **Layout**: 3 colonnes egales
- **Cards**: Image + Overlay gradient + Titre centre
  - Homme
  - Femme
  - Mixte
- **Effet**: Zoom image au hover

#### Section 4: Nouveautes
- **Fond**: Blanc
- **Layout**: Grille 4 colonnes (2 sur mobile)
- **Produits**: 8 produits avec badge "Nouveau" vert

#### Section 5: Best-Sellers
- **Fond**: Gradient gris clair
- **Layout**: Grille 4 colonnes
- **Elements**:
  - Badge "Selection Prestige" dore
  - Titre "Nos Best-Sellers"
  - 8 produits avec badge "Best" dore
  - Bouton CTA

#### Section 6: My Fragrance World
- **Fond**: Blanc
- **Layout**: Grille 4x2
- **Produits**: Filtres par marque Fragrance World

#### Section 7: Univers Lattafa
- **Fond**: Gris clair
- **Layout**: Grille 4x2
- **Produits**: Filtres par marque Lattafa

#### Section 8: Familles Olfactives
- **Fond**: Blanc
- **Layout**: Grille 3x2
- **Cards**: Image + Overlay noir 50% + Titre centre
  - Boise
  - Oriental
  - Floral
  - Fruite
  - Frais
  - Gourmand

#### Section 9: Parfum a l'Honneur (KHAMRAH)
- **Fond**: Gris
- **Layout**: 2 colonnes (texte + video)
- **Video**: Video du parfum Khamrah

#### Section 10: Trouvez Votre Parfum (CTA)
- **Fond**: Gradient dore
- **Style**: Card arrondie avec icone
- **Bouton**: Lien vers quiz/finder

#### Section 11: Blog
- **Fond**: Gris
- **Layout**: 3 colonnes
- **Cards**: Image 16:9 + Titre + Description + Lien

#### Section 12: Avis Google (CTA)
- **Fond**: Noir avec particules dorees
- **Elements**:
  - 5 etoiles dorees
  - Texte invitation avis
  - Bouton dore vers Google

#### Section 13: Citation/Philosophie
- **Fond**: Noir avec bordure doree
- **Style**: Guillemets decoratifs, texte centre italic

#### Section 14: SEO Content
- **Fond**: Gris clair
- **Contenu**: Texte optimise SEO

---

## 4. COMPOSANTS ELEMENTOR

### Bouton Principal
```css
Background: linear-gradient(to right, #c58a3d, #b67a2d)
Border-radius: 12px
Padding: 16px 32px
Font: Inter 600
Color: #ffffff
Shadow: 0 25px 50px rgba(197, 138, 61, 0.3)
Hover: scale(1.05), gradient inverse
```

### Bouton Secondaire (Outline)
```css
Background: transparent
Border: 2px solid #c58a3d
Border-radius: 8px
Color: #c58a3d
Hover: background #c58a3d, color #fff
```

### Card Produit
```css
Background: #ffffff
Border-radius: 16px
Shadow: 0 4px 6px rgba(0,0,0,0.1)
Hover: shadow plus prononcee, scale(1.02)
```

### Badge Premium
```css
Background: rgba(197, 138, 61, 0.1)
Border: 1px solid rgba(197, 138, 61, 0.3)
Border-radius: 9999px
Padding: 8px 24px
Font: Inter 600 12px uppercase
Color: #c58a3d
```

### Overlay Gradient (Cards Categories)
```css
Background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)
```

---

## 5. HEADER

### Structure
- **Logo**: A gauche
- **Menu**: Centre
  - Accueil
  - Boutique (avec mega menu)
  - Marques
  - Blog
  - Contact
- **Icons**: A droite
  - Recherche
  - Compte
  - Panier (avec compteur)

### Style
```css
Background: transparent (hero) puis #000 au scroll
Position: Fixed
Height: 80px
Transition: smooth
```

---

## 6. FOOTER

### Structure 4 Colonnes
1. **Logo + Description** + Reseaux sociaux
2. **Liens Rapides**: Accueil, Boutique, Nouveautes, Best-sellers
3. **Informations**: Contact, FAQ, Livraison, CGV
4. **Newsletter**: Champ email + bouton

### Style
```css
Background: #111827
Color: #9ca3af
Links hover: #c58a3d
```

### Reseaux Sociaux
- Instagram: https://instagram.com/dubainegoce
- TikTok: https://tiktok.com/@dubainegoce
- Facebook: https://facebook.com/dubainegoce

---

## 7. PAGE SHOP (WooCommerce)

### Sidebar Filtres
- Genre (Homme, Femme, Mixte)
- Marque (Lattafa, Alhambra, Fragrance World, etc.)
- Famille Olfactive
- Prix

### Grille Produits
- 4 colonnes desktop
- 2 colonnes mobile
- Pagination ou Load More

### Card Produit
- Image ratio 1:1
- Nom produit
- Marque
- Prix 35EUR
- Bouton Ajouter au panier

---

## 8. PAGE PRODUIT

### Layout
- 2 colonnes: Galerie (50%) + Infos (50%)

### Galerie
- Image principale grande
- Thumbnails en dessous
- Zoom au hover

### Infos Produit
- Breadcrumb
- Nom
- Marque (lien)
- Prix 35EUR barre
- Description courte
- Notes olfactives (badges)
- Quantite + Bouton Ajouter
- Infos livraison
- Accordeons: Description complete, Composition, Conseils

---

## 9. ANIMATIONS (CSS Custom)

```css
/* Fade In Up */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse pour badges */
.pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Hover Scale */
.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

---

## 10. PLUGINS RECOMMANDES

### Essentiels (Gratuits)
- **Elementor** (Free)
- **flavor starter** (Theme)
- **WooCommerce**
- **Jetrile filter** (Filtres produits) ou utiliser Flavor Starter natif

### Recommandes
- **MetForm** ou **WPForms Lite** (Formulaires)
- **Jetrile smart filters* (Filtres avances - gratuit)
- **JETRILE WIZARD PRO ** (Sliders - gratuit)

---

## 11. CONFIGURATION WOOCOMMERCE

### Prix
- Prix unique: 35EUR
- Devise: EUR
- Position: Apres le montant

### Livraison
- Mondial Relay selon poids:
  - 0-500g: 4,10EUR
  - 500-750g: 5,10EUR
  - 750-1kg: 5,10EUR
  - 1-2kg: 6,60EUR
  - 2-4kg: 7,99EUR
  - 4-10kg: 15,99EUR

### Paiement
- Stripe (Carte bancaire)
- Activer codes promo

---

## 12. IMAGES A PREPARER

### Hero
- Video MP4 (format 4:5)
- Fallback image JPG

### Categories Genre
- homme.jpg (800x1000)
- femme.jpg (800x1000)
- mixte.jpg (800x1000)

### Familles Olfactives
- boise.jpg (600x400)
- oriental.jpg (600x400)
- floral.jpg (600x400)
- fruite.jpg (600x400)
- frais.jpg (600x400)
- gourmand.jpg (600x400)

### Produits
- Image principale 1:1 (800x800)
- Images secondaires

---

## 13. SEO

### Meta Titles
- Accueil: "DubaiNegoce | Parfums de Dubai Authentiques a 35EUR"
- Shop: "Boutique Parfums Orientaux | DubaiNegoce"
- Produit: "[Nom Produit] - [Marque] | DubaiNegoce"

### Meta Descriptions
- Inclure: parfums Dubai, 35EUR, livraison France, authentique

---

## 14. CHECKLIST DE MIGRATION

### Phase 1: Configuration
- [ ] Installer WordPress
- [ ] Installer theme flavor starter
- [ ] Installer Elementor Free
- [ ] Installer WooCommerce
- [ ] Configurer couleurs globales
- [ ] Configurer typographies
- [ ] Importer Google Fonts

### Phase 2: Structure
- [ ] Creer Header personnalise
- [ ] Creer Footer personnalise
- [ ] Creer template page produit
- [ ] Creer template page shop

### Phase 3: Pages
- [ ] Page Accueil (toutes les sections)
- [ ] Page Shop
- [ ] Page Contact
- [ ] Page FAQ
- [ ] Page Livraison
- [ ] Page CGV
- [ ] Pages Blog

### Phase 4: Produits
- [ ] Importer les 144 produits
- [ ] Ajouter images
- [ ] Configurer categories
- [ ] Configurer attributs (marque, famille, genre)

### Phase 5: Finitions
- [ ] Tester responsive mobile
- [ ] Optimiser vitesse
- [ ] Configurer Stripe
- [ ] Tester commande
- [ ] Configurer alertes Telegram
- [ ] Configurer emails

---

## 15. RESSOURCES

### URLs Actuelles
- Site: https://dubainegoce.com
- Video Hero: https://res.cloudinary.com/db2ljqpdt/video/upload/vc_h264/v1768561379/lv_0_20260116114130_jsd1ae.mp4

### Cloudinary
- Cloud name: db2ljqpdt / dhjwimevi
- Images produits deja hebergees

### Contact
- Email: contact@dubainegoce.com
- Instagram: @dubainegoce
- TikTok: @dubainegoce

---

**Document cree le 17 Janvier 2026**
**Pour: Migration DubaiNegoce vers WordPress/Elementor**
