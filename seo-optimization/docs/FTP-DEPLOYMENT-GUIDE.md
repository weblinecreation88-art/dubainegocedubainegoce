# 🚀 GUIDE DÉPLOIEMENT FTP - dubainegoce.fr

**Date:** 2026-03-02
**Fichiers à uploader:** 2 fichiers critiques
**Temps estimé:** 15 minutes
**Risque:** Très faible (les autres fichiers restent inchangés)

---

## 📋 FICHIERS À UPLOADER

### 🔴 CRITIQUES (Jour 1-2):
```
1. config/.htaccess → /public_html/.htaccess
2. config/robots.txt → /public_html/robots.txt
```

### 🟡 IMPORTANT (Jour 3-4):
```
3. templates/1-HOMEPAGE-OPTIMIZED.html → Adapter + uploader
4. templates/2-PRODUCT-PAGE-OPTIMIZED.html → Adapter + uploader
5. templates/3-CATEGORY-PAGE-OPTIMIZED.html → Adapter + uploader
6. templates/4-BLOG-ARTICLE-OPTIMIZED.html → Adapter + uploader
```

---

## 🔧 PRÉREQUIS FTP

- ✅ Client FTP (FileZilla, WinSCP, etc.)
- ✅ Identifiants FTP (Host, Username, Password)
- ✅ Accès serveur
- ✅ Permissions écriture `/public_html/`

### Obtenir identifiants FTP:
1. Login hosting (ex: cPanel)
2. Aller à: **Files → FTP Accounts**
3. Créer/Récupérer compte FTP
4. Noter: Host, Username, Password

---

## 📥 ÉTAPE 1: CONNECTER VIA FTP

### Méthode 1: FileZilla (Recommandé)

1. **Télécharger:** https://filezilla-project.org
2. **Ouvrir FileZilla**
3. Cliquer **File → Site Manager**
4. Cliquer **New Site**
5. Remplir:
   ```
   Host: ftp.votredomaine.com (ou IP)
   Protocol: FTP
   Port: 21
   Username: votre_user_ftp
   Password: votre_password
   ```
6. Cliquer **Connect**

### Méthode 2: WinSCP

1. **Télécharger:** https://winscp.net
2. **Ouvrir WinSCP**
3. Remplir:
   ```
   Host: ftp.votredomaine.com
   Username: votre_user_ftp
   Password: votre_password
   ```
4. Cliquer **Login**

---

## 📤 ÉTAPE 2: UPLOADER .htaccess

### ✅ Procédure sécurisée:

**Étape 1: Localiser répertoire racine**
```
/public_html/
  ├── index.php (ou index.html)
  ├── wp-config.php (si WordPress)
  └── .htaccess (ici!)
```

**Étape 2: Sauvegarder ancien .htaccess**
- Si `.htaccess` existe déjà:
  1. Clic droit → **Rename**
  2. Renommer: `.htaccess-backup-2026-03-02`
  3. Garder ce backup!

**Étape 3: Uploader nouveau .htaccess**
1. Aller sur disque local: `D:\DUBAINEGOCE\seo-optimization\config\.htaccess`
2. Drag & drop dans FileZilla zone serveur (`/public_html/`)
3. OU: Clic droit → Upload

**Étape 4: Vérifier permissions**
- Clic droit `.htaccess` → Properties
- Permissions: **644** (rw-r--r--)
- OU: **755** si en dossier lisible public

### ⚠️ Si vous avez WordPress:
Avant uploader, lire ce qui existe dans `.htaccess` WordPress!
```
# BEGIN WordPress
RewriteEngine On
...
# END WordPress
```

**Solution:** Merger nos règles AVANT le bloc WordPress:
```
# ═════════════════════════════════════════════
# DUBAINEGOCE SEO RULES (ajouter en début)
# ═════════════════════════════════════════════
[Copier nos règles ici]

# BEGIN WordPress
RewriteEngine On
...
# END WordPress
```

---

## 📤 ÉTAPE 3: UPLOADER robots.txt

