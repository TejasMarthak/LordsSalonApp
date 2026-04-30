import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { EditIcon, DeleteIcon, UploadIcon, AlertIcon, SuccessIcon, CheckIcon, SaveIcon } from '../../utils/Icons';

// Image Carousel Component - Same as client-side Lookbook
function ImageCarousel({ beforeImage, afterImage, title }) {
  const [currentImage, setCurrentImage] = useState('after');

  useEffect(() => {
    if (!beforeImage) {
      setCurrentImage('after');
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage(prev => prev === 'after' ? 'before' : 'after');
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [beforeImage]);

  const displayImage = currentImage === 'after' ? afterImage : beforeImage;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={displayImage}
        alt={`${title} - ${currentImage}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />
      
      {/* Image indicator badge */}
      {beforeImage && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {currentImage === 'after' ? 'After' : 'Before'}
        </div>
      )}
    </div>
  );
}

// Category icons mapping
const categoryIcons = {
  'Bridal Makeup': '💄',
  'Editorial': '📸',
  'Party Makeup': '🎉',
  'Skincare': '✨',
  'Hair': '💇',
  'Special Effects': '🎭',
};

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    imageFile: null,
    imageUrl: '',
    beforeImageFile: null,
    beforeImageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    fetchServices();
    fetchPortfolio();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${adminConfig.api.baseUrl}/api/services`
      );
      setServices(response.data);
      // Set default category to first service
      if (response.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: response.data[0].name }));
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(
        `${adminConfig.api.baseUrl}/api/portfolio`
      );
      setItems(response.data);
    } catch (err) {
      setError('Error fetching portfolio items');
      console.error(err);
    }
  };

  // Handle file selection
  const handleFileSelect = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > adminConfig.uploadConfig.maxFileSize) {
        setError('File size exceeds 5MB limit');
        return;
      }

      // Check file type
      if (!adminConfig.uploadConfig.allowedMimeTypes.includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
      setError('');
    }
  };

  // Upload file via backend API (which uses Cloudinary with server credentials)
  const uploadFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/upload`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      return response.data.url;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'File upload failed';
      throw new Error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      let imageUrl = formData.imageUrl;
      let beforeImageUrl = formData.beforeImageUrl;

      // Upload new image if selected
      if (formData.imageFile) {
        imageUrl = await uploadFile(formData.imageFile);
      }

      // Upload before image if selected
      if (formData.beforeImageFile) {
        beforeImageUrl = await uploadFile(formData.beforeImageFile);
      }

      if (!imageUrl) {
        setError('Please upload at least the main image');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const submitData = {
        title: formData.title,
        category: formData.category,
        imageUrl,
        beforeImageUrl: beforeImageUrl || undefined,
      };

      if (editingId) {
        await axios.put(
          `${adminConfig.api.baseUrl}/api/portfolio/${editingId}`,
          submitData,
          { headers }
        );
        setSuccess('Portfolio item updated successfully!');
      } else {
        await axios.post(
          `${adminConfig.api.baseUrl}/api/portfolio`,
          submitData,
          { headers }
        );
        setSuccess('Portfolio item created successfully!');
      }

      fetchPortfolio();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error saving portfolio item');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      category: item.category,
      imageFile: null,
      imageUrl: item.imageUrl,
      beforeImageFile: null,
      beforeImageUrl: item.beforeImageUrl || '',
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${adminConfig.api.baseUrl}/api/portfolio/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Portfolio item deleted successfully!');
      fetchPortfolio();
    } catch (err) {
      setError('Error deleting portfolio item');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: services.length > 0 ? services[0].name : '',
      imageFile: null,
      imageUrl: '',
      beforeImageFile: null,
      beforeImageUrl: '',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
        <p className="text-gray-300">
          Add, edit, and manage your portfolio items with before and after images
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-black">
              {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black">
                  Portfolio Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Wedding Day Glam, Summer Skincare"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black">
                  Service Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                >
                  <option value="">Select a service...</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {services.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No services found. Create services first to add portfolio items.
                  </p>
                )}
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black flex items-center gap-2">
                  Main Image {formData.imageFile && <CheckIcon size={16} color="#22863A" />}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'imageFile')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
                />
                {formData.imageUrl && !formData.imageFile && (
                  <p className="text-xs mt-1 text-gray-600">
                    Current: {formData.imageUrl.substring(0, 25)}...
                  </p>
                )}
              </div>

              {/* Before Image Upload (Optional) */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black flex items-center gap-2">
                  Before Image {formData.beforeImageFile && <CheckIcon size={16} color="#22863A" />}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'beforeImageFile')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black"
                />
                {formData.beforeImageUrl && !formData.beforeImageFile && (
                  <p className="text-xs mt-1 text-gray-600">
                    Current: {formData.beforeImageUrl.substring(0, 25)}...
                  </p>
                )}
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    Uploading {uploadProgress}%
                  </p>
                  <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                    <div
                      className="h-full transition-all bg-black"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 font-bold uppercase tracking-wider rounded-lg transition-all bg-black text-white hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <SaveIcon size={16} color="#FFFFFF" />
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add Item'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 font-bold uppercase tracking-wider rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition-all text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Items List Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-2xl p-8 mb-0">
            <h2 className="text-3xl font-bold">Portfolio Items ({items.length})</h2>
          </div>

          <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl p-6">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                  >
                    {/* Image Container with Carousel */}
                    <div 
                      className="relative w-full overflow-hidden" 
                      style={{ aspectRatio: '4/5', backgroundColor: adminConfig.colors.lightBg }}
                    >
                      <ImageCarousel 
                        beforeImage={item.beforeImageUrl}
                        afterImage={item.imageUrl}
                        title={item.title}
                      />
                      
                      {/* Hover Overlay with Action Buttons */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3" 
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
                          style={{ backgroundColor: adminConfig.colors.primary }}
                        >
                          <EditIcon size={16} color="#FFFFFF" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
                          style={{ backgroundColor: adminConfig.colors.warning }}
                        >
                          <DeleteIcon size={16} color="#FFFFFF" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 md:p-6">
                      {/* Category Badge */}
                      <p className="font-inter text-xs uppercase tracking-widest mb-2" style={{ color: adminConfig.colors.accent }}>
                        {categoryIcons[item.category]} {item.category}
                      </p>
                      
                      {/* Title */}
                      <h3 className="font-playfair text-lg md:text-xl font-light mb-2" style={{ color: adminConfig.colors.primary }}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm line-clamp-2 mb-3" style={{ color: adminConfig.colors.secondary }}>
                        {item.description || 'No description provided'}
                      </p>

                      {/* Featured Badge & Before/After Indicator */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: adminConfig.colors.border }}>
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: adminConfig.colors.primary, color: 'white' }}>
                            <CheckIcon size={12} color="#FFFFFF" />
                            Featured
                          </span>
                        )}
                        {item.beforeImageUrl && (
                          <p className="text-xs" style={{ color: adminConfig.colors.textLight }}>
                            ✓ Before & After
                          </p>
                        )}
                        {!item.featured && !item.beforeImageUrl && (
                          <p className="text-xs" style={{ color: adminConfig.colors.textLight }}>
                            Single image
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: adminConfig.colors.secondary }}>No portfolio items yet. Create your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
