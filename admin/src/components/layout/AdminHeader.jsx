import React, { useState } from 'react';
import adminConfig from '../../adminConfig';

export default function AdminHeader({ admin, onLogout, sidebarOpen, onToggleSidebar }) {
  const [showMenu, setShowMenu] = useState(false);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStoredAdminUser = () => {
    try {
      const stored = localStorage.getItem('adminUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storedAdmin = getStoredAdminUser();
  const adminName = admin?.name || storedAdmin?.name || 'Loading...';
  const adminEmail = admin?.email || storedAdmin?.email || 'Loading...';
  const initials = getInitials(adminName);

  return (
    <header 
      style={{ 
        backgroundColor: adminConfig.colors.background,
        borderBottomWidth: '1px',
        borderBottomColor: adminConfig.colors.border,
      }}
      className="sticky top-0 z-40 py-3 px-4 sm:px-6 md:px-8"
    >
      <div className="flex justify-between items-center gap-4">
        {/* Left Section - Title and Live Data */}
        <div className="flex items-center gap-6 min-w-0">
          {/* Mobile Menu Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              title="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: adminConfig.colors.primary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
              Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="font-inter text-xs sm:text-sm" style={{ color: adminConfig.colors.textLight }}>
                Live Data <span className="font-semibold">(2 updates)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Notifications and User Profile */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          {/* Notification Bell */}
          <button 
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: adminConfig.colors.primary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l" style={{ borderLeftColor: adminConfig.colors.border }}>
            {/* User Avatar */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: '#1a3a52' }}
            >
              {initials}
            </div>

            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <p className="font-semibold text-sm" style={{ color: adminConfig.colors.primary }}>
                {adminName}
              </p>
              <p className="font-inter text-xs" style={{ color: adminConfig.colors.textLight }}>
                System Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
