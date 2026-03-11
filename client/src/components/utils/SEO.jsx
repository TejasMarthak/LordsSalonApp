import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for Dynamic Meta Tags & Head Management
 * Handles title, description, canonical URL, Open Graph tags, Twitter cards
 * 
 * Usage:
 * <SEO 
 *   title="Bridal Makeup Services | Lords Salon"
 *   description="Professional bridal makeup in Vadodara"
 *   canonicalUrl="https://lords-salon.com/services/bridal-makeup"
 *   ogImage="https://lords-salon.com/images/bridal-makeup.jpg"
 *   ogType="website"
 *   twitterHandle="@lordssalon"
 * />
 */
const SEO = ({
  title = 'Lords Professional Makeup Studio & Salon | Vadodara',
  description = 'Premium makeup and salon services in Vadodara, Gujarat. Expert bridal makeup, hair styling, skincare treatments.',
  keywords = 'makeup salon, bridal makeup, salon Vadodara, professional makeup artist',
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : '',
  ogImage = 'https://lords-salon.com/og-image.jpg',
  ogType = 'website',
  twitterHandle = '@lordssalon',
  author = 'Lords Professional Makeup Studio & Salon',
}) => {
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Tags (Facebook, LinkedIn) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content="Lords Professional Makeup Studio & Salon" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="7 days" />

      {/* Mobile & Device Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default SEO;
