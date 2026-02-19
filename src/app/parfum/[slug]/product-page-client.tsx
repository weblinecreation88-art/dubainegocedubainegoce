'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

function getShippingMessage(): { text: string; urgent: boolean } {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    return { text: 'Expédition dès lundi matin', urgent: false };
  }

  if (hour < 14) {
    const totalMinutesLeft = (14 - hour - 1) * 60 + (60 - minute);
    const hoursLeft = Math.floor(totalMinutesLeft / 60);
    const minutesLeft = totalMinutesLeft % 60;
    const timeStr = hoursLeft > 0
      ? `${hoursLeft}h${minutesLeft.toString().padStart(2, '0')}`
      : `${minutesLeft} min`;
    return {
      text: `Commandez dans ${timeStr} → expédié aujourd'hui`,
      urgent: totalMinutesLeft < 60,
    };
  }

  return { text: 'Expédié demain avant 14h', urgent: false };
}

export function ProductPageClient() {
  const [msg, setMsg] = useState<{ text: string; urgent: boolean } | null>(null);

  useEffect(() => {
    setMsg(getShippingMessage());
    const interval = setInterval(() => setMsg(getShippingMessage()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!msg) return null;

  return (
    <div className={`flex items-center gap-2 px-4 py-3 border ${msg.urgent ? 'border-orange-200 bg-orange-50' : 'border-black/5 bg-[#F9F9F9]'}`}>
      <Clock className={`h-4 w-4 shrink-0 ${msg.urgent ? 'text-orange-500' : 'text-[#D4AF37]'}`} />
      <p className={`text-[10px] uppercase tracking-wider font-luxury-body ${msg.urgent ? 'text-orange-600' : 'text-black/50'}`}>
        {msg.text}
      </p>
    </div>
  );
}
