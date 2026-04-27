import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function RatingsSection() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const [settingsRes, ratingsRes] = await Promise.all([
        axios.get(`${config.api.baseUrl}/api/site-settings`),
        axios.get(`${config.api.baseUrl}/api/ratings`),
      ]);

      setSiteSettings(settingsRes.data);
      const ratingsData = ratingsRes.data || [];
      
      setRatings(ratingsData);
      setTotalRatings(ratingsData.length);
      
      if (ratingsData.length > 0) {
        const avg = (
          ratingsData.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsData.length
        ).toFixed(1);
        setAvgRating(parseFloat(avg));
      }
    } catch (err) {
      console.error('Error loading ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Only show section if ratings are enabled and exist
  const ratingsEnabled = siteSettings?.featureToggles?.ratingsEnabled !== false;
  if (!ratingsEnabled || ratings.length === 0 || loading) {
    return null;
  }

  const RatingStars = ({ rating, size = 16 }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= rating ? config.colors.buttonColor : '#E5E5E5'}
            stroke="none"
            className="transition-colors"
          >
            <polygon points="12 2 15.09 10.26 24 10.35 17.27 16.61 19.16 25.88 12 20.77 4.84 25.88 6.73 16.61 0 10.35 8.91 10.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>
            Client Reviews & Ratings
          </h2>
          <p className="font-inter text-lg text-gray-600">
            What our clients say about us
          </p>
        </div>

        {/* Ratings Summary */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block">
            <div className="mb-4">
              <div className="text-5xl md:text-6xl font-bold" style={{ color: config.colors.primary }}>
                {avgRating}
              </div>
              <div className="mt-3 flex justify-center">
                <RatingStars rating={Math.round(avgRating)} size={28} />
              </div>
            </div>
            <p className="font-inter text-gray-600">
              Based on {totalRatings} client review{totalRatings !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Ratings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map((rating) => (
            <div
              key={rating._id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="mb-3">
                <RatingStars rating={rating.rating} />
              </div>

              {/* Review Text */}
              {rating.review && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{rating.review}"
                </p>
              )}

              {/* Client Name */}
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold" style={{ color: config.colors.primary }}>
                  {rating.clientName}
                </p>
                {rating.service && (
                  <p className="text-sm text-gray-600">
                    {rating.service}
                  </p>
                )}
                {rating.ratedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(rating.ratedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Have you experienced our services? Share your feedback!
          </p>
          <button
            onClick={() => {
              const bookingElement = document.getElementById('booking');
              if (bookingElement) {
                bookingElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95"
            style={{ backgroundColor: config.colors.buttonColor }}
          >
            Book & Leave a Review
          </button>
        </div>
      </div>
    </section>
  );
}
