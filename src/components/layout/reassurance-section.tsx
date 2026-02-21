
'use client';

import { ShieldCheck, Rocket, Lock, Phone } from 'lucide-react';

const reassurances = [
  {
    icon: <ShieldCheck className="w-6 h-6 mr-3 text-primary" />,
    title: "100% Authentique",
    description: "Importé directement de Dubaï"
  },
  {
    icon: <Lock className="w-6 h-6 mr-3 text-primary" />,
    title: "Prix Juste et Fixe",
    description: "Le luxe accessible à 35€"
  },
  {
    icon: <Rocket className="w-6 h-6 mr-3 text-primary" />,
    title: "Livraison Rapide",
    description: "Colissimo 48h ou Mondial Relay"
  },
  {
    icon: <Phone className="w-6 h-6 mr-3 text-primary" />,
    title: "Support Français",
    description: "Notre équipe vous répond 24h/7j"
  },
];

export function ReassuranceSection() {
  return (
    <section className="py-8 bg-black text-white border-y border-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-8 text-center text-gray-300">
        {reassurances.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-white">{item.icon}</span>
            <div className="text-left">
              <h3 className="font-headline text-sm font-semibold whitespace-nowrap text-white">{item.title}</h3>
              <p className="text-xs opacity-70 whitespace-nowrap">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
