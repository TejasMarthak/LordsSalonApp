import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';

export default function HeroManager() {
  const [heroContent, setHeroContent] = useState({
    headline: '',
    subheadline: '',
    description: '',
    ctaText: 'Book Appointment',
    ctaLink: '/booking',
    heroImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`${adminConfig.api.baseUrl}/api/content/hero`);
      if (response.data) {
        setHeroContent(prev => ({
          ...prev,
          ...response.data,
          heroImages: response.data.heroImages || [],
        }));
      }
    } catch (err) {
      console.error('Error fetching hero content:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({ ...prev, [name]: value }));
  };

  // Add image from URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      new URL(imageUrlInput);
    } catch {
      setError('Please enter a valid image URL');
      return;
    }

    setHeroContent(prev => ({
      ...prev,
      heroImages: [...prev.heroImages, imageUrlInput]
    }));
    setImageUrlInput('');
    setError('');
  };

  // Add image from file upload
  const handleImageFileChange = async (e) => {
    const files = e.target.files;
    if (!files) return;

    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a valid image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds 5MB limit`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setHeroContent(prev => ({
          ...prev,
          heroImages: [...prev.heroImages, dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    }

    setError('');
  };

  // Remove image at index
  const handleRemoveImage = (index) => {
    setHeroContent(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== index)
    }));
    if (currentPreviewIndex >= heroContent.heroImages.length - 1 && currentPreviewIndex > 0) {
      setCurrentPreviewIndex(currentPreviewIndex - 1);
    }
  };

  // Navigate preview
  const handlePrevImage = () => {
    setCurrentPreviewIndex(prev =>
      prev === 0 ? heroContent.heroImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentPreviewIndex(prev =>
      prev === heroContent.heroImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }

      if (!heroContent.headline || !heroContent.subheadline) {
        setError('Headline and subheadline are required');
        setLoading(false);
        return;
      }

      if (heroContent.heroImages.length === 0) {
        setError('Please add at least one image');
        setLoading(false);
        return;
      }

      const dataToSave = {
        headline: heroContent.headline,
        subheadline: heroContent.subheadline,
        description: heroContent.description || '',
        ctaText: heroContent.ctaText || 'Book Appointment',
        ctaLink: heroContent.ctaLink || '/booking',
        heroImages: heroContent.heroImages,
        type: 'hero',
      };

      await axios.post(
        `${adminConfig.api.baseUrl}/api/content/hero`,
        dataToSave,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`Hero section updated successfully with ${heroContent.heroImages.length} image(s)!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving hero content:', err);

      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Invalid data provided');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.error || 'Error saving hero content');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Hero Section Manager
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Manage carousel with 2-3+ images that rotate every 5-10 seconds
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#FFF5F5', borderLeftColor: adminConfig.colors.warning }}>
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.warning }}>❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#F0FDF4', borderLeftColor: adminConfig.colors.success }}>
          <p className="font-inter text-sm" style={{ color: adminConfig.colors.success }}>✅ {success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2 rounded-lg border p-6" style={{ backgroundColor: adminConfig.colors.background, borderColor: adminConfig.colors.border }}>
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Content
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Headline */}
            <AdminInput
              label="Main Headline"
              type="text"
              name="headline"
              value={heroContent.headline}
              onChange={handleInputChange}
              placeholder="e.g., Elevate Your Beauty"
              required
            />

            {/* Subheadline */}
            <AdminInput
              label="Subheadline"
              type="text"
              name="subheadline"
              value={heroContent.subheadline}
              onChange={handleInputChange}
              placeholder="e.g., Professional makeup and styling"
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={heroContent.description}
                onChange={handleInputChange}
                placeholder="Tell visitors more about your services..."
                rows="4"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none"
                style={{ borderColor: adminConfig.colors.border, color: adminConfig.colors.text }}
              />
            </div>

            {/* CTA Button */}
            <div className="grid grid-cols-2 gap-4">
              <AdminInput
                label="Button Text"
                type="text"
                name="ctaText"
                value={heroContent.ctaText}
                onChange={handleInputChange}
                placeholder="Book Appointment"
              />
              <AdminInput
                label="Button Link"
                type="text"
                name="ctaLink"
                value={heroContent.ctaLink}
                onChange={handleInputChange}
                placeholder="/booking"
              />
            </div>

            {/* Images Count */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: adminConfig.colors.lightBg }}>
              <p className="font-inter text-sm" style={{ color: adminConfig.colors.text }}>
                📸 Images Added: <span className="font-bold text-lg">{heroContent.heroImages.length}</span>
                {heroContent.heroImages.length > 0 && (
                  <span style={{ color: adminConfig.colors.success }}> ✓ Ready for carousel</span>
                )}
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading || heroContent.heroImages.length === 0}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all"
              style={{
                backgroundColor: loading || heroContent.heroImages.length === 0 ? '#ccc' : adminConfig.colors.primary,
                cursor: loading || heroContent.heroImages.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : '💾 Save Hero Section'}
            </button>
          </form>
        </div>

        {/* Image Manager */}
        <div className="rounded-lg border p-6" style={{ backgroundColor: adminConfig.colors.background, borderColor: adminConfig.colors.border }}>
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Images ({heroContent.heroImages.length})
          </h3>

          {/* Add Images Section */}
          <div className="space-y-4 mb-6 pb-6 border-b" style={{ borderColor: adminConfig.colors.border }}>
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Upload Images (Multiple)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full px-4 py-3 border rounded-lg text-sm"
                style={{ borderColor: adminConfig.colors.border, color: adminConfig.colors.text }}
              />
              <p className="text-xs mt-2" style={{ color: adminConfig.colors.textLight }}>
                Select 2-3+ images. Max 5MB each.
              </p>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl()}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border rounded-lg text-sm"
                  style={{ borderColor: adminConfig.colors.border, color: adminConfig.colors.text }}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-3 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: adminConfig.colors.accent }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {heroContent.heroImages.length > 0 && (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={heroContent.heroImages[currentPreviewIndex]}
                  alt={`Preview ${currentPreviewIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {heroContent.heroImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {heroContent.heroImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      width: 80,
                      height: 80,
                      border: currentPreviewIndex === idx ? `3px solid ${adminConfig.colors.accent}` : `2px solid ${adminConfig.colors.border}`
                    }}
                    onClick={() => setCurrentPreviewIndex(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center" style={{ color: adminConfig.colors.textLight }}>
                Image {currentPreviewIndex + 1} of {heroContent.heroImages.length}
              </p>
            </div>
          )}

          {heroContent.heroImages.length === 0 && (
            <div className="text-center py-8" style={{ color: adminConfig.colors.textLight }}>
              <p>📸 No images added yet</p>
              <p className="text-xs mt-2">Add at least 2 images for the carousel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