**Procédure simple (très sûr):**

1. Aller sur disque local: `D:\DUBAINEGOCE\seo-optimization\config\robots.txt`
2. Uploader dans `/public_html/robots.txt`
3. Permissions: **644**

**Vérifier upload réussi:**
```
https://dubainegoce.fr/robots.txt
```
Devrait afficher le contenu du fichier robots.txt

---

## ✅ ÉTAPE 4: VALIDATION (TRÈS IMPORTANT!)

### Test 1: Vérifier .htaccess fonctionne
```bash
# Tester HTTP → HTTPS redirect
curl -I http://dubainegoce.fr

# Résultat attendu:
# HTTP/1.1 301 Moved Permanently
# Location: https://dubainegoce.fr/
```

### Test 2: Vérifier robots.txt accessible
```
https://dubainegoce.fr/robots.txt
```
**Résultat attendu:** Affiche le fichier robots.txt

### Test 3: Vérifier Gzip compression
```bash
curl -I https://dubainegoce.fr
```
**Résultat attendu:**
```
Content-Encoding: gzip
```

### Test 4: Vérifier security headers
```bash
curl -I https://dubainegoce.fr
```
**Résultat attendu:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

---

## 📄 ÉTAPE 5: UPLOADER HTML TEMPLATES

### ⚠️ AVANT d'uploader:

1. **Adapter chaque template pour votre site:**

```html
<!-- REMPLACER ces valeurs: -->
<title>Guide Complet: Comment Choisir Le Meilleur Produit | Dubainegoce Blog</title>
<!-- DEVENIR: -->
<title>VOTRE TITRE RÉEL | Dubainegoce Blog</title>

<!-- Remplacer images: -->
<img src="https://dubainegoce.fr/images/blog-intro-800x500.jpg"
<!-- DEVENIR: -->
<img src="https://dubainegoce.fr/images/VOTRE-IMAGE-RÉELLE.jpg"

<!-- Remplacer URLs: -->
<link rel="canonical" href="https://dubainegoce.fr/blog/comment-choisir-produit/">
<!-- DEVENIR: -->
<link rel="canonical" href="https://dubainegoce.fr/VOTRE-URL-RÉELLE/">
```

2. **Valider HTML:** https://validator.w3.org

3. **Checker meta tags:**
   - Unique title (50-60 chars)
   - Unique description (150-160 chars)
   - Unique H1

### Procédure d'upload:

**Option A: Remplacer pages existantes**
```
1. Homepage (index.php): Utiliser 1-HOMEPAGE-OPTIMIZED.html
2. Pages produits: Utiliser 2-PRODUCT-PAGE-OPTIMIZED.html
3. Pages catégories: Utiliser 3-CATEGORY-PAGE-OPTIMIZED.html
4. Articles blog: Utiliser 4-BLOG-ARTICLE-OPTIMIZED.html
```

**Option B: Créer nouvelles pages (plus sûr)**
```
1. Renommer: 1-HOMEPAGE-OPTIMIZED.html → index-seo.html
2. Uploader dans: /public_html/index-seo.html
3. Tester: https://dubainegoce.fr/index-seo.html
4. Si OK → Remplacer index.php original
```

---

## 🔒 SÉCURITÉ PENDANT DÉPLOIEMENT

### Checklist avant/après:

**AVANT:**
- ✅ Backup complet site (FTP entier)
- ✅ Backup base de données (SQL export)
- ✅ Tester en staging (si possible)
- ✅ Checker permissions fichiers
- ✅ Avoir accès root/admin pour rollback

**PENDANT:**
- ⏸️ Attendre fin d'upload (ne pas fermer FTP)
- ⏸️ Ne pas modifier serveur en même temps
- ⏸️ Arrêter services non-essentiels (si possible)

**APRÈS:**
- ✅ Vérifier site charge correctement
- ✅ Tester pages principales
- ✅ Vérifier pas d'erreurs 500
- ✅ Monitor erreurs 24h

---

