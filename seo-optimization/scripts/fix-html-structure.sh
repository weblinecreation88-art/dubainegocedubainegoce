#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║           SCRIPT CORRECTION STRUCTURE HTML - dubainegoce.fr              ║
# ║                    Fix Low Text/HTML Ratio Issues                        ║
# ║              Généré: 2026-03-02 | Automatisation SEO                    ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# This script helps identify and fix HTML structure issues
# Run from your project root directory

echo "🔍 SEO HTML Structure Fixer - dubainegoce.fr"
echo "=============================================="
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 1️⃣ FIND PAGES WITHOUT DOCTYPE
# ═════════════════════════════════════════════════════════════════════════════

echo "1️⃣ Searching for pages without DOCTYPE..."
grep -r "^<!DOCTYPE html>" . --include="*.html" | wc -l
echo "✅ Found pages with DOCTYPE"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 2️⃣ FIND PAGES WITHOUT CHARSET
# ═════════════════════════════════════════════════════════════════════════════

echo "2️⃣ Searching for pages without charset..."
grep -r "<meta charset" . --include="*.html" | wc -l
echo "✅ Found pages with charset"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 3️⃣ FIND PAGES WITH MULTIPLE H1 TAGS
# ═════════════════════════════════════════════════════════════════════════════

echo "3️⃣ Searching for pages with multiple H1 tags..."
for file in $(find . -name "*.html" -type f); do
  count=$(grep -o "<h1" "$file" | wc -l)
  if [ $count -gt 1 ]; then
    echo "  ⚠️  $file has $count H1 tags (should be 1)"
  fi
done
echo "✅ H1 audit complete"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 4️⃣ FIND IMAGES WITHOUT ALT TEXT
# ═════════════════════════════════════════════════════════════════════════════

echo "4️⃣ Searching for images without ALT attributes..."
grep -r "<img" . --include="*.html" | grep -v 'alt=' | wc -l
echo "✅ Images without ALT found"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 5️⃣ FIND EMPTY TITLE TAGS
# ═════════════════════════════════════════════════════════════════════════════

echo "5️⃣ Searching for empty title tags..."
grep -r "<title></title>" . --include="*.html" | wc -l
echo "✅ Empty titles found"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 6️⃣ FIND EMPTY META DESCRIPTIONS
# ═════════════════════════════════════════════════════════════════════════════

echo "6️⃣ Searching for empty meta descriptions..."
grep -r '<meta name="description" content=""' . --include="*.html" | wc -l
echo "✅ Empty descriptions found"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 7️⃣ FIND PAGES WITH LOW WORD COUNT (<100 words)
# ═════════════════════════════════════════════════════════════════════════════

echo "7️⃣ Searching for pages with low word count..."
for file in $(find . -name "*.html" -type f); do
  # Extract text content (rough estimate)
  words=$(html2text "$file" 2>/dev/null | wc -w)
  if [ $words -lt 100 ]; then
    echo "  ⚠️  $file has only ~$words words"
  fi
done
echo "✅ Word count audit complete"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 8️⃣ MINIFY HTML (Optional - install html-minifier first)
# ═════════════════════════════════════════════════════════════════════════════

echo "8️⃣ HTML Minification"
echo "To minify HTML files, install html-minifier:"
echo "  npm install -g html-minifier"
echo "  html-minifier --collapse-whitespace --remove-comments *.html"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 9️⃣ MINIFY CSS (Optional - install cssnano first)
# ═════════════════════════════════════════════════════════════════════════════

echo "9️⃣ CSS Minification"
echo "To minify CSS files, use tools:"
echo "  npm install -g cssnano"
echo "  cssnano *.css"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# 🔟 MINIFY JAVASCRIPT (Optional)
# ═════════════════════════════════════════════════════════════════════════════

echo "🔟 JavaScript Minification"
echo "To minify JS files, use UglifyJS:"
echo "  npm install -g uglify-js"
echo "  uglifyjs script.js -o script.min.js"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# ✅ SUMMARY
# ═════════════════════════════════════════════════════════════════════════════

echo "✅ AUDIT COMPLETE"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Review the issues found above"
echo "2. Fix DOCTYPE and charset on pages"
echo "3. Ensure H1 tags are unique (1 per page)"
echo "4. Add ALT text to all images"
echo "5. Create unique title and meta description"
echo "6. Add 250+ words to pages with low word count"
echo "7. Minify HTML, CSS, and JavaScript"
echo "8. Enable Gzip compression in .htaccess"
echo ""
echo "Estimated time: 2-4 hours depending on number of pages"
