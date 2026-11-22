import React from 'react';
import { ShieldCheck, Truck, RotateCcw, PhoneCall, Star, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export function CheckoutReassurance() {
  return (
    <div className="mt-8 space-y-4">
      {/* 1. Bloc Avis Trustpilot & Preuve Sociale */}
      <div className="bg-[#fcfaf7] border border-[#e6ded1] p-4 rounded-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className="flex text-[#00b67a]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#00b67a]" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1d1a16] tracking-tight">Avis Clients Vérifiés</span>
          </div>
          <Link
            href="https://fr.trustpilot.com/review/dubainegoce.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#00b67a] hover:underline font-semibold"
          >
            Trustpilot ↗
          </Link>
        </div>
        <p className="text-xs text-[#5d564c] leading-relaxed">
          « Flacons 100 % originaux reçus sous blister scellé avec le code barre et hologramme. Expédition très rapide. »
        </p>
        <p className="text-[10px] text-[#8a8074] mt-1.5 font-medium">
          Dubaï Négoce · Entreprise française vérifiée
        </p>
      </div>

      {/* 2. Grille des 4 Garanties Majeures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-start gap-2.5 p-3 bg-white border border-[#ece4d8]">
          <ShieldCheck className="h-5 w-5 text-[#b8955f] shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-bold text-[#1d1a16]">100% Authentique</p>
            <p className="text-[11px] text-[#6f6559] leading-tight mt-0.5">
              Flacon neuf sous blister scellé avec hologramme de la marque.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-white border border-[#ece4d8]">
          <Truck className="h-5 w-5 text-[#b8955f] shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-bold text-[#1d1a16]">Expédié de France 24/48h</p>
            <p className="text-[11px] text-[#6f6559] leading-tight mt-0.5">
              Colis soigné avec numéro de suivi en direct (Mondial Relay / Colissimo).
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-white border border-[#ece4d8]">
          <RotateCcw className="h-5 w-5 text-[#b8955f] shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-bold text-[#1d1a16]">Garantie Satisfait ou Remboursé</p>
            <p className="text-[11px] text-[#6f6559] leading-tight mt-0.5">
              14 jours pour changer d&apos;avis après réception de votre commande.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 bg-white border border-[#ece4d8]">
          <PhoneCall className="h-5 w-5 text-[#b8955f] shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-bold text-[#1d1a16]">Conseil &amp; Suivi au 07 58 99 97 26</p>
            <p className="text-[11px] text-[#6f6559] leading-tight mt-0.5">
              Une question avant de commander ? Appel &amp; WhatsApp direct en France.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bandeau Cadenas Bancaire & Sécurité Stripe */}
      <div className="flex items-center gap-3 p-3 bg-[#f5fbf7] border border-[#d2edd9] text-xs text-[#165b32]">
        <Lock className="h-4 w-4 shrink-0 text-[#1b6b3e]" />
        <span className="leading-snug">
          <strong>Paiement 100% sécurisé et chiffré SSL (3D-Secure)</strong> : aucune coordonnée bancaire ne transite par notre serveur.
        </span>
      </div>
    </div>
  );
}
