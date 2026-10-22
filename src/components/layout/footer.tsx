'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Instagram, Youtube } from 'lucide-react';
import { PaymentBadges } from '@/components/ui/payment-badges';

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z" />
  </svg>
);

const SnapchatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.166 2C9.349 2 6.732 3.343 5.09 5.618c-.897 1.245-1.332 2.694-1.09 4.296-.307.163-.635.243-.97.243-.426 0-.768.337-.768.75s.342.75.768.75c.63 0 1.19-.16 1.67-.41.168.484.373.952.614 1.404-.62.48-1.576 1.29-1.576 2.28 0 .63.394 1.08.923 1.244.65 2.02 3.21 2.825 5.34 2.825.28 0 .557-.013.828-.04.594.532 1.29.796 2.04.796s1.445-.264 2.04-.796c.27.027.548.04.827.04 2.13 0 4.69-.806 5.34-2.825.53-.164.923-.613.923-1.244 0-.99-.956-1.8-1.576-2.28.24-.452.446-.92.613-1.403.48.25 1.04.41 1.67.41.426 0 .769-.337.769-.75s-.343-.75-.769-.75c-.334 0-.662-.08-.97-.243.242-1.602-.192-3.051-1.09-4.296C17.433 3.343 14.817 2 12 2h.166z" />
  </svg>
);