## 🚨 ROLLBACK EN CAS DE PROBLÈME

### Si site plante après upload:

**Méthode 1: Restaurer via FTP**
1. Connecter FTP
2. Supprimer `.htaccess` problématique
3. Restaurer depuis backup: `.htaccess-backup-2026-03-02`

**Méthode 2: Restaurer via cPanel**
1. Login cPanel
2. Aller à: **File Manager**
3. Restaurer depuis backup

**Méthode 3: Restaurer base de données**
```sql
-- Via phpMyAdmin:
1. Importer fichier backup.sql
2. Sélectionner base dubainegoce
3. Cliquer GO
```

---

## 📊 CHECKLIST DÉPLOIEMENT

### Jour 1-2: Configuration initiale
- [ ] Fichier `.htaccess` uploadé
- [ ] Fichier `robots.txt` uploadé
- [ ] HTTP → HTTPS redirige
- [ ] Security headers présents
- [ ] Gzip compression fonctionne
- [ ] Aucune erreur 500

### Jour 3-4: HTML Templates
- [ ] Templates adaptées pour site
- [ ] Images remplacées (vraies images)
- [ ] URLs mises à jour (canonical, internal links)
- [ ] Titres et descriptions uniques
- [ ] Meta tags validés
- [ ] Pages testées en navigateur

### Jour 5: Redirects
- [ ] Redirect rules implémentées
- [ ] Chaînes de redirect éliminées
- [ ] 301 permanent (pas 302 temporaire)
- [ ] Tous les anciens URLs redirigent

### Jour 6-7: SQL
- [ ] Base de données sauvegardée
- [ ] SQL corrections exécutées
- [ ] Vérifications passées
- [ ] 0 pages sans H1
- [ ] 0 pages sans description
- [ ] 0 titres dupliqués

### Suivi:
- [ ] Google Search Console: Submit sitemap
- [ ] Vérifier crawl sans erreurs
- [ ] Monitor 24-48h pour nouvelles erreurs
- [ ] Check Lighthouse score (viser 80+)

---

## ✅ APRÈS DÉPLOIEMENT RÉUSSI

1. **Google Search Console:**
   - Aller: https://search.google.com/search-console
   - Onglet: Coverage
   - Vérifier: 0 Errors, 0 Excluded

2. **Soumettre Sitemap:**
   - Cliquer: Sitemaps
   - Ajouter: `https://dubainegoce.fr/sitemap.xml`

3. **Request Crawl:**
   - URL Inspection
   - Entrer: `https://dubainegoce.fr/`
   - Cliquer: Request Indexing

4. **Monitor Résultats:**
   - Onglet: Performance
   - Attendre 24-48h pour données
   - Checker impressions, clicks, CTR

---

## 🎯 RÉSULTATS ATTENDUS

| Métrique | Avant | Après (1 semaine) |
|----------|-------|-------------------|
| HTTP → HTTPS | ❌ Mixed content | ✅ 100% HTTPS |
| Gzip compression | ❌ Désactivé | ✅ 60-70% réduction |
| Lighthouse | 35/100 | 50-60/100 |
| Load time | 4.5s | <3s |
| Security headers | ❌ Aucun | ✅ Tous présents |

---

## 📞 SUPPORT & TROUBLESHOOTING

### Q: "Error 500" après upload .htaccess
**A:**
1. Restore `.htaccess-backup-2026-03-02`
2. Vérifier syntaxe Apache
3. Checker permissions (644)

### Q: ".htaccess ne semble pas fonctionner"
**A:**
1. Vérifier Apache AllowOverride = All (dans httpd.conf)
2. Vérifier mod_rewrite activé
3. Tester avec simple règle d'abord

### Q: "robots.txt pas accessible"
**A:**
1. Checker permissions (644)
2. Vérifier chemin: /public_html/robots.txt
3. Tester direct: https://dubainegoce.fr/robots.txt

---

**Généré:** 2026-03-02
**Status:** ✅ Prêt pour déploiement FTP
