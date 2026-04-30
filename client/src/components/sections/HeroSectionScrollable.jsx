import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

export default function HeroSectionScrollable({ heroData = null, isLoading = false }) {
  const navigate = useNavigate();
  const heroContent = heroData;

  if (!heroContent && !isLoading) {
    return null;
  }

  const images = (heroContent?.heroImages || []).slice(0, 2);
  const hasImages = images.length > 0;

  // Skeleton Loader
  if (isLoading && !heroContent) {
    return (
      <section className="relative w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start animate-pulse">
            {/* Skeleton Text Content - Left on all sizes */}
            <div className="w-full md:max-w-2xl md:flex-1 space-y-4">
              <div className="h-16 md:h-20 lg:h-24 bg-gray-300 rounded-lg max-w-2xl"></div>
              <div className="h-6 bg-gray-300 rounded-lg max-w-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded-lg max-w-lg"></div>
                <div className="h-4 bg-gray-300 rounded-lg max-w-lg"></div>
                <div className="h-4 bg-gray-300 rounded-lg max-w-md"></div>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-32 bg-gray-400 rounded-lg"></div>
                <div className="h-12 w-32 bg-gray-400 rounded-lg"></div>
              </div>
            </div>

            {/* Skeleton Images - Right on tablet+, below on mobile */}
            {hasImages && (
              <div className="w-full md:flex-1">
                {/* Desktop/Tablet Layout - Right Side */}
                <div className="hidden md:flex flex-col gap-6">
                  <div className="h-96 bg-gray-300 rounded-2xl" style={{ width: '100%', maxWidth: '400px' }}></div>
                  <div className="h-96 bg-gray-300 rounded-2xl" style={{ width: '100%', maxWidth: '400px', marginLeft: '40px', marginTop: '-20px' }}></div>
                </div>

                {/* Mobile Layout - Full Width Below Text */}
                <div className="flex md:hidden flex-col gap-4">
                  <div className="w-full rounded-xl bg-gray-300" style={{ height: 'auto', aspectRatio: '3/4' }}></div>
                  <div className="w-full rounded-xl bg-gray-300" style={{ height: 'auto', aspectRatio: '3/4' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Container - Vertical on mobile, Horizontal on tablet+ */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Text Content - Always Left Aligned */}
          <div className="w-full md:max-w-2xl md:flex-1">
            {/* Main Headline */}
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-4 text-black">
              {heroContent?.headline}
            </h1>

            {/* Subheadline */}
            <p className="font-inter text-base md:text-lg lg:text-xl mb-4 text-black">
              {heroContent?.subheadline}
            </p>

            {/* Description */}
            <p className="font-inter text-sm md:text-base leading-relaxed mb-8 text-black">
              {heroContent?.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  if (heroContent?.ctaLink === '/booking') {
                    navigate('/booking');
                  } else if (heroContent?.ctaLink?.startsWith('#')) {
                    const elementId = heroContent.ctaLink.substring(1);
                    const element = document.getElementById(elementId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 rounded-lg shadow-lg w-fit"
                style={{
                  backgroundColor: '#1F2937',
                  color: 'white'
                }}
              >
                {heroContent?.ctaText}
              </button>
              <button
                onClick={() => {
                  const contactSection = document.getElementById('location');
                  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 font-inter text-sm uppercase tracking-wider font-semibold rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg w-fit"
                style={{
                  backgroundColor: '#1F2937',
                  color: 'white'
                }}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Image Card Container - On Right for tablet+, Below for mobile */}
          {hasImages && (
            <div className="w-full md:flex-1 flex flex-col gap-6">
              {/* Desktop/Tablet Layout - Right Side */}
              <div className="hidden md:flex flex-col gap-6">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      height: 'auto',
                      aspectRatio: '4/5',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      transform: index === 1 ? 'translateX(40px) translateY(20px)' : 'none',
                      zIndex: images.length - index,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Hero Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
                  </div>
                ))}
              </div>

              {/* Mobile Layout - Full Width Below Text */}
              <div className="flex md:hidden flex-col gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden shadow-lg"
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '3/4',
                    }}
                  >
                    <img
                      src={image}
                      alt={`Hero Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
