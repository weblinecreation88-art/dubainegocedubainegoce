
'use client';

import { ShieldCheck, Rocket, Lock, Phone } from 'lucide-react';

const reassurances = [
  {
    icon: ShieldCheck,
    title: "100% Authentique",
    description: "Importé directement de Dubaï"
  },
  {
    icon: Lock,
    title: "Prix Juste et Fixe",
    description: "Le luxe accessible à 35€"
  },
  {
    icon: Rocket,
    title: "Livraison Rapide",
    description: "Colissimo 48h ou Mondial Relay"
  },
  {
    icon: Phone,
    title: "Support Français",
    description: "Notre équipe vous répond 24h/7j"
  },
];

export function ReassuranceSection() {
  return (
    <section className="py-16 bg-white border-t border-black/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {reassurances.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center p-6 hover:bg-neutral-50 transition-colors duration-300 rounded-sm">
                <div className="p-4 rounded-full bg-[#D4AF37]/5 mb-4">
                  <Icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="font-luxury-headline text-lg text-black mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-sm font-luxury-body text-black/60 tracking-wide">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
