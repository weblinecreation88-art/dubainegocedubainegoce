'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const POPUP_STORAGE_KEY = 'dubainegoce_exit_popup_shown';
const POPUP_COOLDOWN_DAYS = 7;

async function subscribeEmail(email: string): Promise<{ error: boolean; message: string }> {
  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error();
    return { error: false, message: 'Inscription réussie !' };
  } catch {
    return { error: true, message: 'Une erreur est survenue.' };
  }
}

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const hasTriggered = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const result = await subscribeEmail(email);
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisible(false)} />
      <div className="relative z-10 bg-white dark:bg-card max-w-md w-full shadow-2xl overflow-hidden">
        <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors z-10" aria-label="Fermer">
          <X className="h-5 w-5" />
        </button>
        <div className="h-1 bg-gradient-to-r from-[#c58a3d] via-[#D4AF37] to-[#c58a3d]" />
        <div className="p-8 md:p-10 text-center">
          {!isDone ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-semibold mb-2">Offre exclusive</p>
              <h2 className="text-2xl md:text-3xl font-headline text-foreground leading-tight mb-3">
                Attendez !<br />
                <span className="text-primary">−10% sur votre</span><br />
                première commande
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Rejoignez notre communauté de passionnés et recevez votre code promo instantanément.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center rounded-none h-12"
                />
                <Button type="submit" disabled={isPending} className="w-full rounded-none h-12">
                  {isPending ? 'Envoi...' : (
                    <span className="flex items-center gap-2">
                      Recevoir mon code −10% <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
              <button onClick={() => setIsVisible(false)} className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Non merci, je préfère payer plein prix
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
              </div>
              <h2 className="text-2xl font-headline text-foreground mb-3">Votre code est en route !</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Vérifiez votre boîte mail — votre code <strong className="text-primary">−10%</strong> arrive dans quelques instants.
              </p>
              <Button onClick={() => setIsVisible(false)} className="rounded-none h-12 px-8">
                Découvrir la collection
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
