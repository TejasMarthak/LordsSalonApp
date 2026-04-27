import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function DiscountSection() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
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

  // Only show section if discounts are enabled and exist
  const discountsEnabled = siteSettings?.featureToggles?.discountsEnabled !== false;
  if (!discountsEnabled || discounts.length === 0 || loading) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full" style={{ backgroundColor: config.colors.accent + '20' }}>
            <span className="font-inter text-xs uppercase tracking-widest font-semibold" style={{ color: config.colors.accent }}>
              Special Offers
            </span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>
            Exclusive Discounts & Offers
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and special offers
          </p>
        </div>

        {/* Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {discounts.map((discount) => (
            <div
              key={discount._id}
              className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100"
            >
              {/* Discount Badge */}
              <div
                className="absolute top-4 right-4 rounded-full p-3 text-white font-bold text-center"
                style={{ backgroundColor: config.colors.buttonColor }}
              >
                <div className="text-sm md:text-base">{discount.discountPercentage}%</div>
                <div className="text-xs">OFF</div>
              </div>

              {/* Content */}
              <div className="pr-20">
                {/* Title */}
                <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-2" style={{ color: config.colors.primary }}>
                  {discount.title}
                </h3>

                {/* Description */}
                {discount.description && (
                  <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                    {discount.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2 text-sm mb-6 pt-4 border-t border-gray-200">
                  {discount.applicableServices && discount.applicableServices.length > 0 && (
                    <div>
                      <p className="font-semibold" style={{ color: config.colors.primary }}>
                        Applicable Services:
                      </p>
                      <p className="text-gray-600">{discount.applicableServices.join(', ')}</p>
                    </div>
                  )}

                  {discount.validUntil && (
                    <div>
                      <p className="font-semibold" style={{ color: config.colors.primary }}>
                        Valid Until:
                      </p>
                      <p className="text-gray-600">
                        {new Date(discount.validUntil).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {discount.minBookingAmount && (
                    <div>
                      <p className="font-semibold" style={{ color: config.colors.primary }}>
                        Minimum Booking:
                      </p>
                      <p className="text-gray-600">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 0,
                        }).format(discount.minBookingAmount)}
                      </p>
                    </div>
                  )}

                  {discount.code && (
                    <div>
                      <p className="font-semibold" style={{ color: config.colors.primary }}>
                        Coupon Code:
                      </p>
                      <p className="font-mono font-bold text-lg" style={{ color: config.colors.accent }}>
                        {discount.code}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    const bookingElement = document.getElementById('booking');
                    if (bookingElement) {
                      bookingElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: config.colors.buttonColor }}
                >
                  Book Now & Redeem
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Terms */}
        {discounts.some(d => d.terms) && (
          <div className="mt-12 p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="font-semibold mb-3" style={{ color: config.colors.primary }}>
              Terms & Conditions
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {discounts
                .filter(d => d.terms)
                .map((d, idx) => (
                  <li key={idx}>• {d.terms}</li>
                ))}
              <li>• All discounts are subject to availability</li>
              <li>• Cannot be combined with other offers</li>
              <li>• Valid only for new and registered customers</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
