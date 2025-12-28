export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dubainegoce.fr';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DubaiNegoce",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Parfums authentiques de Dubaï à prix unique 35€. YARA, Khamrah, Zaffiro, Lovely. Livraison Mondial Relay offerte.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Service Client",
      "email": "contact@dubainegoce.fr",
      "availableLanguage": ["fr"]
    },
    "sameAs": [
      "https://www.instagram.com/dubainegoce",
      "https://www.facebook.com/dubainegoce"
    ]
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

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Parfums de Dubaï",
    "description": "Collection complète de parfums authentiques de Dubaï à prix unique 35€",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "YARA Lattafa",
          "description": "Fragrance florale orientale iconique et intemporelle",
          "brand": {
            "@type": "Brand",
            "name": "Lattafa"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": `${siteUrl}/shop/all?search=yara`
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
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
            "url": `${siteUrl}/shop/all?search=khamrah`
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Zaffiro Regale",
          "description": "Fragrance sophistiquée de la collection iconique",
          "brand": {
            "@type": "Brand",
            "name": "Alhambra"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": `${siteUrl}/shop/all?search=zaffiro`
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Lovely Fragrance World",
          "description": "Best-seller avec notes florales captivantes",
          "brand": {
            "@type": "Brand",
            "name": "Fragrance World"
          },
          "offers": {
            "@type": "Offer",
            "price": "35.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "url": `${siteUrl}/shop/all?search=lovely`
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
          __html: JSON.stringify(offerCatalogSchema)
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
