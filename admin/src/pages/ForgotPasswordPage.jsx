import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminConfig from '../adminConfig';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email -> otp -> newPassword -> success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/auth/forgot-password`,
        { email }
      );

      setMaskedEmail(response.data.masked_email);
      setStep('otp');
      setSuccess('OTP sent to your email. It will expire in 15 minutes.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpBackspace = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${adminConfig.api.baseUrl}/api/auth/verify-otp`,
        { email, otp: otpCode }
      );

      setResetToken(response.data.resetToken);
      setStep('newPassword');
      setSuccess('OTP verified. You can now reset your password.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${adminConfig.api.baseUrl}/api/auth/reset-password`,
        { email, resetToken, newPassword }
      );

      setStep('success');
      setSuccess('Password reset successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full mb-2">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
            <p className="text-gray-300 text-xs font-medium">
              {step === 'email' && 'Enter your email'}
              {step === 'otp' && 'Verify with OTP'}
              {step === 'newPassword' && 'Create new password'}
              {step === 'success' && 'Success!'}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-5 space-y-4">
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

            {/* STEP 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">OTP sent to {maskedEmail}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpBackspace(index, e)}
                        className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-bold text-lg"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium transition"
                  >
                    Back to Email
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: New Password */}
            {step === 'newPassword' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* STEP 4: Success */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Password Reset Successful!</p>
                <p className="text-sm text-gray-600">You can now log in with your new password.</p>

                <button
                  onClick={handleBackToLogin}
                  className="w-full py-2.5 px-4 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Need help? <a href="mailto:support@lords-salon.com" className="text-black hover:underline font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
