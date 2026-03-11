import React, { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-salon.mp4" type="video/mp4" />
        </video>
        {/* Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Logo/Brand Name */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-playfair text-6xl md:text-8xl font-light text-amber-50 tracking-wide">
            Lords
          </h1>
          <p className="font-inter text-sm md:text-base text-amber-100 tracking-[0.3em] mt-2 uppercase">
            Professional Makeup Studio & Salon
          </p>
        </div>

        {/* Tagline */}
        <p className="font-inter text-lg md:text-2xl text-amber-50 max-w-2xl mb-12 font-light leading-relaxed">
          Elevate Your Beauty with Expert Artistry and Uncompromising Quality
        </p>

        {/* Primary CTA Button */}
        <a
          href="#booking"
          className="group inline-flex items-center px-8 py-3 md:px-10 md:py-4 border border-amber-50 text-amber-50 font-inter text-sm md:text-base uppercase tracking-[0.1em] hover:bg-amber-50 hover:text-slate-950 transition-all duration-300 ease-out"
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
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
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
    </section>
  );
}
