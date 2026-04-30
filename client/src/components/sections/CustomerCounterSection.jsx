import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';

const Counter = ({ end, label, icon, isRating = false, showPlus = true }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let animationFrame;

    const animate = () => {
      setCount(prev => {
        const increment = isRating ? 0.1 : Math.ceil(end / 30);
        const newCount = Math.min(prev + increment, end);
        if (newCount < end && isMounted) {
          animationFrame = requestAnimationFrame(animate);
        }
        return newCount;
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && count === 0) {
        animationFrame = requestAnimationFrame(animate);
      }
    });

    const element = document.getElementById(`counter-${label}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [end, label, isRating]);

  return (
    <div
      id={`counter-${label}`}
      className="text-center p-6 md:p-8 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow"
    >
      <div className="mb-3 flex justify-center">
        {icon && (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.colors.buttonColor + '20' }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="font-playfair text-4xl md:text-5xl font-bold mb-2" style={{ color: config.colors.buttonColor }}>
        {isRating ? count.toFixed(1) : Math.floor(count)}{showPlus && !isRating ? '+' : ''}
      </div>
      {isRating && (
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xl" style={{ color: i < Math.round(count) ? config.colors.buttonColor : '#D1D5DB' }}>
              ★
            </span>
          ))}
        </div>
      )}
      <div className="font-inter text-gray-600 text-sm md:text-base font-semibold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default function CustomerCounterSection() {
  const [stats, setStats] = useState({
    happyClients: 500,
    totalServices: 8,
    averageRating: 4.8,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [settingsRes, servicesRes] = await Promise.all([
          axios.get(`${config.api.baseUrl}/api/site-settings`).catch(() => ({ data: {} })),
          axios.get(`${config.api.baseUrl}/api/services`).catch(() => ({ data: [] })),
        ]);

        setStats(prev => ({
          happyClients: settingsRes.data?.stats?.happyClients || prev.happyClients,
          totalServices: servicesRes.data?.length || prev.totalServices,
          averageRating: settingsRes.data?.stats?.averageRating || prev.averageRating,
        }));
      } catch (err) {
        console.error('Error loading statistics:', err);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>
            By The Numbers
          </h2>
          <p className="font-inter text-lg text-gray-600">
            Our commitment to excellence, measured
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Counter
            end={stats.happyClients}
            label="Happy Clients"
            showPlus={true}
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={config.colors.buttonColor} strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />

          <Counter
            end={stats.totalServices}
            label="Services"
            showPlus={false}
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={config.colors.buttonColor} strokeWidth={2}>
                <path d="M6 9l6-7 6 7M9 20h6M9 17h6" />
              </svg>
            }
          />

          <Counter
            end={stats.averageRating}
            label="Average Rating"
            isRating={true}
            showPlus={false}
            icon={
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={config.colors.buttonColor} strokeWidth={2}>
                <polygon points="12 2 15.09 10.26 23.77 10.26 17.43 15.62 20.53 23.78 12 18.42 3.47 23.78 6.57 15.62 0.23 10.26 8.91 10.26 12 2" />
              </svg>
            }
          />
        </div>

        {/* Tagline */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-inter text-gray-600 italic">
            "Excellence is not an act, but a habit." - Aristotle
          </p>
        </div>
      </div>
    </section>
  );
}
