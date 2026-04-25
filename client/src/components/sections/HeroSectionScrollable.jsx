import React, { useState, useEffect } from 'react';
import config from '../../config';
import BookingModal from './BookingModal';
import axios from 'axios';

export default function HeroSectionScrollable() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

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

  // Default hero content
  const heroContent = heroData || {
    headline: 'Elevate Your Beauty',
    subheadline: 'Professional Makeup & Salon Services',
    description: 'Experience sophisticated beauty artistry. Elevate your appearance with expert craftsmanship and premium services tailored to perfection.',
    ctaText: 'Book Appointment',
    ctaLink: '/booking',
    heroImages: []
  };

  // Get images (max 2)
  const images = (heroContent.heroImages || []).slice(0, 2);
  const hasImages = images.length > 0;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Determine layout
  const textFullWidth = !hasImages;

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden bg-white">

        {/* Content Container */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8 lg:px-16">
          {/* Main Layout Container */}
          <div
            className={`w-full h-full flex items-center gap-8 md:gap-12 lg:gap-16 ${
              textFullWidth ? 'justify-center' : 'justify-between'
            }`}
          >
            {/* Left Side - Text Content */}
            <div
              className={`${
                textFullWidth
                  ? 'w-full text-center'
                  : 'flex-1 text-left'
              } flex flex-col justify-center`}
            >
              {/* Top Accent - REMOVED Welcome to Luxury */}

              {/* Main Headline */}
              <h1
                className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-4 text-black"
                style={{
                  maxWidth: textFullWidth ? '800px' : 'none',
                  marginLeft: textFullWidth ? 'auto' : '0',
                  marginRight: textFullWidth ? 'auto' : '0'
                }}
              >
                {heroContent.headline}
              </h1>

              {/* Subheadline */}
              <p
                className="font-inter text-base md:text-lg lg:text-xl mb-4 text-black"
                style={{
                  maxWidth: textFullWidth ? '600px' : 'none',
                  marginLeft: textFullWidth ? 'auto' : '0',
                  marginRight: textFullWidth ? 'auto' : '0'
                }}
              >
                {heroContent.subheadline}
              </p>

              {/* Description */}
              <p
                className="font-inter text-sm md:text-base leading-relaxed mb-8 text-black"
                style={{
                  maxWidth: textFullWidth ? '600px' : 'none',
                  marginLeft: textFullWidth ? 'auto' : '0',
                  marginRight: textFullWidth ? 'auto' : '0'
                }}
              >
                {heroContent.description}
              </p>

              {/* CTA Buttons */}
              <div className={`flex gap-4 pt-4 ${textFullWidth ? 'justify-center' : 'justify-start'} flex-wrap`}>
                <button
                  onClick={() => {
                    if (heroContent.ctaLink === '/booking') {
                      setBookingOpen(true);
                    } else if (heroContent.ctaLink?.startsWith('#')) {
                      const elementId = heroContent.ctaLink.substring(1);
                      const element = document.getElementById(elementId);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg shadow-lg"
                  style={{
                    backgroundColor: '#1F2937',
                    color: 'white'
                  }}
                >
                  {heroContent.ctaText}
                </button>
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('location');
                    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    backgroundColor: '#1F2937',
                    color: 'white'
                  }}
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Right Side - Image Container (Card Style) */}
            {hasImages && !isMobile && (
              <div className="flex-1 h-full flex items-center justify-end pr-4 md:pr-8">
                <div className="relative">
                  {/* Images Stack */}
                  <div className="flex flex-col gap-6">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                          width: '300px',
                          height: '400px',
                          position: 'relative',
                          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                          transform: index === 1 ? 'translateX(40px) translateY(20px)' : 'none',
                          zIndex: images.length - index,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        <img
                          src={image}
                          alt={`Hero Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Subtle overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative elements */}
                  <div
                    className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-full blur-3xl"
                    style={{ pointerEvents: 'none' }}
                  ></div>
                </div>
              </div>
            )}

            {/* Mobile Image Display */}
            {hasImages && isMobile && (
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
                <div className="flex justify-center gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden shadow-lg flex-shrink-0"
                      style={{
                        width: '120px',
                        height: '160px',
                      }}
                    >
                      <img
                        src={image}
                        alt={`Hero Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
