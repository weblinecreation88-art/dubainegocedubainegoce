
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
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Collections</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Tous les produits</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Politique de retour</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Politique de Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">Newsletter</h3>
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
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                            <path d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avis Google</span>
                    </a>
                </div>
            </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DubaiNegoce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
