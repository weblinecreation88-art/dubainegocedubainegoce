export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  // SEO 2025: Organization + LocalBusiness combinés
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "name": "DubaiNegoce",
    "alternateName": "Dubai Negoce",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Spécialiste des parfums authentiques de Dubaï. Prix unique 35€. Livraison gratuite. Lattafa, Maison Alhambra, Fragrance World.",
    "email": "contact@dubainegoce.fr",
    "telephone": "+33-XX-XX-XX-XX",
    "priceRange": "35€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Carte Bancaire, PayPal",
    "openingHours": "Mo-Su 00:00-23:59",
    "areaServed": {
      "@type": "Country",
      "name": "France"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Service Client",
      "email": "contact@dubainegoce.fr",
      "availableLanguage": ["fr"],
      "areaServed": "FR"
    },
    "sameAs": [
      "https://www.instagram.com/dubainegoce",
      "https://www.facebook.com/dubainegoce"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DubaiNegoce",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/shop/all?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // SEO 2025: ItemList pour produits phares
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Parfums Best-Sellers DubaiNegoce",
    "description": "Les parfums les plus populaires de notre collection",
    "numberOfItems": 4,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "YARA Lattafa",
          "description": "Fragrance florale orientale iconique",
          "brand": {
            "@type": "Brand",
            "name": "Lattafa"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31",
            "url": `${siteUrl}/parfum/yara-lattafa`,
            "seller": {
              "@type": "Organization",
              "name": "DubaiNegoce"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Khamrah Lattafa",
          "description": "Parfum oriental épicé et gourmand",
          "brand": {
            "@type": "Brand",
            "name": "Lattafa"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31",
            "url": `${siteUrl}/parfum/khamrah-lattafa`,
            "seller": {
              "@type": "Organization",
              "name": "DubaiNegoce"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "Asad Lattafa",
          "description": "Fragrance boisée et épicée pour homme",
          "brand": {
            "@type": "Brand",
            "name": "Lattafa"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31",
            "url": `${siteUrl}/parfum/asad-lattafa`,
            "seller": {
              "@type": "Organization",
              "name": "DubaiNegoce"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Product",
          "name": "Zaffiro Regale Maison Alhambra",
          "description": "Fragrance sophistiquée de luxe",
          "brand": {
            "@type": "Brand",
            "name": "Maison Alhambra"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31",
            "url": `${siteUrl}/parfum/zaffiro-regale`,
            "seller": {
              "@type": "Organization",
              "name": "DubaiNegoce"
            }
          }
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Boutique",
        "item": `${siteUrl}/shop`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}
