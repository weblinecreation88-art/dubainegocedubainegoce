
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    try {
      const result = await subscribeToNewsletter({ message: '' }, formData);
      toast({
        title: result.error ? 'Erreur' : 'Succès !',
        description: result.message,
        variant: result.error ? 'destructive' : 'default',
      });
      if (!result.error) {
        formRef.current?.reset();
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Collections</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Tous les produits</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/livraison-et-paiement" className="hover:text-primary transition-colors">Livraison et Paiement</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Politique de retour</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li className="pt-2">
                <div className="flex items-start gap-2 text-xs text-muted-foreground group">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-secondary-foreground">Retours & Support Technique</p>
                    <a href="tel:+33758999726" className="hover:text-primary transition-colors break-all">+33 7 58 99 97 26</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href="mailto:contact@dubainegoce.fr" className="hover:text-primary transition-colors break-all">contact@dubainegoce.fr</a>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>54 Rue Alphonse Durand<br />78200 Mantes-la-Jolie, Paris</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm leading-relaxed">Rejoins +1000 passionnés. Nouvelles collections et offres exclusives en avant-première.</p>
            <p className="text-xs text-primary font-semibold">🎁 Guide offert : "Top 10 parfums orientaux à 35€"</p>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData);
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                className="bg-background"
                required
              />
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "S'inscrire"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">Sans spam. Désabonnement en 1 clic.</p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="font-bold text-lg font-headline">DubaiNegoce</span>
            </Link>
            <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer">
              <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg" alt="Trustpilot" width={100} height={25} style={{ height: 'auto' }} />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DubaiNegoce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
