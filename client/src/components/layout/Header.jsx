import React, { useState } from 'react';
import config from '../../config';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="group">
          <div className="font-playfair text-2xl font-bold" style={{ color: config.colors.primary }}>
            {config.salon.name.split(' ')[0] || 'Studio'}
          </div>
          <p className="font-inter text-xs tracking-wider uppercase font-semibold" style={{ color: config.colors.accent }}>
            Beauty Services
          </p>
        </a>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('services')} className="font-inter text-sm uppercase tracking-wider transition-colors font-medium" style={{ color: config.colors.primary }}>
            Services
          </button>
          <button onClick={() => scrollToSection('portfolio')} className="font-inter text-sm uppercase tracking-wider transition-colors font-medium" style={{ color: config.colors.primary }}>
            Portfolio
          </button>
          <button onClick={() => scrollToSection('location')} className="font-inter text-sm uppercase tracking-wider transition-colors font-medium" style={{ color: config.colors.primary }}>
            Contact
          </button>
        </nav>



        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
          style={{ color: config.colors.primary }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white p-6 space-y-4">
          <button onClick={() => scrollToSection('services')} className="block w-full text-left font-inter text-sm uppercase tracking-wider font-semibold" style={{ color: config.colors.primary }}>
            Services
          </button>
          <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left font-inter text-sm uppercase tracking-wider font-semibold" style={{ color: config.colors.primary }}>
            Portfolio
          </button>
          <button onClick={() => scrollToSection('location')} className="block w-full text-left font-inter text-sm uppercase tracking-wider font-semibold" style={{ color: config.colors.primary }}>
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
