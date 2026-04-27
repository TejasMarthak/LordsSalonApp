import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminConfig from '../adminConfig';

export default function LoginPage({ onLogin, isSignupDefaultMode = false }) {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(isSignupDefaultMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'manager',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle pathname changes for /login and /signup routes
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/signup') {
      setIsSignup(true);
    } else if (path === '/login') {
      setIsSignup(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isSignup && (!formData.name || formData.password.length < 8)) {
      setError(formData.password.length < 8 ? 'Password must be at least 8 characters' : 'Please fill in all required fields');
      setLoading(false);
      return;
    }

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
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Redirecting to dashboard after login
        navigate('/dashboard');
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
        errorMessage = 'Cannot connect to server at ' + adminConfig.api.baseUrl;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network connection failed. Please check your connection.';
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
    const newIsSignup = !isSignup;
    setIsSignup(newIsSignup);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'manager',
    });
    
    // Update URL without page reload
    const newPath = newIsSignup ? '/signup' : '/login';
    window.history.pushState({ isSignup: newIsSignup }, '', newPath);
  };

  const handleGoogleOAuth = async () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId || clientId.includes('undefined') || clientId.includes('your_')) {
        setError('Google OAuth is not configured. Please contact administrator.');
        console.warn('Missing VITE_GOOGLE_CLIENT_ID in environment');
        return;
      }

      // Security: Use secure OAuth flow with state parameter
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem('oauth_state', state);
      
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scope = 'openid profile email';
      const responseType = 'code';
      
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      // Redirect to Google OAuth
      window.location.href = oauthUrl;
    } catch (err) {
      setError('Failed to initialize Google login');
      console.error(err);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header - Salon Branded */}
          <div className="bg-gradient-to-r from-black to-gray-900 p-5 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">Lords Salon</h1>
            <p className="text-gray-300 text-xs font-medium">
              {isSignup ? 'Create Your Admin Account' : 'Admin Portal'}
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700 text-xs font-medium">{success}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="admin@lords-salon.com"
              />
            </div>

            {/* Name Field (Signup Only) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                  placeholder="Your Full Name"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={isSignup ? 8 : 1}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition pr-9"
                  placeholder={isSignup ? 'Min 8 characters' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 11.586a4 4 0 111.414-1.414l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.121z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection (Signup Only) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Account Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white text-black"
                >
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all"
            >
              {loading
                ? (isSignup ? 'Creating Account...' : 'Signing in...')
                : (isSignup ? 'Create Account' : 'Sign In')}
            </button>

            {/* Divider */}
            <div className="mt-3 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-700 font-medium">Or</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleGoogleOAuth()}
              disabled={loading}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 hover:border-black text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Forgot Password Link (Login Only) */}
            {!isSignup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 text-xs text-center mb-3">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={handleToggle}
              className="w-full px-4 py-1.5 text-sm border-2 border-black text-black font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              {isSignup ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>

        {/* Support Text */}
        <div className="text-center text-gray-600 text-xs mt-4 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p>Secure Admin Portal | Password must be at least 8 characters</p>
        </div>
      </div>
    </div>
  );
}

