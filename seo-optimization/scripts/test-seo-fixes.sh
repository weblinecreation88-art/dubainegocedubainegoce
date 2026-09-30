#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║              SCRIPT TEST SEO FIXES - dubainegoce.fr                       ║
# ║                    Vérifier implémentation complète                       ║
# ║          Généré: 2026-03-02 | Bash 4.0+                                  ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# Usage: bash test-seo-fixes.sh

set -e

DOMAIN="https://dubainegoce.fr"
RESULTS_FILE="seo-test-results.txt"
PASSED=0
FAILED=0

# Couleurs pour terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ═════════════════════════════════════════════════════════════════════════════
# FONCTION: Test HTTP Status
# ═════════════════════════════════════════════════════════════════════════════

test_http_status() {
  local url=$1
  local expected=$2
  local description=$3

  echo -n "Testing: $description... "
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

  if [ "$status" = "$expected" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Status: $status)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: $expected, Got: $status)"
    ((FAILED++))
  fi
}

# ═════════════════════════════════════════════════════════════════════════════
# FONCTION: Test Redirect
# ═════════════════════════════════════════════════════════════════════════════

test_redirect() {
  local from=$1
  local to=$2
  local description=$3

  echo -n "Testing: $description... "
  final=$(curl -s -L -o /dev/null -w "%{url_effective}" "$from")

  if [[ "$final" == *"$to"* ]]; then
    echo -e "${GREEN}✓ PASS${NC} (Redirects to: $final)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: *$to*, Got: $final)"
    ((FAILED++))
  fi
}

# ═════════════════════════════════════════════════════════════════════════════
# FONCTION: Test Header Présent
# ═════════════════════════════════════════════════════════════════════════════

test_header() {
  local url=$1
  local header=$2
  local description=$3

  echo -n "Testing: $description... "
  result=$(curl -s -I "$url" | grep -i "^$header:" || echo "NOT FOUND")

  if [[ "$result" != "NOT FOUND" ]]; then
    echo -e "${GREEN}✓ PASS${NC} ($result)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Header not found)"
    ((FAILED++))
  fi
}

# ═════════════════════════════════════════════════════════════════════════════
# FONCTION: Test Content Present
# ═════════════════════════════════════════════════════════════════════════════

test_content() {
  local url=$1
  local pattern=$2
  local description=$3

  echo -n "Testing: $description... "
  result=$(curl -s "$url" | grep -i "$pattern" || echo "NOT FOUND")

  if [[ "$result" != "NOT FOUND" ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Pattern not found)"
    ((FAILED++))
  fi
}

# ═════════════════════════════════════════════════════════════════════════════
# DÉBUT TESTS
# ═════════════════════════════════════════════════════════════════════════════

clear

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                  SEO FIXES VERIFICATION TEST SUITE                        ║"
echo "║                        dubainegoce.fr                                     ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 1: HTTPS/HTTP TESTS
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[1] HTTPS/HTTP REDIRECTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_status "$DOMAIN" "200" "HTTPS accessible"
test_redirect "http://dubainegoce.fr" "https://dubainegoce.fr" "HTTP → HTTPS redirect"
test_redirect "https://www.dubainegoce.fr" "https://dubainegoce.fr" "WWW → non-WWW redirect"

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 2: SECURITY HEADERS
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[2] SECURITY HEADERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_header "$DOMAIN" "Strict-Transport-Security" "HSTS header present"
test_header "$DOMAIN" "X-Content-Type-Options" "X-Content-Type-Options header"
test_header "$DOMAIN" "X-Frame-Options" "X-Frame-Options header"
test_header "$DOMAIN" "X-XSS-Protection" "X-XSS-Protection header"

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 3: GZIP COMPRESSION
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[3] PERFORMANCE - GZIP COMPRESSION${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_header "$DOMAIN" "Content-Encoding" "Gzip compression enabled"

echo -n "Testing: Page size reduction with Gzip... "
uncompressed=$(curl -s "$DOMAIN" | wc -c)
compressed=$(curl -s -H "Accept-Encoding: gzip" "$DOMAIN" | gzip -dc 2>/dev/null | wc -c || echo "0")
reduction=$(( (uncompressed - compressed) * 100 / uncompressed ))

if [ $reduction -gt 30 ]; then
  echo -e "${GREEN}✓ PASS${NC} (Reduction: ~${reduction}%)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ WARNING${NC} (Reduction: ~${reduction}% - expected >30%)"
fi

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 4: HTML STRUCTURE
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[4] HTML STRUCTURE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_content "$DOMAIN" "<meta charset" "Charset declared"
test_content "$DOMAIN" "<meta name=\"viewport\"" "Viewport meta tag"
test_content "$DOMAIN" "<h1" "H1 tag present"
test_content "$DOMAIN" "<meta name=\"description\"" "Meta description present"
test_content "$DOMAIN" "<!DOCTYPE html" "DOCTYPE declaration"

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 5: JSON-LD SCHEMA
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[5] STRUCTURED DATA (JSON-LD)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_content "$DOMAIN" "application/ld+json" "JSON-LD schema markup"
test_content "$DOMAIN" "@context" "Schema.org context"

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 6: ROBOTS.TXT & SITEMAP
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[6] ROBOTS.TXT & SITEMAP${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_http_status "$DOMAIN/robots.txt" "200" "Robots.txt accessible"
test_http_status "$DOMAIN/sitemap.xml" "200" "Sitemap.xml accessible"
test_content "$DOMAIN/robots.txt" "User-agent" "Robots.txt has user-agent"
test_content "$DOMAIN/sitemap.xml" "<?xml" "Sitemap.xml is valid XML"

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# SECTION 7: LOAD TIME
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}[7] PERFORMANCE - LOAD TIME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo -n "Testing: Page load time... "
start=$(date +%s%N | cut -b1-13)
curl -s "$DOMAIN" > /dev/null
end=$(date +%s%N | cut -b1-13)
load_time=$(( (end - start) / 1000 ))

if [ $load_time -lt 3000 ]; then
  echo -e "${GREEN}✓ PASS${NC} (${load_time}ms)"
  ((PASSED++))
elif [ $load_time -lt 5000 ]; then
  echo -e "${YELLOW}⚠ WARNING${NC} (${load_time}ms - target: <3000ms)"
  ((FAILED++))
else
  echo -e "${RED}✗ FAIL${NC} (${load_time}ms - target: <3000ms)"
  ((FAILED++))
fi

echo ""

# ═════════════════════════════════════════════════════════════════════════════
# RÉSULTATS FINAUX
# ═════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                         TEST RESULTS SUMMARY                             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Passed: ${GREEN}$PASSED${NC}/$TOTAL"
echo -e "Failed: ${RED}$FAILED${NC}/$TOTAL"
echo -e "Success Rate: ${BLUE}${PERCENTAGE}%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  echo ""
  echo "Your SEO fixes are working correctly:"
  echo "  ✓ HTTPS/HTTP redirects configured"
  echo "  ✓ Security headers set"
  echo "  ✓ Gzip compression enabled"
  echo "  ✓ HTML structure optimized"
  echo "  ✓ Schema markup implemented"
  echo "  ✓ Robots.txt and sitemap present"
  echo ""
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo ""
  echo "Issues to fix:"
  echo "  1. Review failed tests above"
  echo "  2. Check .htaccess configuration"
  echo "  3. Verify server settings"
  echo "  4. Test on staging before production"
  echo ""
  exit 1
fi
