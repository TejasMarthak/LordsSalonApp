import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function Lookbook() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  const categories = ['Bridal Makeup', 'Editorial', 'Party Makeup', 'Skincare', 'Hair', 'Special Effects'];
  
  const categoryIcons = {
    'Bridal Makeup': 'Bridal',
    'Editorial': 'Editorial',
    'Party Makeup': 'Party',
    'Skincare': 'Skincare',
    'Hair': 'Hair',
    'Special Effects': 'Effects',
  };

  useEffect(() => {
    fetchPortfolio();
  }, [selectedCategory]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `${import.meta.env.VITE_API_URL}/api/portfolio?category=${selectedCategory}&featured=true`
        : `${import.meta.env.VITE_API_URL}/api/portfolio?featured=true`;

      const response = await axios.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
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
              className="px-6 py-2 font-inter text-sm uppercase tracking-wider transition-all rounded-lg font-medium flex items-center gap-2"
              style={{
                backgroundColor: selectedCategory === category ? config.colors.primary : 'transparent',
                color: selectedCategory === category ? config.colors.white : config.colors.primary,
                borderWidth: selectedCategory === category ? '0px' : '2px',
                borderColor: config.colors.primary,
              }}
            >
              <span>{categoryIcons[category]}</span>
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>Loading portfolio...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>No portfolio items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="group relative overflow-hidden cursor-pointer rounded-lg"
                style={{
                  gridColumn: index % 5 === 0 ? 'span 2' : 'span 1',
                  gridRow: index % 5 === 0 ? 'span 2' : 'span 1',
                }}
                onClick={() => setActiveItem(item)}
              >
                <div className="w-full h-full overflow-hidden" style={{ backgroundColor: config.colors.light }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="text-white">
                      <h3 className="font-playfair text-xl mb-1">{item.title}</h3>
                      <p className="font-inter text-sm uppercase tracking-wider">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Image Comparison */}
        {activeItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={() => setActiveItem(null)}
          >
            <div
              className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              style={{ backgroundColor: config.colors.white }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <button
                  onClick={() => setActiveItem(null)}
                  className="float-right mb-4 p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: config.colors.primary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h2 className="font-playfair text-3xl mb-2 clear-both" style={{ color: config.colors.primary }}>
                  {activeItem.title}
                </h2>
                <p className="font-inter uppercase tracking-wider mb-6" style={{ color: config.colors.secondary }}>
                  {activeItem.category}
                </p>

                {/* Before and After Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {activeItem.beforeImageUrl && (
                    <div>
                      <p className="font-inter text-sm mb-2" style={{ color: config.colors.secondary }}>Before</p>
                      <img
                        src={activeItem.beforeImageUrl}
                        alt="Before"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-inter text-sm mb-2" style={{ color: config.colors.secondary }}>After</p>
                    <img
                      src={activeItem.imageUrl}
                      alt="After"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                {activeItem.description && (
                  <div style={{ borderTopWidth: '1px', borderColor: config.colors.border, paddingTop: '1.5rem' }}>
                    <p className="font-inter leading-relaxed" style={{ color: config.colors.secondary }}>
                      {activeItem.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
