import React, { useState, useEffect } from 'react';
import config from '../../config';
import BookingModal from './BookingModal';
import axios from 'axios';

export default function HeroSectionNew() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHeroData();
  }, []);

  // Auto-rotate carousel every 7 seconds
  useEffect(() => {
    if (!heroData?.heroImages || heroData.heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev =>
        prev === heroData.heroImages.length - 1 ? 0 : prev + 1
      );
    }, 7000); // Rotate every 7 seconds

    return () => clearInterval(interval);
  }, [heroData?.heroImages]);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/content/hero`);
      if (response.data) {
        setHeroData(response.data);
      }
    } catch (err) {
      console.error('Error fetching hero data:', err);
      setHeroData(null);
    } finally {
      setLoading(false);
    }
  };

  // Default values
  const heroContent = heroData || {
    headline: 'Elevate Your Beauty',
    subheadline: 'Professional Makeup & Salon Services',
    description: 'Experience sophisticated beauty artistry. Elevate your appearance with expert craftsmanship and premium services tailored to perfection.',
    ctaText: 'Book Appointment',
    ctaLink: '/booking',
    heroImages: [],
  };

  const currentImage = heroContent.heroImages?.[currentImageIndex] || 'https://images.unsplash.com/photo-1519456591411-323d9b26f669?w=600&h=600&fit=crop';

  const handlePrevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? heroContent.heroImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === heroContent.heroImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center pt-20" style={{ backgroundColor: config.colors.white }}>
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: config.colors.light, opacity: 0.5 }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-12">
        {/* Left - Text */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
              <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>Welcome to Luxury</span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light" style={{ color: config.colors.primary }}>
              {heroContent.headline || config.salon.name}
            </h1>
            <p className="font-inter text-lg sm:text-xl" style={{ color: config.colors.secondary }}>
              {heroContent.subheadline}
            </p>
          </div>

          <p className="font-inter text-base sm:text-lg leading-relaxed" style={{ color: config.colors.secondary }}>
            {heroContent.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button 
              onClick={() => {
                if (heroContent.ctaLink === '/booking') {
                  setBookingOpen(true);
                } else if (heroContent.ctaLink?.startsWith('#')) {
                  const elementId = heroContent.ctaLink.substring(1);
                  const element = document.getElementById(elementId);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                } else if (heroContent.ctaLink?.startsWith('/')) {
                  window.location.href = heroContent.ctaLink;
                }
              }} 
              className="px-6 sm:px-8 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg"
              style={{ 
                backgroundColor: config.colors.buttonColor,
                color: config.colors.white
              }}
            >
              {heroContent.ctaText}
            </button>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('location');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold border-2 rounded-lg transition-all hover:scale-105 active:scale-95"
              style={{ 
                borderColor: config.colors.secondary,
                color: config.colors.secondary,
                backgroundColor: 'transparent'
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right - Image Carousel */}
        {heroContent.heroImages && heroContent.heroImages.length > 0 ? (
          <div className="relative">
            {/* Main Image with object-cover for proper sizing */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src={currentImage}
                alt={`Hero ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ 
                  objectPosition: 'center',
                  opacity: loading ? 0.5 : 1
                }}
              />
              
              {/* Overlay with gradient */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(26,58,82,0.1) 0%, rgba(26,58,82,0.3) 100%)'
              }}></div>

              {/* Navigation Arrows */}
              {heroContent.heroImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all shadow-lg z-20"
                    aria-label="Previous image"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all shadow-lg z-20"
                    aria-label="Next image"
                  >
                    Next →
                  </button>
                </>
              )}
            </div>

            {/* Navigation Dots */}
            {heroContent.heroImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {heroContent.heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className="rounded-full transition-all"
                    style={{
                      width: currentImageIndex === idx ? 32 : 10,
                      height: 10,
                      backgroundColor: currentImageIndex === idx ? config.colors.accent : config.colors.border,
                      cursor: 'pointer'
                    }}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            {heroContent.heroImages.length > 1 && (
              <div className="text-center mt-4 font-inter text-sm" style={{ color: config.colors.textLight }}>
                {currentImageIndex + 1} / {heroContent.heroImages.length}
              </div>
            )}
          </div>
        ) : (
          // Fallback placeholder
          <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5', backgroundColor: config.colors.lightBg }}>
            <img
              src="https://images.unsplash.com/photo-1519456591411-323d9b26f669?w=600&h=600&fit=crop"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </section>
  );
}
