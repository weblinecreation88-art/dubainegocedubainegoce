-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║                    SQL CORRECTIONS SEO 2026                               ║
-- ║              Pour: dubainegoce.fr - Correction Duplication                ║
-- ║          Généré: 2026-03-02 | Expert Database Optimization               ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝

-- ⚠️ IMPORTANT: SAUVEGARDER LA BASE DE DONNÉES AVANT D'EXÉCUTER!

-- ═════════════════════════════════════════════════════════════════════════════
-- 1️⃣ IDENTIFIER PAGES AVEC TITRES DUPLIQUÉS (28 pages)
-- ═════════════════════════════════════════════════════════════════════════════

-- Voir tous les titres dupliqués
SELECT title, COUNT(*) as count, GROUP_CONCAT(id) as page_ids
FROM pages
WHERE title IS NOT NULL
GROUP BY title
HAVING count > 1
ORDER BY count DESC;


-- ═════════════════════════════════════════════════════════════════════════════
-- 2️⃣ CORRIGER TITRES DUPLIQUÉS - Template
-- À adapter selon votre structure DB
-- ═════════════════════════════════════════════════════════════════════════════

-- Exemple: Pages produits avec même titre
UPDATE pages
SET title = CONCAT(title, ' - ', category_name)
WHERE id IN (
  SELECT id FROM (
    SELECT id, title, ROW_NUMBER() OVER (PARTITION BY title ORDER BY id) as rn
    FROM pages
    WHERE title = 'Produit XYZ'
  ) tmp
  WHERE rn > 1
);


-- ═════════════════════════════════════════════════════════════════════════════
-- 3️⃣ IDENTIFIER META DESCRIPTIONS DUPLIQUÉES (27 pages)
-- ═════════════════════════════════════════════════════════════════════════════

SELECT meta_description, COUNT(*) as count, GROUP_CONCAT(id) as page_ids
FROM pages
WHERE meta_description IS NOT NULL
AND meta_description != ''
GROUP BY meta_description
HAVING count > 1
ORDER BY count DESC;


-- ═════════════════════════════════════════════════════════════════════════════
-- 4️⃣ CORRIGER META DESCRIPTIONS - Template
-- ═════════════════════════════════════════════════════════════════════════════

-- Générer descriptions uniques (ajouter variantes)
UPDATE pages
SET meta_description = CONCAT(
  'Découvrez ',
  title,
  '. Livraison gratuite. Commandez maintenant sur Dubainegoce.fr!'
)
WHERE meta_description IS NULL OR meta_description = '';

-- Pour pages avec descriptions identiques (27):
UPDATE pages
SET meta_description = CONCAT(
  SUBSTRING(meta_description, 1, 130),
  ' - ',
  category_name,
  '.'
)
WHERE id IN (
  SELECT id FROM (
    SELECT id, meta_description, ROW_NUMBER() OVER (PARTITION BY meta_description ORDER BY id) as rn
    FROM pages
    WHERE meta_description IS NOT NULL
  ) tmp
  WHERE rn > 1
);


-- ═════════════════════════════════════════════════════════════════════════════
-- 5️⃣ AJOUTER H1 MANQUANTS (28 pages)
-- ═════════════════════════════════════════════════════════════════════════════

-- Identifier pages sans H1
SELECT id, title, url
FROM pages
WHERE h1_tag IS NULL OR h1_tag = '';

-- Ajouter H1 (utiliser le titre comme H1)
UPDATE pages
SET h1_tag = title
WHERE h1_tag IS NULL OR h1_tag = '';


-- ═════════════════════════════════════════════════════════════════════════════
-- 6️⃣ CORRIGER SLUG/URL
-- Éviter accents, espaces, caractères spéciaux
-- ═════════════════════════════════════════════════════════════════════════════

