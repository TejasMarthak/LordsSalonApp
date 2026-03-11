import React, { useState } from 'react';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { UploadIcon, DeleteIcon, EyeIcon } from '../../utils/Icons';

/**
 * Enhanced Hero Manager with Background Photo Upload & Real-time Preview
 */
export default function HeroManagerEnhanced() {
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    ctaText: 'Book Appointment',
    backgroundImage: '',
    backgroundPreview: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeroData((prev) => ({
          ...prev,
          backgroundPreview: event.target?.result || '',
        }));
      };
      reader.readAsDataURL(file);

      setError('');
      setSuccess('Image preview updated!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  const handleChange = (field, value) => {
    setHeroData((prev) => ({
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
      // Simulate API call - replace with actual endpoint
      console.log('Saving hero data:', heroData);
      
      setSuccess('Hero section updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save hero section');
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
          Customize your homepage hero section with images and text
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
        {/* Content Editor */}
        <div 
          className="lg:col-span-1 rounded-lg border p-6"
          style={{
            backgroundColor: adminConfig.colors.background,
            borderColor: adminConfig.colors.border,
          }}
        >
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Content
          </h3>

          <div className="space-y-4">
            <AdminInput
              label="Title"
              type="text"
              value={heroData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter hero title"
            />

            <AdminInput
              label="Subtitle"
              type="text"
              value={heroData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter hero subtitle"
            />

            <AdminInput
              label="Button Text"
              type="text"
              value={heroData.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              placeholder="e.g., Book Appointment"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div 
          className="lg:col-span-1 rounded-lg border p-6"
          style={{
            backgroundColor: adminConfig.colors.background,
            borderColor: adminConfig.colors.border,
          }}
        >
          <h3 className="font-playfair text-2xl font-bold mb-6" style={{ color: adminConfig.colors.primary }}>
            Background Image
          </h3>

          <div className="space-y-4">
            <div>
              <label 
                className="block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all hover:border-solid"
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
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {heroData.backgroundPreview && (
              <div>
                <p className="font-inter text-xs uppercase tracking-wider mb-2" style={{ color: adminConfig.colors.textLight }}>
                  Current Image
                </p>
                <img 
                  src={heroData.backgroundPreview} 
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div 
          className="lg:col-span-1 rounded-lg border p-6"
          style={{
            backgroundColor: adminConfig.colors.background,
            borderColor: adminConfig.colors.border,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-2xl font-bold" style={{ color: adminConfig.colors.primary }}>
              Preview
            </h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-lg transition-all hover:bg-gray-200"
            >
              <EyeIcon size={20} color={adminConfig.colors.accent} />
            </button>
          </div>

          {showPreview && heroData.backgroundPreview && (
            <div className="space-y-4">
              <div 
                className="w-full h-48 rounded-lg overflow-hidden relative"
                style={{
                  backgroundImage: `url(${heroData.backgroundPreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="font-playfair text-xl font-bold mb-2">
                      {heroData.title || 'Your Title Here'}
                    </h2>
                    <p className="font-inter text-sm mb-4">
                      {heroData.subtitle || 'Your subtitle here'}
                    </p>
                    <button 
                      className="px-4 py-2 font-inter text-sm font-semibold rounded"
                      style={{ backgroundColor: adminConfig.colors.accent }}
                    >
                      {heroData.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showPreview && (
            <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
              Click the eye icon to see how your hero section will look
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4 justify-end">
        <AdminButton
          onClick={handleSave}
          loading={loading}
          variant="primary"
          size="lg"
        >
          Save Hero Section
        </AdminButton>
      </div>
    </div>
  );
}
