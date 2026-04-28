import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../../adminConfig';
import { AdminInput, AdminButton } from '../common/FormComponents';
import { SaveIcon, AlertIcon, SuccessIcon, DeleteIcon, EditIcon, LoadingIcon } from '../../utils/Icons';

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      title: 'New Year Discount',
      description: '20% off on all services',
      discountPercentage: 20,
      occasion: 'New Year',
      validFrom: '2026-01-01',
      validTo: '2026-01-31',
      isActive: true,
      applicableServices: ['All'],
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    occasion: '',
    validFrom: '',
    validTo: '',
    isActive: true,
    applicableServices: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load discounts on mount
  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const response = await axios.get(`${adminConfig.api.baseUrl}/api/discounts`);
        if (response.data && response.data.length > 0) {
          setDiscounts(response.data);
        }
      } catch (err) {
        console.error('Failed to load discounts:', err);
      }
    };

    loadDiscounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.discountPercentage || !formData.validFrom || !formData.validTo) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingId) {
        // Update existing discount
        await axios.put(
          `${adminConfig.api.baseUrl}/api/discounts/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDiscounts((prev) =>
          prev.map((d) => (d.id === editingId ? { ...formData, id: editingId } : d))
        );
        setSuccess('Discount updated successfully!');
        setEditingId(null);
      } else {
        // Add new discount
        const response = await axios.post(
          `${adminConfig.api.baseUrl}/api/discounts`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDiscounts((prev) => [...prev, response.data]);
        setSuccess('Discount added successfully!');
      }

      setFormData({
        title: '',
        description: '',
        discountPercentage: '',
        occasion: '',
        validFrom: '',
        validTo: '',
        isActive: true,
        applicableServices: [],
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save discount');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDiscount = (discount) => {
    setFormData(discount);
    setEditingId(discount._id);
    setShowForm(true);
    setError('');
  };

  const handleDeleteDiscount = async (id) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${adminConfig.api.baseUrl}/api/discounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts((prev) => prev.filter((d) => d._id !== id));
      setSuccess('Discount deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete discount');
    }
  };

  const handleToggleActive = async (id) => {
    const discount = discounts.find((d) => d._id === id);
    const updatedDiscount = { ...discount, isActive: !discount.isActive };

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${adminConfig.api.baseUrl}/api/discounts/${id}`,
        updatedDiscount,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscounts((prev) =>
        prev.map((d) => (d._id === id ? updatedDiscount : d))
      );
      setSuccess('Discount status updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update discount status');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      discountPercentage: '',
      occasion: '',
      validFrom: '',
      validTo: '',
      isActive: true,
      applicableServices: [],
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 rounded-lg p-4 sm:p-5 md:p-6 text-white">
        <h1 className="font-playfair text-xl sm:text-2xl font-bold mb-1">
          Discount Management
        </h1>
        <p className="text-xs sm:text-sm opacity-90">
          Create and manage festive and special occasion discounts
        </p>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded flex items-center gap-2">
          <SuccessIcon size={18} color="#22863A" />
          <span className="text-green-700 text-xs font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center gap-2">
          <AlertIcon size={18} color="#CB2431" />
          <span className="text-red-700 text-xs font-medium">{error}</span>
        </div>
      )}

      {/* Add New Discount Button */}
      <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <h2 className="font-playfair text-xl font-bold" style={{ color: adminConfig.colors.primary }}>
          {showForm ? (editingId ? 'Edit Discount' : 'Add New Discount') : 'Current Discounts'}
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded font-semibold text-sm uppercase tracking-wide transition-all hover:opacity-90 w-full sm:w-auto"
            style={{
              backgroundColor: adminConfig.colors.primary,
              color: adminConfig.colors.white,
            }}
          >
            + Add Discount
          </button>
        )}
      </div>

      {/* Add/Edit Discount Form */}
      {showForm && (
        <div
          className="rounded-lg p-4 sm:p-6 md:p-8"
          style={{ backgroundColor: adminConfig.colors.lightBg }}
        >
          <form onSubmit={handleAddDiscount} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput
                label="Discount Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., New Year Special"
                required
              />
              <AdminInput
                label="Discount Percentage (%)"
                name="discountPercentage"
                type="number"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                min="0"
                max="100"
                required
              />
            </div>

            <AdminInput
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the discount or offer"
              rows={3}
            />

            <AdminInput
              label="Occasion (e.g., Women's Day, Wedding Season)"
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
              placeholder="e.g., Women's Day"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput
                label="Valid From"
                name="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={handleInputChange}
                required
              />
              <AdminInput
                label="Valid To"
                name="validTo"
                type="date"
                value={formData.validTo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium" style={{ color: adminConfig.colors.text }}>
                Enable this discount
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded font-semibold text-sm uppercase tracking-wide transition-all"
                style={{
                  backgroundColor: adminConfig.colors.border,
                  color: adminConfig.colors.text,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded font-semibold text-sm uppercase tracking-wide transition-all hover:opacity-90 flex items-center gap-2 text-white"
                style={{ backgroundColor: adminConfig.colors.primary }}
              >
                {loading ? <LoadingIcon size={16} color="white" /> : <SaveIcon size={16} color="white" />}
                {editingId ? 'Update Discount' : 'Add Discount'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discounts Table/Cards */}
      {!showForm && (
        <div className="space-y-4">
          {discounts.length === 0 ? (
            <div
              className="text-center py-12 rounded-lg"
              style={{ backgroundColor: adminConfig.colors.lightBg }}
            >
              <p style={{ color: adminConfig.colors.textLight }} className="text-sm">
                No discounts created yet. Create your first discount to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-lg border" style={{ borderColor: adminConfig.colors.border }}>
                <table className="w-full">
                  <thead
                    style={{
                      backgroundColor: adminConfig.colors.lightBg,
                      borderBottomColor: adminConfig.colors.border,
                    }}
                    className="border-b"
                  >
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Valid Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: adminConfig.colors.primary }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: adminConfig.colors.border }}>
                    {discounts.map((discount) => (
                      <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: adminConfig.colors.text }}>
                          {discount.title}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold" style={{ color: adminConfig.colors.accent }}>
                          {discount.discountPercentage}% OFF
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: adminConfig.colors.textLight }}>
                          {new Date(discount.validFrom).toLocaleDateString()} to {new Date(discount.validTo).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleToggleActive(discount.id)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                              discount.isActive
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {discount.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                          <button
                            onClick={() => handleEditDiscount(discount)}
                            className="p-2 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <EditIcon size={18} color="#0366D6" />
                          </button>
                          <button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon size={18} color="#CB2431" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: adminConfig.colors.background,
                      borderColor: adminConfig.colors.border,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-sm" style={{ color: adminConfig.colors.primary }}>
                            {discount.title}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: adminConfig.colors.textLight }}>
                            {discount.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg" style={{ color: adminConfig.colors.accent }}>
                            {discount.discountPercentage}%
                          </p>
                          <p className="text-xs uppercase font-semibold" style={{ color: adminConfig.colors.textLight }}>
                            OFF
                          </p>
                        </div>
                      </div>

                      <div className="text-xs" style={{ color: adminConfig.colors.textLight }}>
                        <p>{new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validTo).toLocaleDateString()}</p>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(discount.id)}
                          className={`flex-1 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                            discount.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {discount.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleEditDiscount(discount)}
                          className="p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <EditIcon size={16} color="#0366D6" />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon size={16} color="#CB2431" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
