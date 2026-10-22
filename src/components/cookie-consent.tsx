'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) setShowBanner(true);
    } catch {}
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem('cookie_consent', 'true'); } catch {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="storefront-cookie fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <Cookie className="h-4 w-4 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground flex-1">
          Ce site utilise des cookies pour sauvegarder votre panier et améliorer votre navigation.{' '}
          <a href="/privacy" className="underline hover:text-primary transition-colors">En savoir plus</a>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAccept}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Accepter
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-xs px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fermer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
