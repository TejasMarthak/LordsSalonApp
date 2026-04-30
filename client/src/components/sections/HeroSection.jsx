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
    <section className="relative w-full pb-0 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900" style={{ minHeight: '100vh' }}>
      {/* Mobile Layout: Content on top, Image below */}
      {/* Tablet+ Layout: Content left, Image right */}
      <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
        {/* Content Container - Full width on mobile, left half on tablet+ */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-16 md:py-0 md:justify-start md:pt-32 lg:pt-40 xl:pt-48 relative z-10">
          <div className="px-6 sm:px-8 md:px-12 lg:px-16 space-y-8">
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
            <div className="hidden md:flex pt-12 z-20 animate-bounce">
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

        {/* Video/Image Container - Full width on mobile below content, right half on tablet+ */}
        <div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
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
          {/* Overlay - Darker on mobile, gradient on desktop */}
          <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-l md:from-transparent md:to-slate-950"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 md:top-20 md:right-20 opacity-10 z-0 pointer-events-none">
        <svg className="w-32 h-32 md:w-48 md:h-48 text-amber-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </section>
  );
}
