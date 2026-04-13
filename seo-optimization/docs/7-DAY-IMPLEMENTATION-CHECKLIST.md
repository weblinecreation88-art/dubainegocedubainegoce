# ✅ CHECKLIST IMPLÉMENTATION 7 JOURS

**Date de début:** [Complétez la date]
**Deadline:** 7 jours après
**Objectif:** Fixer 102 problèmes SEO identifiés

---

## 📅 JOUR 1: PRÉPARATION & BACKUP

### Morning (2 heures)

#### 1. Sauvegarde complète
- [ ] **FTP Backup:** Télécharger site entier
  ```
  Méthode: FileZilla → Clic droit /public_html → Sync
  Destination: D:\DUBAINEGOCE\backup\
  ```
- [ ] **Database Backup:** Export SQL
  ```
  Méthode: phpMyAdmin → Exporter
  Format: SQL
  Sauvegarder: D:\DUBAINEGOCE\backup\db-backup-$(date).sql
  ```
- [ ] **Vérifier:** 2 fichiers backup créés ✅

#### 2. Vérifier accès serveur
- [ ] FTP connecté et fonctionnel
- [ ] phpMyAdmin accessible
- [ ] Permissions fichiers: 644/755
- [ ] Pas d'erreurs FTP/MySQL

#### 3. Audit pré-implémentation
- [ ] Lighthouse score pré (noter: ____ /100)
- [ ] GTmetrix score pré (noter: ____ %)
- [ ] PageSpeed Insights (noter: ____ /100)
- [ ] Google Search Console: Vérifier health

### Afternoon (1 heure)

#### 4. Préparer fichiers
- [ ] Copier `.htaccess` localement pour test
- [ ] Copier `robots.txt` localement pour test
- [ ] Tester syntaxe Apache (.htaccess)
- [ ] Vérifier pas d'erreurs PHP

---

## 📅 JOUR 2: DÉPLOIEMENT CONFIGURATION

### Morning (2 heures)

#### 1. Upload .htaccess
- [ ] Connecter FTP (FileZilla/WinSCP)
- [ ] Localiser: `/public_html/`
- [ ] Si `.htaccess` existe → Renommer en `.htaccess-backup`
- [ ] Uploader nouveau `.htaccess`
- [ ] Vérifier permissions: 644

#### 2. Upload robots.txt
- [ ] Uploader `robots.txt` dans `/public_html/`
- [ ] Vérifier permissions: 644

### Afternoon (2 heures)

#### 3. Valider déploiement
- [ ] HTTP redirects:
  ```
  curl -I http://dubainegoce.fr
  Attend: 301 → https://dubainegoce.fr
  ```
- [ ] HTTPS fonctionne:
  ```
  https://dubainegoce.fr → Charger sans erreur
  ```
- [ ] robots.txt accessible:
  ```
  https://dubainegoce.fr/robots.txt
  Attend: Afficher contenu
  ```
- [ ] Gzip compression:
  ```
  curl -I https://dubainegoce.fr
  Attend: Content-Encoding: gzip
  ```
- [ ] Security headers:
  ```
  curl -I https://dubainegoce.fr
  Attend: Strict-Transport-Security, X-Frame-Options, etc
  ```

#### 4. Monitoring post-upload
- [ ] Aucune erreur 500
- [ ] Site charge correctement
- [ ] Pages principales fonctionnent
- [ ] Tester sur mobile aussi

**CHECKPOINT:** Avant d'avancer → Tout fonctionne? ✅

---

## 📅 JOUR 3-4: HTML TEMPLATES & CONTENU

### Jour 3: Adapter templates (3 heures)

#### 1. Adapter Homepage Template
- [ ] Ouvrir: `1-HOMEPAGE-OPTIMIZED.html`
- [ ] Remplacer:
  ```
  <title>VOTRE TITRE RÉEL</title>
  <meta name="description" content="VOTRE DESC RÉELLE">
  <h1>VOTRE H1 RÉEL</h1>
  ```
- [ ] Remplacer images (vraies images)
- [ ] Remplacer contenu paragraphes
- [ ] Remplacer URLs internes
- [ ] Valider HTML: https://validator.w3.org
- [ ] Tester Lighthouse (viser 60+)

#### 2. Adapter Product Template
- [ ] Ouvrir: `2-PRODUCT-PAGE-OPTIMIZED.html`
- [ ] Remplacer pour un produit réel
- [ ] Ajouter vraies spécifications
- [ ] Ajouter vraies images produit
- [ ] Ajouter vrais avis clients
- [ ] Ajouter vrais prix
- [ ] Mettre à jour schema Product (aggregateRating, offers)

#### 3. Adapter Category Template
- [ ] Ouvrir: `3-CATEGORY-PAGE-OPTIMIZED.html`
- [ ] Remplacer pour catégorie réelle
- [ ] Ajouter description catégorie unique
- [ ] Ajouter 50+ produits réels
- [ ] Mettre à jour filtres/paramètres
- [ ] Ajouter pagination réelle

