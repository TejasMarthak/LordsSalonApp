import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import ImageUploadManager from './ImageUploadManager';

export default function SiteAppearance({ admin }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('branding');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${adminConfig.api.baseUrl}/api/site-settings`
      );
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!settings) {
    return <div>Error loading settings</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold mb-2" style={{ color: adminConfig.colors.primary }}>
          Site Appearance
        </h2>
        <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
          Customize colors, branding, backgrounds, and appearance
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
          <p className="font-inter text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto" style={{ borderBottomColor: adminConfig.colors.border }}>
        {['branding', 'colors', 'backgrounds', 'contact'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-3 border-b-2 font-inter font-semibold text-sm capitalize transition-colors whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === tab ? adminConfig.colors.accent : 'transparent',
              color: activeTab === tab ? adminConfig.colors.primary : adminConfig.colors.textLight,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-4">
          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Site Name
            </label>
            <input
              type="text"
              value={settings.branding?.siteName || ''}
              onChange={(e) => handleInputChange('branding', 'siteName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Tagline
            </label>
            <input
              type="text"
              value={settings.branding?.tagline || ''}
              onChange={(e) => handleInputChange('branding', 'tagline', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Logo Image
            </label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('branding', 'logo', imageData.imageId)}
              location="branding"
            />
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          {[
            { key: 'primaryColor', label: 'Primary Color' },
            { key: 'secondaryColor', label: 'Secondary Color' },
            { key: 'accentColor', label: 'Accent Color' },
            { key: 'backgroundColor', label: 'Background Color' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                {label}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance?.[key] || '#FFFFFF'}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer border"
                  style={{ borderColor: adminConfig.colors.border }}
                />
                <input
                  type="text"
                  value={settings.appearance?.[key] || '#FFFFFF'}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: adminConfig.colors.border }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Backgrounds Tab */}
      {activeTab === 'backgrounds' && (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={settings.appearance?.useGlobalBackground || false}
                onChange={(e) => handleInputChange('appearance', 'useGlobalBackground', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-inter font-semibold" style={{ color: adminConfig.colors.primary }}>
                Use Global Background Image
              </span>
            </label>
          </div>

          {settings.appearance?.useGlobalBackground && (
            <div>
              <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Global Background Image
              </label>
              <ImageUploadManager
                onImageSelect={(imageData) => handleInputChange('appearance', 'globalBackground', imageData.imageId)}
                location="background"
              />
            </div>
          )}

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Header Background Image (Optional)
            </label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('appearance', 'headerBackground', imageData.imageId)}
              location="header"
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Footer Background Image (Optional)
            </label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('appearance', 'footerBackground', imageData.imageId)}
              location="footer"
            />
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Phone
            </label>
            <input
              type="tel"
              value={settings.contact?.phone || ''}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Email
            </label>
            <input
              type="email"
              value={settings.contact?.email || ''}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
              Address
            </label>
            <input
              type="text"
              value={settings.contact?.address || ''}
              onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.contact?.latitude || ''}
                onChange={(e) => handleInputChange('contact', 'latitude', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: adminConfig.colors.border }}
              />
            </div>
            <div>
              <label className="block font-inter font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={settings.contact?.longitude || ''}
                onChange={(e) => handleInputChange('contact', 'longitude', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: adminConfig.colors.border }}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t pt-4" style={{ borderTopColor: adminConfig.colors.border }}>
            <h4 className="font-inter font-semibold mb-3" style={{ color: adminConfig.colors.primary }}>
              Social Media Links
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-inter text-sm mb-2" style={{ color: adminConfig.colors.primary }}>
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.social?.instagram || ''}
                  onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: adminConfig.colors.border }}
                />
              </div>
              <div>
                <label className="block font-inter text-sm mb-2" style={{ color: adminConfig.colors.primary }}>
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.social?.facebook || ''}
                  onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: adminConfig.colors.border }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t" style={{ borderTopColor: adminConfig.colors.border }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-6 py-3 rounded-lg font-inter font-semibold text-white transition-all"
          style={{ backgroundColor: adminConfig.colors.accent, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
