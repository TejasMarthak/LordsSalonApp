import React, { useState } from 'react';
import axios from 'axios';
import adminConfig from '../adminConfig';

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
      const apiUrl = `${adminConfig.api.baseUrl}${endpoint}`;
      const payload = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.setItem('adminToken', response.data.token);
      onLogin(response.data.admin);

      if (isSignup) {
        setSuccess('Account created successfully! Logging in...');
        setTimeout(() => {
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Auth Error:', {
        status: err.response?.status,
        error: err.response?.data?.error,
        message: err.message,
      });

      let errorMessage = isSignup ? 'Signup failed' : 'Login failed';
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Make sure server is running on ' + import.meta.env.VITE_API_URL;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network connection failed. Check server is running.';
      }

      setError(errorMessage);
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

  const handleGoogleOAuth = async () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
      
      if (!clientId || clientId === 'your_google_oauth_client_id') {
        setError('Google OAuth not configured. Contact administrator.');
        return;
      }

      // Security: Use secure OAuth flow
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'openid profile email';
      const responseType = 'code';
      
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline`;
      
      // Redirect to Google OAuth
      window.location.href = oauthUrl;
    } catch (err) {
      setError('Failed to initialize Google login');
      console.error(err);
    }
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

            {/* Google OAuth Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-xs text-slate-500 uppercase">Or</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleGoogleOAuth()}
              className="w-full px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-inter uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
              Continue with Google
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
