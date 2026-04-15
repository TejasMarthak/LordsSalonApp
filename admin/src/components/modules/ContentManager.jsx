import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AlertIcon, SuccessIcon, SaveIcon } from '../../utils/Icons';

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
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Content Management</h1>
        <p className="text-gray-300">
          Edit all text content and manage sections across your website
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div 
            className="rounded-2xl border border-gray-200 p-6 space-y-2 bg-white"
          >
            <h3 className="font-bold text-lg mb-6 text-black uppercase tracking-wider">
              Sections
            </h3>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className="w-full text-left px-6 py-3 rounded-lg transition-all font-bold text-sm uppercase tracking-wider"
                style={{
                  backgroundColor: selectedSection === section.id ? '#000000' : 'transparent',
                  color: selectedSection === section.id ? '#FFFFFF' : '#000000',
                  borderWidth: selectedSection === section.id ? '0' : '1px',
                  borderColor: selectedSection === section.id ? 'transparent' : '#E5E5E5',
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
            className="rounded-2xl border border-gray-200 p-8 bg-white"
          >
            <h3 className="font-bold text-2xl mb-8 text-black">
              {sections.find((s) => s.id === selectedSection)?.title}
            </h3>

            <div className="space-y-8">
              {/* Hero Section Content */}
              {selectedSection === 'hero' && (
                <>
                  <div>
                    <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={editingContent.headline || ''}
                      onChange={(e) => handleContentChange('headline', e.target.value)}
                      placeholder="e.g., Elevate Your Beauty"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">
                      Subheadline
                    </label>
                    <textarea
                      value={editingContent.subheadline || ''}
                      onChange={(e) => handleContentChange('subheadline', e.target.value)}
                      placeholder="e.g., Professional makeup and styling..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editingContent.ctaText || ''}
                      onChange={(e) => handleContentChange('ctaText', e.target.value)}
                      placeholder="e.g., Book Appointment"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400"
                    />
                  </div>
                </>
              )}

              {/* Services Section Content */}
              {selectedSection === 'services' && (
                <div>
                  <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">
                    Services Description
                  </label>
                  <textarea
                    value={editingContent.description || ''}
                    onChange={(e) => handleContentChange('description', e.target.value)}
                    placeholder="Edit services section content..."
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none"
                  />
                </div>
              )}

              {/* Generic Content */}
              {selectedSection !== 'hero' && selectedSection !== 'services' && (
                <div>
                  <label className="block font-bold text-sm mb-3 text-black uppercase tracking-wider">
                    Section Content
                  </label>
                  <textarea
                    value={editingContent.content || ''}
                    onChange={(e) => handleContentChange('content', e.target.value)}
                    placeholder="Edit section content..."
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black placeholder-gray-400 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-8 w-full px-8 py-4 font-bold text-sm uppercase tracking-wider rounded-lg transition-all text-white bg-black hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
