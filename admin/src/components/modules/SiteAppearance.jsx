import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import ImageUploadManager from './ImageUploadManager';
import { SuccessIcon, AlertIcon } from '../../utils/Icons';

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
      const response = await axios.get(`${adminConfig.api.baseUrl}/api/site-settings`);
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
      await axios.put(`${adminConfig.api.baseUrl}/api/site-settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>;
  }

  if (!settings) {
    return <div className="text-center py-12 text-red-600">Error loading settings</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Site Appearance</h1>
        <p className="text-gray-300">Customize colors, branding, backgrounds, and appearance</p>
      </div>

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-3">
          <SuccessIcon size={20} color="#22863A" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {['branding', 'colors', 'backgrounds', 'contact'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-6 py-4 border-b-2 font-bold text-sm capitalize transition-colors whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === tab ? '#000000' : 'transparent',
              color: activeTab === tab ? '#000000' : '#666666',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'branding' && (
        <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Site Name</label>
            <input
              type="text"
              value={settings.branding?.siteName || ''}
              onChange={(e) => handleInputChange('branding', 'siteName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Tagline</label>
            <input
              type="text"
              value={settings.branding?.tagline || ''}
              onChange={(e) => handleInputChange('branding', 'tagline', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Logo Image</label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('branding', 'logo', imageData.imageId)}
              location="branding"
            />
          </div>
        </div>
      )}

      {activeTab === 'colors' && (
        <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
          {['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor'].map((key) => (
            <div key={key}>
              <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider capitalize">{key.replace('Color', ' Color')}</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.appearance?.[key] || '#FFFFFF'}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.appearance?.[key] || '#FFFFFF'}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'backgrounds' && (
        <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.appearance?.useGlobalBackground || false}
              onChange={(e) => handleInputChange('appearance', 'useGlobalBackground', e.target.checked)}
              className="w-5 h-5 accent-black"
            />
            <span className="font-bold text-sm text-black uppercase tracking-wider">Use Global Background</span>
          </label>

          {settings.appearance?.useGlobalBackground && (
            <div>
              <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Global Background</label>
              <ImageUploadManager
                onImageSelect={(imageData) => handleInputChange('appearance', 'globalBackground', imageData.imageId)}
                location="background"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Header Background</label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('appearance', 'headerBackground', imageData.imageId)}
              location="header"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Footer Background</label>
            <ImageUploadManager
              onImageSelect={(imageData) => handleInputChange('appearance', 'footerBackground', imageData.imageId)}
              location="footer"
            />
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6 bg-white rounded-2xl p-8 border border-gray-200">
          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Phone</label>
            <input
              type="tel"
              value={settings.contact?.phone || ''}
              onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={settings.contact?.email || ''}
              onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Address</label>
            <input
              type="text"
              value={settings.contact?.address || ''}
              onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={settings.contact?.latitude || ''}
                onChange={(e) => handleInputChange('contact', 'latitude', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              />
            </div>
            <div>
              <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={settings.contact?.longitude || ''}
                onChange={(e) => handleInputChange('contact', 'longitude', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-bold text-sm mb-6 text-black uppercase tracking-wider">Social Media</h4>
            <div className="space-y-6">
              <div>
                <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Instagram</label>
                <input
                  type="url"
                  value={settings.social?.instagram || ''}
                  onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">Facebook</label>
                <input
                  type="url"
                  value={settings.social?.facebook || ''}
                  onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-8 py-4 rounded-lg font-bold text-white text-sm uppercase tracking-wider bg-black hover:bg-gray-900 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
