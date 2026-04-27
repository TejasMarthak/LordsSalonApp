import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { ImageIcon, AlertIcon, SuccessIcon, LoadingIcon } from '../../utils/Icons';

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

    if (heroContent.heroImages.length >= 2) {
      setError('Maximum 2 images allowed. Remove an image to add another.');
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

    let addedCount = 0;
    const maxAllowed = 2 - heroContent.heroImages.length;

    if (maxAllowed <= 0) {
      setError('Maximum 2 images allowed. Remove an image to add another.');
      return;
    }

    for (let file of files) {
      if (addedCount >= maxAllowed) {
        setError(`Maximum 2 images allowed. Only ${maxAllowed} image(s) can be added.`);
        break;
      }

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
      addedCount++;
    }

    setError('');
  };

  // Remove image at index
  const handleRemoveImage = (index) => {
    setHeroContent(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== index)
    }));
    if (currentPreviewIndex >= index && currentPreviewIndex > 0) {
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

      if (!heroContent.headline?.trim() || !heroContent.subheadline?.trim()) {
        setError('Headline and subheadline are required');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Hero Section Manager
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Manage up to 2 hero images in card layout
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-2">
          <AlertIcon size={18} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="font-inter text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-2">
          <SuccessIcon size={18} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="font-inter text-sm text-green-700">{success}</p>
        </div>
      )}

      {fetching && !heroContent.headline && (
        <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 flex items-start gap-2">
          <LoadingIcon size={18} color="#0366D6" className="flex-shrink-0 mt-0.5" />
          <p className="font-inter text-sm text-blue-700">Loading hero section...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor - Left Column on Desktop, Full Width on Mobile */}
        <div className="lg:col-span-2 rounded-lg border p-6" style={{ backgroundColor: adminConfig.colors.background, borderColor: adminConfig.colors.border }}>
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Content
          </h3>

          <div className="space-y-6">
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

            {/* CTA Button - Note: Hidden fields to keep internal link structure */}
            <div className="grid grid-cols-1 gap-4 pb-4 border-b" style={{ borderColor: adminConfig.colors.border }}>
              <AdminInput
                label="Button Text"
                type="text"
                name="ctaText"
                value={heroContent.ctaText}
                onChange={handleInputChange}
                placeholder="Book Appointment"
              />
              <div className="text-xs text-gray-500 italic">
                Note: Button link is fixed to booking flow for consistency
              </div>
            </div>

            {/* Images Count */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: adminConfig.colors.lightBg }}>
              <ImageIcon size={20} color={adminConfig.colors.primary} />
              <div>
                <p className="font-inter text-sm font-bold">
                  Images: <span style={{ color: adminConfig.colors.accent }}>{heroContent.heroImages.length}/2</span>
                  {heroContent.heroImages.length === 2 && (
                    <span style={{ color: adminConfig.colors.success }}> ✓ Maximum</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Manager - Right Column on Desktop */}
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
                Select up to 2 images. Max 5MB each.
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
                      className="absolute top-0 right-0 text-white text-xs p-1 rounded-full bg-red-500 hover:bg-red-600"
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
              <ImageIcon size={32} color={adminConfig.colors.textLight} className="mx-auto mb-2" />
              <p className="text-sm font-semibold">No images added yet</p>
              <p className="text-xs mt-2">Add at least 1 image for the hero section</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button - Below All Content on Mobile, Full Width */}
      <form onSubmit={handleSave} className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg font-semibold text-white transition-all text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: adminConfig.colors.primary,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? (
            <>
              <LoadingIcon size={18} color="white" />
              Saving...
            </>
          ) : (
            'Save Hero Section'
          )}
        </button>
      </form>
    </div>
  );
}

