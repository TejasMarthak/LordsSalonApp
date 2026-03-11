/**
 * JSON-LD Schema Utilities
 * Generates structured data markup for Google Search Console
 */

/**
 * Generate Local Business Schema
 * Returns JSON-LD markup for BeautySalon business
 */
import React from "react";
export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": "https://lords-salon.com",
    name: "Lords Professional Makeup Studio & Salon",
    description: "Premium makeup and salon services in Vadodara, Gujarat",
    url: "https://lords-salon.com",
    telephone: "+91-9876543210",
    email: "info@lords-salon.com",
    image: "https://lords-salon.com/logo.jpg",

    // Address
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address Here",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      postalCode: "390001",
      addressCountry: "IN",
    },

    // Geo Coordinates
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.3072,
      longitude: 73.1812,
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
    sameAs: [
      "https://www.instagram.com/lords-salon",
      "https://www.facebook.com/lords-salon",
      "https://www.linkedin.com/company/lords-salon",
    ],

    // Contact Point
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+91-8733681843",
      email: "tejasmarthak1909@gmail.com",
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

    // Reviews (sample reviews)
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        reviewBody: "Absolutely beautiful work! Professional and courteous.",
        author: {
          "@type": "Person",
          name: "Priya Sharma",
        },
        datePublished: "2024-01-15",
      },
    ],

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
      name: "Lords Professional Makeup Studio & Salon",
      url: "https://lords-salon.com",
    },
    image: service.imageUrl || "https://lords-salon.com/default-service.jpg",
    areaServed: {
      "@type": "City",
      name: "Vadodara",
    },
    priceRange: `Rs. ${service.price}`,
    duration: `PT${service.duration}M`, // ISO 8601 format
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
    name: "Lords Professional Makeup Studio & Salon",
    url: "https://lords-salon.com",
    logo: "https://lords-salon.com/logo.png",
    description: "Premium makeup and salon services in Vadodara, Gujarat",
    sameAs: [
      "https://www.instagram.com/lords-salon",
      "https://www.facebook.com/lords-salon",
      "https://www.linkedin.com/company/lords-salon",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+91-9876543210",
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
