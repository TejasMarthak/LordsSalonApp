import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminConfig from '../../adminConfig';
import {
  DashboardIcon,
  ImageIcon,
  BriefcaseIcon,
  GalleryIcon,
  PhoneIcon,
  TagIcon,
  SettingsIcon,
} from '../../utils/Icons';

export default function Sidebar({ currentPage, onPageChange, sidebarOpen, onLogout }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrLarger(window.innerWidth >= 768);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map item IDs to routes
  const getPathFromId = (id) => {
    const pathMap = {
      'dashboard': '/dashboard',
      'hero': '/hero-section',
      'services': '/services',
      'portfolio': '/portfolio',
      'contact': '/contact',
      'discounts': '/discounts',
      'settings': '/settings',
    };
    return pathMap[id] || '/dashboard';
  };

  // Map item IDs to icon components
  const getIconFromId = (id) => {
    const iconMap = {
      'dashboard': DashboardIcon,
      'hero': ImageIcon,
      'services': BriefcaseIcon,
      'portfolio': GalleryIcon,
      'contact': PhoneIcon,
      'discounts': TagIcon,
      'settings': SettingsIcon,
    };
    return iconMap[id] || DashboardIcon;
  };

  const handleNavigation = (itemId) => {
    navigate(getPathFromId(itemId));
    if (onPageChange) {
      onPageChange(itemId);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Call the onLogout callback from App which clears admin state and token
      if (onLogout) {
        onLogout();
      }
      // Navigate to login page
      navigate('/login', { replace: true });
    }
  };

  return (
    <aside 
      style={{ 
        backgroundColor: adminConfig.colors.background,
        borderRightWidth: '1px',
        borderRightColor: adminConfig.colors.border,
      }}
      className={`${isMobile && sidebarOpen ? 'w-64' : (isCollapsed ? 'w-20 md:w-64' : 'w-64')} h-screen lg:sticky top-0 transition-all duration-300 overflow-y-auto flex flex-col`}
    >
      {/* Logo Section */}
      <div className="py-3 px-4 sm:px-6 md:px-8 border-b flex items-center justify-between" style={{ borderBottomColor: adminConfig.colors.border, height: '64px' }}>
        <div className="flex flex-col gap-1 min-w-0 justify-center">
          {(!isCollapsed || isTabletOrLarger || (isMobile && sidebarOpen)) && (
            <>
              <h2 className="font-playfair text-lg font-bold whitespace-nowrap leading-tight" style={{ color: adminConfig.colors.primary }}>
                Admin
              </h2>
              <p className="font-inter text-xs whitespace-nowrap leading-tight" style={{ color: adminConfig.colors.textLight }}>
                Dashboard
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded transition-colors lg:hidden flex-shrink-0"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
            style={{ color: adminConfig.colors.primary }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:px-6 md:px-8 space-y-2 overflow-y-auto mt-1">
        {adminConfig.navigation.map((item) => {
          const IconComponent = getIconFromId(item.id);
          return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-lg font-inter text-xs sm:text-sm uppercase tracking-wider transition-all"
            style={{
              backgroundColor: currentPage === item.id 
                ? adminConfig.colors.accent 
                : 'transparent',
              color: currentPage === item.id 
                ? adminConfig.colors.white 
                : adminConfig.colors.text,
              borderWidth: currentPage === item.id ? '0' : '1px',
              borderColor: currentPage === item.id ?  
                'transparent' : adminConfig.colors.border,
            }}
            title={item.label}
          >
            <IconComponent size={20} color={currentPage === item.id ? '#FFFFFF' : '#1A1A1A'} className="flex-shrink-0" />
            {(!isCollapsed || isTabletOrLarger || (isMobile && sidebarOpen)) && (
              <div className="text-left min-w-0 flex-1">
                <div className="font-semibold text-xs sm:text-sm truncate">{item.label}</div>
                <div className="text-xs opacity-60 hidden sm:block truncate">{item.description}</div>
              </div>
            )}
          </button>
        );
        })}
      </nav>

      {/* Footer Info */}
      {(!isCollapsed || isTabletOrLarger || (isMobile && sidebarOpen)) && (
        <div className="py-3 px-4 sm:px-6 md:px-8 border-t text-center md:text-left" style={{ borderTopColor: adminConfig.colors.border }}>
          <p className="font-inter text-xs font-medium whitespace-nowrap truncate" style={{ color: adminConfig.colors.textLight }}>
            Beauty Studio Admin
          </p>
          <p className="font-inter text-xs whitespace-nowrap truncate" style={{ color: adminConfig.colors.textLight }}>
            Manage your salon
          </p>
        </div>
      )}

      {/* Logout Button */}
      <div className="px-4 sm:px-6 md:px-8 py-4 border-t" style={{ borderTopColor: adminConfig.colors.border }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-inter text-xs sm:text-sm uppercase tracking-wider transition-all text-white hover:opacity-90"
          style={{ backgroundColor: adminConfig.colors.warning }}
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!isCollapsed || isTabletOrLarger || (isMobile && sidebarOpen)) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
