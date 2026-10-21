import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Playfair_Display, PT_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-headline',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { FirebaseClientProvider } from '@/firebase';
import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('@/components/cookie-consent').then((m) => ({ default: m.CookieConsent })), { ssr: false });
const AuthCartBridge = dynamic(() => import('@/components/auth-cart-bridge').then((m) => ({ default: m.AuthCartBridge })), { ssr: false });
const PrestashopLayerCart = dynamic(
  () => import('@/components/product/prestashop-layer-cart').then((m) => ({ default: m.PrestashopLayerCart })),
  { ssr: false }
);

import { DeferredWidgets } from '@/components/deferred-widgets';
import Script from 'next/script';
import { GA4_MEASUREMENT_ID } from '@/lib/analytics';
import { ShieldCheck, Truck, Lock, Phone } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TJZMGFQ2';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-875971831';

const reassurances = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#d4a017]" />,
    title: 'Parfums Authentiques',
    description: 'Flacons neufs scellés sous blister',
  },
  {
    icon: <Lock className="w-6 h-6 text-[#d4a017]" />,
    title: 'Prix Fixe 35,00 € TTC',
    description: 'Paiement sécurisé CB, PayPal, Apple Pay',
  },
  {
    icon: <Truck className="w-6 h-6 text-[#d4a017]" />,
    title: 'Livraison Colissimo Suivie',
    description: 'Offerte dès 3 parfums (ou 100 €)',
  },
  {
    icon: <Phone className="w-6 h-6 text-[#d4a017]" />,
    title: 'Service Client en Français',
    description: 'Joignable par téléphone et e-mail',
  },
];

const ReassuranceSection = () => {
  return (
    <section className="py-6 bg-[#f7f0e6] text-[#111827] border-y border-[#e4dac9]">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {reassurances.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="shrink-0 bg-white p-2.5 rounded border border-[#e4dac9]">{item.icon}</span>
            <div className="text-left">
              <h3 className="font-headline text-xs sm:text-sm font-bold text-[#111827] leading-tight">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-tight mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dubainegoce – Parfums de Dubaï authentiques à 35,00 € TTC',
    template: '%s | Dubainegoce',
  },
  description:
    'Découvrez les parfums de Dubaï authentiques : Lattafa, Maison Alhambra, French Avenue, Fragrance World. Prix unique 35,00 € TTC, livraison Colissimo offerte dès 3 parfums.',
  keywords: [
    'parfums de Dubaï',
    'parfums orientaux',
    'parfum arabe',
    'eaux de parfum',
    'Lattafa',
    'Maison Alhambra',
    'Fragrance World',
    'Khamrah',
    'Yara',
  ],
  openGraph: {
    title: "Dubainegoce - Parfums de Dubaï Authentiques",
    description:
      'Explorez notre sélection de parfums authentiques de Dubaï. Lattafa, Maison Alhambra, French Avenue à 35,00 € TTC.',
    url: siteUrl,
    siteName: 'Dubainegoce',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sélection de parfums de Dubaï sur Dubainegoce',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubainegoce - Parfums de Dubaï Authentiques',
    description: 'Les grandes maisons de parfums de Dubaï (Lattafa, Maison Alhambra) à 35,00 € TTC.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="tiktok-domain-verification" content="FRFRLCPCQWAL" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://dubainegoce-227c3.firebaseapp.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script id="google-tag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            var h = window.location.hostname;
            if (!(h === 'localhost' || h === '127.0.0.1' || /^192\\.168\\./.test(h))) {
              gtag('config', '${GA4_MEASUREMENT_ID}');
            }
          `}
        </Script>
        <Script
          id="google-ads-tag"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <Script id="google-tag-manager" strategy="lazyOnload">
          {`
            (function() {
              var h = window.location.hostname;
              var ref = document.referrer || '';
              if (h === 'localhost' || h === '127.0.0.1' || h.match(/^192\\.168\\./) || ref.indexOf('console.firebase.google.com') !== -1) return;
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            })();
          `}
        </Script>
      </head>
      <body className={cn(playfair.variable, ptSans.variable, 'font-body antialiased min-h-screen flex flex-col')}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dubainegoce',
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33 7 58 99 97 26',
                email: 'contact@dubainegoce.fr',
                contactType: 'customer service',
                availableLanguage: ['French'],
              },
              sameAs: [
                'https://www.instagram.com/dubai_negoce/',
                'https://www.tiktok.com/@dubai_negoce',
              ],
            }}
          />
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Dubainegoce',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/shop/all?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }}
          />
          <FirebaseClientProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="sticky top-0 z-[9990] w-full">
                  <AnnouncementBar />
                  <Header />
                </div>
                <main className="flex-1">{children}</main>
                <ReassuranceSection />
                <Footer />
                <PrestashopLayerCart />
                <Toaster />
                <CookieConsent />
                <AuthCartBridge />
                <DeferredWidgets />
              </WishlistProvider>
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
