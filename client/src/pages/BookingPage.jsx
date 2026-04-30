import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

export default function BookingPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    selectedService: '',
    numberOfPersons: 1,
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
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/api/services`);
        if (response.data && Array.isArray(response.data)) {
          setServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Handle phone number - only accept digits and limit to 10
    if (name === 'clientPhone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits only (no +91 prefix in storage)
      updatedValue = digitsOnly.slice(0, 10);
    }

    // Handle email - convert to lowercase
    if (name === 'clientEmail') {
      updatedValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPersons' ? parseInt(value) : updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate all required fields (email is optional now)
      if (!formData.selectedService || !formData.clientName || !formData.clientPhone || !formData.bookingDate || !formData.bookingTime) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate email if provided
      if (formData.clientEmail) {
        const allowedDomains = ['gmail.com', 'yahoo.com', 'rediffmail.com'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.clientEmail)) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        const emailDomain = formData.clientEmail.split('@')[1].toLowerCase();
        if (!allowedDomains.includes(emailDomain)) {
          setError('Please use Gmail, Yahoo, or Rediffmail address');
          setLoading(false);
          return;
        }
      }

      // Validate phone format - should have exactly 10 digits
      if (formData.clientPhone.length !== 10 || !/^\d{10}$/.test(formData.clientPhone)) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }

      // Find selected service details
      const selectedServiceObj = services.find(s => s._id === formData.selectedService);
      if (!selectedServiceObj) {
        setError('Please select a valid service');
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
        clientPhone: `+91${formData.clientPhone}`,
        serviceId: selectedServiceObj._id,
        serviceName: selectedServiceObj.name,
        bookingDate: bookingDateTime.toISOString(),
        duration: selectedServiceObj.duration || 60,
        numberOfPersons: formData.numberOfPersons,
        notes: formData.notes,
        status: 'pending',
        paymentStatus: 'pending',
        createdFrom: 'website',
      };

      const response = await axios.post(`${config.api.baseUrl}/api/bookings`, bookingData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess('✅ Booking successful! You will be connected to WhatsApp for confirmation. Our team will reach out shortly.');

      setTimeout(() => {
        // Try to open WhatsApp if available
        if (formData.clientPhone) {
          const whatsappNumber = `91${formData.clientPhone}`;
          const message = `Hi! I would like to book ${selectedServiceObj.name} for ${formData.numberOfPersons} person(s) on ${formData.bookingDate} at ${formData.bookingTime}`;
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        }
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceObj = services.find(s => s._id === formData.selectedService);
  const totalPrice = selectedServiceObj ? (selectedServiceObj.price || 0) * formData.numberOfPersons : 0;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-medium mb-6 transition-all hover:gap-3"
            style={{ color: config.colors.primary }}
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-playfair font-bold mb-2" style={{ color: config.colors.primary }}>
            Book Your Appointment
          </h1>
          <p className="text-gray-600 font-inter">Fill in your details below to schedule your service</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              {error && (
                <div
                  className="p-4 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: '#FFEBEE',
                    color: '#C62828',
                    borderLeftWidth: '4px',
                    borderLeftColor: '#C62828',
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="p-4 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: '#E8F5E9',
                    color: '#1B5E20',
                    borderLeftWidth: '4px',
                    borderLeftColor: '#1B5E20',
                  }}
                >
                  {success}
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                  Select Service *
                </label>
                {loadingServices ? (
                  <div className="p-4 text-center text-gray-500">Loading services...</div>
                ) : (
                  <select
                    name="selectedService"
                    value={formData.selectedService}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  >
                    <option value="">Choose a service...</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} ({service.duration}min) - ₹{service.price}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Number of Persons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Number of Persons *
                  </label>
                  <input
                    type="number"
                    name="numberOfPersons"
                    value={formData.numberOfPersons}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Email <span style={{ color: '#999', fontSize: '0.85em' }}>(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    placeholder="your@gmail.com"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted: Gmail, Yahoo, Rediffmail</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Phone Number * <span style={{ color: '#999', fontSize: '0.85em' }}>(10 digits)</span>
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                    min={today}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                    style={{
                      borderColor: config.colors.border,
                      focusRingColor: config.colors.accent,
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: config.colors.primary }}>
                  Special Requests or Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or preferences..."
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-base"
                  style={{
                    borderColor: config.colors.border,
                    focusRingColor: config.colors.accent,
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 text-white font-semibold text-lg rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.colors.buttonColor }}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-32">
              <h3 className="text-xl font-playfair font-bold mb-6" style={{ color: config.colors.primary }}>
                Booking Summary
              </h3>

              {selectedServiceObj ? (
                <div className="space-y-6">
                  {/* Service Details */}
                  <div className="pb-6 border-b" style={{ borderColor: config.colors.border }}>
                    <p className="text-sm text-gray-600 mb-2">SERVICE</p>
                    <p className="font-semibold text-lg mb-3" style={{ color: config.colors.primary }}>
                      {selectedServiceObj.name}
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{selectedServiceObj.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span className="font-medium">₹{selectedServiceObj.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  {formData.bookingDate && (
                    <div className="pb-6 border-b" style={{ borderColor: config.colors.border }}>
                      <p className="text-sm text-gray-600 mb-3">BOOKING DETAILS</p>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{formData.bookingDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{formData.bookingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Persons:</span>
                          <span className="font-medium">{formData.numberOfPersons}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Base Price:</span>
                        <span>₹{selectedServiceObj.price}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>× {formData.numberOfPersons} Person{formData.numberOfPersons > 1 ? 's' : ''}:</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>

                    <div
                      className="mt-4 pt-4 border-t flex justify-between items-center"
                      style={{ borderColor: config.colors.border }}
                    >
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl" style={{ color: config.colors.buttonColor }}>
                        ₹{totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">Select a service to view summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
