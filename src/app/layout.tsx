
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://parfumeriepassion.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Parfumerie Passion | Parfums, Soins & Cosmétiques partout au Maroc',
  description: 'Parfumerie Passion, votre boutique en ligne de parfums de niche, parfums designer, soins et cosmétiques de luxe. Achat en ligne simple, livraison rapide au Maroc, produits 100% authentiques et service client premium.',
  openGraph: {
    title: 'Parfumerie Passion | Parfums, Soins & Cosmétiques partout au Maroc',
    description: 'Parfumerie Passion, votre boutique en ligne de parfums de niche, parfums designer, soins et cosmétiques de luxe. Achat en ligne simple, livraison rapide au Maroc, produits 100% authentiques et service client premium.',
    url: siteUrl,
    siteName: 'Parfumerie Passion',
    images: [
      {
        url: 'http://parfumeriepassion.com/cdn/shop/files/logo2024-05-11_153538.png?height=628&pad_color=ffffff&v=1715434557&width=1200',
        width: 1200,
        height: 628,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parfumerie Passion | Parfums, Soins & Cosmétiques partout au Maroc',
    description: 'Parfumerie Passion, votre boutique en ligne de parfums de niche, parfums designer, soins et cosmétiques de luxe. Achat en ligne simple, livraison rapide au Maroc, produits 100% authentiques et service client premium.',
  },
  verification: {
    google: 'ogy3NbdeJqMKhL0h_oUNaIsT38mEfZTl6XmIt1wVDno',
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
    <html lang="fr" className="js" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ogy3NbdeJqMKhL0h_oUNaIsT38mEfZTl6XmIt1wVDno" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="" />
        <link rel="canonical" href="https://parfumeriepassion.com/" />
        <link rel="icon" type="image/png" href="//parfumeriepassion.com/cdn/shop/files/WhatsApp_Image_2024-05-11_at_15.33.38.jpg?crop=center&height=32&v=1715434456&width=32" />
        <link rel="preconnect" href="https://fonts.shopifycdn.com" crossOrigin="true" />
        <script src="//parfumeriepassion.com/cdn/shop/t/1/assets/constants.js?v=58251544750838685771715426689" defer></script>
        <script src="//parfumeriepassion.com/cdn/shop/t/1/assets/pubsub.js?v=158357773527763999511715426690" defer></script>
        <script src="//parfumeriepassion.com/cdn/shop/t/1/assets/global.js?v=136628361274817707361715426689" defer></script>
        <script src="//parfumeriepassion.com/cdn/shop/t/1/assets/animations.js?v=88693664871331136111715426688" defer></script>
        <script>window.performance && window.performance.mark && window.performance.mark('shopify.content_for_header.start');</script>
        <meta name="facebook-domain-verification" content="6sl9biwhil87ea9v2rhk79im3o4jjh" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col overflow-x-hidden')}>
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
