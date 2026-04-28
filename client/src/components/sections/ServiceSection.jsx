import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import ResponsiveCarousel from '../utils/ResponsiveCarousel';

// Service Card Component
function ServiceCard({ number, title, price, duration, index, service }) {
  const navigate = useNavigate();
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
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group h-full cursor-pointer"
      >
      {/* Card Background */}
      <div
        className="relative rounded-xl p-5 sm:p-6 md:p-7 min-h-56 sm:min-h-64 md:min-h-72 flex flex-col justify-between overflow-visible transition-all duration-300 ease-out h-full"
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
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${config.colors.accent}, #D4AF37)`,
          }}
        ></div>

        {/* Number Badge */}
        <div
          className="absolute top-4 left-4 sm:top-3 sm:left-3 z-20 transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
          }}
        >
          <div
            className="w-12 sm:w-14 h-12 sm:h-14 rounded-full flex items-center justify-center font-playfair font-bold text-base sm:text-lg shadow-lg"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            {String(number).padStart(2, '0')}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-14 flex flex-col justify-between h-full">
          {/* Title */}
          <div>
            <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-semibold leading-tight text-white">
              {title}
            </h3>
          </div>

          {/* Details Footer */}
          <div className="mt-4 space-y-3 border-t border-white border-opacity-20 pt-4">
            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="font-inter text-xs uppercase tracking-wider text-gray-400">Price</span>
              <span className="font-playfair text-lg font-semibold text-white">₹{price}</span>
            </div>
            
            {/* Duration */}
            {duration && (
              <div className="flex justify-between items-center">
                <span className="font-inter text-xs uppercase tracking-wider text-gray-400">Duration</span>
                <span className="font-inter text-sm text-gray-300">{formatDuration(duration)}</span>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={() => navigate('/booking')}
              className="w-full mt-3 py-2.5 px-4 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-lg active:scale-95"
              style={{
                backgroundColor: config.colors.accent,
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 16px rgba(212, 175, 55, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// Main Services Section Component
export default function ServiceSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Get responsive item count based on screen size
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 2;    // Mobile
    if (width < 1024) return 3;   // Tablet
    return 4;                      // Desktop
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderServiceCard = (service, index) => (
    <ServiceCard
      number={index + 1}
      title={service.name || service.title}
      price={service.price}
      duration={service.duration}
      index={index}
      service={service}
    />
  );

  return (
    <section id="service-section" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
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
          <ResponsiveCarousel
            items={services}
            itemsPerView={itemsPerView}
            renderItem={renderServiceCard}
            title="Our Services"
            description="Comprehensive beauty and wellness services designed to enhance your natural beauty"
            accent={true}
          />
        )}
      </div>

      {/* CSS Animation for spin */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
