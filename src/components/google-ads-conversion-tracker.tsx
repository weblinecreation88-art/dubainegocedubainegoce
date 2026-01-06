'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Déclaration de la fonction gtag pour TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: 'conversion',
      params: {
        send_to: string;
        value: number;
        currency: string;
        transaction_id: string;
      }
    ) => void;
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
    if (transactionId && value !== null && typeof window.gtag === 'function') {
      const conversionData = {
        send_to: `${googleAdsId}/${conversionLabel}`,
        value: value,
        currency: 'EUR',
        transaction_id: transactionId,
      };
      
      console.log('Sending conversion data to Google Ads:', conversionData);
      window.gtag('event', 'conversion', conversionData);
    }
  }, [transactionId, value, googleAdsId, conversionLabel]);

  return (
    <Script
      id="google-ads-conversion-script"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
    />
  );
}
