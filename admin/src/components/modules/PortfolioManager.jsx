import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { EditIcon, DeleteIcon, UploadIcon, AlertIcon, SuccessIcon, CheckIcon, SaveIcon } from '../../utils/Icons';

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
    formDataUpload.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'default_preset');

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'cloudinary_name';
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Bridal Makeup Look"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
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

              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase text-black">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this portfolio item"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-black"
                />
                <label htmlFor="featured" className="text-sm text-black font-medium">
                  Featured on homepage
                </label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all bg-white"
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
                    <h4 className="font-bold text-sm mb-1 text-black">
                      {item.title}
                    </h4>
                    <p className="text-xs mb-2 text-gray-700">
                      {item.category}
                    </p>

                    {item.featured && (
                      <span className="inline-block px-2 py-1 rounded-lg text-xs font-semibold mb-3 bg-black text-white flex items-center gap-1 w-fit">
                        <CheckIcon size={12} color="#FFFFFF" />
                        Featured
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 py-2 font-bold text-xs rounded-lg transition-all bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-1"
                      >
                        <EditIcon size={14} color="#FFFFFF" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 py-2 font-bold text-xs rounded-lg transition-all bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center gap-1"
                      >
                        <DeleteIcon size={14} color="#CB2431" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No portfolio items yet. Create your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
