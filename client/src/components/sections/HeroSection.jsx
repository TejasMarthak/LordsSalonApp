import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-16 pb-0 overflow-hidden" style={{ minHeight: '100vh' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900"></div>

      {/* Video/Background - Right side on desktop, full width on mobile with overlay */}
      <div className="absolute inset-0 md:right-0 md:w-1/2">
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover"
          poster="/images/hero-placeholder.jpg"
        >
          <source src="/videos/hero-salon.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text contrast on mobile */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-l md:from-transparent md:to-slate-950"></div>
      </div>

      {/* Content Container - Left side on desktop, centered on mobile */}
      <div className="relative z-10 h-full flex flex-col justify-center md:justify-start md:pt-20">
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 w-full md:w-1/2 space-y-8">
          {/* Logo/Brand Name */}
          <div className="space-y-3 animate-fade-in">
            <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-amber-50 tracking-wide leading-tight">
              Lords
            </h1>
            <p className="font-inter text-xs sm:text-sm text-amber-100 tracking-[0.3em] uppercase">
              Professional Makeup Studio & Salon
            </p>
          </div>

          {/* Tagline */}
          <p className="font-inter text-lg sm:text-xl md:text-2xl text-amber-50 font-light leading-relaxed max-w-lg">
            Elevate Your Beauty with Expert Artistry and Uncompromising Quality
          </p>

          {/* Primary CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => scrollToSection('booking')}
              className="group inline-flex items-center px-8 py-4 md:px-10 md:py-4 border border-amber-50 text-amber-50 font-inter text-sm md:text-base uppercase tracking-[0.1em] hover:bg-amber-50 hover:text-slate-950 transition-all duration-300 ease-out"
            >
              Book Appointment
              <svg
                className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Scroll Indicator - Only on desktop */}
          <div className="hidden md:flex absolute bottom-8 left-1/2 md:left-16 transform -translate-x-1/2 md:translate-x-0 z-20 animate-bounce pt-12">
            <svg
              className="w-6 h-6 text-amber-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 md:top-20 md:right-20 opacity-10 z-0">
        <svg className="w-32 h-32 md:w-48 md:h-48 text-amber-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </section>
  );
}
