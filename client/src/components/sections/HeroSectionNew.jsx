import React, { useState, useEffect } from 'react';
import config from '../../config';
import BookingModal from './BookingModal';
import axios from 'axios';

export default function HeroSectionNew() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const textColor = '#000000'; // Black text color
  const accentColor = config.colors.accent;
  const buttonColors = { primary: '#000000', secondary: '#000000' };

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

  // Default values
  const heroContent = heroData || {
    headline: 'Elevate Your Beauty',
    subheadline: 'Professional Makeup & Salon Services',
    description: 'Experience sophisticated beauty artistry. Elevate your appearance with expert craftsmanship and premium services tailored to perfection.',
    ctaText: 'Book Appointment',
    ctaLink: '/booking',
    heroImages: [],
  };

  const currentImage = heroContent.heroImages?.[currentImageIndex] || 'https://images.unsplash.com/photo-1519456591411-323d9b26f669?w=1200&h=800&fit=crop';

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

  // Check if we have images to display
  const hasImages = heroContent.heroImages && heroContent.heroImages.length > 0;

  return (
    <section className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden ${hasImages ? '' : 'bg-white'}`}>
      {/* Background Image - Full Width (only show if we have images) */}
      {hasImages && (
        <div className="absolute inset-0 w-full h-full">
        <img
          src={currentImage}
          alt={`Hero ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          style={{
            transition: 'opacity 0.8s ease-in-out',
            opacity: loading ? 0.5 : 1,
          }}
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
        }}></div>
      </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 py-20">


          {/* Main Headline */}
          <h1 
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-black"
          >
            {heroContent.headline || config.salon.name}
          </h1>

          {/* Subheadline */}
          <p 
            className="font-inter text-lg sm:text-xl md:text-2xl text-black"
            style={{ opacity: 0.95 }}
          >
            {heroContent.subheadline}
          </p>

          {/* Description */}
          <p 
            className="font-inter text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-black"
            style={{ opacity: 0.9 }}
          >
            {heroContent.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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
              className="px-8 sm:px-10 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg shadow-lg bg-black text-white hover:bg-gray-900"
            >
              {heroContent.ctaText || 'Book Now'}
            </button>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('location');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 sm:px-10 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 bg-black text-white hover:bg-gray-900 shadow-lg"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroContent.heroImages && heroContent.heroImages.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-70 hover:bg-opacity-90 text-black p-3 sm:p-4 rounded-full transition-all shadow-lg"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-70 hover:bg-opacity-90 text-black p-3 sm:p-4 rounded-full transition-all shadow-lg"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {heroContent.heroImages && heroContent.heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center gap-2">
          {heroContent.heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="rounded-full transition-all backdrop-blur-sm"
              style={{
                width: currentImageIndex === idx ? 32 : 10,
                height: 10,
                backgroundColor: currentImageIndex === idx ? config.colors.accent : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer'
              }}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
    </section>
  );
}