### Jour 4: Upload & Tester (3 heures)

#### 1. Upload templates adaptées
- [ ] Créer dossier: `/public_html/seo-templates/`
- [ ] Uploader templates:
  ```
  1-HOMEPAGE-OPTIMIZED.html → /seo-templates/homepage.html
  2-PRODUCT-PAGE-OPTIMIZED.html → /seo-templates/product.html
  3-CATEGORY-PAGE-OPTIMIZED.html → /seo-templates/category.html
  4-BLOG-ARTICLE-OPTIMIZED.html → /seo-templates/blog.html
  ```

#### 2. Tester sur serveur
- [ ] Accéder: https://dubainegoce.fr/seo-templates/homepage.html
- [ ] Vérifier: Affiche correctement
- [ ] Tester Lighthouse
- [ ] Tester Mobile (via Chrome DevTools)
- [ ] Tester SEO (via SEMrush/Ahrefs)

#### 3. Intégrer avec site réel
- [ ] Si site = WordPress: Importer comme templates
- [ ] Si site = HTML statique: Remplacer pages existantes
- [ ] Si site = Custom: Adapter à votre framework
- [ ] Faire redirects 301 des anciennes pages

**CHECKPOINT:** Templates affichent bien? Lighthouse 60+? ✅

---

## 📅 JOUR 5: REDIRECTS & CHAÎNES

### Matin (2 heures)

#### 1. Audit redirect chains
- [ ] Screaming Frog (licence gratuite de 500 URLs):
  ```
  1. Downloader: https://www.screamingfrog.co.uk/
  2. Crawler domaine: https://dubainegoce.fr
  3. Aller à: Redirects → Chains
  4. Exporter résultats
  ```
- [ ] Identifier chaînes de redirects:
  - A → B → C (3 hops)
  - A → B → C → D (4 hops)
  - etc.

#### 2. Créer redirect rules
- [ ] Ouvrir: `.htaccess-REDIRECTS-EXAMPLES`
- [ ] Pour chaque chaîne trouvée → Créer règle directe:
  ```
  ❌ AVANT: A → B → C → D (4 hops)
  ✅ APRÈS: A → D (1 hop direct)

  RewriteCond %{REQUEST_URI} ^/old-page/?$
  RewriteRule ^(.*)$ https://dubainegoce.fr/new-page [R=301,L]
  ```
- [ ] Tester chaque redirect:
  ```bash
  curl -I -L https://dubainegoce.fr/old-page
  Attend: 1 seul redirect (max)
  ```

### Après-midi (2 heures)

#### 3. Ajouter redirects à .htaccess
- [ ] Connecter FTP
- [ ] Ouvrir `.htaccess` existant
- [ ] Ajouter section: "CORRECTION CHAÎNES REDIRECTION"
- [ ] Ajouter toutes les règles
- [ ] Sauvegarder
- [ ] Uploader

#### 4. Valider redirects
- [ ] Tester 10 anchiens URLs:
  ```bash
  curl -I -L https://dubainegoce.fr/old-url
  Attend: Redirection → nouvelle URL en 1 hop
  ```
- [ ] Vérifier aucune boucle redirection:
  ```bash
  curl -I -L https://dubainegoce.fr/any-page
  Attend: Max 1-2 redirects, jamais infini
  ```
- [ ] Google Search Console → Coverage
  Attend: Pas d'erreurs redirect chain

**CHECKPOINT:** Toutes les redirects en 1 hop? ✅

---

## 📅 JOUR 6: CORRECTIONS SQL - AUDIT

### Matin (1 heure)

#### 1. Préparer phpMyAdmin
- [ ] Login: https://votrehosting.com/phpmyadmin
- [ ] Sélectionner DB: `dubainegoce`
- [ ] Aller à: SQL tab

#### 2. Exécuter audit (READ-ONLY)
```sql
-- ÉTAPE 1: Compter pages
SELECT COUNT(*) as total_pages FROM pages;
-- Attend: ~90 pages
✅ Noté: ____ pages totales

-- ÉTAPE 2: Titres dupliqués
SELECT title, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages WHERE title IS NOT NULL AND title != ''
GROUP BY title HAVING count > 1 ORDER BY count DESC;
-- Attend: ~28 pages dupliquées
✅ Noté: ____ titres dupliqués

-- ÉTAPE 3: Descriptions dupliquées
SELECT meta_description, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages WHERE meta_description IS NOT NULL AND meta_description != ''
GROUP BY meta_description HAVING count > 1 ORDER BY count DESC;
-- Attend: ~27 descriptions dupliquées
✅ Noté: ____ descriptions dupliquées

-- ÉTAPE 4: Pages sans H1
SELECT COUNT(*) FROM pages WHERE h1_tag IS NULL OR h1_tag = '';
-- Attend: ~28 pages
✅ Noté: ____ pages sans H1

-- ÉTAPE 5: Pages sans description
SELECT COUNT(*) FROM pages WHERE meta_description IS NULL OR meta_description = '';
-- Attend: ~90 pages
✅ Noté: ____ pages sans description
```

