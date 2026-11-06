import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div id="ndkcp-15" className="bg-[#f3ede3] text-[#1d1a16] border-b border-[#e6ded1]">
      <div className="container mx-auto px-4">
        <div className="min-h-[32px] py-1.5 flex items-center justify-center gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-center">
          <Link href="/livraison-et-paiement" className="hover:text-[#a8834f] transition-colors">
            Livraison dès 4,10 € (Mondial Relay &amp; Colissimo) · Offerte dès 2 parfums
          </Link>
          <span className="hidden md:inline text-[#1d1a16]/30" aria-hidden="true">·</span>
          <span className="hidden md:inline">Paiement sécurisé</span>
          <span className="hidden lg:inline text-[#1d1a16]/30" aria-hidden="true">·</span>
          <a href="tel:+33758999726" className="hidden lg:inline hover:text-[#a8834f] transition-colors">
            Service client 07 58 99 97 26
          </a>
        </div>
      </div>
    </div>
  );
}
