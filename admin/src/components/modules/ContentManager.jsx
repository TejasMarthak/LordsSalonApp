import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AlertIcon, SuccessIcon, SaveIcon, LoadingIcon } from '../../utils/Icons';

export default function ContentManager() {
  const [sections, setSections] = useState([
    { id: 'hero', title: 'Hero Section', fields: [] },
    { id: 'services', title: 'Services Section', fields: [] },
    { id: 'portfolio', title: 'Portfolio Section', fields: [] },
    { id: 'footer', title: 'Footer', fields: [] },
  ]);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [editingContent, setEditingContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
    setError('');
  };

  const handleContentChange = (field, value) => {
    setEditingContent((prev) => ({
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
        `${adminConfig.api.baseUrl}/api/content/${selectedSection}`,
        editingContent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Content saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold mb-2">
          Content Management
        </h1>
        <p className="text-sm sm:text-base opacity-90">
          Edit all text content and manage sections across your website
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-3 animate-in">
          <AlertIcon size={20} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-3 animate-in">
          <SuccessIcon size={20} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1 h-fit">
          <div 
            className="rounded-lg border border-gray-200 p-4 sm:p-6 space-y-2 bg-white"
          >
            <h3 className="font-playfair font-bold text-base sm:text-lg mb-4 sm:mb-6 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
              Sections
            </h3>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all font-bold text-xs sm:text-sm uppercase tracking-wider"
                style={{
                  backgroundColor: selectedSection === section.id ? adminConfig.colors.primary : 'transparent',
                  color: selectedSection === section.id ? adminConfig.colors.white : adminConfig.colors.primary,
                  borderWidth: selectedSection === section.id ? '0' : '1px',
                  borderColor: selectedSection === section.id ? 'transparent' : adminConfig.colors.border,
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div 
            className="rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 bg-white"
          >
            <h3 className="font-playfair font-bold text-xl sm:text-2xl mb-4 sm:mb-8" style={{ color: adminConfig.colors.primary }}>
              {sections.find((s) => s.id === selectedSection)?.title}
            </h3>

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Hero Section Content */}
              {selectedSection === 'hero' && (
                <>
                  <div>
                    <label className="block font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                      Headline
                    </label>
                    <input
                      type="text"
                      value={editingContent.headline || ''}
                      onChange={(e) => handleContentChange('headline', e.target.value)}
                      placeholder="e.g., Elevate Your Beauty"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                      Subheadline
                    </label>
                    <textarea
                      value={editingContent.subheadline || ''}
                      onChange={(e) => handleContentChange('subheadline', e.target.value)}
                      placeholder="e.g., Professional makeup and styling..."
                      rows="3"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editingContent.ctaText || ''}
                      onChange={(e) => handleContentChange('ctaText', e.target.value)}
                      placeholder="e.g., Book Appointment"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Services Section Content */}
              {selectedSection === 'services' && (
                <div>
                  <label className="block font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                    Services Description
                  </label>
                  <textarea
                    value={editingContent.description || ''}
                    onChange={(e) => handleContentChange('description', e.target.value)}
                    placeholder="Edit services section content..."
                    rows="5"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none text-sm"
                  />
                </div>
              )}

              {/* Contact & Social Content */}
              {selectedSection === 'contact' && (
                <>
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>Contact Information</h4>
                    
                    <div>
                      <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editingContent.phone || ''}
                        onChange={(e) => handleContentChange('phone', e.target.value)}
                        placeholder="e.g., +91 9876543210"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editingContent.email || ''}
                        onChange={(e) => handleContentChange('email', e.target.value)}
                        placeholder="e.g., info@lordssalon.com"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Address
                      </label>
                      <textarea
                        value={editingContent.address || ''}
                        onChange={(e) => handleContentChange('address', e.target.value)}
                        placeholder="e.g., 123 Main Street, City, State"
                        rows="3"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: adminConfig.colors.primary }}>Social Media Links</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={editingContent.instagram || ''}
                          onChange={(e) => handleContentChange('instagram', e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={editingContent.facebook || ''}
                          onChange={(e) => handleContentChange('facebook', e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={editingContent.whatsapp || ''}
                          onChange={(e) => handleContentChange('whatsapp', e.target.value)}
                          placeholder="https://wa.me/..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-xs mb-2 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          value={editingContent.twitter || ''}
                          onChange={(e) => handleContentChange('twitter', e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Generic Content */}
              {selectedSection !== 'hero' && selectedSection !== 'services' && selectedSection !== 'contact' && (
                <div>
                  <label className="block font-bold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                    Section Content
                  </label>
                  <textarea
                    value={editingContent.content || ''}
                    onChange={(e) => handleContentChange('content', e.target.value)}
                    placeholder="Edit section content..."
                    rows="8"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none text-sm"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 sm:mt-8 w-full px-6 sm:px-8 py-3 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all text-white hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: adminConfig.colors.primary }}
            >
              {loading ? (
                <>
                  <LoadingIcon size={16} color="white" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon size={16} color="white" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
