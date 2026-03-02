#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
╔═══════════════════════════════════════════════════════════════════════════╗
║         SCRIPT CORRECTION REDIRECT CHAINS - dubainegoce.fr               ║
║              Fix 5,615 Redirect Chain Issues                             ║
║          Généré: 2026-03-02 | Python 3.8+ Required                      ║
╚═══════════════════════════════════════════════════════════════════════════╝

Usage:
    python3 fix-redirects.py <urls_file.txt>

Example file format:
    https://dubainegoce.fr/page1 → /page2 → /page3 → /page4
    https://dubainegoce.fr/old-product → /product-new
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple

class RedirectChainAnalyzer:
    """Analyze and fix redirect chains"""

    def __init__(self):
        self.chains = []
        self.direct_redirects = []

    def parse_redirect_chain(self, chain_str: str) -> List[str]:
        """Parse redirect chain string to list of URLs"""
        # Remove leading/trailing whitespace
        chain_str = chain_str.strip()

        # Split by → or ->
        urls = re.split(r'→|->|⇒', chain_str)

        # Clean up URLs
        urls = [url.strip() for url in urls if url.strip()]

        return urls

    def analyze_chain(self, urls: List[str]) -> Dict:
        """Analyze single redirect chain"""
        if len(urls) < 2:
            return None

        return {
            'original': urls[0],
            'final': urls[-1],
            'chain_length': len(urls),
            'hops': len(urls) - 1,
            'intermediate': urls[1:-1],
            'time_cost_ms': (len(urls) - 1) * 100,  # ~100ms per hop
        }

    def generate_htaccess_fix(self, chain_info: Dict) -> str:
        """Generate .htaccess rule to fix chain"""
        original = chain_info['original'].replace('https://dubainegoce.fr', '')
        final = chain_info['final'].replace('https://dubainegoce.fr', '')

        return f"""RewriteCond %{{REQUEST_URI}} ^{original}/?$
RewriteRule ^(.*)$ https://dubainegoce.fr{final} [R=301,L]"""

    def process_file(self, filepath: str) -> None:
        """Process file with redirect chains"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except FileNotFoundError:
            print(f"❌ File not found: {filepath}")
            sys.exit(1)

        print(f"📊 Processing {len(lines)} redirect chains...")
        print()

        for i, line in enumerate(lines, 1):
            if line.strip().startswith('#') or not line.strip():
                continue

            urls = self.parse_redirect_chain(line)
            chain_info = self.analyze_chain(urls)

            if chain_info:
                self.chains.append(chain_info)

                # Generate direct redirect
                htaccess_rule = self.generate_htaccess_fix(chain_info)
                self.direct_redirects.append(htaccess_rule)

    def print_summary(self) -> None:
        """Print analysis summary"""
        if not self.chains:
            print("No redirect chains found")
            return

        print("=" * 70)
        print("🔍 REDIRECT CHAIN ANALYSIS SUMMARY")
        print("=" * 70)
        print()

        print(f"Total chains found: {len(self.chains)}")

        # Calculate statistics
        total_hops = sum(c['hops'] for c in self.chains)
        avg_hops = total_hops / len(self.chains) if self.chains else 0
        total_time = sum(c['time_cost_ms'] for c in self.chains)

        print(f"Total hops (unnecessary): {total_hops}")
        print(f"Average hops per chain: {avg_hops:.2f}")
        print(f"Total time cost: {total_time}ms ({total_time/1000:.1f}s)")
        print()

        # Show chains by length
        chain_lengths = {}
        for chain in self.chains:
            length = chain['chain_length']
            chain_lengths[length] = chain_lengths.get(length, 0) + 1

        print("Chains by length:")
        for length in sorted(chain_lengths.keys()):
            count = chain_lengths[length]
            print(f"  {length}-hop chains: {count} pages")

        print()
        print("=" * 70)
        print("🔧 .HTACCESS RULES TO FIX CHAINS")
        print("=" * 70)
        print()

        for i, rule in enumerate(self.direct_redirects[:10], 1):
            print(f"# Chain {i}")
            print(rule)
            print()

        if len(self.direct_redirects) > 10:
            print(f"... and {len(self.direct_redirects) - 10} more rules")
            print()

        print("=" * 70)
        print("✅ RECOMMENDATION")
        print("=" * 70)
        print()
        print("1. Copy all rules to seo-optimization/config/.htaccess")
        print("2. Test redirects with: curl -I https://dubainegoce.fr/old-page")
        print("3. Verify final destination: curl -L https://dubainegoce.fr/old-page")
        print("4. Monitor error logs for 24h")
        print()

    def export_htaccess(self, output_file: str) -> None:
        """Export .htaccess rules to file"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# Auto-generated redirect rules\n")
            f.write("# Generated: 2026-03-02\n")
            f.write("# Purpose: Fix redirect chains (direct 301 redirects)\n")
            f.write("\n")
            f.write("<IfModule mod_rewrite.c>\n")
            f.write("  RewriteEngine On\n")
            f.write("\n")

            for rule in self.direct_redirects:
                f.write(f"  {rule}\n")
                f.write("\n")

            f.write("</IfModule>\n")

        print(f"✅ Exported {len(self.direct_redirects)} rules to {output_file}")

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print()
        print("Example usage:")
        print("  python3 fix-redirects.py redirects.txt")
        sys.exit(1)

    filepath = sys.argv[1]

    analyzer = RedirectChainAnalyzer()
    analyzer.process_file(filepath)
    analyzer.print_summary()

    # Export .htaccess rules
    output_file = "redirects-fixed.conf"
    analyzer.export_htaccess(output_file)

    print()
    print("💡 Next steps:")
    print(f"   1. Review {output_file}")
    print("   2. Add rules to seo-optimization/config/.htaccess")
    print("   3. Test with: curl -I -L https://dubainegoce.fr/old-page")

if __name__ == '__main__':
    main()
