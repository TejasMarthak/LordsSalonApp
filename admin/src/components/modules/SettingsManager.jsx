import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: adminConfig.colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Business Settings
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Manage your salon information, contact details, business hours, and social media
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div 
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#FFF5F5',
            borderLeftColor: adminConfig.colors.warning,
          }}
        >
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.warning }}>
            ❌ {error}
          </p>
        </div>
      )}

      {success && (
        <div 
          className="p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#F0FDF4',
            borderLeftColor: adminConfig.colors.success,
          }}
        >
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.success }}>
            ✅ {success}
          </p>
        </div>
      )}

      {/* Contact Information */}
      <div 
        className="rounded-lg border p-6"
        style={{
          backgroundColor: adminConfig.colors.background,
          borderColor: adminConfig.colors.border,
        }}
      >
        <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
          📞 Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div 
        className="rounded-lg border p-6"
        style={{
          backgroundColor: adminConfig.colors.background,
          borderColor: adminConfig.colors.border,
        }}
      >
        <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
          🌐 Social Media Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div 
        className="rounded-lg border p-6"
        style={{
          backgroundColor: adminConfig.colors.background,
          borderColor: adminConfig.colors.border,
        }}
      >
        <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
          ⏰ Business Hours
        </h3>

        <div className="space-y-4">
          {settings.businessHours.map((hour, index) => (
            <div key={index} className="border rounded-lg p-4" style={{ borderColor: adminConfig.colors.border }}>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="font-inter font-semibold min-w-24" style={{ color: adminConfig.colors.primary }}>
                  {hour.day}
                </label>

                {!hour.isClosed ? (
                  <>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => handleBusinessHourChange(index, 'open', e.target.value)}
                      className="px-3 py-2 border rounded-lg font-inter text-sm"
                      style={{ borderColor: adminConfig.colors.border }}
                    />
                    <span className="font-inter">to</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => handleBusinessHourChange(index, 'close', e.target.value)}
                      className="px-3 py-2 border rounded-lg font-inter text-sm"
                      style={{ borderColor: adminConfig.colors.border }}
                    />
                  </>
                ) : (
                  <span className="font-inter font-semibold" style={{ color: adminConfig.colors.warning }}>
                    CLOSED
                  </span>
                )}

                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={hour.isClosed}
                    onChange={(e) => handleBusinessHourChange(index, 'isClosed', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="font-inter text-sm">Closed</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div 
        className="rounded-lg border p-6"
        style={{
          backgroundColor: '#FFF5F5',
          borderColor: adminConfig.colors.warning,
        }}
      >
        <h3 className="font-playfair text-lg font-bold mb-4" style={{ color: adminConfig.colors.warning }}>
          Danger Zone
        </h3>
        <p className="font-inter text-sm mb-4" style={{ color: adminConfig.colors.textLight }}>
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full px-4 py-3 font-inter text-sm font-semibold uppercase tracking-wider rounded-lg transition-all"
          style={{
            backgroundColor: adminConfig.colors.warning,
            color: adminConfig.colors.white,
          }}
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
