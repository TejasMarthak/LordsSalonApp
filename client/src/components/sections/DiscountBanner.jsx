import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function DiscountBanner() {
  const [discounts, setDiscounts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      const [settingsRes, discountsRes] = await Promise.all([
        axios.get(`${config.api.baseUrl}/api/site-settings`),
        axios.get(`${config.api.baseUrl}/api/discounts`),
      ]);

      setSiteSettings(settingsRes.data);
      setDiscounts(discountsRes.data || []);
    } catch (err) {
      console.error('Error loading discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get active discounts (check dates)
  const now = new Date();
  const activeDiscounts = discounts.filter(d => {
    const from = new Date(d.validFrom);
    const to = new Date(d.validTo);
    return d.isActive && from <= now && to >= now;
  });

  // Only show banner if active discounts exist
  if (loading || activeDiscounts.length === 0) {
    return null;
  }

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Create scrolling text from discounts
  const scrollText = activeDiscounts
    .map((d) => {
      const from = formatDate(d.validFrom);
      const to = formatDate(d.validTo);
      return `${d.discountPercentage}% discount on ${d.occasion || d.title} services from ${from} to ${to}`;
    })
    .join(' • ');

  return (
    <div
      className="py-2 sm:py-3 overflow-hidden relative"
      style={{
        background: `linear-gradient(90deg, ${config.colors.accent}, ${config.colors.accent}cc)`,
      }}
    >
      {/* Animated scrolling text */}
      <div className="flex items-center whitespace-nowrap">
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .scroll-text {
            animation: scroll 30s linear infinite;
            font-size: 0.875rem;
          }
          .scroll-text:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="scroll-text font-inter font-semibold text-white px-4">
          {scrollText}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="scroll-text font-inter font-semibold text-white px-4">
          {scrollText}
        </div>
      </div>
    </div>
  );
}
