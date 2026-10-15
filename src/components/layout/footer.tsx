'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';
import { PaymentBadges } from '@/components/ui/payment-badges';

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.166 2C9.349 2 6.732 3.343 5.09 5.618c-.897 1.245-1.332 2.694-1.09 4.296-.307.163-.635.243-.97.243-.426 0-.768.337-.768.75s.342.75.768.75c.63 0 1.19-.16 1.67-.41.168.484.373.952.614 1.404-.62.48-1.576 1.29-1.576 2.28 0 .63.394 1.08.923 1.244.65 2.02 3.21 2.825 5.34 2.825.28 0 .557-.013.828-.04.594.532 1.29.796 2.04.796s1.445-.264 2.04-.796c.27.027.548.04.827.04 2.13 0 4.69-.806 5.34-2.825.53-.164.923-.613.923-1.244 0-.99-.956-1.8-1.576-2.28.24-.452.446-.92.613-1.403.48.25 1.04.41 1.67.41.426 0 .769-.337.769-.75s-.343-.75-.769-.75c-.334 0-.662-.08-.97-.243.242-1.602-.192-3.051-1.09-4.296C17.433 3.343 14.817 2 12 2h.166z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0f1726] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Logo & À Propos */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-bold text-2xl font-headline tracking-widest uppercase text-[#c9a96e]">Dubaï Négoce</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Votre parfumerie orientale premium. L'authenticité des plus grandes maisons de Dubaï, accessible à tous.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/dubai_negoce/" target="_blank" rel="noopener noreferrer" aria-label="DubaiNegoce sur Instagram" className="text-white/60 hover:text-[#c9a96e] transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://www.tiktok.com/@dubainegoce" target="_blank" rel="noopener noreferrer" aria-label="DubaiNegoce sur TikTok" className="text-white/60 hover:text-[#c9a96e] transition-colors"><TiktokIcon /></a>
              <a href="https://www.snapchat.com/add/dubainegoce" target="_blank" rel="noopener noreferrer" aria-label="DubaiNegoce sur Snapchat" className="text-white/60 hover:text-[#c9a96e] transition-colors"><SnapchatIcon /></a>
              <a href="https://www.youtube.com/@dubainegoce78" target="_blank" rel="noopener noreferrer" aria-label="DubaiNegoce sur YouTube" className="text-white/60 hover:text-[#c9a96e] transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">Boutique</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/shop/all" className="hover:text-[#c9a96e] transition-colors">Tous les parfums</Link></li>
                <li><Link href="/shop/all?sort=newest" className="hover:text-[#c9a96e] transition-colors">Nouveautés</Link></li>
                <li><Link href="/shop/all?sort=bestsellers" className="hover:text-[#c9a96e] transition-colors">Bestsellers</Link></li>
                <li><Link href="/shop/type/oriental" className="hover:text-[#c9a96e] transition-colors">Parfums Orientaux</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">Informations</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/suivi-commande" className="hover:text-[#c9a96e] transition-colors">Suivi de commande</Link></li>
                <li><Link href="/shipping" className="hover:text-[#c9a96e] transition-colors">Livraison & Retours</Link></li>
                <li><Link href="/terms" className="hover:text-[#c9a96e] transition-colors">CGV</Link></li>
                <li><Link href="/privacy" className="hover:text-[#c9a96e] transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">Service Client</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+33758999726" className="flex items-center gap-3 text-sm text-white/70 hover:text-[#c9a96e] transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#c9a96e]/10 transition-colors">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  +33 7 58 99 97 26
                </a>
              </li>
              <li>
                <a href="mailto:contact@dubainegoce.fr" className="flex items-center gap-3 text-sm text-white/70 hover:text-[#c9a96e] transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#c9a96e]/10 transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  contact@dubainegoce.fr
                </a>
              </li>
            </ul>
            <div className="pt-4">
              <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="inline-block opacity-80 hover:opacity-100 transition-opacity">
                <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg" alt="Trustpilot" width={100} height={25} style={{ height: 'auto' }} />
              </a>
            </div>
          </div>

        </div>

        <Separator className="my-10 bg-white/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Dubaï Négoce. Tous droits réservés.</p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-[11px] text-white/60">Paiement 100% sécurisé :</span>
            <PaymentBadges showTitle={false} badgeClassName="h-6" />
          </div>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
