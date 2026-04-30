import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, DeleteIcon, LoadingIcon, EditIcon } from '../../utils/Icons';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    duration: 60,
    notes: '',
    status: 'pending',
    paymentStatus: 'pending',
    createdFrom: 'website',
  });

  const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];
  const paymentStatusOptions = ['pending', 'completed', 'failed'];
  const createdFromOptions = ['website', 'whatsapp', 'phone', 'walk-in'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingsRes, servicesRes] = await Promise.all([
        axios.get(`${adminConfig.api.baseUrl}/api/bookings`, { headers }),
        axios.get(`${adminConfig.api.baseUrl}/api/services`, { headers }),
      ]);

      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      serviceId: '',
      bookingDate: '',
      bookingTime: '',
      duration: 60,
      notes: '',
      status: 'pending',
      paymentStatus: 'pending',
      createdFrom: 'website',
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (!formData.clientName || !formData.clientPhone || !formData.serviceId || !formData.bookingDate || !formData.bookingTime) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      const bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
      const selectedService = services.find(s => s._id === formData.serviceId);

      const data = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        serviceId: formData.serviceId,
        serviceName: selectedService?.name || 'Service',
        bookingDate: bookingDateTime,
        duration: parseInt(formData.duration),
        notes: formData.notes,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        totalPrice: selectedService?.price || 0,
        createdFrom: formData.createdFrom,
      };

      if (editingId) {
        await axios.put(
          `${adminConfig.api.baseUrl}/api/bookings/${editingId}`,
          data,
          { headers }
        );
        setSuccess('Booking updated successfully!');
      } else {
        await axios.post(
          `${adminConfig.api.baseUrl}/api/bookings`,
          data,
          { headers }
        );
        setSuccess('Booking created successfully!');
      }

      await loadData();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save booking');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (booking) => {
    // Handle serviceId - it could be a string or an object (from populate)
    const serviceId = typeof booking.serviceId === 'object' ? booking.serviceId._id : booking.serviceId;
    
    setFormData({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      serviceId: serviceId,
      bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0],
      bookingTime: new Date(booking.bookingDate).toTimeString().slice(0, 5),
      duration: booking.duration,
      notes: booking.notes,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdFrom: booking.createdFrom,
    });
    setEditingId(booking._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${adminConfig.api.baseUrl}/api/bookings/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Booking deleted successfully!');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete booking');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#0366D6',
      completed: '#22863A',
      cancelled: '#CB2431',
    };
    return colors[status] || '#6B6B6B';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIcon size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Booking Management</h1>
        <p className="text-sm opacity-90">Manage all appointments and bookings</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-2">
          <AlertIcon size={18} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-2">
          <SuccessIcon size={18} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="font-playfair text-xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            {editingId ? 'Edit Booking' : 'Add New Booking'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminInput
                label="Client Name"
                type="text"
                value={formData.clientName}
                onChange={(e) => handleFormChange('clientName', e.target.value)}
                placeholder="Client name"
                required
              />
              <AdminInput
                label="Email (Optional)"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleFormChange('clientEmail', e.target.value)}
                placeholder="client@example.com"
              />
              <AdminInput
                label="Phone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => handleFormChange('clientPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            {/* Service & Date */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Service
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleFormChange('serviceId', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: adminConfig.colors.border }}
                  required
                >
                  <option value="">Select Service</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <AdminInput
                label="Date"
                type="date"
                value={formData.bookingDate}
                onChange={(e) => handleFormChange('bookingDate', e.target.value)}
                required
              />

              <AdminInput
                label="Time"
                type="time"
                value={formData.bookingTime}
                onChange={(e) => handleFormChange('bookingTime', e.target.value)}
                required
              />

              <AdminInput
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleFormChange('duration', e.target.value)}
                min="15"
                step="15"
              />
            </div>

            {/* Status & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: adminConfig.colors.border }}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleFormChange('paymentStatus', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: adminConfig.colors.border }}
                >
                  {paymentStatusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Created From
                </label>
                <select
                  value={formData.createdFrom}
                  onChange={(e) => handleFormChange('createdFrom', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  style={{ borderColor: adminConfig.colors.border }}
                >
                  {createdFromOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Any special notes..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: adminConfig.colors.border }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: adminConfig.colors.primary }}
              >
                {saving ? (
                  <>
                    <LoadingIcon size={16} color="white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon size={16} color="white" />
                    {editingId ? 'Update Booking' : 'Create Booking'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-lg font-semibold border transition-all"
                style={{ borderColor: adminConfig.colors.border, color: adminConfig.colors.text }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 rounded-lg font-semibold text-white"
          style={{ backgroundColor: adminConfig.colors.primary }}
        >
          + Add New Booking
        </button>
      )}

      {/* Bookings Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: adminConfig.colors.lightBg }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Service</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Payment</th>
                <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center" style={{ color: adminConfig.colors.textLight }}>
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold" style={{ color: adminConfig.colors.text }}>{booking.clientName}</p>
                        <p className="text-xs" style={{ color: adminConfig.colors.textLight }}>{booking.clientEmail}</p>
                        <p className="text-xs" style={{ color: adminConfig.colors.textLight }}>{booking.clientPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: adminConfig.colors.text }}>
                      {booking.serviceName}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: adminConfig.colors.text }}>
                      {new Date(booking.bookingDate).toLocaleDateString()}<br/>
                      {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusBadgeColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusBadgeColor(booking.paymentStatus) }}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-all"
                        title="Edit"
                      >
                        <EditIcon size={16} color={adminConfig.colors.primary} />
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <DeleteIcon size={16} color="#CB2431" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
