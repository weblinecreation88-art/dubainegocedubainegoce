
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { FirebaseClientProvider } from '@/firebase';
import { FaqChatbot } from '@/components/faq-chatbot';
import { CookieConsent } from '@/components/cookie-consent';
import { StructuredData } from '@/components/structured-data';
import Script from 'next/script';
import { ShieldCheck, Rocket, Lock, Phone } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TJZMGFQ2';

const reassurances = [
  {
    icon: <ShieldCheck className="w-6 h-6 mr-3 text-primary" />,
    title: "100% Authentique",
    description: "Importé directement de Dubaï"
  },
  {
    icon: <Lock className="w-6 h-6 mr-3 text-primary" />,
    title: "Prix Juste et Fixe",
    description: "Le luxe accessible à 35€"
  },
  {
    icon: <Rocket className="w-6 h-6 mr-3 text-primary" />,
    title: "Livraison Rapide",
    description: "Colissimo 48h ou Mondial Relay"
  },
  {
    icon: <Phone className="w-6 h-6 mr-3 text-primary" />,
    title: "Support Français",
    description: "Notre équipe vous répond 24h/7j"
  },
];

const ReassuranceSection = () => {
    const reassuranceContent = (
      <div className="flex items-center">
        {reassurances.map((item, index) => (
          <div key={index} className="flex items-center mx-6">
            {item.icon}
            <div className="text-left">
              <h3 className="font-headline text-base sm:text-lg font-semibold whitespace-nowrap">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    );

    return (
        <section className="py-8 sm:py-12 bg-card border-y overflow-hidden">
            <div className="flex">
                <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around">
                    {reassuranceContent}
                    {reassuranceContent}
                </div>
                 <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around" aria-hidden="true">
                    {reassuranceContent}
                    {reassuranceContent}
                </div>
            </div>
        </section>
    );
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dubainegoce – Parfums de Dubaï à 35€ | Lattafa, Alhambra, Fragrance World | Livraison Offerte',
    template: '%s | Dubainegoce',
  },
  description: 'Parfums authentiques de Dubaï à prix fixe 35€. Découvrez YARA, Khamrah, Asad, Badee, Fakhar par Lattafa, Zaffiro par Alhambra. Livraison Mondial Relay OFFERTE. Importés directement de Dubaï.',
  keywords: [
    'parfums Dubaï',
    'parfums orientaux',
    'Lattafa France',
    'Yara Lattafa',
    'Khamrah Lattafa',
    'Asad Lattafa',
    'Badee Lattafa',
    'Maison Alhambra',
    'Zaffiro Alhambra',
    'Fragrance World',
    'French Avenue',
    'parfum oriental pas cher',
    'parfum arabe authentique',
    'parfum 35 euros',
    'livraison gratuite parfum',
    'parfum homme Dubaï',
    'parfum femme Dubaï',
    'parfum mixte oriental',
    'Qaed Al Fursan',
    'Fakhar Black',
    'Mayar Lattafa',
    'parfum longue tenue',
    'eau de parfum Dubaï',
    'parfumerie orientale en ligne',
  ],
  openGraph: {
    title: 'Dubainegoce - Parfums Authentiques de Dubaï | Lattafa, Alhambra | Prix Fixe 35€',
    description: 'Découvrez notre collection exclusive de parfums orientaux : YARA, Khamrah, Asad, Zaffiro. Prix fixe 35€. Livraison Mondial Relay OFFERTE. 100% authentiques, importés de Dubaï.',
    url: siteUrl,
    siteName: 'Dubainegoce',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Parfums de Dubaï authentiques - Lattafa, Maison Alhambra, Fragrance World - DubaiNegoce',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubainegoce - Parfums de Dubaï Authentiques | Prix Fixe 35€',
    description: 'YARA, Khamrah, Asad, Zaffiro et plus encore. Prix fixe 35€. Livraison Mondial Relay OFFERTE. Parfums 100% authentiques importés de Dubaï.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  verification: {
    // google: 'XXXXX', // A ajouter une fois que vous avez le code de la Search Console
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col overflow-x-hidden')}>
        <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
        </noscript>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          <StructuredData />
          <FirebaseClientProvider>
            <CartProvider>
              <AnnouncementBar />
              <Header />
              <main className="flex-grow">{children}</main>
              <ReassuranceSection />
              <Footer />
              <Toaster />
              <FaqChatbot />
              <CookieConsent />
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