export default function Footer() {
  return (
    <footer id="footer" className="storefront-footer bg-[#111827] text-white border-t-4 border-[#d4a017]">
      <div className="container mx-auto px-4 py-12">
        {/* DESKTOP : 4 Colonnes structurées style PrestaShop */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12">
          {/* Colonne 1 : Dubaï Négoce & Vendeur */}
          <div className="space-y-4">
            <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-[#d4a017] border-b border-white/15 pb-2">
              Dubaï Négoce
            </h3>
            <p className="text-xs text-white/75 leading-relaxed">
              Boutique spécialisée dans les eaux de parfum authentiques de Dubaï (Lattafa, Maison Alhambra, French Avenue, Fragrance World, Paris Corner) au tarif fixe de 35,00 € TTC.
            </p>
            <ul className="space-y-2 text-xs text-white/80">
              <li><Link href="/about" className="hover:text-[#d4a017] transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-[#d4a017] transition-colors">Mentions légales &amp; Vendeur</Link></li>
              <li><Link href="/terms" className="hover:text-[#d4a017] transition-colors">Conditions Générales de Vente (CGV)</Link></li>
              <li><Link href="/privacy" className="hover:text-[#d4a017] transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Colonne 2 : Catalogue & Parfums */}
          <div className="space-y-4">
            <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-[#d4a017] border-b border-white/15 pb-2">
              Nos Rayons Parfums
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li><Link href="/shop/all" className="hover:text-[#d4a017] transition-colors">Tous les parfums (35,00 €)</Link></li>
              <li><Link href="/shop/all?genders=femme" className="hover:text-[#d4a017] transition-colors">Parfums Femme</Link></li>
              <li><Link href="/shop/all?genders=homme" className="hover:text-[#d4a017] transition-colors">Parfums Homme</Link></li>
              <li><Link href="/shop/all?genders=mixte" className="hover:text-[#d4a017] transition-colors">Parfums Mixtes</Link></li>
              <li><Link href="/trouver-mon-parfum" className="hover:text-[#d4a017] transition-colors">Diagnostic Parfum (Quiz)</Link></li>
              <li><Link href="/blog" className="hover:text-[#d4a017] transition-colors">Le Blog Parfumerie</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Livraison, Retours & Commandes */}
          <div className="space-y-4">
            <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-[#d4a017] border-b border-white/15 pb-2">
              Livraison &amp; Commandes
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li><Link href="/livraison-et-paiement" className="hover:text-[#d4a017] transition-colors">Tarifs de livraison &amp; Paiement</Link></li>
              <li><Link href="/shipping" className="hover:text-[#d4a017] transition-colors">Conditions de retour (14 jours)</Link></li>
              <li><Link href="/suivi-commande" className="hover:text-[#d4a017] transition-colors">Suivre ma commande</Link></li>
              <li><Link href="/faq" className="hover:text-[#d4a017] transition-colors">Foire Aux Questions (FAQ)</Link></li>
              <li><Link href="/account" className="hover:text-[#d4a017] transition-colors">Mon compte client</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Contact & Avis */}
          <div className="space-y-4">
            <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-[#d4a017] border-b border-white/15 pb-2">
              Contact &amp; Service Client
            </h3>
            <ul className="space-y-3 text-xs text-white/85">
              <li>
                <a href="tel:+33758999726" className="flex items-center gap-2.5 hover:text-[#d4a017] transition-colors">
                  <Phone className="h-4 w-4 text-[#d4a017] shrink-0" />
                  <span>+33 7 58 99 97 26</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@dubainegoce.fr" className="flex items-center gap-2.5 hover:text-[#d4a017] transition-colors">
                  <Mail className="h-4 w-4 text-[#d4a017] shrink-0" />
                  <span>contact@dubainegoce.fr</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className="inline-block text-[#d4a017] font-bold hover:underline">
                  → Formulaire de contact
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="https://fr.trustpilot.com/review/dubainegoce.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block opacity-90 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg"
                  alt="Avis Dubainegoce sur Trustpilot"
                  width={110}
                  height={28}
                  style={{ height: 'auto' }}
                />
              </a>
            </div>

            <div className="flex gap-3 pt-1">
              <a
                href="https://www.instagram.com/dubai_negoce/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@dubainegoce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="h-8 w-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <TiktokIcon />
              </a>
              <a
                href="https://www.snapchat.com/add/dubainegoce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat"
                className="h-8 w-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <SnapchatIcon />
              </a>
              <a
                href="https://www.youtube.com/@dubainegoce78"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-8 w-8 rounded bg-white/10 flex items-center justify-center hover:bg-[#d4a017] hover:text-[#111827] transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* MOBILE : Accordéons <details> style PrestaShop */}
        <div className="md:hidden space-y-3 text-sm">
          <details className="border-b border-white/15 pb-3">
            <summary className="font-bold text-[#d4a017] cursor-pointer py-1">Notre boutique &amp; le vendeur</summary>
            <ul className="space-y-2 pt-2 pl-3 text-xs text-white/80">
              <li><Link href="/about">Qui sommes-nous ?</Link></li>
              <li><Link href="/mentions-legales">Mentions légales &amp; Vendeur</Link></li>
              <li><Link href="/terms">Conditions Générales de Vente (CGV)</Link></li>
              <li><Link href="/privacy">Politique de confidentialité</Link></li>
            </ul>
          </details>

          <details className="border-b border-white/15 pb-3">
            <summary className="font-bold text-[#d4a017] cursor-pointer py-1">Livraison, retours &amp; suivi</summary>
            <ul className="space-y-2 pt-2 pl-3 text-xs text-white/80">
              <li><Link href="/livraison-et-paiement">Tarifs Colissimo &amp; Paiement</Link></li>
              <li><Link href="/shipping">Retour &amp; rétractation (14 jours)</Link></li>
              <li><Link href="/suivi-commande">Suivre ma commande</Link></li>
              <li><Link href="/faq">Foire Aux Questions (FAQ)</Link></li>
            </ul>
          </details>

          <details className="border-b border-white/15 pb-3">
            <summary className="font-bold text-[#d4a017] cursor-pointer py-1">Nos rayons parfums</summary>
            <ul className="space-y-2 pt-2 pl-3 text-xs text-white/80">
              <li><Link href="/shop/all">Tous les parfums (35,00 €)</Link></li>
              <li><Link href="/shop/all?genders=femme">Parfums Femme</Link></li>
              <li><Link href="/shop/all?genders=homme">Parfums Homme</Link></li>
              <li><Link href="/shop/all?genders=mixte">Parfums Mixtes</Link></li>
              <li><Link href="/blog">Le Blog Parfumerie</Link></li>
            </ul>
          </details>

          <div className="pt-2 space-y-2 text-xs text-white/85">
            <p className="font-bold text-[#d4a017]">Service client :</p>
            <p><a href="tel:+33758999726">+33 7 58 99 97 26</a> • <a href="mailto:contact@dubainegoce.fr">contact@dubainegoce.fr</a></p>
          </div>
        </div>

        {/* Bas de Footer : Paiements & Copyright */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Dubaï Négoce — Tous droits réservés.</p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-[11px] text-white/75">Moyens de paiement acceptés :</span>
            <PaymentBadges showTitle={false} badgeClassName="h-6" />
          </div>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="/terms" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
