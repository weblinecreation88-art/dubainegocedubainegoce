# ⚡ QUICK REFERENCE - Commandes & Ressources

## 🔗 URLs IMPORTANTES

```
Google Search Console: https://search.google.com/search-console
Google Analytics 4: https://analytics.google.com
PageSpeed Insights: https://pagespeed.web.dev/
Lighthouse: https://developers.google.com/web/tools/lighthouse
Screaming Frog: https://www.screamingfrog.co.uk/
Schema Validator: https://schema.org/validator
HTML Validator: https://validator.w3.org/
Security Headers: https://securityheaders.com/
```

---

## ⌨️ COMMANDES BASH/CLI

### Test HTTPS Redirect
```bash
curl -I https://dubainegoce.fr      # 200 OK
curl -I http://dubainegoce.fr       # 301 → HTTPS
curl -I https://www.dubainegoce.fr  # 301 → non-www
```

### Test Gzip Compression
```bash
curl -I -H "Accept-Encoding: gzip" https://dubainegoce.fr
# Should show: Content-Encoding: gzip
```

### Test Redirect Chains
```bash
curl -I -L https://dubainegoce.fr/old-page
# Should show 1 or 2 redirects max (not 4+)
```

### Find Images Without ALT
```bash
grep -r '<img' . --include="*.html" | grep -v 'alt=' | wc -l
# Should return: 0
```

### Find Duplicate Titles
```bash
grep -r '<title>' . --include="*.html" | sort | uniq -d
# Should return: Nothing (all unique)
```

### Find Empty Descriptions
```bash
grep -r '<meta name="description" content=""' . --include="*.html" | wc -l
# Should return: 0
```

### Count HTML Files
```bash
find . -name "*.html" -type f | wc -l
# Shows total HTML pages
```

---

## 🔧 TOOLS & INSTALLATION

### Minify HTML (Mac/Linux)
```bash
npm install -g html-minifier
html-minifier --collapse-whitespace input.html -o output.min.html
```

### Minify CSS
```bash
npm install -g cssnano
cssnano input.css
```

### Minify JavaScript
```bash
npm install -g uglify-js
uglifyjs input.js -o output.min.js -c -m
```

### Python Script (Fix Redirects)
```bash
python3 seo-optimization/scripts/fix-redirects.py redirects.txt
```

### Bash Script (HTML Structure Audit)
```bash
bash seo-optimization/scripts/fix-html-structure.sh
```

---

## 📊 SQL COMMANDES (phpMyAdmin)

### Find Duplicate Titles
```sql
SELECT title, COUNT(*) as count, GROUP_CONCAT(id) as page_ids
FROM pages
WHERE title IS NOT NULL
GROUP BY title
HAVING count > 1
ORDER BY count DESC;
```

### Fix Duplicate Titles
```sql
UPDATE pages
SET title = CONCAT(title, ' - ', category_name)
WHERE id IN (SELECT id FROM (...) tmp WHERE rn > 1);
```

### Add Missing H1
```sql
UPDATE pages
SET h1_tag = title
WHERE h1_tag IS NULL OR h1_tag = '';
```

### Add Missing Meta Descriptions
```sql
UPDATE pages
SET meta_description = CONCAT('Découvrez ', title, '. Commandez maintenant!')
WHERE meta_description IS NULL OR meta_description = '';
```

### Verify All H1 Present
```sql
SELECT COUNT(*) FROM pages WHERE h1_tag IS NULL;
# Should return: 0
```

---

## 🌐 GOOGLE SEARCH CONSOLE TASKS

### Submit HTTPS Sitemap
```
1. Open: https://search.google.com/search-console
2. Select HTTPS property
3. Left menu: Sitemaps
4. Add new: https://dubainegoce.fr/sitemap.xml
5. Submit
```

### Check Coverage
```
1. Left menu: Coverage
2. Look for:
   - Valid: Should be 90+
   - Excluded: Should be <10
   - Error: Should be 0
   - Valid with warning: Check details
```

