'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCart } from '@/context/cart-context';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PROMO_CODE = 'COMEBACK5';
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function CartAbandonmentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const { cart } = useCart();
  const { toast } = useToast();

  // Generate cart hash to avoid showing popup for same cart
  const getCartHash = () => {
    return cart.map(item => `${item.id}:${item.quantity}`).join('|');
  };

  const isCartPopupShown = (cartHash: string) => {
    if (typeof window === 'undefined') return false;
    const shown = localStorage.getItem(`dubainegoce_cart_popup_${cartHash}`);
    return shown === 'true';
  };

  const markCartPopupShown = (cartHash: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`dubainegoce_cart_popup_${cartHash}`, 'true');
    // Clear after 24 hours
    setTimeout(() => {
      localStorage.removeItem(`dubainegoce_cart_popup_${cartHash}`);
    }, 24 * 60 * 60 * 1000);
  };

  const startInactivityTimer = () => {
    // Only show popup on /cart page with non-empty cart
    if (pathname !== '/cart' || cart.length === 0) {
      return;
    }

    // Check if already shown for this cart
    const cartHash = getCartHash();
    if (isCartPopupShown(cartHash)) {
      return;
    }

    // Set timer for popup
    const newTimeoutId = setTimeout(() => {
      setShowPopup(true);
      markCartPopupShown(cartHash);
    }, INACTIVITY_TIMEOUT);

    setTimeoutId(newTimeoutId);
  };

  const resetInactivityTimer = () => {
    // Clear existing timer
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Restart timer only on /cart with items
    if (pathname === '/cart' && cart.length > 0) {
      startInactivityTimer();
    }
  };

  // Track activity to reset timer
  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [pathname, cart, timeoutId]);

  // Initialize timer on cart/pathname changes
  useEffect(() => {
    resetInactivityTimer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname, cart.length]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    toast({
      title: 'Code copié!',
      description: `${PROMO_CODE} a été copié dans le presse-papiers.`,
      duration: 2000,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Reset timer after closing popup
    resetInactivityTimer();
  };

  return (
    <AlertDialog open={showPopup} onOpenChange={handleClosePopup}>
      <AlertDialogContent className="bg-white dark:bg-slate-950">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <AlertDialogTitle className="text-xl">Vous oubliez vos parfums?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-foreground">
            Ne partez pas sans votre sélection! Utilisez notre code promo et économisez <span className="font-bold text-accent">5%</span> sur votre commande.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Promo Code Display */}
        <div className="bg-accent/10 dark:bg-accent/20 border border-accent/30 rounded-lg p-4 my-4">
          <p className="text-sm text-muted-foreground mb-2">Votre code promo:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-lg font-bold text-accent bg-white dark:bg-slate-900 px-3 py-2 rounded border border-accent/30">
              {PROMO_CODE}
            </code>
            <button
              onClick={handleCopyCode}
              className="p-2 hover:bg-accent/20 rounded transition-colors"
              title="Copier le code"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 text-accent" />
              )}
            </button>
          </div>
        </div>


        <div className="flex gap-3">
          <AlertDialogCancel onClick={handleClosePopup}>
            Pas maintenant
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => {
              handleCopyCode();
              setShowPopup(false);
              // Scroll to checkout button for mobile
              setTimeout(() => {
                const checkoutBtn = document.querySelector('[data-checkout-button]');
                checkoutBtn?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Continuer les achats
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
