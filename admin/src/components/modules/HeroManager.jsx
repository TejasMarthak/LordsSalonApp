import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { UploadIcon, EyeIcon, DeleteIcon } from '../../utils/Icons';

export default function HeroManager() {
  const [heroContent, setHeroContent] = useState(adminConfig.defaultHeroContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [services, setServices] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchHeroContent();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${adminConfig.api.baseUrl}/api/services`);
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchHeroContent = async () => {
    try {
      // This assumes you have an endpoint to fetch hero content
      // For now, we'll use the default
    } catch (err) {
      console.error('Error fetching hero content:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
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
        setPreviewImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setBackgroundImage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare data
      let imageUrl = backgroundImage;
      
      // If there's a new image, upload it first (in real implementation with Cloudinary)
      if (imageFile && previewImage) {
        // In production, upload to Cloudinary here
        // For now, use the preview as the URL
        imageUrl = previewImage;
        setBackgroundImage(previewImage);
      }

      const dataToSave = {
        ...heroContent,
        backgroundImage: imageUrl,
      };

      // Update hero content via API
      await axios.post(
        `${adminConfig.api.baseUrl}/api/hero`,
        dataToSave,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Hero section updated successfully!');
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving hero content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Hero Section Management
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Customize the main banner and headline on your homepage
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div 
            className="p-8 rounded-lg border"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              borderColor: adminConfig.colors.border,
            }}
          >
            <form onSubmit={handleSave} className="space-y-6">
              {/* Headline */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Main Headline *
                </label>
                <input
                  type="text"
                  name="headline"
                  value={heroContent.headline}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Elevate Your Beauty"
                  className="w-full px-4 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
                <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                  This is the main title displayed in the hero section
                </p>
              </div>

              {/* Subheadline */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Subheadline
                </label>
                <input
                  type="text"
                  name="subheadline"
                  value={heroContent.subheadline}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional makeup and styling at Lords Salon"
                  className="w-full px-4 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
                <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                  Secondary text shown below the main headline
                </p>
              </div>

              {/* CTA Button Text */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={heroContent.ctaText}
                  onChange={handleInputChange}
                  placeholder="e.g., Book Appointment"
                  className="w-full px-4 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
              </div>

              {/* Featured Service */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Featured Service
                </label>
                <select
                  name="featuredService"
                  value={heroContent.featuredService}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                >
                  <option value="">Select a service to feature</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                  This service will be highlighted in the hero section
                </p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-inter text-sm font-semibold uppercase tracking-wider rounded-lg transition-all"
                style={{
                  backgroundColor: adminConfig.colors.accent,
                  color: adminConfig.colors.white,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div 
            className="p-8 rounded-lg border sticky top-24"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
              Preview
            </h3>

            <div 
              className="p-6 rounded-lg space-y-3"
              style={{
                backgroundColor: adminConfig.colors.background,
                borderWidth: '1px',
                borderColor: adminConfig.colors.border,
              }}
            >
              <h4 className="font-playfair text-2xl font-bold" style={{ color: adminConfig.colors.primary }}>
                {heroContent.headline}
              </h4>
              <p className="font-inter text-sm" style={{ color: adminConfig.colors.secondary }}>
                {heroContent.subheadline}
              </p>
              <button
                className="mt-4 w-full py-2 font-inter text-xs font-semibold uppercase tracking-wider rounded"
                style={{
                  backgroundColor: adminConfig.colors.accent,
                  color: adminConfig.colors.white,
                }}
              >
                {heroContent.ctaText}
              </button>
            </div>

            <p className="text-xs mt-4 font-inter" style={{ color: adminConfig.colors.textLight }}>
              This is a preview of how your hero section will look on the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
