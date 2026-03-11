import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    salonName: '',
    phone: '',
    email: '',
    address: '',
    hours: 'Mon-Fri: 10am-8pm, Sat: 11am-9pm, Sun: 12pm-7pm',
    instagram: '',
    facebook: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${adminConfig.api.baseUrl}/api/settings`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const confirmPassword = prompt('Enter your password to confirm account deletion:');
      
      if (!confirmPassword) {
        setError('Deletion cancelled');
        setLoading(false);
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
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Business Settings
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Manage your salon information and account settings
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salon Information */}
        <div 
          className="rounded-lg border p-6"
          style={{
            backgroundColor: adminConfig.colors.background,
            borderColor: adminConfig.colors.border,
          }}
        >
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Salon Information
          </h3>

          <div className="space-y-4">
            <AdminInput
              label="Salon Name"
              type="text"
              value={settings.salonName}
              onChange={(e) => handleSettingChange('salonName', e.target.value)}
              placeholder="Enter your salon name"
            />

            <AdminInput
              label="Phone"
              type="tel"
              value={settings.phone}
              onChange={(e) => handleSettingChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />

            <AdminInput
              label="Email"
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              placeholder="contact@salon.com"
            />

            <AdminInput
              label="Address"
              type="textarea"
              value={settings.address}
              onChange={(e) => handleSettingChange('address', e.target.value)}
              placeholder="Enter your salon address"
              rows={3}
            />

            <AdminInput
              label="Business Hours"
              type="text"
              value={settings.hours}
              onChange={(e) => handleSettingChange('hours', e.target.value)}
              placeholder="Mon-Fri: 10am-8pm, Sat: 11am-9pm, Sun: 12pm-7pm"
            />
          </div>
        </div>

        {/* Social Media & Account */}
        <div className="space-y-8">
          {/* Social Media Links */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: adminConfig.colors.background,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
              Social Media
            </h3>

            <div className="space-y-4">
              <AdminInput
                label="Instagram"
                type="url"
                value={settings.instagram}
                onChange={(e) => handleSettingChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yoursalon"
              />

              <AdminInput
                label="Facebook"
                type="url"
                value={settings.facebook}
                onChange={(e) => handleSettingChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yoursalon"
              />

              <AdminInput
                label="WhatsApp"
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => handleSettingChange('whatsapp', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
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
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <AdminButton
          onClick={handleSave}
          loading={loading}
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
                loading={loading}
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
