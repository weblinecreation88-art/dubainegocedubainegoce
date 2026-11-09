import type { Metadata } from 'next';
import './globals.css';
import './storefront-polish.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { FirebaseClientProvider } from '@/firebase';
import dynamic from 'next/dynamic';
import { CartDrawer } from '@/components/cart/cart-drawer';

const CookieConsent = dynamic(() => import('@/components/cookie-consent').then((m) => ({ default: m.CookieConsent })), { ssr: false });
const AuthCartBridge = dynamic(() => import('@/components/auth-cart-bridge').then((m) => ({ default: m.AuthCartBridge })), { ssr: false });

import { DeferredWidgets } from '@/components/deferred-widgets';
import Script from 'next/script';
import { GA4_MEASUREMENT_ID } from '@/lib/analytics';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TJZMGFQ2';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-875971831';

const reassurances = [
  {
    title: 'Livraison Mondial Relay suivie',
    description: 'Dès 4,10 € en Point Relais, offerte dès 2 parfums',
    href: '/livraison-et-paiement',
  },
  {
    title: 'Paiement sécurisé',
    description: 'Carte bancaire, Apple Pay et Google Pay via Stripe',
    href: '/livraison-et-paiement',
  },
  {
    title: 'Flacons neufs scellés',
    description: 'Retour possible sous 14 jours',
    href: '/shipping',
  },
  {
    title: 'À votre écoute',
    description: '07 58 99 97 26 · contact@dubainegoce.fr',
    href: '/contact',
  },
];

const ReassuranceSection = () => {
  return (
    <section className="storefront-reassurance bg-white border-t border-[#e6ded1]">
      <div className="container mx-auto px-5 sm:px-6 py-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {reassurances.map((item) => (
          <Link key={item.title} href={item.href} className="group block">
            <h3 className="text-[13px] text-[#1d1a16] group-hover:text-[#a8834f] transition-colors">{item.title}</h3>
            <p className="text-[12px] text-[#6f6559] leading-relaxed mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dubainegoce – Parfums orientaux et parfums de Dubaï',
    template: '%s | Dubainegoce',
  },
  description:
    'Découvrez les parfums de Dubaï authentiques : Lattafa, Maison Alhambra, French Avenue, Fragrance World. Découvrez les prix et disponibilités de chaque référence.',
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
      'Explorez notre sélection de parfums authentiques de Dubaï. Lattafa, Maison Alhambra, French Avenue : explorez la sélection.',
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
    description: 'Les grandes maisons de parfums de Dubaï (Lattafa, Maison Alhambra) : découvrez la sélection.',
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
            // GA4 désactivé en local et pour les robots (navigateurs automatisés,
            // fermes de serveurs à Singapour / en Chine qui gonflent les visiteurs à ~0 s d'engagement).
            var h = window.location.hostname, tz = '';
            try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
            var internal = h === 'localhost' || h === '127.0.0.1' || /^192\\.168\\./.test(h);
            var bot = navigator.webdriver === true
              || /HeadlessChrome|PhantomJS|Lighthouse/i.test(navigator.userAgent)
              || /^Asia\\/(Singapore|Shanghai|Chongqing|Chungking|Harbin|Urumqi)$/.test(tz);
            window.__ga4Off = internal || bot;
            if (!window.__ga4Off) {
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
              <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
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
                <div className="relative lg:sticky top-0 z-40 w-full">
                  <AnnouncementBar />
                  <Header />
                </div>
                <main className="flex-1">{children}</main>
                <ReassuranceSection />
                <Footer />
                <CartDrawer />
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
