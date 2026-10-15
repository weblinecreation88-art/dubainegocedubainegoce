'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FaqChatbot = dynamic(() => import('@/components/faq-chatbot').then(m => ({ default: m.FaqChatbot })), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/exit-intent-popup').then(m => ({ default: m.ExitIntentPopup })), { ssr: false });
const CartAbandonmentPopup = dynamic(() => import('@/components/cart-abandonment-popup').then(m => ({ default: m.CartAbandonmentPopup })), { ssr: false });

export function DeferredWidgets() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const enableWidgets = () => {
      setShouldRender(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', enableWidgets);
      window.removeEventListener('touchstart', enableWidgets);
      window.removeEventListener('click', enableWidgets);
      clearTimeout(timer);
    };

    window.addEventListener('scroll', enableWidgets, { passive: true, once: true });
    window.addEventListener('touchstart', enableWidgets, { passive: true, once: true });
    window.addEventListener('click', enableWidgets, { passive: true, once: true });

    // Fallback après 8s si aucune interaction utilisateur
    const timer = setTimeout(enableWidgets, 8000);

    return cleanup;
  }, []);

  if (!shouldRender) return null;

  return (
    <>
      <FaqChatbot />
      <ExitIntentPopup />
      <CartAbandonmentPopup />
    </>
  );
}
