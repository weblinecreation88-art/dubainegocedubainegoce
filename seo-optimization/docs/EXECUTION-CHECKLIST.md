# ✅ EXECUTION CHECKLIST - 21 JOURS SEO 2026

## 🎯 PHASE 1: URGENCE (Semaines 1-2)

### JOUR 1-2: Configuration & Sauvegardes

- [ ] Sauvegarder la base de données complète
- [ ] Backup FTP complet du site
- [ ] Tester restore du backup
- [ ] Confirmer accès FTP/cPanel/SSH
- [ ] Créer dossier `/seo-corrections/` sur serveur
- [ ] Uploader tous fichiers de configuration

### JOUR 3-4: HTTP/HTTPS Correction (11,375 pages)

- [ ] Sauvegarder ancien .htaccess
- [ ] Uploader .htaccess-optimized dans /public_html/
- [ ] Tester redirection HTTP→HTTPS
  - [ ] http://dubainegoce.fr → https (301)
  - [ ] https://www.dubainegoce.fr → https://dubainegoce.fr (301)
  - [ ] https://dubainegoce.fr → 200 OK
- [ ] Vérifier pas d'erreurs 500
- [ ] Vérifier HSTS header activé
- [ ] Soumettre sitemap HTTPS à Google
- [ ] Supprimer ancienne propriété HTTP Google

### JOUR 5: Ratio Texte/HTML (90 pages)

- [ ] Identifier les 10 pages critiques
- [ ] Ajouter 250+ mots contenu à chaque
- [ ] Minifier CSS (45 KB → 12 KB)
- [ ] Minifier JS (120 KB → 32 KB)
- [ ] Vérifier Gzip compression activée
- [ ] Tester Lighthouse (cible: 60+)

### JOUR 6-7: Chaînes Redirection (5,615 pages)

- [ ] Audit avec Screaming Frog
- [ ] Identifier toutes chaînes redirection
- [ ] Créer redirects directs (301)
- [ ] Tester chaque redirection
- [ ] Vérifier pas de boucles
- [ ] Vérifier pas de chaînes restantes

---

## 🟡 PHASE 2: IMPORTANT (Semaines 3-4)

### JOUR 8-9: Contenu Dupliqué

- [ ] Auditer titres dupliqués (28 pages)
  - [ ] Exécuter SQL SELECT
  - [ ] Modifier SQL UPDATE
  - [ ] Appliquer changements
  - [ ] Vérifier résultats

- [ ] Auditer meta descriptions (27 pages)
  - [ ] SELECT duplicates
  - [ ] CREATE descriptions uniques
  - [ ] UPDATE database

- [ ] Auditer contenu dupliqué (26 pages)
  - [ ] Identifier pages
  - [ ] Décider stratégie (fusionner/canonical)
  - [ ] Appliquer solution

### JOUR 10-11: Liens & Balises Manquantes

- [ ] Corriger liens cassés (2,750)
  - [ ] Identifier avec GSC
  - [ ] Créer redirects 301
  - [ ] Tester redirects

- [ ] Ajouter H1 manquants (28)
  - [ ] Exécuter SQL
  - [ ] Vérifier 1 H1 par page

- [ ] Ajouter meta descriptions (90)
  - [ ] Créer descriptions uniques
  - [ ] 150-160 caractères
  - [ ] Inclure mots-clés

- [ ] Ajouter ALT text images (383)
  - [ ] Identifier images sans ALT
  - [ ] Créer ALT descriptif
  - [ ] Vérifier pertinence

### JOUR 12-14: Performance Optimization

- [ ] Implémenter lazy loading
- [ ] Configurer cache navigateur
- [ ] Compresser images
- [ ] Réduire CSS/JS payload
- [ ] Tester Lighthouse (cible: 75+)
- [ ] Vérifier Core Web Vitals

### JOUR 15-17: Structure Technique

- [ ] Vérifier robots.txt
- [ ] Générer sitemap complet
- [ ] Tester sitemap XML valide
- [ ] Uploader sitemap.xml
- [ ] Soumettre à Google
- [ ] Vérifier security headers
- [ ] Tester avec SecurityHeaders.io

---

## 🟢 PHASE 3: MONITORING (Semaines 5-6+)

### JOUR 18-21: Analytics & Monitoring Setup

- [ ] Setup Google Search Console
  - [ ] Vérifier propriété HTTPS
  - [ ] Soumettre sitemap
  - [ ] Monitoring Coverage

- [ ] Setup Google Analytics 4
  - [ ] Créer propriété
  - [ ] Implémenter tracking
  - [ ] Configurer objectifs

- [ ] Setup monitoring KPIs
  - [ ] Google Data Studio
  - [ ] Dashboards rapports
  - [ ] Weekly metrics tracking

---

## 📊 RÉSULTATS ATTENDUS

### Semaine 1-2
```
AVANT:
- Pages contenu mixte: 11,375
- Ratio texte/HTML: 10-15%
- Lighthouse: 35/100

APRÈS:
- Pages contenu mixte: 0 ✅
- Ratio texte/HTML: 25%+ ✅
- Lighthouse: 50-60/100 ✅
```

### Semaine 3-4
```
AVANT:
- Titres dupliqués: 28
- H1 manquants: 28
- Liens cassés: 2,750

APRÈS:
- Titres dupliqués: 0 ✅
- H1 manquants: 0 ✅
- Liens cassés: <50 ✅
```

### Semaine 5-6
```
BEFORE:
- Lighthouse: 45/100
- Load time: 4.5s
- Trafic/mois: 5,000

AFTER:
- Lighthouse: 80+/100 ✅
- Load time: 1s ✅
- Trafic/mois: 12,500+ ✅
```

---

## ⚠️ TROUBLESHOOTING

### Problème: Erreur 500 après .htaccess

**Solution:**
1. Vérifier syntaxe mod_rewrite
2. Uploader par FTP (pas cPanel)
3. Vérifier permissions (644)
4. Tester avec simple .htaccess

### Problème: Pages toujours HTTP

**Solution:**
1. Vérifier .htaccess dans root
2. Tester: `curl -I http://site.com`
3. Confirmer mod_rewrite activé

### Problème: SQL error

**Solution:**
1. Sauvegarder DB avant
2. Tester sur staging DB
3. Exécuter par phases
4. Vérifier syntax SQL

---

## 🎯 PROCHAINES ÉTAPES

**Après Phase 3 (Semaine 6+):**
- [ ] Content Marketing (50+ articles)
- [ ] Link Building (200+ backlinks)
- [ ] Technical SEO Advanced
- [ ] Continuous Monitoring

---

**Duration:** 21 days
**Effort:** 50-60 hours
**Expected ROI:** +150% organic traffic
