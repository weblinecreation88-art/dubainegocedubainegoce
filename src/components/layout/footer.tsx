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

const FOOTER_COLUMNS = [
  {
    title: 'Les parfums',
    links: [
      { href: '/shop/all', label: 'Toute la boutique' },
      { href: '/shop/all?genders=femme', label: 'Pour elle' },
      { href: '/shop/all?genders=homme', label: 'Pour lui' },
      { href: '/shop/all?genders=mixte', label: 'Parfums mixtes' },
      { href: '/trouver-mon-parfum', label: 'Trouver mon parfum' },
    ],
  },
  {
    title: 'Besoin d’aide ?',
    links: [
      { href: '/livraison-et-paiement', label: 'Livraison et paiement' },
      { href: '/shipping', label: 'Retours sous 14 jours' },
      { href: '/suivi-commande', label: 'Suivre ma commande' },
      { href: '/faq', label: 'Questions fréquentes' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Notre maison',
    links: [
      { href: '/about', label: 'À propos de Dubaï Négoce' },
      { href: '/blog', label: 'Le journal' },
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/terms', label: 'CGV' },
      { href: '/privacy', label: 'Confidentialité' },
    ],
  },
];

const socialLinkClass =
  'h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-[#b8955f] hover:text-[#b8955f] transition-colors';

export default function Footer() {
  return (
    <footer id="footer" className="storefront-footer bg-[#1d1a16] text-white">
      <div className="container mx-auto px-5 sm:px-6 pt-14 pb-8 sm:pt-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10">
          {/* Présentation & contact */}
          <div className="col-span-2 lg:col-span-4 lg:pr-10">
            <p className="font-headline text-[34px] leading-none mb-5">Dubaï Négoce</p>
            <p className="text-[13px] text-white/65 leading-relaxed mb-6 max-w-sm">
              Eaux de parfum authentiques des maisons de Dubaï, en flacons neufs scellés, expédiées depuis la France.
            </p>
            <div className="space-y-2 text-[13px] text-white/85 mb-6">
              <a href="tel:+33758999726" className="flex items-center gap-2.5 hover:text-[#b8955f] transition-colors">
                <Phone className="h-4 w-4 text-[#b8955f]" strokeWidth={1.5} /> 07 58 99 97 26
              </a>
              <a href="mailto:contact@dubainegoce.fr" className="flex items-center gap-2.5 hover:text-[#b8955f] transition-colors">
                <Mail className="h-4 w-4 text-[#b8955f]" strokeWidth={1.5} /> contact@dubainegoce.fr
              </a>
            </div>
            <Link
              href="/contact"
              className="inline-block border border-white/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] hover:bg-white hover:text-[#1d1a16] transition-colors"
            >
              Nous écrire
            </Link>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">{column.title}</h3>
              <ul className="space-y-2.5 text-[13px] text-white/85">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-[#b8955f] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Avis & réseaux */}
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">Nous suivre</h3>
            <div className="flex gap-2.5 mb-6">
              <a href="https://www.instagram.com/dubai_negoce/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialLinkClass}>
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href="https://www.tiktok.com/@dubainegoce" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={socialLinkClass}>
                <TiktokIcon />
              </a>
              <a href="https://www.snapchat.com/add/dubainegoce" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" className={socialLinkClass}>
                <SnapchatIcon />
              </a>
              <a href="https://www.youtube.com/@dubainegoce78" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialLinkClass}>
                <Youtube className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
            <a
              href="https://fr.trustpilot.com/review/dubainegoce.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block opacity-80 hover:opacity-100 transition-opacity"
            >
              <Image
                src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg"
                alt="Avis Dubainegoce sur Trustpilot"
                width={104}
                height={26}
                style={{ height: 'auto' }}
              />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5 text-[11px] text-white/50">
          <p>&copy; {new Date().getFullYear()} Dubaï Négoce · Mentions légales · CGV · Confidentialité</p>
          <PaymentBadges showTitle={false} badgeClassName="h-6" />
        </div>
      </div>
    </footer>
  );
}
