import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AddIcon, EditIcon, DeleteIcon, SaveIcon, CloseIcon, LoadingIcon } from '../../utils/Icons';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
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
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Services Management</h1>
        <p className="text-gray-300">
          Add, edit, and manage all your beauty services with pricing and duration
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          {editingId ? (
            <>
              <EditIcon size={28} color="#000000" />
              <h2 className="text-3xl font-bold text-black">Edit Service</h2>
            </>
          ) : (
            <>
              <AddIcon size={28} color="#000000" />
              <h2 className="text-3xl font-bold text-black">Add New Service</h2>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Service Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Bridal Makeup Package"
              required
            />

            <FormField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="2999"
              required
              min="0"
            />

            <FormField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
              required
              min="15"
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the service..."
            required
            rows="4"
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-3 sm:py-3 px-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg disabled:opacity-50 bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-2 text-sm sm:text-base min-h-12"
            >
              {loading ? (
                <>
                  <LoadingIcon size={20} color="#FFFFFF" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Saving</span>
                </>
              ) : editingId ? (
                <>
                  <SaveIcon size={20} color="#FFFFFF" />
                  <span className="hidden sm:inline">Update Service</span>
                  <span className="sm:hidden">Update</span>
                </>
              ) : (
                <>
                  <AddIcon size={20} color="#FFFFFF" />
                  <span className="hidden sm:inline">Add Service</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:flex-1 py-3 sm:py-3 px-4 border-2 border-gray-300 rounded-xl font-bold uppercase tracking-wider transition-all hover:border-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 text-sm sm:text-base min-h-12"
              >
                <CloseIcon size={20} color="#000000" />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List */}
      <div>
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-2xl p-8 mb-0">
          <h2 className="text-3xl font-bold">Your Services ({services.length})</h2>
          <p className="text-gray-300 text-sm mt-2">
            {services.length === 0 ? 'No services yet. Create your first one!' : `You have ${services.length} service${services.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {services.length > 0 ? (
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase text-xs text-black">Name</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-xs text-black">Price</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-xs text-black">Duration</th>
                    <th className="px-6 py-4 text-center font-bold uppercase text-xs text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr
                      key={service._id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-black">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-black">
                        ₹{service.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {service.duration} min
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 rounded-lg transition-all hover:bg-gray-200 hover:shadow-md flex items-center gap-1 px-3 py-2 text-sm font-bold"
                          title="Edit service"
                        >
                          <EditIcon size={16} color="#1A1A1A" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 rounded-lg transition-all hover:bg-red-100 hover:shadow-md flex items-center gap-1 px-3 py-2 text-sm font-bold text-red-600"
                          title="Delete service"
                        >
                          <DeleteIcon size={16} color="#CB2431" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-2xl p-16 text-center">
            <BriefcaseIcon size={48} color="#CCCCCC" className="mx-auto mb-4" />
            <p className="text-gray-800 text-lg font-medium">
              No services added yet
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Create your first service to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Form Field Component for consistency
function FormField({ label, name, type, value, onChange, placeholder, required, options, rows, min }) {
  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-bold mb-3 uppercase text-black">
          {label}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none bg-white text-black"
        />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div>
        <label className="block text-sm font-bold mb-3 uppercase text-black">
          {label}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-bold mb-3 uppercase text-black">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black"
      />
    </div>
  );
}

import { BriefcaseIcon } from '../../utils/Icons';
