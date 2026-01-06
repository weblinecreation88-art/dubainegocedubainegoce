/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/parfum/philos-pura',
        destination: '/shop/all',
        permanent: true,
      },
      {
        source: '/parfum/no-2-men',
        destination: '/shop/all',
        permanent: true,
      },
      {
        source: '/parfum/versencia-oro',
        destination: '/shop/all',
        permanent: true,
      },
      {
        source: '/parfum/qaed-al-fursan',
        destination: '/shop/all',
        permanent: true,
      },
      {
        source: '/parfum/jardin-de-paris',
        destination: '/shop/all',
        permanent: true,
      },
    ];
  },
  // Optimisations de performance
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Mode export pour PWA/Capacitor (APK)
  // output: 'export',
};

export default config;
