-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║              SQL CORRECTIONS À EXÉCUTER - dubainegoce.fr                 ║
-- ║                    Prêt pour phpMyAdmin execution                        ║
-- ║          Généré: 2026-03-02 | ÉTAPES ORDONNÉES                          ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- ⚠️ AVANT DE COMMENCER:
-- 1. SAUVEGARDER la base de données (Export SQL complet)
-- 2. Exécuter sur COPIE de la DB ou staging (pas production!)
-- 3. Vérifier SELECT avant UPDATE
-- 4. Exécuter une section à la fois
-- 5. Vérifier résultats après chaque UPDATE

-- ═════════════════════════════════════════════════════════════════════════════
-- SECTION 1: AUDIT - Identifier les problèmes (READ ONLY - SAFE)
-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ ÉTAPE 1: Compter pages totales
SELECT COUNT(*) as total_pages FROM pages;
-- Expected: ~90 pages

-- ✅ ÉTAPE 2: Identifier titres dupliqués
SELECT title, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages
WHERE title IS NOT NULL AND title != ''
GROUP BY title
HAVING count > 1
ORDER BY count DESC;
-- Expected: ~28 pages avec titres dupliqués

-- ✅ ÉTAPE 3: Identifier descriptions dupliquées
SELECT meta_description, COUNT(*) as count, GROUP_CONCAT(id SEPARATOR ',') as page_ids
FROM pages
WHERE meta_description IS NOT NULL AND meta_description != ''
GROUP BY meta_description
HAVING count > 1
ORDER BY count DESC;
-- Expected: ~27 pages avec descriptions dupliquées

-- ✅ ÉTAPE 4: Identifier pages sans H1
SELECT id, title, url
FROM pages
WHERE h1_tag IS NULL OR h1_tag = ''
ORDER BY id;
-- Expected: ~28 pages sans H1

-- ✅ ÉTAPE 5: Identifier pages sans description
SELECT id, title, url
FROM pages
WHERE meta_description IS NULL OR meta_description = ''
ORDER BY id;
-- Expected: ~90 pages sans description

-- ═════════════════════════════════════════════════════════════════════════════
-- SECTION 2: CORRECTIONS - Exécuter les UPDATE
-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 1: Ajouter H1 = Title (28 pages)
-- Exemple pour pages sans H1
UPDATE pages
SET h1_tag = title
WHERE (h1_tag IS NULL OR h1_tag = '') AND title IS NOT NULL;

-- Vérification
SELECT COUNT(*) as pages_without_h1
FROM pages
WHERE h1_tag IS NULL OR h1_tag = '';
-- Expected: 0

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 2: Créer Meta Descriptions uniques (90 pages)
-- Pour pages sans description: Utiliser titre + snippet contenu
UPDATE pages
SET meta_description = CONCAT(
  'Découvrez ', SUBSTRING(title, 1, 40), '. ',
  'Qualité premium, livraison gratuite. ',
  'Commandez maintenant sur Dubainegoce.fr!'
)
WHERE meta_description IS NULL OR meta_description = ''
LIMIT 90;

-- Vérification
SELECT COUNT(*) as pages_without_desc
FROM pages
WHERE meta_description IS NULL OR meta_description = '';
-- Expected: 0

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 3: Ajouter Meta Keywords
UPDATE pages
SET meta_keywords = CONCAT_WS(', ',
  title,
  'dubainegoce',
  'e-commerce',
  'qualité premium',
  'livraison gratuite'
)
WHERE meta_keywords IS NULL OR meta_keywords = '';

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 4: Créer Canonical URLs pour pages paramétrées
-- Exemple pour pages avec paramètres
UPDATE pages
SET canonical_url = CONCAT(
  'https://dubainegoce.fr/',
  REPLACE(REPLACE(REPLACE(url, '?sort=', ''), '?filter=', ''), '?page=', ''),
  '/'
)
WHERE url LIKE '%?%' AND (canonical_url IS NULL OR canonical_url = '');

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 5: Corriger Titres dupliqués (28 pages)
-- ATTENTION: Adapter l'identifiant unique à votre structure

-- Exemple 1: Si c'est des variantes produit (couleurs, tailles)
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

