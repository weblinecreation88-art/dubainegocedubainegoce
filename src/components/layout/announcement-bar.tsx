import Link from 'next/link';
import { Truck, ShieldCheck, Flame } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="h-8 flex items-center justify-between text-[10px] sm:text-xs font-semibold tracking-wide">
          {/* Gauche : Urgence */}
          <div className="hidden lg:flex items-center gap-1.5 text-[#c9a96e]">
            <Flame className="h-4 w-4 shrink-0" />
            <span>Stock limité sur les Bestsellers</span>
          </div>
          {/* Centre : Message Livraison */}
          <span className="flex-1 text-center flex items-center justify-center gap-2">
            <Truck className="h-4 w-4 text-[#c9a96e]" />
            Livraison Express 48h
          </span>
          {/* Droite : Rassurance */}
          <div className="hidden lg:flex items-center gap-1.5 text-[#c9a96e]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="text-white">Retour facile sous 14 jours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
