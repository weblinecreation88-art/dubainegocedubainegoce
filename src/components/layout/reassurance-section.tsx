
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
    const reassuranceContent = (
      <div className="flex items-center">
        {reassurances.map((item, index) => (
          <div key={index} className="flex items-center mx-6">
            {item.icon}
            <div className="text-left">
              <h3 className="font-headline text-base sm:text-lg font-semibold whitespace-nowrap">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    );

    return (
        <section className="py-8 sm:py-12 bg-card border-y overflow-hidden">
            <div className="flex">
                <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around">
                    {reassuranceContent}
                    {reassuranceContent}
                </div>
                 <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around" aria-hidden="true">
                    {reassuranceContent}
                    {reassuranceContent}
                </div>
            </div>
        </section>
    );
}
