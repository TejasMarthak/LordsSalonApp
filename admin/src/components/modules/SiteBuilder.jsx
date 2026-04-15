import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AddIcon, EditIcon, DeleteIcon, EyeIcon, AlertIcon, SuccessIcon } from '../../utils/Icons';

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
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Website Builder</h1>
        <p className="text-gray-300">
          Design and manage your website by adding, editing, and organizing sections
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

      {/* Page Selector */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label className="font-bold mb-4 block text-sm uppercase text-black">
          Select Page
        </label>
        <div className="flex gap-2 flex-wrap">
          {availablePages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className="px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              style={{
                backgroundColor: currentPage === page.id ? '#000000' : '#F3F4F6',
                color: currentPage === page.id ? 'white' : '#000000',
              }}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div>
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-2xl p-8 mb-0 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Page Sections ({sections.length})</h2>
          </div>
          <button
            onClick={() => setShowAddSection(!showAddSection)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-white text-black hover:bg-gray-100 transition-all"
          >
            <AddIcon size={18} color="#000000" />
            Add Section
          </button>
        </div>

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl p-6">
          {/* Add Section Modal */}
          {showAddSection && (
            <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <h4 className="font-bold mb-3 text-black">Select Section Type</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sectionTypes.map((sectionType) => (
                  <button
                    key={sectionType.type}
                    onClick={() => addSection(sectionType.type)}
                    className="p-3 rounded-lg border border-gray-200 transition-all hover:shadow-md text-left bg-white hover:border-black"
                  >
                    <p className="font-semibold text-sm text-black">
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
                  className="p-4 rounded-lg border flex justify-between items-center transition-all border-gray-200"
                  style={{
                    backgroundColor: section.isVisible ? '#FFFFFF' : '#F9F9F9',
                    opacity: section.isVisible ? 1 : 0.7,
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-black">
                      {section.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Type: {section.type} • Order: {section.order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSectionVisibility(section.sectionId, section.isVisible)}
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: section.isVisible ? '#22863A' : '#CCCCCC', color: 'white' }}
                      title={section.isVisible ? 'Hide section' : 'Show section'}
                    >
                      <EyeIcon size={18} color="white" />
                    </button>
                    <button
                      onClick={() => setEditingSection(section)}
                      className="p-2 rounded-lg transition-all bg-black text-white hover:bg-gray-900"
                    >
                      <EditIcon size={18} color="white" />
                    </button>
                    <button
                      onClick={() => deleteSection(section.sectionId)}
                      className="p-2 rounded-lg transition-all bg-red-500 text-white hover:bg-red-600"
                    >
                      <DeleteIcon size={18} color="white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg bg-gray-50">
              <p className="text-gray-600">
                No sections yet. Click "Add Section" to get started.
              </p>
            </div>
          )}
        </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-black to-gray-900 text-white">
          <h3 className="text-2xl font-bold">Edit Section</h3>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block font-bold mb-3 text-sm uppercase text-black">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold mb-3 text-sm uppercase text-black">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold mb-3 text-sm uppercase text-black">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition resize-none bg-white text-black"
            />
          </div>

          <div>
            <label className="block font-bold mb-3 text-sm uppercase text-black">
              Background Color
            </label>
            <input
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor || '#FFFFFF'}
              onChange={handleInputChange}
              className="w-full h-12 rounded-xl cursor-pointer border border-gray-300"
            />
          </div>
        </div>

        <div className="p-8 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm upper case text-black bg-gray-200 hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm uppercase text-white bg-black hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
