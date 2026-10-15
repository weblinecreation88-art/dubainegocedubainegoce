/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Clés publiques forcées au build time (indépendant de Firebase App Hosting)
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: 'AZSVA1R4EqfYKQEnx2djfVOuVbDe9XZBL2DDnLkBiOWJ6a9ucmjbyAyszvjmu0908BwMvH2srgp1Wewg',
  },

  async redirects() {
    return [
      // ============================================================
      // SITEMAP WORDPRESS → SITEMAP NEXT.JS
      // ============================================================
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap_index.xml/', destination: '/sitemap.xml', permanent: true },

      // ============================================================
      // BOUTIQUE WOOCOMMERCE & TAXONOMIES → SHOP NEXT.JS
      // ============================================================
      { source: '/boutique', destination: '/shop', permanent: true },
      { source: '/boutique/:path*', destination: '/shop', permanent: true },
      { source: '/etiquette-produit/:path*', destination: '/shop', permanent: true },

      // ============================================================
      // ANCIENNES PAGES BLOG & LANDING WOOCOMMERCE
      // ============================================================
      { source: '/best-sellers-homme', destination: '/shop/genre/homme', permanent: true },
      { source: '/best-sellers-homme/:path*', destination: '/shop/genre/homme', permanent: true },
      { source: '/best-sellers-femme', destination: '/shop/genre/femme', permanent: true },
      { source: '/best-sellers-femme/:path*', destination: '/shop/genre/femme', permanent: true },
      { source: '/meilleurs-parfums-orientaux-homme', destination: '/shop/genre/homme', permanent: true },
      { source: '/meilleurs-parfums-orientaux-homme/:path*', destination: '/shop/genre/homme', permanent: true },
      { source: '/top-5-parfums-mixtes-2025-les-meilleures-fragrances-unisexe-orientales', destination: '/blog/top-5-lattafa-2025', permanent: true },
      { source: '/top-5-parfums-mixtes-2025-les-meilleures-fragrances-unisexe-orientales/:path*', destination: '/blog/top-5-lattafa-2025', permanent: true },
      { source: '/top-5-parfums-femme-importes-de-dubai-notre-selection-2025', destination: '/blog/parfums-orientaux-femme-2026', permanent: true },
      { source: '/top-5-parfums-femme-importes-de-dubai-notre-selection-2025/:path*', destination: '/blog/parfums-orientaux-femme-2026', permanent: true },
      { source: '/nos-tops-parfums-les-incontournables-de-lete-et-de-lautomne', destination: '/shop', permanent: true },
      { source: '/nos-tops-parfums-les-incontournables-de-lete-et-de-lautomne/:path*', destination: '/shop', permanent: true },
      { source: '/alternatives-parfums-luxe-pas-cher-dubai', destination: '/blog/dupes-parfums-luxe', permanent: true },
      { source: '/alternatives-parfums-luxe-pas-cher-dubai/:path*', destination: '/blog/dupes-parfums-luxe', permanent: true },
      { source: '/les-meilleures-notes-oud-pour-lete-notre-selection-parfumee', destination: '/blog/guide-parfum-oud', permanent: true },
      { source: '/les-meilleures-notes-oud-pour-lete-notre-selection-parfumee/:path*', destination: '/blog/guide-parfum-oud', permanent: true },
      { source: '/contact-2', destination: '/contact', permanent: true },
      { source: '/contact-2/:path*', destination: '/contact', permanent: true },
      { source: '/suivez-nous', destination: '/about', permanent: true },
      { source: '/suivez-nous/:path*', destination: '/about', permanent: true },

      // ============================================================
      // PRODUITS WOOCOMMERCE AVEC CHANGEMENT DE SLUG
      // ============================================================
      { source: '/parfum/teriaq-de-lattafa-perfumes', destination: '/parfum/teriaq-lattafa-mixte', permanent: true },
      { source: '/parfum/teriaq-de-lattafa-perfumes/:path*', destination: '/parfum/teriaq-lattafa-mixte', permanent: true },
      { source: '/parfum/fakhar-noir', destination: '/parfum/fakhar-black-lattafa', permanent: true },
      { source: '/parfum/fakhar-noir/:path*', destination: '/parfum/fakhar-black-lattafa', permanent: true },
      { source: '/parfum/fakhar-wasam', destination: '/parfum/fakhar-wasam-lattafa', permanent: true },
      { source: '/parfum/fakhar-wasam/:path*', destination: '/parfum/fakhar-wasam-lattafa', permanent: true },
      { source: '/parfum/eclair-lattafa-100ml', destination: '/parfum/eclaire-lattafa', permanent: true },
      { source: '/parfum/eclair-lattafa-100ml/:path*', destination: '/parfum/eclaire-lattafa', permanent: true },
      { source: '/parfum/eclair-de-latttafa', destination: '/parfum/eclaire-lattafa', permanent: true },
      { source: '/parfum/eclair-de-latttafa/:path*', destination: '/parfum/eclaire-lattafa', permanent: true },
      { source: '/parfum/glacier-ultra', destination: '/parfum/glacier-pour-homme-maison-alhambra', permanent: true },
      { source: '/parfum/glacier-ultra/:path*', destination: '/parfum/glacier-pour-homme-maison-alhambra', permanent: true },
      { source: '/parfum/glacier-bold', destination: '/parfum/glacier-pour-homme-maison-alhambra', permanent: true },
      { source: '/parfum/glacier-bold/:path*', destination: '/parfum/glacier-pour-homme-maison-alhambra', permanent: true },
      { source: '/parfum/jean-lowe-nouveau-alhambra', destination: '/parfum/jean-lowe-nouveau-maison-alhambra', permanent: true },
      { source: '/parfum/jean-lowe-nouveau-alhambra/:path*', destination: '/parfum/jean-lowe-nouveau-maison-alhambra', permanent: true },
      { source: '/parfum/mocha-wood-de-fragrance-world', destination: '/parfum/mocha-wood-fragrance-world', permanent: true },
      { source: '/parfum/mocha-wood-de-fragrance-world/:path*', destination: '/parfum/mocha-wood-fragrance-world', permanent: true },
      { source: '/parfum/mocha-wood', destination: '/parfum/mocha-wood-fragrance-world', permanent: true },
      { source: '/parfum/mocha-wood/:path*', destination: '/parfum/mocha-wood-fragrance-world', permanent: true },
      { source: '/parfum/liquid-brun-gold', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/liquid-brun-gold/:path*', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/liquid-brun-100ml', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/liquid-brun-100ml/:path*', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/yeah-man', destination: '/parfum/yeah-maison-alhambra', permanent: true },
      { source: '/parfum/yeah-man/:path*', destination: '/parfum/yeah-maison-alhambra', permanent: true },
      { source: '/parfum/francique-63-55', destination: '/parfum/francique-63-55-french-avenue', permanent: true },
      { source: '/parfum/francique-63-55/:path*', destination: '/parfum/francique-63-55-french-avenue', permanent: true },
      { source: '/parfum/francique-107-9', destination: '/parfum/francique-107-9-french-avenue', permanent: true },
      { source: '/parfum/francique-107-9/:path*', destination: '/parfum/francique-107-9-french-avenue', permanent: true },
      { source: '/parfum/francique-107-9-2', destination: '/parfum/francique-107-9-french-avenue', permanent: true },
      { source: '/parfum/francique-107-9-2/:path*', destination: '/parfum/francique-107-9-french-avenue', permanent: true },
      { source: '/parfum/hercules', destination: '/parfum/hercules-maison-alhambra', permanent: true },
      { source: '/parfum/hercules/:path*', destination: '/parfum/hercules-maison-alhambra', permanent: true },
      { source: '/parfum/after-effect', destination: '/parfum/after-effect-french-avenue', permanent: true },
      { source: '/parfum/after-effect/:path*', destination: '/parfum/after-effect-french-avenue', permanent: true },
      { source: '/parfum/al-noble-safeer', destination: '/parfum/al-noble-safeer-lattafa', permanent: true },
      { source: '/parfum/al-noble-safeer/:path*', destination: '/parfum/al-noble-safeer-lattafa', permanent: true },
      { source: '/parfum/yara-rose-lattafa', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-rose-lattafa/:path*', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-london-oriental-candy', destination: '/parfum/yara-candy-lattafa', permanent: true },
      { source: '/parfum/yara-london-oriental-candy/:path*', destination: '/parfum/yara-candy-lattafa', permanent: true },
      { source: '/parfum/yara-london-oriental-jasmine', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-london-oriental-jasmine/:path*', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-jordan', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/yara-jordan/:path*', destination: '/parfum/yara-lattafa', permanent: true },
      { source: '/parfum/victorioso-victory', destination: '/parfum/victorioso-victory-maison-alhambra', permanent: true },
      { source: '/parfum/victorioso-victory/:path*', destination: '/parfum/victorioso-victory-maison-alhambra', permanent: true },
      { source: '/parfum/kenzie-candid-vanilla', destination: '/parfum/kenzie-candid-vanilla-french-avenue', permanent: true },
      { source: '/parfum/kenzie-candid-vanilla/:path*', destination: '/parfum/kenzie-candid-vanilla-french-avenue', permanent: true },

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
      // TYPES ANCIENS → SHOP TYPE ORIENTAL
      // ============================================================
      { source: '/shop/type/equivalent', destination: '/shop/type/oriental', permanent: true },
      { source: '/shop/type/equivalent/', destination: '/shop/type/oriental', permanent: true },
      { source: '/shop/type/dupe', destination: '/shop/type/oriental', permanent: true },
      { source: '/shop/type/dupe/', destination: '/shop/type/oriental', permanent: true },

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
      { source: '/mon-compte', destination: '/account', permanent: true },
      { source: '/mon-compte/', destination: '/account', permanent: true },
      { source: '/mon-compte/:path*', destination: '/account', permanent: true },
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
      { source: '/parfum/zaffiro-crafted-oud-maison-alhambra', destination: '/parfum/zaffiro-collection-crafted-oud-maison-alhambra', permanent: true },
      { source: '/parfum/zaffiro-crafted-oud-maison-alhambra/', destination: '/parfum/zaffiro-collection-crafted-oud-maison-alhambra', permanent: true },
      { source: '/parfum/ombre-noir-jean-lowe-maison-alhambra', destination: '/parfum/jean-lowe-ombre-maison-alhambra', permanent: true },
      { source: '/parfum/ombre-noir-jean-lowe-maison-alhambra/', destination: '/parfum/jean-lowe-ombre-maison-alhambra', permanent: true },

      // khamrah sans suffixe
      { source: '/parfum/khamrah', destination: '/blog/khamrah-lattafa-avis', permanent: true },
      { source: '/parfum/khamrah/', destination: '/blog/khamrah-lattafa-avis', permanent: true },

      // Produits supprimés → page marque correspondante
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
      { source: '/parfum/kenzie-candid-vanilla-100ml', destination: '/shop', permanent: true },
      { source: '/parfum/kenzie-candid-vanilla-100ml/', destination: '/shop', permanent: true },
      { source: '/parfum/limmensite-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/limmensite-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/liquide-brun-french-avenue-essentiel', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/liquide-brun-french-avenue-essentiel/', destination: '/parfum/liquide-brun-french-avenue', permanent: true },
      { source: '/parfum/the-artist-no1-maison-alhambra', destination: '/shop/marque/maison-alhambra', permanent: true },
      { source: '/parfum/the-artist-no1-maison-alhambra/', destination: '/shop/marque/maison-alhambra', permanent: true },

      // ============================================================
      // REDIRECTIONS PAGES SPÉCIALES
      // ============================================================
      { source: '/sucrer', destination: '/shop', permanent: true },
      { source: '/sucrer/', destination: '/shop', permanent: true },
      { source: '/search/:path*', destination: '/shop', permanent: true },

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
    // L'optimiseur d'images integre n'est pas actif sur cet hebergement : les
    // URLs distantes etaient servies brutes (PNG de 2 Mo pour un affichage en
    // 665 px). Cloudinary transforme a la volee via src/lib/cloudinary-loader.
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
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
        hostname: 'frenchavenue.fr',
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
