import React from 'react';
import adminConfig from '../../adminConfig';

/**
 * Reusable Input Component
 * Handles all input styling with proper focus states and visibility
 */
export const AdminInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  error = '',
  className = '',
  rows = undefined,
}) => {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-3">
      {label && (
        <label 
          className="block font-bold text-sm text-black uppercase tracking-wider"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Component
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${className} ${isTextarea ? 'resize-none' : ''} bg-white text-black border-gray-300 placeholder-gray-400`}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = '#000000';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = '#D1D5DB';
            e.target.style.boxShadow = 'none';
          }
        }}
      />
      {error && (
        <p className="text-xs text-red-600 font-bold uppercase tracking-wider">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

/**
 * Reusable Button Component
 */
export const AdminButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
}) => {
  const variants = {
    primary: {
      bg: '#000000',
      text: '#FFFFFF',
      hover: '#1F2937',
    },
    secondary: {
      bg: '#F3F4F6',
      text: '#000000',
      hover: '#E5E7EB',
    },
    danger: {
      bg: '#DC2626',
      text: '#FFFFFF',
      hover: '#B91C1C',
    },
    success: {
      bg: '#22863A',
      text: '#FFFFFF',
      hover: '#1a6830',
    },
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const style = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-bold rounded-lg transition-all uppercase tracking-wider ${sizes[size]} ${className}`}
      style={{
        backgroundColor: disabled || loading ? '#D1D5DB' : style.bg,
        color: style.text,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = style.hover;
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = style.bg;
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default { AdminInput, AdminButton };
