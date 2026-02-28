
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { FirebaseClientProvider } from '@/firebase';
import { FaqChatbot } from '@/components/faq-chatbot';
import { CookieConsent } from '@/components/cookie-consent';
import { ExitIntentPopup } from '@/components/exit-intent-popup';
import Script from 'next/script';
import { ShieldCheck, Rocket, Lock, Phone } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

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
    <section className="hidden md:block py-8 bg-black text-white border-y border-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-8 text-center text-gray-300">
        {reassurances.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-white">{item.icon}</span>
            <div className="text-left">
              <h3 className="font-headline text-sm font-semibold whitespace-nowrap text-white">{item.title}</h3>
              <p className="text-xs opacity-70 whitespace-nowrap">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dubainegoce – Parfums de Dubaï authentiques à prix accessibles',
    template: '%s | Dubainegoce',
  },
  description: 'Découvrez les meilleurs parfums de Dubaï. Lattafa, Maison Alhambra. Parfums authentiques, dupes de luxe et créations originales à 35€. Livraison rapide.',
  keywords: ['parfums de Dubaï', 'parfums orientaux', 'parfum arabe pas cher', 'parfum inspiration', 'parfums authentiques Émirats', 'Lattafa', 'Maison Alhambra', 'Fragrance World', 'Khamrah', 'Yara'],
  openGraph: {
    title: 'Dubainegoce - L\'Excellence des Parfums de Dubaï Authentiques',
    description: 'Explorez notre sélection de parfums authentiques de Dubaï. Fragrances rares, dupes de luxe et best-sellers à prix unique.',
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
    description: 'Les plus grandes marques de parfums de Dubaï (Lattafa, Alhambra) à prix accessible. Trouvez votre sillage unique.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect Cloudinary pour réduire la latence des images/vidéos */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
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
      <body className={cn('font-body antialiased min-h-screen')}>
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
                contactType: 'customer service',
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
                  urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }}
          />
          <FirebaseClientProvider>
            <CartProvider>
              <WishlistProvider>
                <div
                  className="fixed top-0 inset-x-0 z-[9999] w-full bg-black"
                >
                  <AnnouncementBar />
                  <Header />
                </div>
                <main className="flex-grow pt-[104px]">
                  {children}
                </main>
                <ReassuranceSection />
                <Footer />
                <Toaster />
                <FaqChatbot />
                <CookieConsent />
                <ExitIntentPopup />
              </WishlistProvider>
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
