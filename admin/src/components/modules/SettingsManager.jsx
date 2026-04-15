import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, DeleteIcon } from '../../utils/Icons';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    contact: { phone: '', email: '', address: '', latitude: '', longitude: '' },
    social: { instagram: '', facebook: '', whatsapp: '', twitter: '' },
    businessHours: [
      { day: 'Monday', open: '10:00', close: '20:00', isClosed: false },
      { day: 'Tuesday', open: '10:00', close: '20:00', isClosed: false },
      { day: 'Wednesday', open: '10:00', close: '20:00', isClosed: false },
      { day: 'Thursday', open: '10:00', close: '20:00', isClosed: false },
      { day: 'Friday', open: '10:00', close: '20:00', isClosed: false },
      { day: 'Saturday', open: '11:00', close: '21:00', isClosed: false },
      { day: 'Sunday', open: '12:00', close: '19:00', isClosed: false },
    ],
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
        const response = await axios.get(`${adminConfig.api.baseUrl}/api/site-settings`);
        setSettings((prev) => ({
          ...prev,
          contact: response.data.contact || prev.contact,
          social: response.data.social || prev.social,
          businessHours: response.data.businessHours || prev.businessHours,
        }));
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleContactChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSocialChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
  };

  const handleBusinessHourChange = (index, field, value) => {
    const newHours = [...settings.businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setSettings((prev) => ({ ...prev, businessHours: newHours }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        settings,
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

      setSuccess('Account deleted successfully. Logging out...');
      localStorage.removeItem('adminToken');
      setTimeout(() => {
        window.location.href = '/';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Business Settings</h1>
        <p className="text-gray-300">
          Manage your salon information, contact details, business hours, and social media
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-3">
          <AlertIcon size={20} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-3">
          <SuccessIcon size={20} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Contact Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h3 className="font-bold text-2xl mb-8 text-black uppercase tracking-wider">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Phone"
            type="tel"
            value={settings.contact.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />

          <AdminInput
            label="Email"
            type="email"
            value={settings.contact.email}
            onChange={(e) => handleContactChange('email', e.target.value)}
            placeholder="contact@salon.com"
          />

          <AdminInput
            label="Address"
            type="textarea"
            value={settings.contact.address}
            onChange={(e) => handleContactChange('address', e.target.value)}
            placeholder="123 Main Street, City, State 12345"
            rows={3}
            className="md:col-span-2"
          />

          <AdminInput
            label="Latitude (for Map)"
            type="number"
            step="0.00001"
            value={settings.contact.latitude}
            onChange={(e) => handleContactChange('latitude', e.target.value)}
            placeholder="40.7128"
          />

          <AdminInput
            label="Longitude (for Map)"
            type="number"
            step="0.00001"
            value={settings.contact.longitude}
            onChange={(e) => handleContactChange('longitude', e.target.value)}
            placeholder="-74.0060"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h3 className="font-bold text-2xl mb-8 text-black uppercase tracking-wider">
          Social Media Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminInput
            label="Instagram"
            type="url"
            value={settings.social.instagram}
            onChange={(e) => handleSocialChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yoursalon"
          />

          <AdminInput
            label="Facebook"
            type="url"
            value={settings.social.facebook}
            onChange={(e) => handleSocialChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yoursalon"
          />

          <AdminInput
            label="WhatsApp"
            type="tel"
            value={settings.social.whatsapp}
            onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />

          <AdminInput
            label="Twitter"
            type="url"
            value={settings.social.twitter}
            onChange={(e) => handleSocialChange('twitter', e.target.value)}
            placeholder="https://twitter.com/yoursalon"
          />
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <h3 className="font-bold text-2xl mb-8 text-black uppercase tracking-wider">
          Business Hours
        </h3>

        <div className="space-y-4">
          {settings.businessHours.map((hour, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="font-bold text-sm min-w-24 text-black uppercase tracking-wider">
                  {hour.day}
                </label>

                {!hour.isClosed ? (
                  <>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => handleBusinessHourChange(index, 'open', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                    />
                    <span className="font-bold text-black">to</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => handleBusinessHourChange(index, 'close', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                    />
                  </>
                ) : (
                  <span className="font-bold text-red-600 uppercase tracking-wider">
                    Closed
                  </span>
                )}

                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={hour.isClosed}
                    onChange={(e) => handleBusinessHourChange(index, 'isClosed', e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-black border border-gray-300 rounded"
                  />
                  <span className="font-bold text-sm text-black uppercase tracking-wider">Closed</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-8">
        <h3 className="font-bold text-lg mb-4 text-red-700 uppercase tracking-wider">
          Danger Zone
        </h3>
        <p className="font-bold text-sm mb-6 text-red-600">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full px-6 py-4 font-bold text-sm uppercase tracking-wider rounded-lg transition-all text-white bg-red-600 hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <AdminButton
          onClick={handleSave}
          loading={saving}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Save All Settings
        </AdminButton>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg p-8 max-w-md w-full"
            style={{ backgroundColor: adminConfig.colors.background }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
              Delete Account?
            </h3>
            <p className="font-inter text-sm mb-6" style={{ color: adminConfig.colors.textLight }}>
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <AdminButton
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </AdminButton>
              <AdminButton
                onClick={handleDeleteAccount}
                loading={saving}
                variant="danger"
                className="flex-1"
              >
                Delete
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
