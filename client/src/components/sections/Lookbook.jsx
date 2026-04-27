import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

// Image Carousel Component for Before/After
function ImageCarousel({ beforeImage, afterImage, title }) {
  const [currentImage, setCurrentImage] = useState('after');
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (!beforeImage) {
      setCurrentImage('after');
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage(prev => prev === 'after' ? 'before' : 'after');
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [beforeImage]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe left to show before, swipe right to show after
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left
        setCurrentImage('before');
      } else {
        // Swiped right
        setCurrentImage('after');
      }
    }
    setTouchStart(null);
  };

  const displayImage = currentImage === 'after' ? afterImage : beforeImage;

  return (
    <div 
      className="relative w-full h-full overflow-hidden group cursor-pointer touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={displayImage}
        alt={`${title} - ${currentImage}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      />
      
      {/* Image indicator badge */}
      {beforeImage && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {currentImage === 'after' ? 'After' : 'Before'}
        </div>
      )}

      {/* Mobile swipe hint */}
      {beforeImage && (
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs md:hidden">
          Swipe to compare
        </div>
      )}
    </div>
  );
}

export default function Lookbook() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    // Fetch categories (services) on mount
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch portfolio items when category changes
    fetchPortfolio();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/api/services`);
      // Extract service names as categories
      const serviceNames = response.data.map(service => service.name);
      setCategories(serviceNames);
    } catch (error) {
      // Fall back to empty array if services can't be fetched
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `${config.api.baseUrl}/api/portfolio?category=${selectedCategory}`
        : `${config.api.baseUrl}/api/portfolio`;

      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (itemId) => {
    navigate(`/lookbook/${itemId}`);
  };

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor: config.colors.white }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>Gallery</span>
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
          </div>
          <h2 className="font-playfair text-5xl md:text-6xl mb-4" style={{ color: config.colors.primary }}>
            Our Lookbook
          </h2>
          <p className="font-inter text-lg" style={{ color: config.colors.secondary }}>
            Before & after transformations and editorial beauty artistry
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-6 py-2 font-inter text-sm uppercase tracking-wider transition-all rounded-lg font-medium"
            style={{
              backgroundColor: selectedCategory === null ? config.colors.primary : 'transparent',
              color: selectedCategory === null ? config.colors.white : config.colors.primary,
              borderWidth: selectedCategory === null ? '0px' : '2px',
              borderColor: config.colors.primary,
            }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 font-inter text-sm uppercase tracking-wider transition-all rounded-lg font-medium"
              style={{
                backgroundColor: selectedCategory === category ? config.colors.primary : 'transparent',
                color: selectedCategory === category ? config.colors.white : config.colors.primary,
                borderWidth: selectedCategory === category ? '0px' : '2px',
                borderColor: config.colors.primary,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid of Portfolio Cards */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>Loading portfolio...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>No portfolio items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                onClick={() => handleCardClick(item._id)}
              >
                {/* Image Container with Carousel */}
                <div 
                  className="relative w-full overflow-hidden" 
                  style={{ aspectRatio: '4/5', backgroundColor: config.colors.lightBg }}
                >
                  <ImageCarousel 
                    beforeImage={item.beforeImageUrl}
                    afterImage={item.imageUrl}
                    title={item.title}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <button
                      className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
                      style={{ backgroundColor: config.colors.buttonColor }}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 md:p-6">
                  {/* Category Badge */}
                  <p className="font-inter text-xs uppercase tracking-widest mb-2" style={{ color: config.colors.accent }}>
                    {item.category}
                  </p>
                  
                  {/* Title */}
                  <h3 className="font-playfair text-lg md:text-xl font-light mb-2" style={{ color: config.colors.primary }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-sm line-clamp-2" style={{ color: config.colors.secondary }}>
                    {item.description || 'Beautiful transformation in our lookbook'}
                  </p>

                  {/* Before/After Indicator */}
                  {item.beforeImageUrl && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: config.colors.border }}>
                      <p className="font-inter text-xs" style={{ color: config.colors.textLight }}>
                        ✓ Before & After images • Switches every 5 seconds
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

