import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { UploadIcon, EyeIcon, DeleteIcon, SaveIcon, AlertIcon, SuccessIcon } from '../../utils/Icons';

export default function HeroManager() {
  const [heroContent, setHeroContent] = useState(adminConfig.defaultHeroContent);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState('');

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
          ...response.data
        }));
        if (response.data.heroImage) {
          setPreviewImage(response.data.heroImage);
        }
      }
    } catch (err) {
      console.error('Error fetching hero content:', err);
      // Use default if fetch fails
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrlInput(url);
    if (url) {
      setPreviewImage(url);
      setHeroContent(prev => ({ ...prev, heroImage: url }));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setPreviewImage(dataUrl);
        setHeroContent(prev => ({ ...prev, heroImage: dataUrl }));
        setImageUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setImageUrlInput('');
    setHeroContent(prev => ({ ...prev, heroImage: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Validate token exists
      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return;
      }
      
      // Validate required fields
      if (!heroContent.headline || !heroContent.subheadline) {
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
        heroImage: heroContent.heroImage || '',
        type: 'hero',
      };

      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/content/hero`,
        dataToSave,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setSuccess('Hero section updated successfully!');
      setImageFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving hero content:', err);
      
      // Handle different error types
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
          Customize your homepage hero section with headline, description, image, and call-to-action
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Content Editor */}
        <div 
          className="lg:col-span-2 rounded-lg border p-6"
          style={{
            backgroundColor: adminConfig.colors.background,
            borderColor: adminConfig.colors.border,
          }}
        >
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
            />

            {/* Description */}
            <div>
              <label 
                className="block text-xs uppercase tracking-wider font-bold mb-2"
                style={{ color: adminConfig.colors.primary }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={heroContent.description}
                onChange={handleInputChange}
                placeholder="e.g., Experience sophisticated beauty artistry..."
                rows="4"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: adminConfig.colors.border,
                  focusRingColor: adminConfig.colors.accent,
                }}
              />
              <p className="text-xs mt-2" style={{ color: adminConfig.colors.textLight }}>
                Supporting text displayed below the subheadline
              </p>
            </div>

            {/* CTA Button Text */}
            <AdminInput
              label="Call-to-Action Button Text"
              type="text"
              name="ctaText"
              value={heroContent.ctaText}
              onChange={handleInputChange}
              placeholder="e.g., Book Appointment"
            />

            {/* CTA Button Link */}
            <AdminInput
              label="Call-to-Action Button Link"
              type="text"
              name="ctaLink"
              value={heroContent.ctaLink}
              onChange={handleInputChange}
              placeholder="e.g., /booking or #services"
            />

            {/* Save Button */}
            <AdminButton
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Save Hero Section
            </AdminButton>
          </form>
        </div>

        {/* Image Upload & Preview */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: adminConfig.colors.background,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
              Hero Image
            </h3>

            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label 
                  className="block text-xs uppercase tracking-wider font-bold mb-2"
                  style={{ color: adminConfig.colors.primary }}
                >
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={handleImageUrlChange}
                  placeholder="Paste image URL here"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTopColor: adminConfig.colors.border, borderTopWidth: '1px' }}></div>
                <span className="text-xs px-2" style={{ color: adminConfig.colors.textLight }}>OR</span>
                <div className="flex-1" style={{ borderTopColor: adminConfig.colors.border, borderTopWidth: '1px' }}></div>
              </div>

              {/* File Upload */}
              <label 
                className="block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all hover:border-solid"
                style={{
                  borderColor: adminConfig.colors.accent,
                  backgroundColor: adminConfig.colors.lightBg,
                }}
              >
                <UploadIcon size={32} color={adminConfig.colors.accent} className="mx-auto mb-2" />
                <p className="font-inter text-sm font-semibold" style={{ color: adminConfig.colors.primary }}>
                  Click to upload image
                </p>
                <p className="font-inter text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                  PNG, JPG up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Current Image Preview */}
              {previewImage && (
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider mb-2" style={{ color: adminConfig.colors.textLight }}>
                    Preview
                  </p>
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={previewImage} 
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                      <DeleteIcon size={18} color="#FFFFFF" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: adminConfig.colors.background,
              borderColor: adminConfig.colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold" style={{ color: adminConfig.colors.primary }}>
                Live Preview
              </h3>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
              >
                <EyeIcon size={18} color={adminConfig.colors.accent} />
              </button>
            </div>

            {showPreview && (
              <div 
                className="rounded-lg overflow-hidden border"
                style={{
                  borderColor: adminConfig.colors.border,
                  backgroundColor: adminConfig.colors.lightBg,
                }}
              >
                {previewImage && (
                  <div className="w-full h-40 overflow-hidden mb-3">
                    <img 
                      src={previewImage} 
                      alt="Hero" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 space-y-2">
                  <h4 className="font-playfair text-lg font-bold" style={{ color: adminConfig.colors.primary }}>
                    {heroContent.headline}
                  </h4>
                  <p className="text-sm font-semibold" style={{ color: adminConfig.colors.accent }}>
                    {heroContent.subheadline}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: adminConfig.colors.secondary }}>
                    {heroContent.description}
                  </p>
                  <button
                    className="mt-3 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-white"
                    style={{ backgroundColor: adminConfig.colors.accent }}
                  >
                    {heroContent.ctaText}
                  </button>
                </div>
              </div>
            )}

            {!showPreview && (
              <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
                Click the eye icon to see your live preview
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
