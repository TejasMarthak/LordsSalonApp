import React, { useState, useEffect } from 'react';
import config from '../../config';
import BookingModal from './BookingModal';
import axios from 'axios';

export default function HeroSectionNew() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textColor, setTextColor] = useState('white');
  const [buttonColors, setButtonColors] = useState({ primary: 'white', secondary: 'black' });

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

  // Detect image brightness and set appropriate text color with enhanced algorithm
  const detectImageBrightness = (imgElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(imgElement, 0, 0, 200, 200);

      // Sample multiple areas: corners and center for better accuracy
      const sampleSize = 50;
      const samples = [
        { x: 0, y: 0 },           // top-left
        { x: 150, y: 0 },         // top-right
        { x: 0, y: 150 },         // bottom-left
        { x: 150, y: 150 },       // bottom-right
        { x: 75, y: 75 }          // center
      ];

      let totalLuminance = 0;
      let sampleCount = 0;

      samples.forEach(sample => {
        try {
          const imageData = ctx.getImageData(sample.x, sample.y, sampleSize, sampleSize);
          const data = imageData.data;

          let r = 0, g = 0, b = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          const pixelCount = data.length / 4;
          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          // WCAG luminance calculation for better contrast
          const [rs, gs, bs] = [r, g, b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
          });
          const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          totalLuminance += luminance;
          sampleCount++;
        } catch (e) {
          console.warn('Sample error:', e);
        }
      });

      const avgLuminance = totalLuminance / sampleCount;

      // Determine text color based on luminance with better threshold
      // Add text stroke/shadow for all cases
      let color, shadowColor;
      
      if (avgLuminance > 0.6) {
        // Very bright image - use dark text
        color = '#0a0a0a';
        shadowColor = 'rgba(255, 255, 255, 0.8)';
      } else if (avgLuminance > 0.4) {
        // Medium bright - use white with dark shadow
        color = '#ffffff';
        shadowColor = 'rgba(0, 0, 0, 0.8)';
      } else {
        // Dark image - use bright white
        color = '#ffffff';
        shadowColor = 'rgba(0, 0, 0, 0.9)';
      }

      setTextColor(color);
      setButtonColors({ 
        primary: color, 
        secondary: color,
        shadowColor: shadowColor
      });
    } catch (err) {
      console.error('Error detecting brightness:', err);
      // Fallback to white with dark shadow
      setTextColor('#ffffff');
      setButtonColors({ 
        primary: '#ffffff', 
        secondary: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.9)'
      });
    }
  };

  const handleImageLoad = (e) => {
    detectImageBrightness(e.target);
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

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={currentImage}
          alt={`Hero ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
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

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 py-20">
          {/* Top Accent */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span 
              className="font-inter text-xs uppercase tracking-widest" 
              style={{ 
                color: config.colors.accent,
                textShadow: `
                  1px 1px 2px ${buttonColors.shadowColor},
                  -1px -1px 2px ${buttonColors.shadowColor}
                `
              }}
            >
              Welcome to Luxury
            </span>
            <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
          </div>

          {/* Main Headline */}
          <h1 
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight"
            style={{ 
              color: textColor,
              textShadow: `
                2px 2px 4px ${buttonColors.shadowColor},
                -2px -2px 4px ${buttonColors.shadowColor},
                2px -2px 4px ${buttonColors.shadowColor},
                -2px 2px 4px ${buttonColors.shadowColor}
              `
            }}
          >
            {heroContent.headline || config.salon.name}
          </h1>

          {/* Subheadline */}
          <p 
            className="font-inter text-lg sm:text-xl md:text-2xl"
            style={{ 
              color: textColor, 
              opacity: 0.95,
              textShadow: `
                1px 1px 3px ${buttonColors.shadowColor},
                -1px -1px 3px ${buttonColors.shadowColor},
                1px -1px 3px ${buttonColors.shadowColor},
                -1px 1px 3px ${buttonColors.shadowColor}
              `
            }}
          >
            {heroContent.subheadline}
          </p>

          {/* Description */}
          <p 
            className="font-inter text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ 
              color: textColor, 
              opacity: 0.9,
              textShadow: `
                1px 1px 2px ${buttonColors.shadowColor},
                -1px -1px 2px ${buttonColors.shadowColor},
                1px -1px 2px ${buttonColors.shadowColor},
                -1px 1px 2px ${buttonColors.shadowColor}
              `
            }}
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
              className="px-8 sm:px-10 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg shadow-lg"
              style={{ 
                backgroundColor: config.colors.buttonColor,
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
              className="px-8 sm:px-10 py-3 sm:py-4 font-inter text-sm uppercase tracking-wider font-semibold border-2 rounded-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
              style={{ 
                borderColor: textColor,
                color: textColor,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                textShadow: `1px 1px 2px ${buttonColors.shadowColor}`
              }}
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