### Monitor Performance
```
1. Left menu: Performance
2. View:
   - Total Impressions (target: +30% in week 2)
   - Total Clicks (target: +30% in week 2)
   - Average CTR (target: 4%+)
   - Average Position (target: -20 positions in week 3)
```

### Crawl Stats
```
1. Settings → Crawl statistics
2. Check:
   - Requests per day (should stay consistent)
   - Kilobytes downloaded (should decrease with Gzip)
   - Crawl time (should decrease)
```

---

## 📈 ANALYTICS SETUP

### Google Analytics 4 Install
```html
<!-- Add to <head> before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Goals to Setup
```
- Organic traffic milestone: 1000 sessions/month
- Conversion milestone: 20 conversions/month
- Ranking milestone: 10 keywords top 10
- Ranking milestone: 50 keywords top 100
```

---

## 🐛 TROUBLESHOOTING

### Issue: 500 Error After .htaccess Upload
```
Solution:
1. Check syntax: grep -n "RewriteEngine" .htaccess
2. Verify permissions: chmod 644 .htaccess
3. Start simple: RewriteEngine On only
4. Add rules one by one
5. Check error logs: cPanel → Error Logs
```

### Issue: Pages Still Showing HTTP
```
Solution:
1. Verify .htaccess in /public_html/ (not subfolder)
2. Check mod_rewrite enabled: a2enmod rewrite
3. Restart Apache: systemctl restart apache2
4. Test: curl -I http://site.com
```

### Issue: Gzip Not Working
```
Solution:
1. Verify in .htaccess: <IfModule mod_deflate.c>
2. Test: curl -I -H "Accept-Encoding: gzip" site.com
3. Check Apache modules: apache2ctl -M | grep deflate
4. Enable if needed: a2enmod deflate
```

### Issue: Rankings Drop After Changes
```
Solution (expected behavior):
- Usually temporary (24-48 hours)
- Monitor Google Search Console
- Check for new errors in Coverage
- Ensure no new 404s
- Check robots.txt not blocking pages
- Wait 1-2 weeks for full recrawl
```

---

## 📋 DAILY CHECKLIST

### Day 1-3 (HTTPS Fix)
- [ ] Backup created ✓
- [ ] .htaccess uploaded ✓
- [ ] Redirects tested ✓
- [ ] No 500 errors ✓
- [ ] Sitemap HTTPS submitted ✓

### Day 4 (Text Ratio)
- [ ] 250+ words added to pages ✓
- [ ] HTML minified ✓
- [ ] CSS minified ✓
- [ ] Gzip verified ✓
- [ ] Lighthouse: 50+ ✓

### Day 5 (Redirects)
- [ ] Screaming Frog audit done ✓
- [ ] Redirect chains identified ✓
- [ ] Direct 301s created ✓
- [ ] .htaccess updated ✓
- [ ] Redirect chains tested ✓

### Day 6-7 (Duplicates & H1)
- [ ] SQL: duplicate titles fixed ✓
- [ ] SQL: H1 tags added ✓
- [ ] SQL: descriptions added ✓
- [ ] HTML: ALT text added ✓
- [ ] GSC: 0 errors ✓

---

## 🎯 SUCCESS METRICS (End Week 1)

```
✅ HTTP/HTTPS: 0 mixed content pages
✅ Ratio: 30%+ text (from 10%)
✅ Redirects: All direct 301 (no chains)
✅ Titles: 100% unique
✅ Descriptions: 100% present
✅ H1 Tags: 100% present (1 per page)
✅ Lighthouse: 50-60/100 (from 35)
✅ Load time: <3s (from 4.5s)
✅ GSC: 0 4xx/5xx errors
✅ Ranking: Stable (preparing for week 2 gains)
```

---

## 📞 SUPPORT

**Need help?**
- Read: `IMPLEMENTATION-GUIDE.md`
- Check: `SEMRUSH-ANALYSIS.md`
- Execute: `EXECUTION-CHECKLIST.md`

---

**Last Updated:** 2026-03-02
**Version:** 1.0 Quick Reference
