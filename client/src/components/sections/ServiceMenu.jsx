import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function ServiceMenu() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'Professional Bridal Makeup',
    'Hair Styling',
    'Advanced Skincare',
    'Special Occasions',
    'Consultation',
  ];

  const categoryIcons = {
    'Professional Bridal Makeup': 'Makeup',
    'Hair Styling': 'Hair',
    'Advanced Skincare': 'Skincare',
    'Special Occasions': 'Events',
    'Consultation': 'Consultation',
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `${import.meta.env.VITE_API_URL}/api/services?category=${selectedCategory}`
        : `${import.meta.env.VITE_API_URL}/api/services`;

      const response = await axios.get(url);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>Our Collections</span>
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
          </div>
          <h2 className="font-playfair text-5xl md:text-6xl mb-4" style={{ color: config.colors.primary }}>
            Our Services
          </h2>
          <p className="font-inter text-lg" style={{ color: config.colors.secondary }}>
            Curated beauty experiences tailored to your unique style and needs
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
            All Services
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

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-inter" style={{ color: config.colors.secondary }}>No services available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="group p-8 transition-all rounded-lg"
                style={{ 
                  borderWidth: '1px', 
                  borderColor: config.colors.border,
                  backgroundColor: config.colors.white,
                }}
              >
                <h3 className="font-playfair text-2xl mb-2" style={{ color: config.colors.primary }}>
                  {service.name}
                </h3>
                <p className="font-inter text-sm uppercase tracking-widest mb-4" style={{ color: config.colors.accent }}>
                  {service.category}
                </p>
                <p className="font-inter leading-relaxed mb-6" style={{ color: config.colors.secondary }}>
                  {service.description}
                </p>
                <div className="flex justify-between items-center pt-4" style={{ borderTopWidth: '1px', borderColor: config.colors.border }}>
                  <div>
                    <p className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.secondary }}>Duration</p>
                    <p className="font-playfair text-lg" style={{ color: config.colors.primary }}>
                      {service.duration} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.secondary }}>Price</p>
                    <p className="font-playfair text-lg" style={{ color: config.colors.accent }}>
                      ₹{service.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
