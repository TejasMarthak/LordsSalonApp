import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Professional Bridal Makeup',
    description: '',
    price: '',
    duration: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  const categories = [
    'Professional Bridal Makeup',
    'Hair Styling',
    'Advanced Skincare',
    'Special Occasions',
    'Consultation',
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${adminConfig.api.baseUrl}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(
          `${adminConfig.api.baseUrl}/api/services/${editingId}`,
          formData,
          { headers }
        );
      } else {
        await axios.post(
          `${adminConfig.api.baseUrl}/api/services`,
          formData,
          { headers }
        );
      }

      fetchServices();
      setFormData({
        name: '',
        category: 'Professional Bridal Makeup',
        description: '',
        price: '',
        duration: '',
      });
      setEditingId(null);
    } catch (error) {
      alert('Error saving service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setEditingId(service._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${adminConfig.api.baseUrl}/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (error) {
      alert('Error deleting service: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: 'Professional Bridal Makeup',
      description: '',
      price: '',
      duration: '',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
        <h2 className="font-playfair text-2xl text-white mb-6">
          {editingId ? 'Edit Service' : 'Add New Service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase">
                Service Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
                placeholder="e.g., Bridal Makeup Package"
              />
            </div>

            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
                placeholder="2999"
              />
            </div>

            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="15"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="block font-inter text-sm text-slate-300 mb-2 uppercase">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
              placeholder="Describe the service..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-white font-inter uppercase tracking-wider rounded transition-colors"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add Service'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-inter uppercase tracking-wider rounded transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-800">
          <h3 className="font-playfair text-xl text-white">Services ({services.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left font-inter text-sm text-slate-300 uppercase">Name</th>
                <th className="px-6 py-3 text-left font-inter text-sm text-slate-300 uppercase">Category</th>
                <th className="px-6 py-3 text-left font-inter text-sm text-slate-300 uppercase">Price</th>
                <th className="px-6 py-3 text-left font-inter text-sm text-slate-300 uppercase">Duration</th>
                <th className="px-6 py-3 text-left font-inter text-sm text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-white font-inter">{service.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-inter text-sm">{service.category}</td>
                  <td className="px-6 py-4 text-white font-inter">₹{service.price}</td>
                  <td className="px-6 py-4 text-slate-400 font-inter text-sm">{service.duration} min</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
