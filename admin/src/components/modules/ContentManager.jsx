import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Content Management
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Edit all text content and manage sections across your website
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div 
            className="rounded-lg border p-4 space-y-2"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-lg font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
              Sections
            </h3>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className="w-full text-left px-4 py-3 rounded-lg transition-all font-inter text-sm"
                style={{
                  backgroundColor: selectedSection === section.id ? adminConfig.colors.accent : 'transparent',
                  color: selectedSection === section.id ? adminConfig.colors.white : adminConfig.colors.primary,
                  borderColor: adminConfig.colors.border,
                  borderWidth: selectedSection === section.id ? 0 : '1px',
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
            className="rounded-lg border p-6"
            style={{
              backgroundColor: adminConfig.colors.background,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
              {sections.find((s) => s.id === selectedSection)?.title}
            </h3>

            <div className="space-y-6">
              {/* Hero Section Content */}
              {selectedSection === 'hero' && (
                <>
                  <div>
                    <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                      Headline
                    </label>
                    <input
                      type="text"
                      value={editingContent.headline || ''}
                      onChange={(e) => handleContentChange('headline', e.target.value)}
                      placeholder="e.g., Elevate Your Beauty"
                      className="w-full px-4 py-2 border rounded-lg font-inter text-sm"
                      style={{
                        borderColor: adminConfig.colors.border,
                        color: adminConfig.colors.text,
                        backgroundColor: adminConfig.colors.background,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                      Subheadline
                    </label>
                    <textarea
                      value={editingContent.subheadline || ''}
                      onChange={(e) => handleContentChange('subheadline', e.target.value)}
                      placeholder="e.g., Professional makeup and styling..."
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg font-inter text-sm resize-none"
                      style={{
                        borderColor: adminConfig.colors.border,
                        color: adminConfig.colors.text,
                        backgroundColor: adminConfig.colors.background,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editingContent.ctaText || ''}
                      onChange={(e) => handleContentChange('ctaText', e.target.value)}
                      placeholder="e.g., Book Appointment"
                      className="w-full px-4 py-2 border rounded-lg font-inter text-sm"
                      style={{
                        borderColor: adminConfig.colors.border,
                        color: adminConfig.colors.text,
                        backgroundColor: adminConfig.colors.background,
                      }}
                    />
                  </div>
                </>
              )}

              {/* Services Section Content */}
              {selectedSection === 'services' && (
                <div>
                  <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                    Services Description
                  </label>
                  <textarea
                    value={editingContent.description || ''}
                    onChange={(e) => handleContentChange('description', e.target.value)}
                    placeholder="Edit services section content..."
                    rows="5"
                    className="w-full px-4 py-2 border rounded-lg font-inter text-sm resize-none"
                    style={{
                      borderColor: adminConfig.colors.border,
                      color: adminConfig.colors.text,
                      backgroundColor: adminConfig.colors.background,
                    }}
                  />
                </div>
              )}

              {/* Generic Content */}
              {selectedSection !== 'hero' && selectedSection !== 'services' && (
                <div>
                  <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                    Section Content
                  </label>
                  <textarea
                    value={editingContent.content || ''}
                    onChange={(e) => handleContentChange('content', e.target.value)}
                    placeholder="Edit section content..."
                    rows="8"
                    className="w-full px-4 py-2 border rounded-lg font-inter text-sm resize-none"
                    style={{
                      borderColor: adminConfig.colors.border,
                      color: adminConfig.colors.text,
                      backgroundColor: adminConfig.colors.background,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 w-full px-4 py-3 font-inter text-sm font-semibold uppercase tracking-wider rounded-lg transition-all"
              style={{
                backgroundColor: adminConfig.colors.accent,
                color: adminConfig.colors.white,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
