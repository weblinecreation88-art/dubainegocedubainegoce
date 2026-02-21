import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  // Products
  const products = getProducts();
  const productUrls = products.map(product => ({
    url: `${siteUrl}/parfum/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.8,
  }));

  // Blog Posts
  const blogPosts = [
    { slug: 'alhambra-ete-2025' },
    { slug: 'tendances-parfums-orientaux-2025' },
    { slug: 'top-5-lattafa-2025' },
  ];
  const blogUrls = blogPosts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.7,
  }));

  // Static Pages with priorities from the plan
  const staticPages = [
    { url: `${siteUrl}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${siteUrl}/shop`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${siteUrl}/blog`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${siteUrl}/about`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${siteUrl}/contact`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${siteUrl}/faq`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${siteUrl}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${siteUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${siteUrl}/shipping`, priority: 0.6, changeFrequency: 'yearly' },
  ].map(page => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: page.priority,
  }));

  // Filter out disallowed pages from the sitemap
  const disallowedPaths = ['/signup', '/login', '/cart', '/checkout', '/account'];
  const finalStaticPages = staticPages.filter(page => !disallowedPaths.some(path => page.url.endsWith(path)));

  return [
    ...finalStaticPages,
    ...productUrls,
    ...blogUrls,
  ];
}
