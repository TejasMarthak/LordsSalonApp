import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminManager({ admin }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'manager',
    isActive: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/admins`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (adminData) => {
    setEditingId(adminData._id);
    setFormData({
      name: adminData.name,
      role: adminData.role,
      isActive: adminData.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('adminToken');

      if (editingId) {
        // Update existing admin
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/auth/admins/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Refresh the list
      await fetchAdmins();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', role: 'manager', isActive: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update admin');
    }
  };

  const handleDelete = async (adminId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/auth/admins/${adminId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete admin');
    }
  };

  // Only show admin manager if user is owner
  if (admin.role !== 'owner') {
    return (
      <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-6">
        <p className="font-inter text-amber-300">
          Only owners can manage admin accounts
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="font-inter text-slate-300">Loading admins...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded text-red-300 font-inter text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="font-playfair text-2xl text-white">Manage Admins</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', role: 'manager', isActive: true });
          }}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-inter rounded transition-colors"
        >
          {showForm && !editingId ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block font-inter text-sm text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white font-inter focus:outline-none focus:border-amber-600"
              placeholder="Admin Name"
            />
          </div>

          <div>
            <label className="block font-inter text-sm text-slate-300 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white font-inter focus:outline-none focus:border-amber-600"
            >
              <option value="manager">Manager</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"
            />
            <label htmlFor="isActive" className="ml-3 font-inter text-slate-300">
              Active
            </label>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-inter rounded transition-colors"
          >
            {editingId ? 'Update Admin' : 'Save Admin'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 font-inter text-slate-300">
                Name
              </th>
              <th className="text-left py-3 px-4 font-inter text-slate-300">
                Email
              </th>
              <th className="text-left py-3 px-4 font-inter text-slate-300">
                Role
              </th>
              <th className="text-left py-3 px-4 font-inter text-slate-300">
                Status
              </th>
              <th className="text-left py-3 px-4 font-inter text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((adminData) => (
              <tr
                key={adminData._id}
                className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-4 font-inter text-white">
                  {adminData.name}
                </td>
                <td className="py-3 px-4 font-inter text-slate-300">
                  {adminData.email}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded font-inter text-xs uppercase ${
                      adminData.role === 'owner'
                        ? 'bg-amber-900/30 text-amber-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {adminData.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded font-inter text-xs uppercase ${
                      adminData.isActive
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}
                  >
                    {adminData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => handleEdit(adminData)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-inter text-xs rounded transition-colors"
                  >
                    Edit
                  </button>
                  {admin._id !== adminData._id && (
                    <>
                      {deleteConfirm === adminData._id ? (
                        <>
                          <button
                            onClick={() => handleDelete(adminData._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-inter text-xs rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white font-inter text-xs rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(adminData._id)}
                          className="px-3 py-1 bg-red-900/30 hover:bg-red-700 text-red-300 font-inter text-xs rounded transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