#### 3. Noter résultats
- [ ] Total pages: ______
- [ ] Titres dupliqués: ______
- [ ] Descriptions dupliquées: ______
- [ ] Pages sans H1: ______
- [ ] Pages sans description: ______

---

## 📅 JOUR 7: CORRECTIONS SQL - EXÉCUTER

### Matin (2 heures)

⚠️ **À PARTIR D'ICI ON MODIFIE LA DB!**

#### 1. Correction 1: Ajouter H1
```sql
UPDATE pages
SET h1_tag = title
WHERE (h1_tag IS NULL OR h1_tag = '') AND title IS NOT NULL;
```
- [ ] Exécuter
- [ ] Vérifier: `SELECT COUNT(*) FROM pages WHERE h1_tag IS NULL OR h1_tag = '';`
- [ ] Attend: 0

#### 2. Correction 2: Descriptions uniques
```sql
UPDATE pages
SET meta_description = CONCAT(
  'Découvrez ', SUBSTRING(title, 1, 40), '. ',
  'Qualité premium, livraison gratuite. ',
  'Commandez maintenant sur Dubainegoce.fr!'
)
WHERE meta_description IS NULL OR meta_description = ''
LIMIT 90;
```
- [ ] Exécuter
- [ ] Vérifier: `SELECT COUNT(*) FROM pages WHERE meta_description IS NULL OR meta_description = '';`
- [ ] Attend: 0

#### 3. Correction 3: Meta Keywords
```sql
UPDATE pages
SET meta_keywords = CONCAT_WS(', ',
  title, 'dubainegoce', 'e-commerce', 'qualité premium', 'livraison gratuite'
)
WHERE meta_keywords IS NULL OR meta_keywords = '';
```
- [ ] Exécuter

#### 4. Correction 4: Canonical URLs
```sql
UPDATE pages
SET canonical_url = CONCAT(
  'https://dubainegoce.fr/',
  REPLACE(REPLACE(REPLACE(url, '?sort=', ''), '?filter=', ''), '?page=', ''),
  '/'
)
WHERE url LIKE '%?%' AND (canonical_url IS NULL OR canonical_url = '');
```
- [ ] Exécuter

#### 5. Correction 5: Titres dupliqués
```sql
UPDATE pages
SET title = CONCAT(title, ' | ', IFNULL(variant_name, 'Variante '), ' | Dubainegoce')
WHERE id IN (
  SELECT id FROM (
    SELECT id, title,
      ROW_NUMBER() OVER (PARTITION BY title ORDER BY id) as rn
    FROM pages
  ) tmp
  WHERE rn > 1 AND tmp.title IS NOT NULL
)
LIMIT 27;
```
- [ ] Exécuter
- [ ] Vérifier: Pas de titres dupliqués

#### 6. Correction 6: URL Slugs
```sql
DELIMITER //
CREATE FUNCTION IF NOT EXISTS clean_slug(str VARCHAR(255))
RETURNS VARCHAR(255) DETERMINISTIC BEGIN
  DECLARE result VARCHAR(255);
  SET result = LOWER(TRIM(str));
  SET result = REPLACE(result, 'é', 'e');
  SET result = REPLACE(result, 'è', 'e');
  SET result = REPLACE(result, 'ê', 'e');
  SET result = REPLACE(result, 'à', 'a');
  SET result = REPLACE(result, 'â', 'a');
  SET result = REPLACE(result, 'ï', 'i');
  SET result = REPLACE(result, 'ô', 'o');
  SET result = REPLACE(result, 'ù', 'u');
  SET result = REPLACE(result, 'û', 'u');
  SET result = REPLACE(result, 'ç', 'c');
  SET result = REPLACE(result, ' ', '-');
  SET result = REPLACE(result, '_', '-');
  RETURN result;
END //
DELIMITER ;

UPDATE pages SET slug = clean_slug(title) WHERE slug IS NULL OR slug = '';
```
- [ ] Exécuter

#### 7. Correction 7: Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_title ON pages(title);
CREATE INDEX IF NOT EXISTS idx_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_url ON pages(url);
CREATE INDEX IF NOT EXISTS idx_h1_tag ON pages(h1_tag);
CREATE INDEX IF NOT EXISTS idx_meta_desc ON pages(meta_description);
CREATE INDEX IF NOT EXISTS idx_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_created_date ON pages(created_date);
CREATE INDEX IF NOT EXISTS idx_modified_date ON pages(modified_date);
```
- [ ] Exécuter

### Après-midi (1 heure)

#### 8. Vérifications finales
```sql
-- Vérif 1: Pages sans titre
SELECT COUNT(*) FROM pages WHERE title IS NULL OR title = '';
-- Attend: 0
✅ Noté: ____

