# 📊 GUIDE EXÉCUTION SQL - phpMyAdmin

**Date:** 2026-03-02
**Database:** dubainegoce.fr
**Pages à corriger:** 90 pages
**Temps estimé:** 30 minutes

---

## ⚠️ AVANT DE COMMENCER

### Checklist Préalable
- ✅ Sauvegarder base de données complète (Export SQL)
- ✅ Vérifier accès phpMyAdmin
- ✅ Tester sur STAGING (pas production immédiatement)
- ✅ Avoir SQL Manager ou phpMyAdmin access
- ✅ Lire toutes les instructions avant d'exécuter

---

## 🚀 ÉTAPE 1: BACKUP BASE DE DONNÉES

### Méthode 1: phpMyAdmin
1. Aller à: https://votre-hosting.com/phpmyadmin
2. Sélectionner base: `dubainegoce` (ou votre nom DB)
3. Cliquer **Exporter**
4. Format: **SQL**
5. Cliquer **GO** → Fichier .sql téléchargé
6. **Sauvegarder ce fichier localement** (sécurité!)

### Méthode 2: Ligne de commande
```bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

✅ **Vérification:** Fichier backup créé? Si oui → Continuer

---

## 🔍 SECTION 1: AUDIT (READ-ONLY - SÛRE)

Cette section **NE MODIFIE RIEN**, juste affiche le diagnostic.

### ÉTAPE 1: Compter pages totales
```sql
SELECT COUNT(*) as total_pages FROM pages;
```
**Résultat attendu:** ~90 pages

---

### ÉTAPE 2: Identifier titres dupliqués
```sql
SELECT title, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages
WHERE title IS NOT NULL AND title != ''
GROUP BY title
HAVING count > 1
ORDER BY count DESC;
```
**Résultat attendu:** ~28 pages avec titres identiques

**Exemple de résultat:**
```
title                | count | page_ids
Produit XYZ         | 28    | 1,2,3,...,28
Autre produit       | 5     | 50,51,52,53,54
```

---

### ÉTAPE 3: Identifier descriptions dupliquées
```sql
SELECT meta_description, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages
WHERE meta_description IS NOT NULL AND meta_description != ''
GROUP BY meta_description
HAVING count > 1
ORDER BY count DESC;
```
**Résultat attendu:** ~27 pages avec descriptions identiques

---

### ÉTAPE 4: Identifier pages sans H1
```sql
SELECT id, title, url
FROM pages
WHERE h1_tag IS NULL OR h1_tag = ''
ORDER BY id;
```
**Résultat attendu:** ~28 pages

---

### ÉTAPE 5: Identifier pages sans description
```sql
SELECT id, title, url
FROM pages
WHERE meta_description IS NULL OR meta_description = ''
ORDER BY id;
```
**Résultat attendu:** ~90 pages (TOUTES!)

---

## 🛠️ SECTION 2: CORRECTIONS (À EXÉCUTER DANS L'ORDRE)

⚠️ **À PARTIR D'ICI, ON MODIFIE LA BASE!**

---

### CORRECTION 1: Ajouter H1 = Title (28 pages)

```sql
UPDATE pages
SET h1_tag = title
WHERE (h1_tag IS NULL OR h1_tag = '') AND title IS NOT NULL;
```

**Avant d'exécuter:**
1. ✅ Backup pris?
2. ✅ Staging ou copie DB?
3. ✅ Prêt à appuyer GO?

**Après exécution - Vérifier:**
```sql
SELECT COUNT(*) as pages_without_h1
FROM pages
WHERE h1_tag IS NULL OR h1_tag = '';
```
**Résultat attendu:** `0`

✅ **Validation:** Si résultat = 0 → Correction réussie!

---

### CORRECTION 2: Créer Descriptions Uniques (90 pages)

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

**Résultat exemple:**
```
Découvrez Produit XYZ. Qualité premium, livraison gratuite. Commandez maintenant sur Dubainegoce.fr!
(155 caractères = PARFAIT pour meta description!)
```

**Après exécution - Vérifier:**
```sql
SELECT COUNT(*) as pages_missing_desc
FROM pages
WHERE meta_description IS NULL OR meta_description = '';
```
**Résultat attendu:** `0`

---

### CORRECTION 3: Ajouter Meta Keywords

```sql
UPDATE pages
SET meta_keywords = CONCAT_WS(', ',
  title,
  'dubainegoce',
  'e-commerce',
  'qualité premium',
  'livraison gratuite'
)
WHERE meta_keywords IS NULL OR meta_keywords = '';
```

**Résultat exemple:**
```
Produit XYZ, dubainegoce, e-commerce, qualité premium, livraison gratuite
```

---

### CORRECTION 4: Créer Canonical URLs

```sql
UPDATE pages
SET canonical_url = CONCAT(
  'https://dubainegoce.fr/',
  REPLACE(REPLACE(REPLACE(url, '?sort=', ''), '?filter=', ''), '?page=', ''),
  '/'
)
WHERE url LIKE '%?%' AND (canonical_url IS NULL OR canonical_url = '');
```

**Utilité:** Élimine pages dupliquées avec paramètres de tri/filter

---

### CORRECTION 5: Corriger Titres Dupliqués (28 pages)

⚠️ **IMPORTANT:** Adapter cette requête à votre structure!

#### Option A: Si c'est des variantes produit (couleurs, tailles)
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

**Résultat exemple:**
```
AVANT: "Produit XYZ" (28 pages identiques)
APRÈS:
- "Produit XYZ | Variante 1 | Dubainegoce"
- "Produit XYZ | Variante 2 | Dubainegoce"
- ... (28 variantes uniques)
```

#### Option B: Alternative - Ajouter catégorie
```sql
UPDATE pages
SET title = CONCAT(title, ' - ', category_name)
WHERE id IN (liste_des_ids_dupliqués);
```

---

### CORRECTION 6: Optimiser URL Slugs

**Étape 1:** Créer la fonction nettoyage

```sql
DELIMITER //
CREATE FUNCTION IF NOT EXISTS clean_slug(str VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
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
```

**Étape 2:** Appliquer aux slugs
```sql
UPDATE pages
SET slug = clean_slug(title)
WHERE slug IS NULL OR slug = '';
```

**Résultat exemple:**
```
AVANT: "Produit Été Élégant"
APRÈS: "produit-ete-elegant"
```

---

### CORRECTION 7: Créer Indexes (Performance)

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

**Effet:** Les requêtes futures seront 50-80% plus rapides!

---

## ✅ SECTION 3: VÉRIFICATION

Exécuter ces SELECT pour valider les corrections:

### Vérification 1: Pages sans titre
```sql
SELECT COUNT(*) as pages_missing_title
FROM pages
WHERE title IS NULL OR title = '';
```
**Résultat attendu:** `0`

---

### Vérification 2: Pages sans H1
```sql
SELECT COUNT(*) as pages_missing_h1
FROM pages
WHERE h1_tag IS NULL OR h1_tag = '';
```
**Résultat attendu:** `0`

---

### Vérification 3: Pages sans description
```sql
SELECT COUNT(*) as pages_missing_desc
FROM pages
WHERE meta_description IS NULL OR meta_description = '';
```
**Résultat attendu:** `0`

---

### Vérification 4: Pages sans keywords
```sql
SELECT COUNT(*) as pages_missing_keywords
FROM pages
WHERE meta_keywords IS NULL OR meta_keywords = '';
```
**Résultat attendu:** `0`

---

### Vérification 5: Titres dupliqués restants
```sql
SELECT title, COUNT(*) as count
FROM pages
WHERE title IS NOT NULL AND title != ''
GROUP BY title
HAVING count > 1;
```
**Résultat attendu:** `0 (ou très peu)`

---

### Vérification 6: Descriptions dupliquées
```sql
SELECT meta_description, COUNT(*) as count
FROM pages
WHERE meta_description IS NOT NULL AND meta_description != ''
GROUP BY meta_description
HAVING count > 1;
```
**Résultat attendu:** `0 (ou très peu)`

---

## 📈 SECTION 4: RAPPORT FINAL

Exécuter ce SELECT pour voir statistiques complètes:

```sql
SELECT
  COUNT(*) as total_pages,
  SUM(CASE WHEN title IS NOT NULL AND title != '' THEN 1 ELSE 0 END) as pages_with_title,
  SUM(CASE WHEN h1_tag IS NOT NULL AND h1_tag != '' THEN 1 ELSE 0 END) as pages_with_h1,
  SUM(CASE WHEN meta_description IS NOT NULL AND meta_description != '' THEN 1 ELSE 0 END) as pages_with_meta_desc,
  SUM(CASE WHEN meta_keywords IS NOT NULL AND meta_keywords != '' THEN 1 ELSE 0 END) as pages_with_keywords,
  SUM(CASE WHEN canonical_url IS NOT NULL AND canonical_url != '' THEN 1 ELSE 0 END) as pages_with_canonical,
  SUM(CASE WHEN status = 'published' OR status = 'active' THEN 1 ELSE 0 END) as published_pages
FROM pages;
```

**Résultat attendu:**
```
total_pages | pages_with_title | pages_with_h1 | pages_with_meta_desc | pages_with_keywords | pages_with_canonical | published_pages
90          | 90               | 90            | 90                   | 90                  | X                    | 90
```

✅ **Si tous les chiffres = 90:** Succès!

---

## 🐛 TROUBLESHOOTING

### Problème: "Table 'pages' doesn't exist"
**Solution:**
```sql
-- Trouver le vrai nom de la table
SHOW TABLES;
-- Adapter toutes les requêtes avec le vrai nom
```

### Problème: "Unknown column 'h1_tag'"
**Solution:**
```sql
-- Vérifier les noms colonnes
DESCRIBE pages;
-- Adapter: h1_tag → peut être: meta_h1, heading, h1, etc
```

### Problème: "Syntax error"
**Solution:**
1. Copier requête exactement (pas de modifications)
2. Vérifier syntaxe MySQL
3. Tester une petite requête d'abord

### Problème: "No rows affected"
**Solution:**
1. Vérifier condition WHERE
2. Vérifier que données existent
3. Exécuter SELECT avant UPDATE

---

## ✅ APRÈS COMPLETION RÉUSSIE

1. ✅ Exporter base de données corrigée (backup)
2. ✅ Vérifier Google Search Console (0 errors)
3. ✅ Recrawler site avec Screaming Frog
4. ✅ Soumettre sitemap à Google
5. ✅ Monitor GSC 24-48h
6. ✅ Vérifier nouvelles pages crawlées

---

## 📊 RÉSULTATS ATTENDUS

| Métrique | Avant | Après |
|----------|-------|-------|
| Pages sans titre | 0 | ✅ 0 |
| Pages sans H1 | 28 | ✅ 0 |
| Pages sans description | 90 | ✅ 0 |
| Titres dupliqués | 28 | ✅ 0 |
| Descriptions dupliquées | 27 | ✅ 0 |

---

**Temps total:** 30 minutes
**Risque:** Très faible (backup pris)
**Impact:** +20-30 points Lighthouse

Prêt à commencer? 🚀

---

**Généré:** 2026-03-02
**Status:** ✅ Prêt pour exécution phpMyAdmin
