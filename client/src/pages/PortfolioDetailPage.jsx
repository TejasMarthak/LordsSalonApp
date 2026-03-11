import React from 'react';
import SEO from '../components/utils/SEO';
import config from '../config';
import { useJsonLd, generateServiceSchema } from '../utils/jsonLdSchema';
import OptimizedImage, { PortfolioImage } from '../components/utils/OptimizedImage';
import axios from 'axios';

/**
 * Portfolio Detail Page Component
 * Shows a single portfolio item with before/after images
 * Demonstrates responsive images with lazy loading
 */
const PortfolioDetailPage = ({ itemId }) => {
  const [item, setItem] = React.useState(null);
  const [relatedItems, setRelatedItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        // Fetch the specific portfolio item
        const itemResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/portfolio/${itemId}`
        );
        setItem(itemResponse.data);

        // Fetch related items from same category
        const relatedResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/portfolio?category=${itemResponse.data.category}&limit=6`
        );
        setRelatedItems(relatedResponse.data.filter((p) => p._id !== itemId));
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItem();
  }, [itemId]);

  // JSON-LD Schema for portfolio item
  if (item) {
    useJsonLd({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: item.title,
      description: item.description,
      image: [item.imageUrl, item.beforeImageUrl].filter(Boolean),
      author: {
        '@type': 'Organization',
        name: config.salon.name,
      },
      datePublished: item.createdAt,
      dateModified: item.updatedAt,
    });
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!item) {
    return <div className="p-8 text-center">Portfolio item not found</div>;
  }

  const canonicalUrl = `${config.salon.website}/portfolio/${item._id}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title={`${item.title} | Portfolio | ${config.salon.name}`}
        description={item.description}
        canonicalUrl={canonicalUrl}
        ogImage={item.imageUrl}
        keywords={`${item.category}, makeup, portfolio`}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-slate-600 font-inter">
            <a href="/" className="hover:text-slate-950">
              Home
            </a>
            {' / '}
            <a href="/#portfolio" className="hover:text-slate-950">
              Portfolio
            </a>
            {' / '}
            <span className="text-slate-950">{item.category}</span>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <OptimizedImage
                  src={item.imageUrl}
                  alt={item.title}
                  width={800}
                  height={800}
                  priority={true}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                />
              </div>

              {/* Before/After Gallery */}
              {item.beforeImageUrl && (
                <div className="mt-8">
                  <h3 className="font-playfair text-xl text-slate-950 mb-4">
                    Before & After
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <OptimizedImage
                        src={item.beforeImageUrl}
                        alt={`Before - ${item.title}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <p className="text-xs text-slate-600 mt-2 text-center">Before</p>
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={`After - ${item.title}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <p className="text-xs text-slate-600 mt-2 text-center">After</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="bg-slate-50 p-8 rounded-lg h-fit">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-slate-950 text-white text-xs uppercase tracking-widest rounded mb-4">
                  {item.category}
                </span>
              </div>

              <h1 className="font-playfair text-3xl text-slate-950 mb-4">
                {item.title}
              </h1>

              <p className="font-inter text-gray-700 leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Metadata */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">
                    Makeup Artist
                  </p>
                  <p className="font-inter text-slate-950">
                    {item.stylist || `${config.salon.name} Team`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">
                    Date
                  </p>
                  <p className="font-inter text-slate-950">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#booking"
                className="block w-full mt-8 px-6 py-3 bg-slate-950 text-white text-center font-inter uppercase tracking-wider hover:bg-slate-800 transition-colors rounded"
              >
                Book Similar Service
              </a>
            </div>
          </div>

          {/* Related Portfolio Items */}
          {relatedItems.length > 0 && (
            <div className="mt-16 pt-16 border-t border-slate-200">
              <h2 className="font-playfair text-3xl text-slate-950 mb-8">
                More {item.category} Work
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.slice(0, 6).map((relatedItem) => (
                  <PortfolioImage
                    key={relatedItem._id}
                    imageUrl={relatedItem.imageUrl}
                    beforeImageUrl={relatedItem.beforeImageUrl}
                    title={relatedItem.title}
                    category={relatedItem.category}
                    onClick={() => (window.location.href = `/portfolio/${relatedItem._id}`)}
                    className="aspect-square"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioDetailPage;
