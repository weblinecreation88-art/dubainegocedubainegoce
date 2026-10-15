'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FaqChatbot = dynamic(() => import('@/components/faq-chatbot').then(m => ({ default: m.FaqChatbot })), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/exit-intent-popup').then(m => ({ default: m.ExitIntentPopup })), { ssr: false });
const CartAbandonmentPopup = dynamic(() => import('@/components/cart-abandonment-popup').then(m => ({ default: m.CartAbandonmentPopup })), { ssr: false });

export function DeferredWidgets() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Différer le montage des popups marketing et du chatbot pour libérer le thread principal
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(() => setShouldRender(true), { timeout: 2500 });
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(() => setShouldRender(true), 2000);
        return () => clearTimeout(timer);
      }
    }
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
