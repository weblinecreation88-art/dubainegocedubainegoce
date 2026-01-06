import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/checkout/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
      // SEO 2026: Directives spécifiques pour les bots d'IA
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'anthropic-ai', 'ClaudeBot', 'Claude-Web'],
        disallow: ['/'],
      },
      // Crawlers spéciaux - accès complet aux images
      {
        userAgent: ['Googlebot-Image', 'Bingbot'],
        allow: '/*',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