-- Exemple 2: Alternative - Ajouter catégorie si disponible
-- UPDATE pages
-- SET title = CONCAT(title, ' - ', category_name)
-- WHERE id IN (liste_des_ids_dupliqués);

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 6: Optimiser URL Slugs (supprimer accents)
-- Créer fonction nettoyage (si n'existe pas)
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

-- Appliquer la fonction aux slugs
UPDATE pages
SET slug = clean_slug(title)
WHERE slug IS NULL OR slug = '';

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ CORRECTION 7: Créer Indexes pour performance
-- ⚠️ Ceux-ci accelerent les requêtes futures
CREATE INDEX IF NOT EXISTS idx_title ON pages(title);
CREATE INDEX IF NOT EXISTS idx_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_url ON pages(url);
CREATE INDEX IF NOT EXISTS idx_h1_tag ON pages(h1_tag);
CREATE INDEX IF NOT EXISTS idx_meta_desc ON pages(meta_description);
CREATE INDEX IF NOT EXISTS idx_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_created_date ON pages(created_date);
CREATE INDEX IF NOT EXISTS idx_modified_date ON pages(modified_date);

-- ═════════════════════════════════════════════════════════════════════════════
-- SECTION 3: VÉRIFICATION - Checker résultats après corrections
-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ Vérification 1: Pages sans titre
SELECT COUNT(*) as pages_missing_title FROM pages WHERE title IS NULL OR title = '';
-- Expected: 0

-- ✅ Vérification 2: Pages sans H1
SELECT COUNT(*) as pages_missing_h1 FROM pages WHERE h1_tag IS NULL OR h1_tag = '';
-- Expected: 0

-- ✅ Vérification 3: Pages sans description
SELECT COUNT(*) as pages_missing_desc FROM pages WHERE meta_description IS NULL OR meta_description = '';
-- Expected: 0

-- ✅ Vérification 4: Pages sans keywords
SELECT COUNT(*) as pages_missing_keywords FROM pages WHERE meta_keywords IS NULL OR meta_keywords = '';
-- Expected: 0

-- ✅ Vérification 5: Titres dupliqués restants
SELECT title, COUNT(*) as count
FROM pages
WHERE title IS NOT NULL AND title != ''
GROUP BY title
HAVING count > 1;
-- Expected: 0 (or very few)

-- ✅ Vérification 6: Descriptions dupliquées restantes
SELECT meta_description, COUNT(*) as count
FROM pages
WHERE meta_description IS NOT NULL AND meta_description != ''
GROUP BY meta_description
HAVING count > 1;
-- Expected: 0 (or very few)

-- ═════════════════════════════════════════════════════════════════════════════
-- SECTION 4: RAPPORT FINAL - Statistiques après corrections
-- ═════════════════════════════════════════════════════════════════════════════

SELECT
  COUNT(*) as total_pages,
  SUM(CASE WHEN title IS NOT NULL AND title != '' THEN 1 ELSE 0 END) as pages_with_title,
  SUM(CASE WHEN h1_tag IS NOT NULL AND h1_tag != '' THEN 1 ELSE 0 END) as pages_with_h1,
  SUM(CASE WHEN meta_description IS NOT NULL AND meta_description != '' THEN 1 ELSE 0 END) as pages_with_meta_desc,
  SUM(CASE WHEN meta_keywords IS NOT NULL AND meta_keywords != '' THEN 1 ELSE 0 END) as pages_with_keywords,
  SUM(CASE WHEN canonical_url IS NOT NULL AND canonical_url != '' THEN 1 ELSE 0 END) as pages_with_canonical,
  SUM(CASE WHEN status = 'published' OR status = 'active' THEN 1 ELSE 0 END) as published_pages
FROM pages;

-- ═════════════════════════════════════════════════════════════════════════════
-- NOTES IMPORTANTES
-- ═════════════════════════════════════════════════════════════════════════════

-- ⚠️ SI ERREURS:
-- 1. Erreur de syntaxe? → Vérifier nom colonnes (adapter si nécessaire)
-- 2. Fonction exists? → Commencer par ÉTAPE 7 avant autres
-- 3. Aucun résultat UPDATE? → Vérifier condition WHERE
-- 4. Problèmes perfs? → Exécuter par sections, pas tout d'un coup

-- ✅ APRÈS COMPLETION:
-- 1. Vérifier Google Search Console (0 errors)
-- 2. Recrawl site avec Screaming Frog
-- 3. Submit sitemap à Google
-- 4. Monitor Search Console 24-48h
-- 5. Check for new errors ou issues

-- ═════════════════════════════════════════════════════════════════════════════
-- MAPPING COLONNES - À ADAPTER À VOTRE STRUCTURE
-- ═════════════════════════════════════════════════════════════════════════════

-- Si vos colonnes s'appellent différemment, remplacer:
-- pages → your_table_name
-- title → your_title_column
-- h1_tag → your_h1_column (ou meta_h1, heading1, etc)
-- meta_description → description, seo_desc, etc
-- meta_keywords → keywords, seo_keywords, etc
-- url → slug, uri, permalink, etc
-- status → state, is_published, visibility, etc

-- ═════════════════════════════════════════════════════════════════════════════

-- ✅ RÉSULTATS ATTENDUS APRÈS EXÉCUTION:
-- - 0 pages sans titre
-- - 0 pages sans H1
-- - 90+ pages avec descriptions
-- - 90+ pages avec keywords
-- - 0 titres dupliqués (ou minimal)
-- - 0 descriptions dupliquées (ou minimal)
-- - Indexes créés pour performance

-- Généré: 2026-03-02
-- Status: ✅ Prêt pour execution
