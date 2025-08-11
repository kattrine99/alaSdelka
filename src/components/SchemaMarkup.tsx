// components/SchemaMarkup.tsx
interface SchemaProps {
  data: any;
}

export const SchemaMarkup: React.FC<SchemaProps> = ({ data }) => {
  return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
  );
};

// Использование для Organization
export const OrganizationSchema: React.FC<{ contacts: any }> = ({ contacts }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": contacts.company.name,
    "description": contacts.company.description,
    "url": "https://invin.uz",
    "logo": `https://invin.uz${contacts.company.logo}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contacts.phone,
      "contactType": "customer service",
      "availableLanguage": ["Russian", "Uzbek"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contacts.address,
      "addressLocality": contacts.location.city,
      "postalCode": contacts.location.postal_code,
      "addressCountry": "UZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": contacts.location.latitude,
      "longitude": contacts.location.longitude
    },
    "sameAs": Object.values(contacts.social).filter(Boolean)
  };
  
  return <SchemaMarkup data={schema} />;
};

// BreadcrumbList Schema
export const BreadcrumbSchema: React.FC<{ items: Array<{name: string, url: string}>, locale: string }> = ({ items, locale }) => {
  const baseUrl = 'https://invin.uz';
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": locale === 'ru' 
        ? `${baseUrl}${item.url}`
        : `${baseUrl}/uz${item.url}`
    }))
  };
  
  return <SchemaMarkup data={schema} />;
};

// Schema для объявления (Product + LocalBusiness)
export const OfferSchema: React.FC<{ offer: any, locale: string }> = ({ offer, locale }) => {
  const schemas = [
    // Product Schema
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": offer.title,
      "description": offer.description,
      "image": offer.photos?.map((p: any) => `https://invin.uz${p.url}`) || [],
      "sku": offer.id.toString(),
      "category": offer.category?.title_ru,
      "offers": {
        "@type": "Offer",
        "url": `https://invin.uz/${locale}/offer/${offer.slug}`,
        "priceCurrency": "UZS",
        "price": offer.price,
        "priceValidUntil": offer.updated_at,
        "availability": offer.offer_status === 'published' 
          ? "https://schema.org/InStock" 
          : "https://schema.org/SoldOut",
        "seller": {
          "@type": "Person",
          "name": offer.user?.name
        }
      },
      "aggregateRating": offer.rating ? {
        "@type": "AggregateRating",
        "ratingValue": offer.rating,
        "reviewCount": offer.reviews_count || 0
      } : undefined
    },
    // LocalBusiness Schema (для бизнеса)
    offer.offer_type === 'business' ? {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": offer.title,
      "description": offer.description,
      "image": offer.photos?.map((p: any) => `https://invin.uz${p.url}`) || [],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": offer.address?.address,
        "addressLocality": offer.address?.city?.name_ru,
        "addressCountry": "UZ"
      },
      "geo": offer.address?.latitude && offer.address?.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": offer.address.latitude,
        "longitude": offer.address.longitude
      } : undefined,
      "url": `https://invin.uz/${locale}/offer/${offer.slug}`,
      "telephone": offer.user_phone,
      "priceRange": `${offer.price} UZS`,
      "openingHoursSpecification": offer.working_hours
    } : null
  ].filter(Boolean);
  
  return (
    <>
      {schemas.map((schema, index) => (
        <SchemaMarkup key={index} data={schema} />
      ))}
    </>
  );
};

// Schema для страницы категории со списком
export const CategoryPageSchema: React.FC<{ 
  category: any, 
  offers: any[], 
  locale: string 
}> = ({ category, offers, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.title_ru,
    "description": category.meta_description_ru,
    "url": `https://invin.uz/${locale}/category/${category.slug}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": `https://invin.uz/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category.title_ru,
          "item": `https://invin.uz/${locale}/category/${category.slug}`
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": offers.length,
      "itemListElement": offers.map((offer, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": offer.title,
          "url": `https://invin.uz/${locale}/offer/${offer.slug}`,
          "image": offer.main_photo,
          "offers": {
            "@type": "Offer",
            "price": offer.price,
            "priceCurrency": "UZS"
          }
        }
      }))
    }
  };
  
  return <SchemaMarkup data={schema} />;
};

// Schema для страницы города со списком
export const CityPageSchema: React.FC<{ 
  city: any, 
  offers: any[], 
  locale: string 
}> = ({ city, offers, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": city.name_ru,
    "description": city.meta_description_ru,
    "url": `https://invin.uz/${locale}/city/${city.slug}`,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.latitude,
      "longitude": city.longitude
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name_ru,
      "addressRegion": city.region_ru,
      "addressCountry": "UZ"
    },
    "containsPlace": offers.map(offer => ({
      "@type": "LocalBusiness",
      "name": offer.title,
      "url": `https://invin.uz/${locale}/offer/${offer.slug}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city.name_ru
      }
    }))
  };
  
  return <SchemaMarkup data={schema} />;
};

// Schema для статичных страниц (business, franchise, etc.)
export const StaticPageSchema: React.FC<{ 
  pageType: string,
  title: string,
  description: string,
  locale: string 
}> = ({ pageType, title, description, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `https://invin.uz/${locale}/${pageType}`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": `https://invin.uz/${locale}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": `https://invin.uz/${locale}/${pageType}`
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Invest In",
      "url": "https://invin.uz"
    }
  };
  
  return <SchemaMarkup data={schema} />;
};

// Schema для списка объявлений с фильтрами (SearchResultsPage)
export const SearchResultsSchema: React.FC<{
  query?: string,
  filters?: any,
  resultsCount: number,
  offers: any[],
  locale: string
}> = ({ query, filters, resultsCount, offers, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": query ? `Поиск: ${query}` : "Все объявления",
    "url": `https://invin.uz/${locale}/offers`,
    "numberOfResults": resultsCount,
    "searchQuery": query,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": offers.length,
      "itemListElement": offers.map((offer, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": offer.title,
          "url": `https://invin.uz/${locale}/offer/${offer.slug}`,
          "image": offer.main_photo,
          "offers": {
            "@type": "Offer",
            "price": offer.price,
            "priceCurrency": "UZS",
            "availability": offer.offer_status === 'published' 
              ? "https://schema.org/InStock" 
              : "https://schema.org/SoldOut"
          }
        }
      }))
    }
  };
  
  return <SchemaMarkup data={schema} />;
};

// FAQ Schema для страниц с частыми вопросами
export const FAQSchema: React.FC<{ 
  questions: Array<{question: string, answer: string}> 
}> = ({ questions }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
  
  return <SchemaMarkup data={schema} />;
};

// WebSite Schema с поиском (для главной страницы)
export const WebSiteSchema: React.FC<{ locale: string }> = ({ locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Invest In",
    "url": "https://invin.uz",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://invin.uz/${locale}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  
  return <SchemaMarkup data={schema} />;
};

// AggregateOffer Schema для категорий с диапазоном цен
export const AggregateOfferSchema: React.FC<{
  category: string,
  offerCount: number,
  lowPrice: number,
  highPrice: number,
  locale: string
}> = ({ category, offerCount, lowPrice, highPrice, locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "name": category,
    "offerCount": offerCount,
    "lowPrice": lowPrice,
    "highPrice": highPrice,
    "priceCurrency": "UZS",
    "url": `https://invin.uz/${locale}/category/${category}`
  };
  
  return <SchemaMarkup data={schema} />;
};