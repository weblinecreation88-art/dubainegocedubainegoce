
import { Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 333" {...props}>
        <path fill="currentColor" d="M288 116.2v48.8c-26.4-11.2-52-24.3-76.9-39.1v153.8C211.1 292.8 194.5 302 175 302s-36.1-9.2-36.1-22.3V125.1c0-23 15.3-40.4 40.4-40.4 22.3 0 38.3 12.1 38.3 12.1l-11.2 45.9s-12.9-9.2-24.3-9.2c-7.7 0-12.9 2.3-12.9 8.4v30.2c33.8 15.3 64.9 31 93.8 45.1V116.2h55zM116.2 0h-55v228.8c0 23-15.3 40.4-40.4 40.4S0 251.8 0 228.8s15.3-40.4 40.4-40.4h4.6V0h55v134.5c0 23-15.3 40.4-40.4 40.4S0 174.9 0 151.9s15.3-40.4 40.4-40.4h4.6V0h-4.6C18.1 0 0 20.3 0 45.1v183.7C0 284.1 27.2 302 55 302s55-17.9 55-42.7V0h6.2z"/>
    </svg>
);

const SnapchatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.93 0 1.83-.13 2.69-.37l.86-1.72c.32-.64.98-1.03 1.68-1.03h.01c.78 0 1.48.53 1.71 1.29.35 1.15.55 2.36.55 3.61 0 .55-.45 1-1 1s-1-.45-1-1c0-1.1-.18-2.16-.5-3.15-.17-.55-.68-1.2-1.31-1.2h-.01c-.55 0-1.04.3-1.28.78l-1.02 2.05C13.53 21.9 12.78 22 12 22c-5.52 0-10-4.48-10-10S6.48 2 12 2zm8.5 5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5S12.5 7.83 12.5 7s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
    </svg>
);


const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dubai_negoce/',
    icon: <Instagram className="h-8 w-8 text-pink-500" />,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@dubainegoce',
    icon: <TikTokIcon className="h-8 w-8 text-cyan-400" />,
  },
   {
    name: 'Facebook',
    href: 'https://web.facebook.com/people/Babou-Father/100007559055739/',
    icon: <Facebook className="h-8 w-8 text-blue-600" />,
  },
   {
    name: 'Snapchat',
    href: 'https://www.snapchat.com/add/dubainegoce',
    icon: <SnapchatIcon className="h-8 w-8 text-yellow-400" />,
  }
];

export function SocialFollowSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline">Suivez notre aventure</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Rejoignez notre communauté pour ne rien manquer de nos nouveautés,
            conseils et coulisses.
          </p>
        </div>
        <div className="flex flex-nowrap items-stretch justify-center gap-2 md:gap-8 max-w-4xl mx-auto">
            {socialLinks.map((social) => (
                <Link href={social.href} key={social.name} target="_blank" rel="noopener noreferrer" className="group flex-1 flex basis-0">
                    <div className="w-full flex flex-col items-center justify-center p-4 md:p-6 bg-background rounded-lg border border-transparent hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 h-40 md:h-48 overflow-hidden">
                        {social.icon}
                        <p className="mt-4 font-semibold text-center text-sm md:text-base">{social.name}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
