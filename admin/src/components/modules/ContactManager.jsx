import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, LoadingIcon, AddIcon, DeleteIcon, EyeIcon } from '../../utils/Icons';

export default function ContactManager() {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [addresses, setAddresses] = useState([
    { id: 1, address: '', latitude: '', longitude: '', googleMapsLink: '' }
  ]);

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
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load contact info on mount
  useEffect(() => {
    const loadContact = async () => {
      try {
        // Get admin info
        const token = localStorage.getItem('adminToken');
        const adminRes = await axios.get(`${adminConfig.api.baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAdmin({
          name: adminRes.data.name || '',
          email: adminRes.data.email || '',
          phone: adminRes.data.phone || '',
        });

        // Get site settings for addresses and social
        const settingsRes = await axios.get(`${adminConfig.api.baseUrl}/api/site-settings`);
        
        if (settingsRes.data.addresses && settingsRes.data.addresses.length > 0) {
          setAddresses(settingsRes.data.addresses);
        }
        
        if (settingsRes.data.social) {
          setSocial(settingsRes.data.social);
        }
      } catch (err) {
        console.error('Failed to load contact info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const handleAdminChange = (field, value) => {
    setAdmin((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (id, field, value) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const handleAddAddress = () => {
    const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
    setAddresses((prev) => [
      ...prev,
      { id: newId, address: '', latitude: '', longitude: '', googleMapsLink: '' }
    ]);
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert('You must have at least one address');
      return;
    }
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSocialChange = (field, value) => {
    setSocial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/auth/update-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setShowPasswordReset(false);
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Save admin info
      await axios.put(
        `${adminConfig.api.baseUrl}/api/auth/update-profile`,
        { name: admin.name, phone: admin.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save addresses and social
      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        { addresses, social },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('All information saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save information');
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-4 sm:p-5 md:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">
          Contact Management
        </h1>
        <p className="text-xs sm:text-sm opacity-90">
          Manage business contact details, locations, and social media
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

      {/* ========== SECTION 1: CONTACT DETAILS ========== */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider text-black">
          📋 Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <AdminInput
            label="Name"
            type="text"
            value={admin.name}
            onChange={(e) => handleAdminChange('name', e.target.value)}
            placeholder="Your Name"
          />

          <AdminInput
            label="Phone Number"
            type="tel"
            value={admin.phone}
            onChange={(e) => handleAdminChange('phone', e.target.value)}
            placeholder="+91 9876543210"
          />

          <div className="md:col-span-2">
            <AdminInput
              label="Email Address"
              type="email"
              value={admin.email}
              disabled={true}
              placeholder="contact@lordssalon.com"
              title="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">Email address is read-only for security</p>
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowPasswordReset(!showPasswordReset)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 font-bold text-sm uppercase tracking-wider hover:border-gray-500 transition-all"
          >
            <EyeIcon size={16} />
            {showPasswordReset ? 'Hide' : 'Reset'} Password
          </button>

          {showPasswordReset && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 mb-3">
                Enter a new password below. Minimum 6 characters required.
              </p>
              
              {passwordError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 mb-3">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 mb-3">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Enter new password"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-black text-white font-bold text-xs uppercase rounded-lg hover:bg-gray-800 transition-all"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== SECTION 2: LOCATION DETAILS ========== */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="font-playfair font-bold text-lg sm:text-xl uppercase tracking-wider text-black">
            📍 Location Details
          </h2>
          <button
            type="button"
            onClick={handleAddAddress}
            className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-800 transition-all"
          >
            <AddIcon size={14} color="white" />
            Add Location
          </button>
        </div>

        <div className="space-y-6">
          {addresses.map((addr, index) => (
            <div
              key={addr.id}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all relative"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-sm text-black">
                  Location {index + 1}
                </h3>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-600 hover:text-red-700 font-bold text-xs flex items-center gap-1"
                  >
                    <DeleteIcon size={14} />
                    Delete
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <AdminInput
                    label="Business Address"
                    type="textarea"
                    value={addr.address}
                    onChange={(e) => handleAddressChange(addr.id, 'address', e.target.value)}
                    placeholder="123 Main Street, City, State 12345"
                    rows={2}
                  />
                </div>

                <AdminInput
                  label="Latitude"
                  type="number"
                  step="0.00001"
                  value={addr.latitude}
                  onChange={(e) => handleAddressChange(addr.id, 'latitude', e.target.value)}
                  placeholder="40.7128"
                />

                <AdminInput
                  label="Longitude"
                  type="number"
                  step="0.00001"
                  value={addr.longitude}
                  onChange={(e) => handleAddressChange(addr.id, 'longitude', e.target.value)}
                  placeholder="-74.0060"
                />

                <div className="md:col-span-2">
                  <AdminInput
                    label="Google Maps Link (Optional)"
                    type="url"
                    value={addr.googleMapsLink}
                    onChange={(e) => handleAddressChange(addr.id, 'googleMapsLink', e.target.value)}
                    placeholder="https://maps.google.com/?q=40.7128,-74.0060"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get link from Google Maps: right-click location → Share/Embed → Copy link
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SECTION 3: SOCIAL MEDIA LINKS ========== */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider text-black">
          🔗 Social Media Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <AdminInput
            label="Facebook URL"
            type="url"
            value={social.facebook}
            onChange={(e) => handleSocialChange('facebook', e.target.value)}
            placeholder="https://facebook.com/lordssalon"
          />

          <AdminInput
            label="Instagram URL"
            type="url"
            value={social.instagram}
            onChange={(e) => handleSocialChange('instagram', e.target.value)}
            placeholder="https://instagram.com/lordssalon"
          />

          <AdminInput
            label="WhatsApp Link"
            type="tel"
            value={social.whatsapp}
            onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
            placeholder="+91 9876543210"
          />

          <AdminInput
            label="Twitter/X URL"
            type="url"
            value={social.twitter}
            onChange={(e) => handleSocialChange('twitter', e.target.value)}
            placeholder="https://twitter.com/lordssalon"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 sm:px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-lg transition-all text-white hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 bg-black"
        >
          {saving ? (
            <>
              <LoadingIcon size={16} color="white" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon size={16} color="white" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
