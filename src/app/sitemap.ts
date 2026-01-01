import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';
  const currentDate = new Date();

  // Products - Haute priorité pour SEO produits
  const products = getProducts();
  const productUrls = products.map(product => ({
    url: `${siteUrl}/parfum/${product.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85, // Augmenté car pages produits = conversion
  }));

  // Blog Posts - Content marketing pour SEO
  const blogPosts = [
    { slug: 'alhambra-ete-2025', lastMod: new Date('2025-01-01') },
    { slug: 'tendances-parfums-orientaux-2025', lastMod: new Date('2025-01-01') },
    { slug: 'top-5-lattafa-2025', lastMod: new Date('2025-01-01') },
  ];
  const blogUrls = blogPosts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.75, // Blog important pour SEO informationnel
  }));

  // Static Pages - Optimisé pour SEO 2025
  const staticPages: Array<{url: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'}> = [
    // Pages principales - Priorité maximale
    { url: `${siteUrl}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${siteUrl}/shop`, priority: 0.95, changeFrequency: 'daily' },
    { url: `${siteUrl}/shop/all`, priority: 0.92, changeFrequency: 'daily' },

    // Pages catégories marques - Haute priorité SEO
    { url: `${siteUrl}/shop/all?brands=Lattafa`, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${siteUrl}/shop/all?brands=Maison%20Alhambra`, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${siteUrl}/shop/all?brands=Fragrance%20World`, priority: 0.88, changeFrequency: 'weekly' },
    { url: `${siteUrl}/shop/all?brands=French%20Avenue`, priority: 0.88, changeFrequency: 'weekly' },

    // Pages informatives - SEO E-E-A-T
    { url: `${siteUrl}/blog`, priority: 0.80, changeFrequency: 'weekly' },
    { url: `${siteUrl}/about`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${siteUrl}/faq`, priority: 0.72, changeFrequency: 'monthly' },
    { url: `${siteUrl}/contact`, priority: 0.70, changeFrequency: 'monthly' },

    // Pages utilitaires - Priorité moyenne
    { url: `${siteUrl}/shipping`, priority: 0.65, changeFrequency: 'monthly' },

    // Pages légales - Priorité basse mais nécessaires
    { url: `${siteUrl}/mentions-legales`, priority: 0.35, changeFrequency: 'yearly' },
    { url: `${siteUrl}/privacy`, priority: 0.32, changeFrequency: 'yearly' },
    { url: `${siteUrl}/terms`, priority: 0.32, changeFrequency: 'yearly' },
  ].map(page => ({
    url: page.url,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [
    ...staticPages,
    ...productUrls,
    ...blogUrls,
  ];
}
