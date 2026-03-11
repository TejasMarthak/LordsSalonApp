import React from 'react';
import SEO from '../utils/SEO';
import { useJsonLd, generateServiceSchema } from '../../utils/jsonLdSchema';
import axios from 'axios';

/**
 * Service Detail Page Component
 * Demonstrates SEO implementation for dynamic pages
 * Route: /services/:slug
 */
const ServiceDetailPage = ({ slug }) => {
  const [service, setService] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchService = async () => {
      try {
        // Example API call - adjust based on your implementation
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/services?name=${slug}`
        );
        setService(response.data[0]);
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  // Inject JSON-LD schema if service data is available
  if (service) {
    useJsonLd(generateServiceSchema(service));
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!service) {
    return <div className="p-8 text-center">Service not found</div>;
  }

  const canonicalUrl = `https://lords-salon.com/services/${slug}`;
  const pageTitle = `${service.name} | Professional Makeup Services | Lords Salon`;
  const pageDescription = service.description;

  return (
    <>
      {/* SEO Component - Inject Meta Tags */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        ogImage={service.imageUrl || 'https://lords-salon.com/og-image.jpg'}
        keywords={`${service.name}, ${service.category}, makeup, salon, Vadodara`}
      />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>

          {/* Content Section */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-slate-950 text-white text-xs uppercase tracking-widest rounded mb-4">
                {service.category}
              </span>
            </div>

            <h1 className="font-playfair text-4xl text-slate-950 mb-4">
              {service.name}
            </h1>

            <p className="font-inter text-gray-700 text-lg leading-relaxed mb-6">
              {service.description}
            </p>

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded">
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">
                  Duration
                </p>
                <p className="font-playfair text-2xl text-slate-950">
                  {service.duration} min
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">
                  Starting from
                </p>
                <p className="font-playfair text-2xl text-slate-950">
                  ₹{service.price}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="#booking"
              className="inline-block px-8 py-4 bg-slate-950 text-white font-inter uppercase tracking-wider hover:bg-slate-800 transition-colors rounded"
            >
              Book This Service
            </a>

            {/* Schema.org Markup Note */}
            <div className="mt-8 text-xs text-slate-500 font-inter space-y-1">
              <p>✓ Schema.org markup applied for search engines</p>
              <p>✓ Meta tags optimized for social sharing</p>
              <p>✓ Canonical URL set to prevent duplicate content</p>
            </div>
          </div>
        </div>

        {/* Additional SEO Content */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="font-playfair text-2xl text-slate-950 mb-4">
            Why Choose Our {service.name} Service?
          </h2>
          <ul className="space-y-3 text-gray-700 font-inter">
            <li>✓ Professional makeup artists with 10+ years experience</li>
            <li>✓ Premium products used for best results</li>
            <li>✓ Customized approach for each client</li>
            <li>✓ Satisfaction guaranteed</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;