-- Créer function pour nettoyer URL (MySQL)
DELIMITER //
CREATE FUNCTION IF NOT EXISTS clean_slug(str VARCHAR(255))
RETURNS VARCHAR(255)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE result VARCHAR(255);
  SET result = LOWER(str);
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
  SET result = REGEXP_REPLACE(result, '[^a-z0-9-]', '');
  SET result = REGEXP_REPLACE(result, '-+', '-');
  SET result = TRIM(BOTH '-' FROM result);
  RETURN result;
END //
DELIMITER ;

-- Appliquer la fonction
UPDATE pages
SET slug = clean_slug(title)
WHERE slug IS NULL OR slug = '';


-- ═════════════════════════════════════════════════════════════════════════════
-- 7️⃣ AJOUTER META KEYWORDS (optionnel, mais aide SEO)
-- ═════════════════════════════════════════════════════════════════════════════

UPDATE pages
SET meta_keywords = CONCAT(
  title, ', ',
  category_name, ', ',
  'Dubainegoce, e-commerce, qualité'
)
WHERE meta_keywords IS NULL OR meta_keywords = '';


-- ═════════════════════════════════════════════════════════════════════════════
-- 8️⃣ CRÉER CANONICAL_URL POUR PAGES PARAMÉTRÉES
-- Éviter duplication sort/filter
-- ═════════════════════════════════════════════════════════════════════════════

-- Ajouter si pages ont paramètres
UPDATE pages
SET canonical_url = CONCAT(
  'https://dubainegoce.fr/page/',
  REPLACE(url, '?sort=', ''),
  '/'
)
WHERE url LIKE '%?sort=%'
  OR url LIKE '%?filter=%'
  OR url LIKE '%?page=%';


-- ═════════════════════════════════════════════════════════════════════════════
-- 9️⃣ CRÉER INDEX POUR PERFORMANCE
-- Améliore vitesse des requêtes
-- ═════════════════════════════════════════════════════════════════════════════

-- Index sur colonnes fréquemment recherchées
CREATE INDEX IF NOT EXISTS idx_title ON pages(title);
CREATE INDEX IF NOT EXISTS idx_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_url ON pages(url);
CREATE INDEX IF NOT EXISTS idx_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_canonical ON pages(canonical_url);
CREATE INDEX IF NOT EXISTS idx_created_date ON pages(created_date);
CREATE INDEX IF NOT EXISTS idx_modified_date ON pages(modified_date);


-- ═════════════════════════════════════════════════════════════════════════════
-- 🔟 VÉRIFIER RÉSULTATS
-- ═════════════════════════════════════════════════════════════════════════════

-- Pages sans titre
SELECT id, url FROM pages WHERE title IS NULL OR title = '';

-- Pages sans H1
SELECT id, title, url FROM pages WHERE h1_tag IS NULL OR h1_tag = '';

-- Pages sans meta description
SELECT id, title, url FROM pages WHERE meta_description IS NULL OR meta_description = '';

-- Titres dupliqués restants
SELECT title, COUNT(*) as count
FROM pages
GROUP BY title
HAVING count > 1
ORDER BY count DESC;

-- Meta descriptions dupliquées restantes
SELECT meta_description, COUNT(*) as count
FROM pages
GROUP BY meta_description
HAVING count > 1
AND meta_description IS NOT NULL
ORDER BY count DESC;


-- ═════════════════════════════════════════════════════════════════════════════
-- STATISTIQUES FINALES
-- ═════════════════════════════════════════════════════════════════════════════

SELECT
  COUNT(*) as total_pages,
  SUM(CASE WHEN title IS NOT NULL THEN 1 ELSE 0 END) as pages_with_title,
  SUM(CASE WHEN h1_tag IS NOT NULL THEN 1 ELSE 0 END) as pages_with_h1,
  SUM(CASE WHEN meta_description IS NOT NULL THEN 1 ELSE 0 END) as pages_with_meta_desc,
  SUM(CASE WHEN canonical_url IS NOT NULL THEN 1 ELSE 0 END) as pages_with_canonical,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_pages
FROM pages;
