import React, { useEffect, useState } from 'react';
import axios from 'axios';
import adminConfig from '../adminConfig';

export default function OAuthCallback({ onLogin }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setError('No authorization code received from Google');
        setLoading(false);
        return;
      }

      // Exchange authorization code for token
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/auth/oauth/google/callback`,
        { code, state },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.token) {
        // Save token
        localStorage.setItem('adminToken', response.data.token);
        
        // Call onLogin callback
        if (response.data.admin) {
          onLogin(response.data.admin);
        }

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(response.data.error || 'Failed to authenticate with Google');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'OAuth authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <h2 className="font-playfair text-2xl text-white mb-2">
                Signing you in...
              </h2>
              <p className="font-inter text-slate-400">
                Completing authentication with Google
              </p>
            </>
          ) : error ? (
            <>
              <div className="text-red-400 text-4xl mb-4">✕</div>
              <h2 className="font-playfair text-2xl text-white mb-4">
                Authentication Failed
              </h2>
              <p className="font-inter text-slate-400 mb-6">{error}</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-inter uppercase tracking-wider rounded transition-colors"
              >
                Back to Login
              </a>
            </>
          ) : (
            <>
              <div className="text-green-400 text-4xl mb-4">✓</div>
              <h2 className="font-playfair text-2xl text-white mb-2">
                Success!
              </h2>
              <p className="font-inter text-slate-400">
                Redirecting to dashboard...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
