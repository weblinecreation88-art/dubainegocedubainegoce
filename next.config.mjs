/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Clés publiques forcées au build time (indépendant de Firebase App Hosting)
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: 'AZSVA1R4EqfYKQEnx2djfVOuVbDe9XZBL2DDnLkBiOWJ6a9ucmjbyAyszvjmu0908BwMvH2srgp1Wewg',
  },

  async redirects() {
    return [
      // ============================================================
      // PRODUITS WOOCOMMERCE → PAGES PARFUM NEXT.JS
      // ============================================================
      { source: '/produit/:slug/', destination: '/parfum/:slug', permanent: true },
      { source: '/produit/:slug', destination: '/parfum/:slug', permanent: true },

      // ============================================================
      // CATÉGORIES WOOCOMMERCE → SHOP NEXT.JS
      // ============================================================

      // Lattafa (toutes les variantes d'anciens chemins)
      { source: '/categorie-produit/parfums-lattafa/:path*', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/categorie-produit/maison-alhambra/lattafa/:path*', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/categorie-produit/nos-marques/parfums-lattafa/:path*', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/categorie-produit/lattafa/:path*', destination: '/shop/marque/lattafa', permanent: true },

      // Maison Alhambra
      { source: '/categorie-produit/parfums-alhambra/:path*', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/categorie-produit/maison-alhambra/:path*', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/categorie-produit/nos-marques/parfums-alhambra/:path*', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/categorie-produit/alhambra-parfums/:path*', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/categorie-produit/alhambra/:path*', destination: '/shop/marque/maison-alhambra', permanent: true },

      // Fragrance World
      { source: '/categorie-produit/parfums/fragrance-world/:path*', destination: '/shop/marque/fragrance-world', permanent: true },
      { source: '/categorie-produit/nos-marques/fragrance-world/:path*', destination: '/shop/marque/fragrance-world', permanent: true },

      // Genre femme
      { source: '/categorie-produit/parfum-femme/:path*', destination: '/shop/genre/femme', permanent: true },

      // Catch-all catégories restantes
      { source: '/categorie-produit/:path*', destination: '/shop', permanent: true },

      // ============================================================
      // GENRE → SHOP GENRE
      // ============================================================
      { source: '/genre/femme', destination: '/shop/genre/femme', permanent: true },
      { source: '/genre/homme', destination: '/shop/genre/homme', permanent: true },
      { source: '/genre/unisex', destination: '/shop/genre/mixte', permanent: true },
      { source: '/genre/:path*', destination: '/shop', permanent: true },

      // ============================================================
      // ANCIENNES PAGES CUSTOM WORDPRESS / WOOCOMMERCE
      // ============================================================
      { source: '/a-propos', destination: '/about', permanent: true },
      { source: '/a-propos/', destination: '/about', permanent: true },
      { source: '/f-a-q', destination: '/faq', permanent: true },
      { source: '/f-a-q/', destination: '/faq', permanent: true },
      { source: '/parfums-de-dubai', destination: '/shop', permanent: true },
      { source: '/parfums-de-dubai/', destination: '/shop', permanent: true },
      { source: '/parfums-de-dubai-2', destination: '/shop', permanent: true },
      { source: '/parfums-de-dubai-2/', destination: '/shop', permanent: true },
      { source: '/parfums-lattafa', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/parfums-lattafa/', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/votre-parfum-de-dubai', destination: '/shop', permanent: true },
      { source: '/votre-parfum-de-dubai/', destination: '/shop', permanent: true },
      { source: '/accueil-2', destination: '/', permanent: true },
      { source: '/accueil-2/', destination: '/', permanent: true },
      { source: '/news', destination: '/blog', permanent: true },
      { source: '/news/', destination: '/blog', permanent: true },
      { source: '/les-parfums-equivalents-de-luxe', destination: '/shop', permanent: true },
      { source: '/les-parfums-equivalents-de-luxe/', destination: '/shop', permanent: true },
      { source: '/perfume-finder', destination: '/shop', permanent: true },
      { source: '/perfume-finder/', destination: '/shop', permanent: true },
      { source: '/my-account-2/orders', destination: '/account/orders', permanent: true },
      { source: '/my-account-2/orders/', destination: '/account/orders', permanent: true },
      { source: '/my-account-2', destination: '/account', permanent: true },
      { source: '/my-account-2/', destination: '/account', permanent: true },
      { source: '/my-account-2-2', destination: '/account', permanent: true },
      { source: '/my-account-2-2/', destination: '/account', permanent: true },
      { source: '/les-notes-olfactives', destination: '/shop', permanent: true },
      { source: '/les-notes-olfactives/', destination: '/shop', permanent: true },
      { source: '/femme', destination: '/shop/genre/femme', permanent: true },
      { source: '/femme/', destination: '/shop/genre/femme', permanent: true },
      { source: '/fruite', destination: '/shop', permanent: true },
      { source: '/fruite/', destination: '/shop', permanent: true },
      { source: '/boise-2', destination: '/shop', permanent: true },
      { source: '/boise-2/', destination: '/shop', permanent: true },
      { source: '/test2', destination: '/', permanent: true },
      { source: '/test2/', destination: '/', permanent: true },
      { source: '/cart-2', destination: '/cart', permanent: true },
      { source: '/cart-2/', destination: '/cart', permanent: true },
      { source: '/cart-2/:path*', destination: '/cart', permanent: true },
      { source: '/panier', destination: '/cart', permanent: true },
      { source: '/panier/', destination: '/cart', permanent: true },
      { source: '/panier/:path*', destination: '/cart', permanent: true },
      { source: '/checkout-2', destination: '/checkout', permanent: true },
      { source: '/checkout-2/', destination: '/checkout', permanent: true },
      { source: '/checkout-2/:path*', destination: '/checkout', permanent: true },
      { source: '/category/:path*', destination: '/blog', permanent: true },

      // ============================================================
      // ANCIENS SLUGS PRODUITS À LA RACINE (WooCommerce sans /produit/)
      // ============================================================
      { source: '/eau-de-parfum-:slug/', destination: '/parfum/:slug', permanent: true },
      { source: '/eau-de-parfum-:slug', destination: '/parfum/:slug', permanent: true },
      { source: '/fakhar-black-lattafa', destination: '/parfum/fakhar-black-lattafa', permanent: true },
      { source: '/fakhar-black-lattafa/', destination: '/parfum/fakhar-black-lattafa', permanent: true },
      { source: '/ana-abbiyadh-rouge', destination: '/parfum/ana-abbiyadh-rouge', permanent: true },
      { source: '/ana-abbiyadh-rouge/', destination: '/parfum/ana-abbiyadh-rouge', permanent: true },

      // ============================================================
      // SLUG CORRECTIONS - Old WordPress → Current slugs
      // ============================================================
      // Simple slugs → with brand suffix
      { source: '/parfum/asad', destination: '/parfum/asad-lattafa', permanent: true },
      { source: '/parfum/yara', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/ameer-al-oudh-intense-oud', destination: '/parfum/ameer-al-oudh-intense-oud-lattafa', permanent: true },
      { source: '/parfum/noble-wazeer-lattafa', destination: '/parfum/al-noble-wazeer-lattafa', permanent: true },
      { source: '/parfum/saffron-maison-alhambra', destination: '/parfum/by-saffron-maison-alhambra', permanent: true },
      { source: '/parfum/woody-oud-maison-alhambra', destination: '/parfum/woody-oud-80-ml-maison-alhambra', permanent: true },
      { source: '/parfum/the-tux-maison-alhambra', destination: '/parfum/the-tux-maison-alhambra-mixte', permanent: true },
      { source: '/parfum/zaffiro-regale', destination: '/parfum/zaffiro-regale-maison-alhambra-unisex', permanent: true },
      { source: '/parfum/zaffiro-regale-for-her-maison-alhambra', destination: '/parfum/zaffiro-regale-maison-alhambra-unisex', permanent: true },
      { source: '/parfum/lovely-cherie-french-avenue', destination: '/parfum/lovely-cherie-maison-alhambra', permanent: true },
      { source: '/parfum/ramz-silver-lattafa-lattafa', destination: '/parfum/ramz-silver-lattafa', permanent: true },

      // Corrections slug : variantes Google indexées mais slug changé en DB
      { source: '/parfum/yara-tous-lattafa', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-tous-lattafa/', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/moscow-kismet-maison-alhambra', destination: '/parfum/kismet-moscow-maison-alhambra', permanent: true },
      { source: '/parfum/moscow-kismet-maison-alhambra/', destination: '/parfum/kismet-moscow-maison-alhambra', permanent: true },
      { source: '/parfum/liquide-brun-french-avenue', destination: '/parfum/liquid-brun-100ml', permanent: true },
      { source: '/parfum/liquide-brun-french-avenue/', destination: '/parfum/liquid-brun-100ml', permanent: true },
      { source: '/parfum/zaffiro-crafted-oud-maison-alhambra', destination: '/parfum/zaffiro-collection-crafted-oud-maison-alhambra', permanent: true },
      { source: '/parfum/zaffiro-crafted-oud-maison-alhambra/', destination: '/parfum/zaffiro-collection-crafted-oud-maison-alhambra', permanent: true },
      { source: '/parfum/ombre-noir-jean-lowe-maison-alhambra', destination: '/parfum/jean-lowe-ombre-maison-alhambra', permanent: true },
      { source: '/parfum/ombre-noir-jean-lowe-maison-alhambra/', destination: '/parfum/jean-lowe-ombre-maison-alhambra', permanent: true },

      // Produits supprimés → page marque correspondante
      { source: '/parfum/khamrah-lattafa', destination: '/blog/khamrah-lattafa-avis', permanent: true },
      { source: '/parfum/khamrah-lattafa/', destination: '/blog/khamrah-lattafa-avis', permanent: true },
      { source: '/parfum/lintrude-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/lintrude-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/versencia-oro-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/versencia-oro-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/no-2-men-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/no-2-men-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/philos-pura-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/philos-pura-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/narissa-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/narissa-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/qaed-al-fursan-lattafa', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/parfum/qaed-al-fursan-lattafa/', destination: '/shop/marque/lattafa', permanent: true },
      { source: '/parfum/jack-of-clubs-fragrance-world', destination: '/shop/marque/fragrance-world', permanent: true },
      { source: '/parfum/jack-of-clubs-fragrance-world/', destination: '/shop/marque/fragrance-world', permanent: true },

      // ============================================================
      // ARTICLES DE BLOG (corrections de slug)
      // ============================================================
      {
        source: '/pourquoi-lattafa-simpose-comme-la-marque-de-parfum-incontournable-en-2025',
        destination: '/blog/top-5-lattafa-2025',
        permanent: true,
      },
      {
        source: '/pourquoi-lattafa-simpose-comme-la-marque-de-parfum-incontournable-en-2025/',
        destination: '/blog/top-5-lattafa-2025',
        permanent: true,
      },
      {
        source: '/blog/tendance-parfums-orientaux-2025',
        destination: '/blog/tendances-parfums-orientaux-2025',
        permanent: true,
      },

      // ============================================================
      // FICHIERS / ROUTES WORDPRESS TECHNIQUES
      // ============================================================
      { source: '/wp-json/:path*', destination: '/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },
      { source: '/cgi-bin/:path*', destination: '/', permanent: true },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dubainegoce.fr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.frenchavenue.fr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('raw-body');
      // firebase-admin should only be used on the server
      config.externals.push('firebase-admin');
      config.externals.push('firebase-admin/app');
      config.externals.push('firebase-admin/firestore');
    }
    return config;
  }
};

export default config;
