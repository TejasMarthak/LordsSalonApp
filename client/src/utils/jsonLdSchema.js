/**
 * JSON-LD Schema Utilities
 * Generates structured data markup for Google Search Console
 */

/**
 * Generate Local Business Schema
 * Returns JSON-LD markup for BeautySalon business
 */
import config from "../config";

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": config.salon.website,
    name: config.salon.name,
    description:
      "Premium makeup and salon services. Expert bridal makeup, hair styling, and skincare.",
    url: config.salon.website,
    telephone: config.salon.phone,
    email: config.salon.email,
    image: `${config.salon.website}/logo.jpg`,

    // Address
    address: {
      "@type": "PostalAddress",
      streetAddress: config.salon.address.split(",")[0] || "Your Address",
      addressLocality: "Your City",
      addressRegion: "Your State",
      postalCode: "000000",
      addressCountry: "IN",
    },

    // Geo Coordinates
    geo: {
      "@type": "GeoCoordinates",
      latitude: config.salon.lat,
      longitude: config.salon.lng,
    },

    // Business Hours
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "11:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "19:00",
      },
    ],

    // Price Range
    priceRange: "$$",

    // Social Media Profiles
    sameAs: [config.social.instagram, config.social.facebook],

    // Contact Point
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: config.salon.phone,
      email: config.salon.email,
      areaServed: "IN",
      availableLanguage: "en-IN",
    },

    // Ratings (placeholder - update with real reviews)
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "35+",
      bestRating: "5",
      worstRating: "1",
    },

    // Services (link to service list)
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Beauty Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Professional Bridal Makeup",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hair Styling",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Advanced Skincare",
          },
        },
      ],
    },
  };
};

/**
 * Generate Service Schema
 * Used for individual service pages (e.g., /services/bridal-makeup)
 */
export const generateServiceSchema = (service) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "BeautySalon",
      name: config.salon.name,
      url: config.salon.website,
    },
    image: service.imageUrl || `${config.salon.website}/default-service.jpg`,
    areaServed: {
      "@type": "City",
      name: "Your City",
    },
    priceRange: `Rs. ${service.price || "0"}`,
    duration: `PT${service.duration || "60"}M`, // ISO 8601 format
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "100",
    },
  };
};

/**
 * Generate Organization Schema
 * Returns core organization schema for homepage
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.salon.name,
    url: config.salon.website,
    logo: `${config.salon.website}/logo.png`,
    description:
      "Premium makeup and salon services. Expert bridal makeup, hair styling, and skincare.",
    sameAs: [config.social.instagram, config.social.facebook],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: config.salon.phone,
      email: config.salon.email,
    },
  };
};

/**
 * React Hook to Inject JSON-LD Schema into Document Head
 */
export const useJsonLd = (schema) => {
  React.useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    script.async = true;

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [schema]);
};

// Export all schemas
export default {
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateOrganizationSchema,
  useJsonLd,
};
