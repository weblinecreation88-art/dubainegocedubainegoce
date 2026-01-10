
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
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
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Collections</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-dubainegoce-color transition-colors">Tous les produits</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-dubainegoce-color transition-colors">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-dubainegoce-color transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-dubainegoce-color transition-colors">Politique de retour</Link></li>
              <li><Link href="/faq" className="hover:text-dubainegoce-color transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-dubainegoce-color transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-dubainegoce-color transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-dubainegoce-color transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm">Reçois les lancements et sélections olfactives (sans promos).</p>
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
                {pending ? <Loader2 className="animate-spin" /> : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
                 <Link href="/">
                    <span className="font-bold text-lg font-headline">DubaiNegoce</span>
                </Link>
                <div className="flex items-center gap-3">
                    <a href="https://fr.trustpilot.com/review/dubainegoce.fr" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                        <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1766250269/logo-white_x4wl9x.svg" alt="Trustpilot" width={100} height={25} style={{ width: 'auto', height: 'auto' }} />
                    </a>
                    <a
                        href="https://g.page/r/CYfNDXizM9KSEAE/review"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                            alt="Google Reviews"
                            width={74}
                            height={24}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </a>
                </div>
            </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DubaiNegoce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
