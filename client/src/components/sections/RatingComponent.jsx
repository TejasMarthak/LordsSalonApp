import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function RatingComponent({ serviceId, serviceName }) {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    rating: 5,
    review: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRatings();
  }, [serviceId]);

  const fetchRatings = async () => {
    try {
      const [ratingsRes, avgRes] = await Promise.all([
        axios.get(`${config.api.baseUrl}/api/ratings?serviceId=${serviceId}&limit=5`),
        axios.get(`${config.api.baseUrl}/api/ratings/average/${serviceId}`),
      ]);

      setRatings(ratingsRes.data);
      setAverageRating(avgRes.data.averageRating || 0);
      setTotalRatings(avgRes.data.totalRatings || 0);
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${config.api.baseUrl}/api/ratings`, {
        ...formData,
        serviceId,
        ratingType: 'service',
      });

      setFormData({ clientName: '', clientEmail: '', rating: 5, review: '' });
      setShowForm(false);
      fetchRatings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="mt-8 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-200">
      {/* Header with Average Rating */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          ⭐ Customer Reviews
        </h3>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-sm text-gray-600 mt-2">
              {totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            ✍️ Write a Review
          </button>
        </div>
      </div>

      {/* Rating Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg border-2 border-pink-200 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className={`text-3xl transition-all ${
                    star <= formData.rating
                      ? 'text-yellow-400 scale-110'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Review (Optional)
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Share your experience..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition resize-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? '⏳ Submitting...' : '🎯 Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {ratings.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          ratings.map((rating) => (
            <div key={rating._id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-800">{rating.clientName}</p>
                <StarRating rating={rating.rating} />
              </div>
              {rating.review && (
                <p className="text-gray-600 text-sm">{rating.review}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(rating.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
