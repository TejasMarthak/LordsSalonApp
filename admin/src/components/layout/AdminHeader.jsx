import React, { useState } from 'react';
import adminConfig from '../../adminConfig';

export default function AdminHeader({ admin, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header 
      style={{ 
        backgroundColor: adminConfig.colors.background,
        borderBottomWidth: '1px',
        borderBottomColor: adminConfig.colors.border,
      }}
      className="sticky top-0 z-40 py-4 px-6 md:px-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl font-bold" style={{ color: adminConfig.colors.primary }}>
            Lords Admin
          </h1>
          <p className="font-inter text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
            Management Dashboard
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Admin Info - Desktop */}
          <div className="hidden md:flex flex-col items-end font-inter">
            <p className="text-sm font-medium" style={{ color: adminConfig.colors.text }}>
              Welcome, {admin?.name || 'Owner'}
            </p>
            <p className="text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
              {admin?.email || 'owner@lords-salon.com'}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-inter text-sm uppercase tracking-wider transition-all rounded font-semibold"
            style={{
              backgroundColor: adminConfig.colors.warning,
              color: adminConfig.colors.white,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
