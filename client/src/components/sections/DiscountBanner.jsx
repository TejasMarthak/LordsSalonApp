import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function DiscountBanner() {
  const [discounts, setDiscounts] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissedDiscounts, setDismissedDiscounts] = useState(new Set());

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
    return d.isActive && from <= now && to >= now && !dismissedDiscounts.has(d._id);
  });

  // Format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
    });
  };

  const handleDismiss = (discountId) => {
    setDismissedDiscounts(prev => new Set([...prev, discountId]));
  };

  // Only show cards if active discounts exist
  if (loading || activeDiscounts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-30 pt-1 md:pt-1">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-4 justify-start">
          {activeDiscounts.map((discount) => (
            <div
              key={discount._id}
              className="relative flex items-center gap-4 rounded-lg p-4 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 max-w-sm"
              style={{
                backgroundColor: config.colors.buttonColor + '10',
                borderLeftColor: config.colors.buttonColor,
              }}
            >
              {/* Discount Badge */}
              <div
                className="flex-shrink-0 rounded-full p-3 text-white font-bold text-center min-w-fit"
                style={{ backgroundColor: config.colors.buttonColor }}
              >
                <div className="text-sm md:text-base leading-tight">{discount.discountPercentage}%</div>
                <div className="text-xs">OFF</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-sm md:text-base" style={{ color: config.colors.primary }}>
                  {discount.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {discount.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Valid till {formatDate(discount.validTo)}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => handleDismiss(discount._id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-300 rounded-full transition-colors"
                aria-label="Close discount"
                title="Dismiss"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
