import React, { useState } from 'react';
import config from '../../config';
import BookingModal from './BookingModal';

export default function HeroSectionNew() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const featured = {
    _id: '1',
    name: 'Premium Bridal Package',
    price: 5999,
    duration: 180
  };

  return (
    <section className="relative w-full min-h-screen flex items-center pt-20" style={{ backgroundColor: config.colors.white }}>
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ backgroundColor: config.colors.light, opacity: 0.5 }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left - Text */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
              <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>Welcome to Luxury</span>
            </div>
            <h1 className="font-playfair text-6xl md:text-7xl font-light" style={{ color: config.colors.primary }}>
              Lords Professional
            </h1>
            <p className="font-inter text-2xl" style={{ color: config.colors.secondary }}>
              Makeup Studio & Salon
            </p>
          </div>

          <p className="font-inter text-lg leading-relaxed" style={{ color: config.colors.secondary }}>
            Experience sophisticated beauty artistry. Elevate your appearance with expert craftsmanship and premium services tailored to perfection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => setBookingOpen(true)} 
              className="px-8 py-4 font-inter uppercase tracking-wider font-semibold transition-all"
              style={{ 
                backgroundColor: config.colors.buttonColor,
                color: config.colors.white
              }}
            >
              Book Appointment
            </button>
            <button 
              className="px-8 py-4 font-inter uppercase tracking-wider font-semibold transition-all border-2"
              style={{ 
                borderColor: config.colors.primary,
                backgroundColor: 'transparent',
                color: config.colors.primary
              }}
            >
              Contact Us
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <p className="font-playfair text-3xl mb-1" style={{ color: config.colors.accent }}>500+</p>
              <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Happy Clients</p>
            </div>
            <div>
              <p className="font-playfair text-3xl mb-1" style={{ color: config.colors.accent }}>15+</p>
              <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Services</p>
            </div>
            <div>
              <p className="font-playfair text-3xl mb-1" style={{ color: config.colors.accent }}>10+</p>
              <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Artists</p>
            </div>
          </div>
        </div>

        {/* Right - Image/Visual */}
        <div className="relative h-full hidden md:flex items-center justify-center">
          <div 
            className="w-full aspect-square rounded-lg overflow-hidden shadow-2xl"
            style={{ backgroundColor: config.colors.light }}
          >
            <img 
              src="https://images.unsplash.com/photo-1519456591411-323d9b26f669?w=600&h=600&fit=crop" 
              alt="Professional Makeup" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative corner */}
          <div 
            className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20"
            style={{ backgroundColor: config.colors.accent }}
          ></div>
        </div>
      </div>

      {/* Modal */}
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} service={featured} />
    </section>
  );
}
