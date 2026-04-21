import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

// Service Card Component
function ServiceCard({ number, title, price, duration, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Format duration to display in hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Card Background */}
      <div
        className="relative rounded-2xl p-6 sm:p-8 md:p-10 min-h-48 sm:min-h-56 md:min-h-64 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out"
        style={{
          backgroundColor: '#2A2A2A',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 1px rgba(212, 175, 55, 0.3)'
            : '0 10px 25px rgba(0, 0, 0, 0.3)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}></div>

        {/* Animated gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${config.colors.accent}, #D4AF37)`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-center items-center">
          {/* Title - Centered */}
          <h3 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-light leading-relaxed text-white text-center">
            {title}
          </h3>
        </div>
      </div>

      {/* Number Badge - Positioned overlapping top-left */}
      <div
        className="absolute -top-3 -left-3 z-20 transition-all duration-300"
        style={{
          transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
        }}
      >
        <div
          className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center font-playfair font-bold text-lg sm:text-xl shadow-lg"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1A1A1A',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          {String(number).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

// Main Services Section Component
export default function ServiceSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);

  // Default services data
  const defaultServices = [
    { id: 1, name: 'Eyebrow Threading', duration: 30, price: 250 },
    { id: 2, name: 'Eyebrow Shaping', duration: 45, price: 350 },
    { id: 3, name: 'Eyebrow Beautification', duration: 60, price: 450 },
    { id: 4, name: 'Tanning', duration: 45, price: 400 },
    { id: 5, name: 'Bridal Services', duration: 180, price: 1500 },
    { id: 6, name: 'Pedicure', duration: 75, price: 600 },
    { id: 7, name: 'Haircut', duration: 45, price: 500 },
    { id: 8, name: 'Hair Threading', duration: 30, price: 200 },
    { id: 9, name: 'Hair Coloring', duration: 120, price: 1200 },
    { id: 10, name: 'Facial Treatment', duration: 60, price: 800 },
    { id: 11, name: 'Manicure', duration: 45, price: 350 },
    { id: 12, name: 'Waxing', duration: 30, price: 250 },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/api/services`);
      if (response.data && response.data.length > 0) {
        setServices(response.data);
      } else {
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const displayedServices = services.slice(0, displayCount);
  const hasMoreServices = services.length > displayCount;

  const handleShowMore = () => {
    setShowAll(!showAll);
    if (!showAll) {
      // Smooth scroll to ensure user sees the new services
      setTimeout(() => {
        const element = document.getElementById('service-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      setDisplayCount(services.length);
    } else {
      setDisplayCount(8);
    }
  };

  return (
    <section id="service-section" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span
              className="font-inter text-xs sm:text-sm uppercase tracking-widest"
              style={{ color: config.colors.accent }}
            >
              Premium Services
            </span>
            <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
          </div>
          <h2
            className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6"
            style={{ color: config.colors.primary }}
          >
            Our Services
          </h2>
          <p className="font-inter text-base sm:text-lg md:text-xl max-w-2xl mx-auto" style={{ color: config.colors.secondary }}>
            Comprehensive beauty and wellness services designed to enhance your natural beauty
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="text-center">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 mx-auto mb-4"
                style={{
                  borderColor: config.colors.accent,
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
              <p className="font-inter text-sm sm:text-base" style={{ color: config.colors.secondary }}>
                Loading services...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
              {displayedServices.map((service, index) => (
                <div
                  key={service.id || index}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeIn 0.6s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <ServiceCard
                    number={index + 1}
                    title={service.name || service.title}
                    price={service.price}
                    duration={service.duration}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {hasMoreServices && (
              <div className="flex justify-center mt-12 sm:mt-16">
                <button
                  onClick={handleShowMore}
                  className="px-8 sm:px-10 py-3 sm:py-4 font-inter text-sm sm:text-base uppercase tracking-wider font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: config.colors.primary,
                    border: `2px solid ${config.colors.primary}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = config.colors.primary;
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FFFFFF';
                    e.target.style.color = config.colors.primary;
                  }}
                >
                  {showAll ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS Animation for fade-in */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
