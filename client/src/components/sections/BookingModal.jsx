import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

export default function BookingModal({ isOpen, onClose, service }) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate all required fields
      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone || !formData.bookingDate || !formData.bookingTime) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Validate phone format
      const phoneRegex = /^[\d+\-\s()]+$/;
      if (!phoneRegex.test(formData.clientPhone) || formData.clientPhone.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      // Create booking date in ISO format
      const bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
      
      // Validate that booking date is in the future
      if (bookingDateTime < new Date()) {
        setError('Please select a future date and time');
        setLoading(false);
        return;
      }

      // Prepare booking data with all required fields
      const bookingData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        serviceId: service._id || service.id,
        serviceName: service.name,
        bookingDate: bookingDateTime.toISOString(),
        duration: service.duration || 60,
        notes: formData.notes,
        status: 'pending',
        paymentStatus: 'pending',
        createdFrom: 'website'
      };

      const response = await axios.post(
        `${config.api.baseUrl}/api/bookings`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('✅ Booking successful! We will confirm via WhatsApp soon.');
      
      setTimeout(() => {
        // Try to open WhatsApp if available
        if (formData.clientPhone) {
          const whatsappNumber = formData.clientPhone.replace(/\D/g, '');
          const message = `Hi! I'd like to book ${service.name} for ${formData.bookingDate} at ${formData.bookingTime}`;
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        }
        onClose();
        resetForm();
      }, 1500);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      bookingDate: '',
      bookingTime: '',
      notes: '',
    });
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 p-6 text-white" style={{ backgroundColor: config.colors.buttonColor }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-playfair font-bold">Book Appointment</h2>
              <p className="text-sm mt-1" style={{ opacity: 0.9 }}>{service?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: config.colors.white, color: config.colors.buttonColor }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FFEBEE', color: '#C62828', borderLeftWidth: '4px', borderLeftColor: '#C62828' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#E8F5E9', color: '#1B5E20', borderLeftWidth: '4px', borderLeftColor: '#1B5E20' }}>
              {success}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Full Name
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: config.colors.border, focusRingColor: config.colors.accent }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Email
            </label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: config.colors.border }}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              required
              placeholder="+91 xxxx xxxx xx"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: config.colors.border }}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Preferred Date
            </label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              required
              min={today}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: config.colors.border }}
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Preferred Time
            </label>
            <input
              type="time"
              name="bookingTime"
              value={formData.bookingTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
              style={{ borderColor: config.colors.border }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: config.colors.primary }}>
              Special Requests (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requests or preferences?"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition resize-none"
              style={{ borderColor: config.colors.border }}
            />
          </div>

          {/* Service Details */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: config.colors.light, borderWidth: '1px', borderColor: config.colors.border }}>
            <p className="text-sm font-medium" style={{ color: config.colors.primary }}>
              <strong>Service:</strong> {service?.name}
            </p>
            <p className="text-sm mt-1" style={{ color: config.colors.secondary }}>
              <strong>Duration:</strong> {service?.duration} minutes
            </p>
            <p className="text-sm mt-1" style={{ color: config.colors.accent }}>
              <strong>Price:</strong> ₹{service?.price}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-bold rounded-lg transition-all font-inter uppercase tracking-wider"
            style={{ 
              backgroundColor: config.colors.buttonColor,
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>

          {/* Info */}
          <p className="text-xs text-center mt-4 font-inter" style={{ color: config.colors.secondary }}>
            You'll be connected to WhatsApp for confirmation. Our team will reach out shortly.
          </p>
        </form>
      </div>
    </div>
  );
}
