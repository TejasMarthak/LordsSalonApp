import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

// Image Carousel Component for Before/After
function DetailImageCarousel({ beforeImage, afterImage, title }) {
  const [currentImage, setCurrentImage] = useState('after');
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!beforeImage || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentImage(prev => prev === 'after' ? 'before' : 'after');
    }, 5000);

    return () => clearInterval(interval);
  }, [beforeImage, autoPlay]);

  const displayImage = currentImage === 'after' ? afterImage : beforeImage;

  const handleToggle = () => {
    setCurrentImage(currentImage === 'after' ? 'before' : 'after');
    setAutoPlay(false);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
      <img
        src={displayImage}
        alt={`${title} - ${currentImage}`}
        className="w-full h-auto object-cover transition-opacity duration-500"
      />
      
      {/* Image indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-semibold">
        {currentImage === 'after' ? 'After' : 'Before'}
      </div>

      {/* Manual toggle button */}
      {beforeImage && (
        <button
          onClick={handleToggle}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-black px-6 py-2 rounded-full font-semibold transition-all text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.07 3.97a4 4 0 015.659.001m-.038 6.942A4 4 0 005.109 9.27m9.538.896a4 4 0 00-4.473-4.472m-2.868 13.036A4 4 0 015.109 13m14.882-4a4.001 4.001 0 00-4.268-3.277m0 0c1.930-.444 3.574-1.394 4.728-2.714m0 0A4 4 0 0017.464 9.5" clipRule="evenodd" />
          </svg>
          Switch Image
        </button>
      )}

      {/* Auto-play indicator */}
      {beforeImage && autoPlay && (
        <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-60 px-3 py-1 rounded-full">
          Auto-switching • {currentImage === 'after' ? 'Before in 5s' : 'After in 5s'}
        </div>
      )}
    </div>
  );
}

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    fetchPortfolioItem();
  }, [id]);

  const fetchPortfolioItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/api/portfolio/${id}`);
      setItem(response.data);

      // Fetch related items in same category
      if (response.data.category) {
        const relatedResponse = await axios.get(
          `${config.api.baseUrl}/api/portfolio?category=${response.data.category}`
        );
        // Filter out the current item
        const filtered = relatedResponse.data.filter(i => i._id !== id).slice(0, 3);
        setRelatedItems(filtered);
      }
    } catch (err) {
      console.error('Error fetching portfolio item:', err);
      setError('Portfolio item not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: config.colors.white }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: config.colors.secondary }}>Loading portfolio details...</p>
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: config.colors.white }}>
        <div className="text-center">
          <h2 className="font-playfair text-3xl mb-4" style={{ color: config.colors.primary }}>
            {error || 'Portfolio item not found'}
          </h2>
          <button
            onClick={() => navigate('/lookbook')}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: config.colors.buttonColor }}
          >
            Back to Lookbook
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen" style={{ backgroundColor: config.colors.white }}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <button
          onClick={() => navigate('/lookbook')}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all"
          style={{ backgroundColor: config.colors.lightBg, color: config.colors.primary }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lookbook
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>
              Portfolio
            </span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl mb-4" style={{ color: config.colors.primary }}>
            {item.title}
          </h1>
          <p className="font-inter text-lg" style={{ color: config.colors.secondary }}>
            {item.category}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Images Section */}
          <div className="lg:col-span-2">
            {item.beforeImageUrl ? (
              <DetailImageCarousel
                beforeImage={item.beforeImageUrl}
                afterImage={item.imageUrl}
                title={item.title}
              />
            ) : (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full rounded-xl shadow-lg"
              />
            )}

            {/* Image Labels */}
            {item.beforeImageUrl && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: config.colors.accent }}></div>
                  <p className="font-inter text-sm font-semibold" style={{ color: config.colors.secondary }}>Before</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: config.colors.accent }}></div>
                  <p className="font-inter text-sm font-semibold" style={{ color: config.colors.secondary }}>After</p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div>
            {/* Category Card */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: config.colors.lightBg }}
            >
              <p className="font-inter text-xs uppercase tracking-widest mb-2" style={{ color: config.colors.accent }}>
                Service Category
              </p>
              <h3 className="font-playfair text-2xl" style={{ color: config.colors.primary }}>
                {item.category}
              </h3>
            </div>

            {/* Description Card */}
            {item.description && (
              <div
                className="rounded-xl p-6 mb-6"
                style={{ backgroundColor: config.colors.lightBg }}
              >
                <p className="font-inter text-xs uppercase tracking-widest mb-3" style={{ color: config.colors.accent }}>
                  About This Work
                </p>
                <p className="font-inter leading-relaxed" style={{ color: config.colors.secondary }}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: config.colors.lightBg }}
            >
              <p className="font-inter text-xs uppercase tracking-widest mb-4" style={{ color: config.colors.accent }}>
                Features
              </p>
              <ul className="space-y-3">
                {item.beforeImageUrl && (
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5" style={{ color: config.colors.accent }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-inter text-sm" style={{ color: config.colors.secondary }}>
                      Before & After Comparison
                    </span>
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" style={{ color: config.colors.accent }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter text-sm" style={{ color: config.colors.secondary }}>
                    5-Second Auto-Switch
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5" style={{ color: config.colors.accent }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-inter text-sm" style={{ color: config.colors.secondary }}>
                    Professional Service
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="border-t" style={{ borderColor: config.colors.border, paddingTop: '3rem' }}>
            <h2 className="font-playfair text-3xl mb-8" style={{ color: config.colors.primary }}>
              More from {item.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map(relatedItem => (
                <div
                  key={relatedItem._id}
                  onClick={() => navigate(`/lookbook/${relatedItem._id}`)}
                  className="cursor-pointer group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                    <img
                      src={relatedItem.imageUrl}
                      alt={relatedItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <span className="text-white font-semibold">View</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-playfair text-lg" style={{ color: config.colors.primary }}>
                      {relatedItem.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div
          className="mt-16 rounded-2xl p-12 text-center"
          style={{ backgroundColor: config.colors.lightBg }}
        >
          <h2 className="font-playfair text-3xl md:text-4xl mb-4" style={{ color: config.colors.primary }}>
            Ready for Your Transformation?
          </h2>
          <p className="font-inter text-lg mb-8" style={{ color: config.colors.secondary }}>
            Book your appointment with our expert beauty professionals today
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-4 rounded-lg font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: config.colors.buttonColor }}
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </section>
  );
}
