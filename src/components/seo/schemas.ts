/**
 * JSON-LD Schemas pour SEO
 * Utilisés pour aider Google à comprendre le contenu
 */

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dubainegoce',
  url: 'https://dubainegoce.fr',
  logo: 'https://dubainegoce.fr/logo.png',
  description: 'Parfums authentiques de Dubaï - Lattafa, Maison Alhambra, Fragrance World',
  sameAs: [
    'https://www.facebook.com/dubainegoce',
    'https://www.instagram.com/dubainegoce',
    'https://twitter.com/dubainegoce'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'contact@dubainegoce.fr',
    availableLanguage: ['fr', 'en']
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR'
  }
};

export const productSchema = (product: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  brand: {
    '@type': 'Brand',
    name: product.brand
  },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: `https://dubainegoce.fr/parfum/${product.slug}`
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating.value,
    ratingCount: product.rating.count
  } : undefined
});

export const breadcrumbSchema = (items: Array<{name: string; url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

export const faqSchema = (faqs: Array<{question: string; answer: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const articleSchema = (article: any) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  author: {
    '@type': 'Person',
    name: article.author || 'Dubainegoce'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dubainegoce',
    logo: {
      '@type': 'ImageObject',
      url: 'https://dubainegoce.fr/logo.png'
    }
  }
});
