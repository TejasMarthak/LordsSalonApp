import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, DeleteIcon, LoadingIcon } from '../../utils/Icons';

export default function SettingsManager() {
  const [userInfo, setUserInfo] = useState({
    name: 'Admin',
    email: 'admin@lords-salon.com',
  });

  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Tuesday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Wednesday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Thursday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Friday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Saturday', open: '11:00', close: '21:00', isClosed: false },
    { day: 'Sunday', open: '12:00', close: '19:00', isClosed: false },
  ]);

  const [featureToggles, setFeatureToggles] = useState({
    discountsEnabled: true,
    ratingsEnabled: true,
    bookingEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch admin info
        const adminRes = await axios.get(`${adminConfig.api.baseUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (adminRes.data) {
          setUserInfo({
            name: adminRes.data.name || 'Admin',
            email: adminRes.data.email || 'admin@lords-salon.com',
          });
        }
        
        // Fetch site settings
        const settingsRes = await axios.get(`${adminConfig.api.baseUrl}/api/site-settings`);
        // Only use API businessHours if they exist and are not empty
        if (settingsRes.data.businessHours && settingsRes.data.businessHours.length > 0) {
          setBusinessHours(settingsRes.data.businessHours);
        }
        // Load feature toggles
        if (settingsRes.data.featureToggles) {
          setFeatureToggles(settingsRes.data.featureToggles);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleUserInfoChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessHourChange = (index, field, value) => {
    const newHours = [...businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setBusinessHours(newHours);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('Session expired. Please login again.');
        setSaving(false);
        return;
      }

      // Save user info (name and email)
      if (userInfo.name || userInfo.email) {
        try {
          await axios.put(
            `${adminConfig.api.baseUrl}/api/auth/update-profile`,
            { 
              name: userInfo.name,
              email: userInfo.email 
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (profileErr) {
          // If email update fails because email is not updatable, just log it
          console.error('Profile update error:', profileErr);
          if (profileErr.response?.status !== 400) {
            setError(profileErr.response?.data?.error || 'Failed to save profile');
            setSaving(false);
            return;
          }
        }
      }

      // Save business hours
      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        { businessHours, featureToggles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const confirmPassword = prompt('Enter your password to confirm account deletion:');
      
      if (!confirmPassword) {
        setError('Deletion cancelled');
        setSaving(false);
        return;
      }

      await axios.delete(
        `${adminConfig.api.baseUrl}/api/admin/account`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { password: confirmPassword }
        }
      );

      setSuccess('Account deleted successfully. Redirecting...');
      localStorage.removeItem('adminToken');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIcon size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-4 sm:p-5 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm opacity-90">
          Manage your account information and business hours
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

      {/* User Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
          Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <AdminInput
            label="Name"
            type="text"
            value={userInfo.name}
            onChange={(e) => handleUserInfoChange('name', e.target.value)}
            placeholder="Your name"
          />

          <AdminInput
            label="Email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleUserInfoChange('email', e.target.value)}
            placeholder="admin@lordssalon.com"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
          Feature Management
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {/* Discounts Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                Enable Discounts
              </p>
              <p className="text-xs text-gray-600 mt-1">Show discount section on website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featureToggles.discountsEnabled}
                onChange={(e) => setFeatureToggles({ ...featureToggles, discountsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Ratings Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                Enable Ratings
              </p>
              <p className="text-xs text-gray-600 mt-1">Show client reviews on website</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featureToggles.ratingsEnabled}
                onChange={(e) => setFeatureToggles({ ...featureToggles, ratingsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Booking Toggle */}
          <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                Enable Bookings
              </p>
              <p className="text-xs text-gray-600 mt-1">Allow customers to book appointments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={featureToggles.bookingEnabled}
                onChange={(e) => setFeatureToggles({ ...featureToggles, bookingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 md:p-6">
        <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-5 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
          Business Hours
        </h2>

        <div className="space-y-2 sm:space-y-3">
          {businessHours.map((hour, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                <label className="font-bold text-xs sm:text-sm min-w-20 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                  {hour.day}
                </label>

                {!hour.isClosed ? (
                  <>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => handleBusinessHourChange(index, 'open', e.target.value)}
                      className="px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                    />
                    <span className="font-bold text-xs sm:text-sm hidden sm:inline" style={{ color: adminConfig.colors.primary }}>to</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => handleBusinessHourChange(index, 'close', e.target.value)}
                      className="px-2 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                    />
                  </>
                ) : (
                  <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-red-600">
                    Closed
                  </span>
                )}

                <label className="flex items-center gap-1.5 cursor-pointer sm:ml-auto">
                  <input
                    type="checkbox"
                    checked={hour.isClosed}
                    onChange={(e) => handleBusinessHourChange(index, 'isClosed', e.target.checked)}
                    className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer accent-black border border-gray-300 rounded"
                  />
                  <span className="font-bold text-xs sm:text-sm uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>Closed</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button */}
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
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Delete Account Card */}
      <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 sm:p-5 md:p-6">
        <h3 className="font-playfair font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-red-700 uppercase tracking-wider">
          Delete Account
        </h3>
        <p className="font-bold text-xs sm:text-sm mb-3 text-red-600 uppercase tracking-wider">
          Permanently delete your account and all associated data
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all text-white bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <DeleteIcon size={14} color="white" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div 
            className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full"
            style={{ backgroundColor: adminConfig.colors.background }}
          >
            <h3 className="font-playfair text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: adminConfig.colors.primary }}>
              Delete Account?
            </h3>
            <p className="font-inter text-xs sm:text-sm mb-4" style={{ color: adminConfig.colors.textLight }}>
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 sm:px-4 py-2 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all"
                style={{
                  backgroundColor: adminConfig.colors.border,
                  color: adminConfig.colors.text,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving}
                className="flex-1 px-3 sm:px-4 py-2 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-1"
              >
                {saving ? (
                  <>
                    <LoadingIcon size={12} color="white" />
                    <span className="hidden sm:inline">Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
