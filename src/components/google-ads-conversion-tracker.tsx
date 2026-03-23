'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAdsConversionTrackerProps {
    googleAdsId: string;
    conversionLabel: string;
    transactionId: string | null;
    value: number | null;
}

export function GoogleAdsConversionTracker({ googleAdsId, conversionLabel, transactionId, value }: GoogleAdsConversionTrackerProps) {

  useEffect(() => {
    if (!transactionId || value === null) return;

    const fireConversion = () => {
      if (typeof window.gtag !== 'function') return;

      const conversionData = {
        send_to: `${googleAdsId}/${conversionLabel}`,
        value: value,
        currency: 'EUR',
        transaction_id: transactionId,
      };

      console.log('Sending conversion to Google Ads:', conversionData);
      window.gtag('event', 'conversion', conversionData);
    };

    // Petit délai pour laisser le temps à gtag de s'initialiser (chargé en afterInteractive)
    const timeout = setTimeout(fireConversion, 500);
    return () => clearTimeout(timeout);
  }, [transactionId, value, googleAdsId, conversionLabel]);

  return null;
}
