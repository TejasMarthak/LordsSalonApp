import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { UploadIcon, EyeIcon, DeleteIcon, SaveIcon, AlertIcon, SuccessIcon } from '../../utils/Icons';

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
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Hero Section Management</h1>
        <p className="text-gray-300">
          Customize the main banner and headline on your homepage
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-3">
          <AlertIcon size={20} color="#CB2431" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 flex items-start gap-3">
          <SuccessIcon size={20} color="#22863A" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            {success}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Headline */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase text-black">
                  Main Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={heroContent.headline}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Elevate Your Beauty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
                <p className="text-xs mt-2 text-gray-600">
                  This is the main title displayed in the hero section
                </p>
              </div>

              {/* Subheadline */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase text-black">
                  Subheadline
                </label>
                <input
                  type="text"
                  name="subheadline"
                  value={heroContent.subheadline}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional makeup and styling at Lords Salon"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
                <p className="text-xs mt-2 text-gray-600">
                  Secondary text shown below the main headline
                </p>
              </div>

              {/* CTA Button Text */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase text-black">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  name="ctaText"
                  value={heroContent.ctaText}
                  onChange={handleInputChange}
                  placeholder="e.g., Book Appointment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
              </div>

              {/* Featured Service */}
              <div>
                <label className="block text-sm font-bold mb-3 uppercase text-black">
                  Featured Service
                </label>
                <select
                  name="featuredService"
                  value={heroContent.featuredService}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                >
                  <option value="">Select a service to feature</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-2 text-gray-600">
                  This service will be highlighted in the hero section
                </p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold uppercase tracking-wider rounded-xl transition-all bg-black text-white hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <SaveIcon size={20} color="#FFFFFF" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-black">
              Preview
            </h3>

            <div className="p-6 rounded-xl space-y-3 border border-gray-200 bg-gray-50">
              <h4 className="text-2xl font-bold text-black">
                {heroContent.headline}
              </h4>
              <p className="text-sm text-gray-700">
                {heroContent.subheadline}
              </p>
              <button
                className="mt-4 w-full py-2 font-bold uppercase tracking-wider rounded-lg bg-black text-white hover:bg-gray-900 transition-all text-xs"
              >
                {heroContent.ctaText}
              </button>
            </div>

            <p className="text-xs mt-4 text-gray-600">
              This is a preview of how your hero section will look on the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
