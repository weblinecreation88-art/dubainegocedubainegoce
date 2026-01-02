import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DubaiNegoce - Parfums de Dubaï Authentiques',
    short_name: 'DubaiNegoce',
    description: 'Parfums authentiques de Dubaï à prix fixe 35€. Lattafa, Maison Alhambra, Fragrance World. Livraison gratuite.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    categories: ['shopping', 'lifestyle'],
    lang: 'fr',
    dir: 'ltr',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
