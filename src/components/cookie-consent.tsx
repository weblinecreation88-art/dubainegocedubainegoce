'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        setShowBanner(true);
      }
    } catch (error) {
      // localStorage is not available (e.g., in server-side rendering or private browsing)
      // We can choose to not show the banner or handle it differently
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'true');
      setShowBanner(false);
    } catch (error) {
       setShowBanner(false);
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <Card className={cn(
            "w-full max-w-lg mx-auto shadow-2xl border-secondary/20",
            "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
            "transition-transform duration-500 ease-out",
            showBanner ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="p-2 bg-gradient-yara rounded-full mt-1">
                    <Cookie className="h-6 w-6 text-white" />
                </div>
                <div>
                    <CardTitle className="text-lg text-gradient-yara">Nous utilisons des cookies</CardTitle>
                    <CardDescription className="mt-1">
                        Ce site utilise des cookies pour sauvegarder votre panier et améliorer votre expérience de navigation. En continuant, vous acceptez notre utilisation des cookies.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAccept} className="w-full bg-gradient-yara hover:opacity-90 text-white border-0">
                        Accepter
                    </Button>
                     <Button variant="outline" onClick={() => setShowBanner(false)} className="w-full border-secondary text-secondary hover:bg-secondary/10">
                        Refuser
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
