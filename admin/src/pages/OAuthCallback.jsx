import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminConfig from '../adminConfig';

export default function OAuthCallback({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      const url = new URL(window.location);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      // Verify state parameter
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid OAuth state. Possible CSRF attack detected.');
      }
      sessionStorage.removeItem('oauth_state');

      if (!code) {
        throw new Error('No authorization code received from Google');
      }

      setProgress(25);

      // Exchange authorization code for token
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/auth/oauth/google/callback`,
        { code, state },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setProgress(75);

      if (response.data.token) {
        // Save token
        localStorage.setItem('adminToken', response.data.token);
        
        setProgress(90);

        // Call onLogin callback
        if (response.data.admin) {
          onLogin(response.data.admin);
        }

        setProgress(100);

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Failed to authenticate with Google');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'OAuth authentication failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Lords Salon</h1>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {loading && !error ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Signing you in...
                </h2>
                <p className="text-gray-600 mb-6">
                  Completing authentication with Google
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-black to-gray-900 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </>
            ) : error ? (
              <>
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Authentication Failed
                </h2>
                <p className="text-red-600 mb-6 text-sm bg-red-50 p-4 rounded-lg">
                  {error}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Success!
                </h2>
                <p className="text-gray-600">
                  Redirecting to dashboard...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
