import { MetadataRoute } from 'next';
import { getProducts, brands } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

// Familles de parfum pour les pages de catégorie
const fragranceFamilies = [
  'Boisé', 'Oriental', 'Floral', 'Aquatique', 'Oud', 'Fruité', 'Épicé', 'Musqué',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getProducts();

  // ─── Pages produits ───────────────────────────────────────────────────────
  const productUrls: MetadataRoute.Sitemap = products.map(product => ({
    url: `${SITE_URL}/parfum/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: product.isBestseller ? 0.9 : 0.8,
  }));

  // ─── Pages shop par famille ───────────────────────────────────────────────
  const familyUrls: MetadataRoute.Sitemap = fragranceFamilies.map(family => ({
    url: `${SITE_URL}/shop/all?families=${encodeURIComponent(family)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // ─── Pages shop par marque ────────────────────────────────────────────────
  const brandUrls: MetadataRoute.Sitemap = brands.map(brand => ({
    url: `${SITE_URL}/shop/all?brand=${encodeURIComponent(brand.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // ─── Articles de blog ─────────────────────────────────────────────────────
  const blogSlugs = [
    'alhambra-ete-2025',
    'tendances-parfums-orientaux-2025',
    'top-5-lattafa-2025',
  ];
  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // ─── Pages statiques ──────────────────────────────────────────────────────
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/shop`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/shop/all`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/contact`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/faq`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/suivi-commande`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/livraison-et-paiement`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/mentions-legales`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/terms`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/shipping`, priority: 0.5, changeFrequency: 'yearly' },
  ].map(page => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  return [
    ...staticUrls,
    ...productUrls,
    ...familyUrls,
    ...brandUrls,
    ...blogUrls,
  ];
}
