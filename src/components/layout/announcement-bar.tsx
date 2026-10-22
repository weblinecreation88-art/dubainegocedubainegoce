import Link from 'next/link';
import { Truck, ShieldCheck, Phone, HelpCircle } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div id="ndkcp-15" className="bg-[#111827] text-white border-b border-[#d4a017]/40">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="min-h-[34px] py-1 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          {/* Gauche : Authenticité & Prix fixe */}
          <div className="hidden md:flex items-center gap-2 text-white/90">
            <ShieldCheck className="h-3.5 w-3.5 text-[#d4a017] shrink-0" />
            <span>
              Parfums authentiques de Dubaï • <strong className="text-[#d4a017]">Découvrez notre sélection</strong>
            </span>
          </div>

          {/* Centre : Règle unique de livraison gratuite */}
          <div className="flex-1 md:flex-initial text-center">
            <Link
              href="/livraison-et-paiement"
              className="inline-flex items-center justify-center gap-1.5 hover:underline"
            >
              <Truck className="h-3.5 w-3.5 text-[#d4a017] shrink-0" />
              <span>
                Livraison Colissimo <strong className="text-[#d4a017] uppercase">gratuite</strong> dès{' '}
                <span className="font-extrabold text-[#d4a017] underline">3 parfums</span> (ou 100 € d&apos;achat)
              </span>
            </Link>
          </div>

          {/* Droite : Liens pratiques & Contact */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-white/85">
            <Link href="/suivi-commande" className="hover:text-[#d4a017] transition-colors flex items-center gap-1">
              <span>📦 Suivre ma commande</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/shipping" className="hover:text-[#d4a017] transition-colors flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-[#d4a017]" />
              <span>Livraison &amp; Retours</span>
            </Link>
            <span className="text-white/30">|</span>
            <a href="tel:+33758999726" className="hover:text-[#d4a017] transition-colors flex items-center gap-1 font-semibold">
              <Phone className="h-3 w-3 text-[#d4a017]" />
              <span>07 58 99 97 26</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
