import React, { useState, useEffect, useRef } from 'react';
import config from '../../config';

// Responsive Carousel Component
export default function ResponsiveCarousel({ items, itemsPerView, renderItem, title, description, accent = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const scrollContainer = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - itemsPerView;
      return newIndex < 0 ? Math.max(0, items.length - itemsPerView) : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, items.length - itemsPerView);
      const newIndex = prev + itemsPerView;
      return newIndex > maxIndex ? 0 : newIndex;
    });
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
  };

  // Scroll the container smoothly
  useEffect(() => {
    if (scrollContainer.current) {
      const itemWidth = scrollContainer.current.offsetWidth / itemsPerView;
      scrollContainer.current.style.scrollBehavior = 'smooth';
      scrollContainer.current.scrollLeft = currentIndex * itemWidth;
    }
  }, [currentIndex, itemsPerView]);

  const displayItems = items.slice(currentIndex, currentIndex + itemsPerView);
  const showNavigation = items.length > itemsPerView;

  return (
    <div className="w-full">
      {/* Header */}
      {title && (
        <div className="text-center mb-12 sm:mb-16">
          {accent && (
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
              <span
                className="font-inter text-xs sm:text-sm uppercase tracking-widest"
                style={{ color: config.colors.accent }}
              >
                {title.split(' ')[0]}
              </span>
              <div className="w-8 sm:w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            </div>
          )}
          <h2
            className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6"
            style={{ color: config.colors.primary }}
          >
            {title}
          </h2>
          {description && (
            <p className="font-inter text-base sm:text-lg md:text-xl max-w-2xl mx-auto" style={{ color: config.colors.secondary }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Scroll Container */}
        <div
          ref={scrollContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {displayItems.map((item, index) => (
            <div
              key={currentIndex + index}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`,
              }}
            >
              {renderItem(item, currentIndex + index)}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showNavigation && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 sm:-translate-x-12 z-10 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: config.colors.accent,
                color: 'white',
              }}
              aria-label="Previous items"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 sm:translate-x-12 z-10 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                backgroundColor: config.colors.accent,
                color: 'white',
              }}
              aria-label="Next items"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {showNavigation && (
          <div className="flex justify-center gap-2 mt-8 sm:mt-12">
            {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerView)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    Math.floor(currentIndex / itemsPerView) === index
                      ? config.colors.accent
                      : config.colors.secondary + '40',
                }}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
