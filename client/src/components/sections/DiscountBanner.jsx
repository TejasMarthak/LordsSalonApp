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

  // Only show banner if discounts are enabled and exist
  const discountsEnabled = siteSettings?.featureToggles?.discountsEnabled !== false;
  const hasActiveDiscount = discounts.length > 0;

  if (!discountsEnabled || !hasActiveDiscount || loading) {
    return null;
  }

  // Create scrolling text from discounts
  const scrollText = discounts
    .map((d) => `${d.discountPercentage}% OFF on ${d.title} | Code: ${d.code}`)
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
          ✨ {scrollText} ✨
        </div>
        {/* Duplicate for seamless loop */}
        <div className="scroll-text font-inter font-semibold text-white px-4">
          ✨ {scrollText} ✨
        </div>
      </div>
    </div>
  );
}
