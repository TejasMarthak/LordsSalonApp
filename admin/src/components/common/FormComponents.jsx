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
    <div className="space-y-2">
      {label && (
        <label 
          className="block font-inter text-sm font-semibold"
          style={{ color: adminConfig.colors.primary }}
        >
          {label} {required && <span style={{ color: adminConfig.colors.warning }}>*</span>}
        </label>
      )}
      <Component
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border-2 rounded-lg font-inter text-sm transition-all focus:outline-none ${className} ${isTextarea ? 'resize-none' : ''}`}
        style={{
          borderColor: error ? adminConfig.colors.warning : adminConfig.colors.border,
          backgroundColor: adminConfig.colors.white,
          color: adminConfig.colors.text,
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = adminConfig.colors.accent;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = adminConfig.colors.border;
          }
        }}
      />
      {error && (
        <p className="font-inter text-xs" style={{ color: adminConfig.colors.warning }}>
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
      bg: adminConfig.colors.accent,
      text: adminConfig.colors.white,
      hover: '#0d2535',
    },
    secondary: {
      bg: adminConfig.colors.lightBg,
      text: adminConfig.colors.primary,
      hover: '#E8E8E8',
    },
    danger: {
      bg: adminConfig.colors.warning,
      text: adminConfig.colors.white,
      hover: '#B02026',
    },
    success: {
      bg: adminConfig.colors.success,
      text: adminConfig.colors.white,
      hover: '#1a6830',
    },
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const style = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-inter font-semibold rounded-lg transition-all uppercase tracking-wider ${sizes[size]} hover:scale-105 ${className}`}
      style={{
        backgroundColor: disabled || loading ? '#CCCCCC' : style.bg,
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
      {loading ? '⏳ Loading...' : children}
    </button>
  );
};

export default { AdminInput, AdminButton };
