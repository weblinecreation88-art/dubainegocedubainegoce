
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useRef, useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SnapchatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.602.602 0 0 1 .25-.052c.206 0 .38.072.529.18.152.105.281.24.375.39.048.074.09.15.123.232l.024.06c.034.085.049.18.049.275a.762.762 0 0 1-.123.405c-.152.24-.435.375-.71.375h-.123c-.105 0-.225 0-.36-.03a4.5 4.5 0 0 0-.72-.075 3.7 3.7 0 0 0-.614.055c-.14.02-.26.06-.36.12l-.045.03c.12.36.24.75.375 1.125a9.59 9.59 0 0 0 .51 1.2c.406.675.93 1.155 1.55 1.41.204.09.405.15.6.18.204.03.405.045.6.045l.165-.015c.15-.015.27-.03.36-.045l.06-.015c.375-.09.72-.039.975.165.27.21.39.555.33.93-.045.315-.225.59-.48.78-.33.24-.734.39-1.2.45-.436.06-.93.09-1.485.09h-.015l-.45.015c-.165.015-.3.045-.405.09-.12.06-.224.135-.3.225-.09.105-.165.21-.225.315-.06.105-.165.27-.33.465-.165.195-.375.375-.645.51-.27.135-.585.195-.945.18a4.365 4.365 0 0 1-.96-.135 6.212 6.212 0 0 0-.66-.135 4.59 4.59 0 0 0-.555-.045 6.23 6.23 0 0 0-.72.045c-.225.03-.435.075-.63.135a4.5 4.5 0 0 1-.825.15c-.405.03-.795-.03-1.155-.195a2.43 2.43 0 0 1-.735-.525 3.4 3.4 0 0 1-.39-.525l-.06-.105c-.06-.105-.12-.21-.165-.315-.06-.12-.135-.24-.225-.33-.09-.105-.195-.18-.315-.24-.12-.06-.27-.09-.45-.105l-.45-.015h-.015c-.555 0-1.05-.03-1.485-.09-.465-.06-.87-.21-1.2-.45a1.07 1.07 0 0 1-.48-.78c-.06-.375.06-.72.33-.93.255-.204.6-.255.975-.165l.06.015c.09.015.21.03.36.045l.165.015c.195 0 .396-.015.6-.045.195-.03.396-.09.6-.18.62-.255 1.144-.735 1.55-1.41.21-.36.39-.765.51-1.2.135-.375.255-.765.375-1.125l-.045-.03c-.105-.06-.225-.105-.36-.12a3.7 3.7 0 0 0-.614-.055c-.24 0-.48.03-.72.075-.135.03-.255.03-.36.03h-.123c-.275 0-.558-.135-.71-.375a.762.762 0 0 1-.123-.405c0-.095.015-.19.049-.275l.024-.06c.033-.082.075-.158.123-.232.094-.15.223-.285.375-.39.149-.108.323-.18.529-.18.086 0 .17.017.25.052.374.181.733.285 1.033.301.198 0 .326-.045.401-.09a6.88 6.88 0 0 1-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.853 1.069 11.21.793 12.2.793h.006z"/>
  </svg>
);

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/dubai_negoce/', icon: Instagram, color: 'hover:text-pink-500' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@dubainegoce', icon: TikTokIcon, color: 'hover:text-cyan-400' },
  { name: 'Facebook', href: 'https://web.facebook.com/people/Babou-Father/100007559055739/', icon: Facebook, color: 'hover:text-blue-500' },
  { name: 'Snapchat', href: 'https://www.snapchat.com/add/dubainegoce', icon: SnapchatIcon, color: 'hover:text-yellow-400' },
];

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
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-t border-[#c58a3d]/20">
      <div className="container mx-auto px-4 pt-20 pb-10">
        {/* Logo et Description */}
        <div className="mb-12 text-center">
          <Link href="/">
            <span className="text-4xl md:text-5xl font-headline font-bold tracking-wider text-white hover:text-[#c58a3d] transition-colors inline-block">
              DUBAI<span className="text-[#c58a3d]">NEGOCE</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xl mx-auto text-gray-400 italic text-sm md:text-base">
            Votre ambassadeur de la haute parfumerie orientale. L'élégance de Dubaï à portée de main.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#c58a3d] uppercase tracking-wider">Collections</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-[#c58a3d] transition-colors text-gray-300">Tous les produits</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#c58a3d] uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-[#c58a3d] transition-colors text-gray-300">À Propos</Link></li>
              <li><Link href="/contact" className="hover:text-[#c58a3d] transition-colors text-gray-300">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-[#c58a3d] transition-colors text-gray-300">Politique de retour</Link></li>
              <li><Link href="/faq" className="hover:text-[#c58a3d] transition-colors text-gray-300">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#c58a3d] uppercase tracking-wider">Légal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-[#c58a3d] transition-colors text-gray-300">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-[#c58a3d] transition-colors text-gray-300">Politique de Confidentialité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-[#c58a3d] transition-colors text-gray-300">Mentions Légales</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#c58a3d] uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-gray-300">Reçois les lancements et sélections olfactives (sans promos).</p>
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
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
              <Button type="submit" disabled={pending} className="gradient-amber text-white hover:shadow-amber-glow">
                {pending ? <Loader2 className="animate-spin" /> : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Réseaux sociaux */}
        <div className="text-center mb-8">
          <h3 className="text-sm font-semibold text-[#c58a3d] uppercase tracking-wider mb-4">Suivez-nous</h3>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-colors ${social.color}`}
                aria-label={social.name}
              >
                <social.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-white/5" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Avis clients */}
            <div className="flex items-center gap-4">
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

            {/* Copyright et liens légaux */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400 mb-2">
                &copy; {new Date().getFullYear()} DubaiNegoce. Tous droits réservés.
              </p>
              <div className="flex space-x-6 text-xs text-gray-500 justify-center md:justify-end">
                <Link href="/privacy" className="hover:text-[#c58a3d] transition-colors">
                  Confidentialité
                </Link>
                <Link href="/terms" className="hover:text-[#c58a3d] transition-colors">
                  CGV
                </Link>
                <Link href="/mentions-legales" className="hover:text-[#c58a3d] transition-colors">
                  Mentions Légales
                </Link>
              </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
