
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
    default: 'Parfums de Dubaï 35€ | Lattafa, Alhambra, Fragrance World | Livraison Gratuite',
    template: '%s | DubaiNegoce - Parfums Orientaux',
  },
  description: 'Parfums authentiques de Dubaï à prix fixe 35€ - Livraison GRATUITE. Découvrez YARA, Khamrah, Asad (Lattafa), Zaffiro (Alhambra) et 50+ fragrances. 100% authentiques, importés directement de Dubaï. Stock permanent, livraison rapide 48-72h.',
  keywords: [
    // Mots-clés principaux SEO 2025
    'parfums Dubaï authentiques',
    'parfums orientaux France',
    'parfum arabe pas cher',

    // Marques principales
    'Lattafa France',
    'Yara Lattafa parfum',
    'Khamrah Lattafa',
    'Asad Lattafa',
    'Badee Al Oud Lattafa',
    'Fakhar Black Lattafa',
    'Qaed Al Fursan',
    'Mayar Lattafa',

    'Maison Alhambra France',
    'Zaffiro Maison Alhambra',

    'Fragrance World',
    'French Avenue',

    // Intentions transactionnelles
    'acheter parfum Dubaï',
    'parfum oriental 35 euros',
    'parfum pas cher livraison gratuite',
    'parfum homme Dubaï',
    'parfum femme oriental',
    'parfum mixte',

    // Long-tail 2026 - Tendances IA et recherche vocale
    'meilleur parfum oriental 2026',
    'parfum longue tenue pas cher',
    'eau de parfum Dubaï',
    'parfumerie orientale en ligne',
    'dupes parfums luxe',
    'parfum oud naturel',
    'parfum niche abordable',
    'parfum authentique importé Dubaï',
    'quel parfum oriental acheter 2026',
    'où acheter parfum Lattafa en France',
  ],
  openGraph: {
    title: 'Parfums Dubaï 35€ | Lattafa, Alhambra | Livraison GRATUITE',
    description: 'Découvrez notre collection exclusive de parfums orientaux authentiques : YARA, Khamrah, Asad, Zaffiro. Prix unique 35€. Livraison Mondial Relay OFFERTE. 100% authentiques, importés directement de Dubaï.',
    url: siteUrl,
    siteName: 'DubaiNegoce',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DubaiNegoce - Parfums authentiques de Dubaï - Lattafa, Maison Alhambra, Fragrance World',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parfums Dubaï 35€ | Lattafa, Alhambra',
    description: 'YARA, Khamrah, Asad, Zaffiro. Prix fixe 35€. Livraison OFFERTE. 100% authentiques importés de Dubaï.',
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
    // google: 'XXXXX', // À ajouter après vérification Search Console
  },
  alternates: {
    canonical: siteUrl,
  },
  authors: [{ name: 'DubaiNegoce' }],
  creator: 'DubaiNegoce',
  publisher: 'DubaiNegoce',
  category: 'Parfumerie',
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

        {/* Favicons et Icons PWA */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA Manifest - SEO 2026 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4af37" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1f2e" media="(prefers-color-scheme: dark)" />

        {/* PWA Tags pour iOS et Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DubaiNegoce" />

        {/* Performance & SEO 2026 */}
        <meta name="format-detection" content="telephone=no" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500,
            });
            gtag('js', new Date());
            gtag('config', 'G-HM2MMVGBP7'); // Replace with your GA4 Measurement ID
          `}
        </Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>

        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HM2MMVGBP7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HM2MMVGBP7');
          `}
        </Script>
        {/* Google Customer Reviews - platform.js */}
        <Script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer strategy="afterInteractive" />

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
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=G-HM2MMVGBP7"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
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
              <main className="flex-grow pt-[10.5rem] lg:pt-[6.5rem]">{children}</main>
              <ReassuranceSection />
              <Footer />
              <Toaster />
              <CookieConsent />
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