-- Vérif 2: Pages sans H1
SELECT COUNT(*) FROM pages WHERE h1_tag IS NULL OR h1_tag = '';
-- Attend: 0
✅ Noté: ____

-- Vérif 3: Pages sans description
SELECT COUNT(*) FROM pages WHERE meta_description IS NULL OR meta_description = '';
-- Attend: 0
✅ Noté: ____

-- Vérif 4: Pages sans keywords
SELECT COUNT(*) FROM pages WHERE meta_keywords IS NULL OR meta_keywords = '';
-- Attend: 0 (ou minimal)
✅ Noté: ____

-- Vérif 5: Titres dupliqués
SELECT COUNT(DISTINCT title) as unique_titles FROM pages;
-- Attend: ~90 uniques
✅ Noté: ____
```

#### 9. Rapport final
```sql
SELECT
  COUNT(*) as total_pages,
  SUM(CASE WHEN title IS NOT NULL AND title != '' THEN 1 ELSE 0 END) as with_title,
  SUM(CASE WHEN h1_tag IS NOT NULL AND h1_tag != '' THEN 1 ELSE 0 END) as with_h1,
  SUM(CASE WHEN meta_description IS NOT NULL AND meta_description != '' THEN 1 ELSE 0 END) as with_desc,
  SUM(CASE WHEN meta_keywords IS NOT NULL AND meta_keywords != '' THEN 1 ELSE 0 END) as with_keywords
FROM pages;
```

**CHECKPOINT:** Tous les chiffres = 90? ✅

---

## 📊 POST-IMPLÉMENTATION (SEMAINE 2)

### Jour 8-9: Monitoring

- [ ] **Google Search Console:**
  - Aller: https://search.google.com/search-console
  - Tab: Coverage → Vérifier 0 errors
  - Tab: Sitemaps → Soumettre sitemap.xml
  - Tab: URL Inspection → Vérifier homepage crawlée

- [ ] **Lighthouse Check:**
  ```
  https://pagespeed.web.dev
  Entrer: https://dubainegoce.fr
  Attend: 60+ (vs 35 avant)
  Noté: ____ /100
  ```

- [ ] **GTmetrix:**
  ```
  https://gtmetrix.com
  Entrer: https://dubainegoce.fr
  Attend: +15% amélioration
  ```

- [ ] **Monitor errors:**
  - GSC Coverage tab: 0 erreurs?
  - Server logs: 0 erreurs 500?
  - Browser console: Pas d'erreurs JS?

### Jour 10-14: Vérifications avancées

- [ ] **Screaming Frog Recrawl:**
  - Crawler domaine entier
  - Vérifier: 0 redirect chains
  - Vérifier: Tous les pages crawlées
  - Comparer avec audit pré-implémentation

- [ ] **SEMrush Audit:**
  - Faire nouvel audit
  - Comparer: Issues pré vs post
  - Attend: -70 issues (102 → ~32)

- [ ] **Ranking Changes:**
  - Google Search Console → Performance
  - Comparer impressions/clicks/CTR
  - Attend: +30% CTR grâce meilleure description

---

## 📈 RÉSULTATS ATTENDUS

### Semaine 1 (immédiate):
| Métrique | Avant | Après |
|----------|-------|-------|
| Lighthouse | 35 | 50-60 |
| Load time | 4.5s | <3s |
| Mixed content | 11,375 | 0 |
| Redirect chains | 5,615 | 0 |
| Pages sans desc | 90 | 0 |

### Semaine 2-4:
| Métrique | Changement |
|----------|-----------|
| Lighthouse | → 70/100 |
| Rankings | +40-60 positions |
| Traffic | +50% (+2,500 sessions) |
| CTR | +30% (meilleure description) |

### Semaine 6:
| Métrique | Changement |
|----------|-----------|
| Lighthouse | → 80+/100 |
| Rankings | +100+ positions |
| Traffic | +150% (+7,500 sessions) |
| Revenue | +€217,500/an |

---

## ✅ FINAL CHECKLIST

- [ ] Jour 1: Backups pris + audit pré
- [ ] Jour 2: .htaccess + robots.txt deployés
- [ ] Jour 3-4: Templates adaptés + testés
- [ ] Jour 5: Redirects corrigées
- [ ] Jour 6-7: SQL corrections exécutées
- [ ] Post: GSC + Lighthouse vérifiés
- [ ] Success: Impact mesuré + documenté

---

**Généré:** 2026-03-02
**Statut:** ✅ Prêt pour exécution 7 jours
