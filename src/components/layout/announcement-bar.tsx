import Link from 'next/link';
import { Phone, Truck } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="h-10 flex items-center justify-between text-xs font-medium">
          {/* Gauche : Téléphone */}
          <a href="tel:+33758999726" className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>+33 7 58 99 97 26</span>
          </a>
          {/* Centre : Message prix */}
          <span className="flex-1 text-center tracking-wide">
            Prix unique : tous nos parfums sont à <span style={{color: '#fbbf24', fontWeight: 700}}>35€</span> ! Livraison Mondial Relay dès <span style={{color: '#fbbf24', fontWeight: 700}}>4,73 €</span>
          </span>
          {/* Droite : Livraison */}
          <Link href="/livraison-et-paiement" className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Truck className="h-3.5 w-3.5 shrink-0" />
            <span>Livraison &amp; Paiement</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
