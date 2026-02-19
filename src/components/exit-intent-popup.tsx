'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const POPUP_STORAGE_KEY = 'dubainegoce_exit_popup_shown';
const POPUP_COOLDOWN_DAYS = 7;

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const hasTriggered = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already shown recently
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSince < POPUP_COOLDOWN_DAYS) return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered.current) {
        hasTriggered.current = true;
        setIsVisible(true);
        localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
      }
    };

    // Also trigger on mobile after 30s if no interaction
    const mobileTimer = setTimeout(() => {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        setIsVisible(true);
        localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData();
    formData.set('email', email);
    try {
      const result = await subscribeToNewsletter({ message: '' }, formData);
      if (!result.error) {
        setIsDone(true);
      } else {
        toast({ title: 'Erreur', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsPending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white max-w-md w-full shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-black/40 hover:text-black transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top gold bar */}
        <div className="h-1 bg-gradient-to-r from-[#c58a3d] via-[#D4AF37] to-[#c58a3d]" />

        {/* Content */}
        <div className="p-8 md:p-10 text-center">
          {!isDone ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-[#D4AF37]" />
                </div>
              </div>

              {/* Headline */}
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-luxury-body mb-2">
                Offre exclusive
              </p>
              <h2 className="text-2xl md:text-3xl font-luxury-headline text-black leading-tight mb-3">
                Attendez !<br />
                <span className="text-[#D4AF37]">−10% sur votre</span><br />
                première commande
              </h2>
              <p className="text-sm text-black/50 font-luxury-body mb-6 leading-relaxed">
                Rejoignez notre communauté de passionnés et recevez votre code promo instantanément.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center border-black/20 rounded-none h-12 font-luxury-body text-sm"
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-black text-white hover:bg-[#D4AF37] hover:text-white rounded-none h-12 font-luxury-body text-[10px] uppercase tracking-[0.3em] transition-all duration-300"
                >
                  {isPending ? 'Envoi...' : (
                    <span className="flex items-center gap-2">
                      Recevoir mon code −10% <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <button
                onClick={handleClose}
                className="mt-4 text-[10px] uppercase tracking-wider text-black/30 hover:text-black/60 transition-colors font-luxury-body"
              >
                Non merci, je préfère payer plein prix
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
              <h2 className="text-2xl font-luxury-headline text-black mb-3">
                Votre code est en route !
              </h2>
              <p className="text-sm text-black/50 font-luxury-body mb-6">
                Vérifiez votre boîte mail — votre code <strong className="text-[#D4AF37]">−10%</strong> arrive dans quelques instants.
              </p>
              <Button
                onClick={handleClose}
                className="bg-black text-white hover:bg-[#D4AF37] rounded-none h-12 px-8 font-luxury-body text-[10px] uppercase tracking-[0.3em]"
              >
                Découvrir la collection
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
