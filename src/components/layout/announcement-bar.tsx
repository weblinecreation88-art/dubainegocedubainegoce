'use client';

import { useEffect, useState } from 'react';

function getShippingCountdown(): string {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Cutoff: 14h00 en semaine (lun-ven)
  const day = now.getDay(); // 0=dim, 6=sam
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    return 'Expédition lundi';
  }

  const cutoffHour = 14;
  if (hour < cutoffHour) {
    const hoursLeft = cutoffHour - hour - 1;
    const minutesLeft = 60 - minute;
    if (hoursLeft > 0) {
      return `Expédié aujourd'hui si commande dans ${hoursLeft}h${minutesLeft.toString().padStart(2, '0')}`;
    } else {
      return `Expédié aujourd'hui si commande dans ${minutesLeft} min`;
    }
  }
  return `Expédié demain avant 14h`;
}

export function AnnouncementBar() {
  const [shippingText, setShippingText] = useState('');

  useEffect(() => {
    setShippingText(getShippingCountdown());
    const interval = setInterval(() => {
      setShippingText(getShippingCountdown());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const messages = [
    { icon: '🚀', text: shippingText || "Expédition rapide Colissimo & Mondial Relay" },
    { icon: '🎁', text: 'Livraison Mondial Relay OFFERTE dès maintenant !' },
    { icon: '💎', text: 'Tous nos parfums authentiques à prix unique : 35€' },
    { icon: '✨', text: '100% Authentiques · Importés directement de Dubaï' },
    { icon: '⭐', text: '4.9/5 sur +150 avis clients vérifiés' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white overflow-hidden" style={{ height: '36px' }}>
      <div className="flex items-center h-full">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...messages, ...messages].map((msg, i) => (
            <span key={i} className="mx-8 text-[10px] uppercase tracking-[0.2em] font-luxury-body flex items-center gap-2">
              <span>{msg.icon}</span>
              <span>{msg.text}</span>
              <span className="text-[#D4AF37] mx-4">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
