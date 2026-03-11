import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'manager',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        payload
      );

      localStorage.setItem('adminToken', response.data.token);
      onLogin(response.data.admin);

      if (isSignup) {
        setSuccess('Account created successfully! Logging in...');
        setTimeout(() => {
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || (isSignup ? 'Signup failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'manager',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
          <h1 className="font-playfair text-4xl text-white mb-2">Lords</h1>
          <p className="font-inter text-slate-400 mb-8">
            {isSignup ? 'Admin Registration' : 'Admin Dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded text-red-300 font-inter text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-900/30 border border-green-700 rounded text-green-300 font-inter text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white font-inter placeholder-slate-500 focus:outline-none focus:border-amber-600"
                placeholder="admin@lords-salon.com"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block font-inter text-sm text-slate-300 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white font-inter placeholder-slate-500 focus:outline-none focus:border-amber-600"
                  placeholder="Your Name"
                />
              </div>
            )}

            <div>
              <label className="block font-inter text-sm text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white font-inter placeholder-slate-500 focus:outline-none focus:border-amber-600"
                placeholder={isSignup ? 'Min 8 characters' : '••••••••'}
              />
            </div>

            {isSignup && (
              <div>
                <label className="block font-inter text-sm text-slate-300 mb-2 uppercase tracking-wider">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white font-inter focus:outline-none focus:border-amber-600"
                >
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-white font-inter uppercase tracking-wider rounded transition-colors"
            >
              {loading
                ? isSignup
                  ? 'Creating Account...'
                  : 'Logging in...'
                : isSignup
                  ? 'Create Account'
                  : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="font-inter text-sm text-slate-400 text-center mb-4">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={handleToggle}
              className="w-full px-4 py-3 border border-amber-600 hover:bg-amber-600/10 text-amber-600 font-inter uppercase tracking-wider rounded transition-colors"
            >
              {isSignup ? 'Login' : 'Create Account'}
            </button>
          </div>

          {!isSignup && (
            <p className="font-inter text-xs text-slate-500 text-center mt-6">
              For testing: use credentials from your .env file
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
