
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

const TiktokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.82a8.18 8.18 0 0 0 4.78 1.52V6.89a4.85 4.85 0 0 1-1.01-.2z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.166 2C9.349 2 6.732 3.343 5.09 5.618c-.897 1.245-1.332 2.694-1.09 4.296-.307.163-.635.243-.97.243-.426 0-.768.337-.768.75s.342.75.768.75c.63 0 1.19-.16 1.67-.41.168.484.373.952.614 1.404-.62.48-1.576 1.29-1.576 2.28 0 .63.394 1.08.923 1.244.65 2.02 3.21 2.825 5.34 2.825.28 0 .557-.013.828-.04.594.532 1.29.796 2.04.796s1.445-.264 2.04-.796c.27.027.548.04.827.04 2.13 0 4.69-.806 5.34-2.825.53-.164.923-.613.923-1.244 0-.99-.956-1.8-1.576-2.28.24-.452.446-.92.613-1.403.48.25 1.04.41 1.67.41.426 0 .769-.337.769-.75s-.343-.75-.769-.75c-.334 0-.662-.08-.97-.243.242-1.602-.192-3.051-1.09-4.296C17.433 3.343 14.817 2 12 2h.166z"/>
  </svg>
);

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
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop/all" className="hover:text-primary transition-colors">Tous les parfums</Link></li>
              <li><Link href="/shop/all?sort=newest" className="hover:text-primary transition-colors">Nouveautés</Link></li>
              <li><Link href="/shop/all?sort=bestsellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li className="pt-1 text-xs text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Marques</li>
              <li><Link href="/shop/all?brands=Lattafa" className="hover:text-primary transition-colors">Lattafa</Link></li>
              <li><Link href="/shop/all?brands=Maison+Alhambra" className="hover:text-primary transition-colors">Maison Alhambra</Link></li>
              <li><Link href="/shop/all?brands=Fragrance+World" className="hover:text-primary transition-colors">Fragrance World</Link></li>
              <li><Link href="/shop/all?brands=French+Avenue" className="hover:text-primary transition-colors">French Avenue</Link></li>
              <li className="pt-1 text-xs text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Familles</li>
              <li><Link href="/shop/all?families=Oriental" className="hover:text-primary transition-colors">Oriental</Link></li>
              <li><Link href="/shop/all?families=Boisé" className="hover:text-primary transition-colors">Boisé</Link></li>
              <li><Link href="/shop/all?families=Floral" className="hover:text-primary transition-colors">Floral</Link></li>
              <li><Link href="/shop/all?families=Gourmand" className="hover:text-primary transition-colors">Gourmand</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/suivi-commande" className="hover:text-primary transition-colors">Suivi de commande</Link></li>
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
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Newsletter</h3>
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
            <p className="text-xs text-gray-700 dark:text-gray-300">Sans spam. Désabonnement en 1 clic.</p>
            <div className="pt-2 space-y-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Suivez-nous</p>
              <div className="grid grid-cols-2 gap-2">
                <a href="https://www.instagram.com/dubai_negoce/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Instagram className="h-4 w-4 shrink-0" />
                  <span>Instagram</span>
                </a>
                <a href="https://www.tiktok.com/@dubainegoce" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <TiktokIcon />
                  <span>TikTok</span>
                </a>
                <a href="https://web.facebook.com/people/Babou-Father/100007559055739/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <Facebook className="h-4 w-4 shrink-0" />
                  <span>Facebook</span>
                </a>
                <a href="https://www.snapchat.com/add/dubainegoce" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                  <SnapchatIcon />
                  <span>Snapchat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/">
              <span className="font-bold text-lg font-headline">DubaiNegoce</span>
            </Link>
            <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer">
              <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg" alt="Trustpilot" width={100} height={25} style={{ height: 'auto' }} />
            </a>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">&copy; {new Date().getFullYear()} DubaiNegoce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
