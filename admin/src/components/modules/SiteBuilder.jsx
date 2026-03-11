import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AddIcon, EditIcon, DeleteIcon, EyeIcon } from '../../utils/Icons';

export default function SiteBuilder({ admin }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const availablePages = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'services', name: 'Services' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'contact', name: 'Contact' },
  ];

  const sectionTypes = [
    { type: 'hero', name: 'Hero Section' },
    { type: 'services', name: 'Services Grid' },
    { type: 'portfolio', name: 'Portfolio Gallery' },
    { type: 'testimonials', name: 'Testimonials' },
    { type: 'about', name: 'About Text' },
    { type: 'contact', name: 'Contact Form' },
    { type: 'custom-section', name: 'Custom Section' },
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (currentPage) {
      fetchPageContent();
    }
  }, [currentPage]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${adminConfig.api.baseUrl}/api/content/pages`
      );
      setPages(response.data);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async () => {
    try {
      const response = await axios.get(
        `${adminConfig.api.baseUrl}/api/content/pages/${currentPage}`
      );
      setSections(response.data?.sections || []);
    } catch (err) {
      console.error('Error fetching page content:', err);
    }
  };

  const addSection = async (sectionType) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/content/pages/${currentPage}/sections`,
        {
          type: sectionType,
          title: `New ${sectionType} Section`,
          isVisible: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSections([...sections, response.data]);
      setShowAddSection(false);
      setSuccess('Section added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add section');
    }
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${adminConfig.api.baseUrl}/api/content/pages/${currentPage}/sections/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSections(sections.filter((s) => s.sectionId !== sectionId));
      setSuccess('Section deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete section');
    }
  };

  const toggleSectionVisibility = async (sectionId, isVisible) => {
    try {
      const token = localStorage.getItem('adminToken');
      const section = sections.find((s) => s.sectionId === sectionId);
      
      await axios.put(
        `${adminConfig.api.baseUrl}/api/content/pages/${currentPage}/sections/${sectionId}`,
        { ...section, isVisible: !isVisible },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSections(
        sections.map((s) =>
          s.sectionId === sectionId ? { ...s, isVisible: !isVisible } : s
        )
      );
    } catch (err) {
      setError('Failed to update section');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p style={{ color: adminConfig.colors.textLight }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold mb-2" style={{ color: adminConfig.colors.primary }}>
          Website Builder
        </h2>
        <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
          Design and manage your website by adding, editing, and organizing sections
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#FFEBEE', borderLeftColor: adminConfig.colors.warning }}>
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.warning }}>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#E8F5E9', borderLeftColor: adminConfig.colors.success }}>
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.success }}>{success}</p>
        </div>
      )}

      {/* Page Selector */}
      <div>
        <label className="font-inter font-semibold mb-3 block text-sm" style={{ color: adminConfig.colors.primary }}>
          Select Page
        </label>
        <div className="flex gap-2 flex-wrap">
          {availablePages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className="px-4 py-2 rounded-lg font-inter text-sm font-semibold transition-all"
              style={{
                backgroundColor: currentPage === page.id ? adminConfig.colors.primary : adminConfig.colors.lightBg,
                color: currentPage === page.id ? 'white' : adminConfig.colors.primary,
              }}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-playfair text-xl font-bold" style={{ color: adminConfig.colors.primary }}>
            Page Sections ({sections.length})
          </h3>
          <button
            onClick={() => setShowAddSection(!showAddSection)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-inter text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: adminConfig.colors.success }}
          >
            <AddIcon size={18} color="white" />
            Add Section
          </button>
        </div>

        {/* Add Section Modal */}
        {showAddSection && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: adminConfig.colors.lightBg, borderColor: adminConfig.colors.border }}>
            <h4 className="font-inter font-semibold mb-3" style={{ color: adminConfig.colors.primary }}>
              Select Section Type
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sectionTypes.map((sectionType) => (
                <button
                  key={sectionType.type}
                  onClick={() => addSection(sectionType.type)}
                  className="p-3 rounded-lg border transition-all hover:shadow-md text-left"
                  style={{
                    backgroundColor: adminConfig.colors.white,
                    borderColor: adminConfig.colors.border,
                  }}
                >
                  <p className="font-inter font-semibold text-sm" style={{ color: adminConfig.colors.primary }}>
                    {sectionType.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sections List */}
        {sections.length > 0 ? (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.sectionId}
                className="p-4 rounded-lg border flex justify-between items-center transition-all"
                style={{
                  backgroundColor: section.isVisible ? adminConfig.colors.lightBg : '#F5F5F5',
                  borderColor: adminConfig.colors.border,
                  opacity: section.isVisible ? 1 : 0.6,
                }}
              >
                <div className="flex-1">
                  <h4 className="font-inter font-semibold mb-1" style={{ color: adminConfig.colors.primary }}>
                    {section.title}
                  </h4>
                  <p className="font-inter text-xs" style={{ color: adminConfig.colors.textLight }}>
                    Type: {section.type} • Order: {section.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSectionVisibility(section.sectionId, section.isVisible)}
                    className="p-2 rounded-lg transition-all"
                    style={{ backgroundColor: section.isVisible ? adminConfig.colors.success : adminConfig.colors.warning, color: 'white' }}
                    title={section.isVisible ? 'Hide section' : 'Show section'}
                  >
                    <EyeIcon size={18} color="white" />
                  </button>
                  <button
                    onClick={() => setEditingSection(section)}
                    className="p-2 rounded-lg transition-all"
                    style={{ backgroundColor: adminConfig.colors.info, color: 'white' }}
                  >
                    <EditIcon size={18} color="white" />
                  </button>
                  <button
                    onClick={() => deleteSection(section.sectionId)}
                    className="p-2 rounded-lg transition-all"
                    style={{ backgroundColor: adminConfig.colors.warning, color: 'white' }}
                  >
                    <DeleteIcon size={18} color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-lg" style={{ backgroundColor: adminConfig.colors.lightBg }}>
            <p style={{ color: adminConfig.colors.textLight }}>
              No sections yet. Click "Add Section" to get started.
            </p>
          </div>
        )}
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditor
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={(updatedSection) => {
            setSections(
              sections.map((s) =>
                s.sectionId === updatedSection.sectionId ? updatedSection : s
              )
            );
            setEditingSection(null);
            setSuccess('Section updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
          }}
          pageId={currentPage}
        />
      )}
    </div>
  );
}

// Section Editor Component
function SectionEditor({ section, onClose, onSave, pageId }) {
  const [formData, setFormData] = useState(section);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/content/pages/${pageId}/sections/${section.sectionId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(formData);
    } catch (error) {
      alert('Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b sticky top-0" style={{ borderBottomColor: adminConfig.colors.border }}>
          <h3 className="font-playfair text-2xl font-bold" style={{ color: adminConfig.colors.primary }}>
            Edit Section
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block font-inter font-semibold mb-2 text-sm" style={{ color: adminConfig.colors.primary }}>
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2 text-sm" style={{ color: adminConfig.colors.primary }}>
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2 text-sm" style={{ color: adminConfig.colors.primary }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: adminConfig.colors.border }}
            />
          </div>

          <div>
            <label className="block font-inter font-semibold mb-2 text-sm" style={{ color: adminConfig.colors.primary }}>
              Background Color
            </label>
            <input
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor || '#FFFFFF'}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="p-6 border-t flex gap-3 sticky bottom-0 bg-white" style={{ borderTopColor: adminConfig.colors.border }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-inter font-semibold"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              color: adminConfig.colors.primary,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg font-inter font-semibold text-white transition-all"
            style={{ backgroundColor: adminConfig.colors.accent, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
