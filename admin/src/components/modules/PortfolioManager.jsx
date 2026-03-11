import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';

export default function PortfolioManager() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Bridal Makeup',
    description: '',
    imageFile: null,
    imageUrl: '',
    beforeImageFile: null,
    beforeImageUrl: '',
    featured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    fetchPortfolio();
  }, []);

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

  // Upload file to Cloudinary
  const uploadFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'lords_salon');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsjfrpbsh/image/upload',
        formDataUpload,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      return response.data.secure_url;
    } catch (err) {
      throw new Error('File upload failed');
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
        description: formData.description,
        imageUrl,
        beforeImageUrl: beforeImageUrl || undefined,
        featured: formData.featured,
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
      description: item.description,
      imageFile: null,
      imageUrl: item.imageUrl,
      beforeImageFile: null,
      beforeImageUrl: item.beforeImageUrl || '',
      featured: item.featured || false,
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
      category: 'Bridal Makeup',
      description: '',
      imageFile: null,
      imageUrl: '',
      beforeImageFile: null,
      beforeImageUrl: '',
      featured: false,
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Portfolio Management
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Add, edit, and manage your portfolio items with before and after images
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
        <div className="lg:col-span-1">
          <div 
            className="p-6 rounded-lg border sticky top-24"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              borderColor: adminConfig.colors.border,
            }}
          >
            <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
              {editingId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Bridal Makeup Look"
                  className="w-full px-4 py-2 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                >
                  {adminConfig.portfolioCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Main Image * {formData.imageFile && '✓'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'imageFile')}
                  className="w-full px-4 py-2 border rounded-lg font-inter text-sm"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
                {formData.imageUrl && !formData.imageFile && (
                  <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                    Current: {formData.imageUrl.substring(0, 25)}...
                  </p>
                )}
              </div>

              {/* Before Image Upload (Optional) */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Before Image (Optional) {formData.beforeImageFile && '✓'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'beforeImageFile')}
                  className="w-full px-4 py-2 border rounded-lg font-inter text-sm"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
                {formData.beforeImageUrl && !formData.beforeImageFile && (
                  <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                    Current: {formData.beforeImageUrl.substring(0, 25)}...
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-inter text-sm font-semibold mb-2" style={{ color: adminConfig.colors.primary }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this portfolio item"
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg font-inter text-sm resize-none focus:outline-none focus:ring-2"
                  style={{
                    borderColor: adminConfig.colors.border,
                  }}
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="featured" className="font-inter text-sm" style={{ color: adminConfig.colors.primary }}>
                  Featured on homepage
                </label>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <p className="font-inter text-xs" style={{ color: adminConfig.colors.textLight }}>
                    Uploading {uploadProgress}%
                  </p>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: adminConfig.colors.border }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${uploadProgress}%`,
                        backgroundColor: adminConfig.colors.accent,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 font-inter text-sm font-semibold uppercase tracking-wider rounded-lg transition-all"
                  style={{
                    backgroundColor: adminConfig.colors.accent,
                    color: adminConfig.colors.white,
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add Item'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 font-inter text-sm font-semibold uppercase tracking-wider rounded-lg"
                    style={{
                      backgroundColor: adminConfig.colors.border,
                      color: adminConfig.colors.primary,
                    }}
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
          <h3 className="font-playfair text-xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
            Portfolio Items ({items.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-lg border overflow-hidden hover:shadow-lg transition-all"
                style={{
                  borderColor: adminConfig.colors.border,
                  backgroundColor: adminConfig.colors.background,
                }}
              >
                {/* Thumbnail */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Item Info */}
                <h4 className="font-playfair font-bold text-sm mb-1" style={{ color: adminConfig.colors.primary }}>
                  {item.title}
                </h4>
                <p className="font-inter text-xs mb-2" style={{ color: adminConfig.colors.textLight }}>
                  {item.category}
                </p>

                {item.featured && (
                  <span 
                    className="inline-block px-2 py-1 rounded text-xs font-semibold mb-3"
                    style={{
                      backgroundColor: adminConfig.colors.accent,
                      color: adminConfig.colors.white,
                    }}
                  >
                    Featured
                  </span>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-2 font-inter text-xs font-semibold rounded transition-all"
                    style={{
                      backgroundColor: adminConfig.colors.info,
                      color: adminConfig.colors.white,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 py-2 font-inter text-xs font-semibold rounded transition-all"
                    style={{
                      backgroundColor: adminConfig.colors.warning,
                      color: adminConfig.colors.white,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="font-inter" style={{ color: adminConfig.colors.textLight }}>
                No portfolio items yet. Create your first one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
