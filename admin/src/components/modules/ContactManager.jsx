import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, LoadingIcon } from '../../utils/Icons';

export default function ContactManager() {
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [social, setSocial] = useState({
    instagram: '',
    facebook: '',
    whatsapp: '',
    twitter: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load contact info on mount
  useEffect(() => {
    const loadContact = async () => {
      try {
        const response = await axios.get(`${adminConfig.api.baseUrl}/api/site-settings`);
        if (response.data.contact) {
          setContact(response.data.contact);
        }
        if (response.data.social) {
          setSocial(response.data.social);
        }
      } catch (err) {
        console.error('Failed to load contact info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const handleContactChange = (field, value) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (field, value) => {
    setSocial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        { contact, social },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Contact information saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingIcon size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-4 sm:p-5 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">
          Contact Information
        </h1>
        <p className="text-xs sm:text-sm opacity-90">
          Manage your business contact details and social media links
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-2">
          <AlertIcon size={18} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 break-words">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-2">
          <SuccessIcon size={18} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-700 break-words">{success}</p>
        </div>
      )}

      {/* Contact Information Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
          Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <AdminInput
            label="Phone Number"
            type="tel"
            value={contact.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            placeholder="+91 9876543210"
          />

          <AdminInput
            label="Email Address"
            type="email"
            value={contact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            placeholder="contact@lordssalon.com"
          />

          <div className="md:col-span-2">
            <AdminInput
              label="Business Address"
              type="textarea"
              value={contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="123 Main Street, City, State 12345"
              rows={3}
            />
          </div>

          <AdminInput
            label="Latitude (Map Location)"
            type="number"
            step="0.00001"
            value={contact.latitude}
            onChange={(e) => handleContactChange('latitude', e.target.value)}
            placeholder="40.7128"
          />

          <AdminInput
            label="Longitude (Map Location)"
            type="number"
            step="0.00001"
            value={contact.longitude}
            onChange={(e) => handleContactChange('longitude', e.target.value)}
            placeholder="-74.0060"
          />
        </div>
      </div>

      {/* Social Media Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
          Social Media Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <AdminInput
            label="Instagram URL"
            type="url"
            value={social.instagram}
            onChange={(e) => handleSocialChange('instagram', e.target.value)}
            placeholder="https://instagram.com/lordssalon"
          />

          <AdminInput
            label="Facebook URL"
            type="url"
            value={social.facebook}
            onChange={(e) => handleSocialChange('facebook', e.target.value)}
            placeholder="https://facebook.com/lordssalon"
          />

          <AdminInput
            label="WhatsApp Number"
            type="tel"
            value={social.whatsapp}
            onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
            placeholder="+91 9876543210"
          />

          <AdminInput
            label="Twitter URL"
            type="url"
            value={social.twitter}
            onChange={(e) => handleSocialChange('twitter', e.target.value)}
            placeholder="https://twitter.com/lordssalon"
          />
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all text-white hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: adminConfig.colors.primary }}
        >
          {saving ? (
            <>
              <LoadingIcon size={14} color="white" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon size={14} color="white" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
