import React, { useState } from 'react';
import adminConfig from '../../adminConfig';

export default function Sidebar({ currentPage, onPageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      style={{ 
        backgroundColor: adminConfig.colors.background,
        borderRightWidth: '1px',
        borderRightColor: adminConfig.colors.border,
      }}
      className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen sticky top-0 transition-all duration-300 overflow-y-auto flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ borderBottomColor: adminConfig.colors.border }}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-playfair text-lg font-bold" style={{ color: adminConfig.colors.primary }}>
                Admin
              </h2>
              <p className="font-inter text-xs" style={{ color: adminConfig.colors.textLight }}>
                Dashboard
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
              style={{ color: adminConfig.colors.primary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {adminConfig.navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-inter text-sm uppercase tracking-wider transition-all"
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
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <div className="text-left">
                <div className="font-semibold">{item.label}</div>
                <div className="text-xs opacity-60">{item.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t" style={{ borderTopColor: adminConfig.colors.border }}>
          <p className="font-inter text-xs font-medium" style={{ color: adminConfig.colors.textLight }}>
            Beauty Studio Admin
          </p>
          <p className="font-inter text-xs mt-2" style={{ color: adminConfig.colors.textLight }}>
            Manage your salon
          </p>
        </div>
      )}
    </aside>
  );
}
