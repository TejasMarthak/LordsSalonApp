import React, { useState, useEffect } from 'react';
import AdminHeader from './components/layout/AdminHeader';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ServicesManager from './components/modules/ServicesManager';
import PortfolioManager from './components/modules/PortfolioManager';
import HeroManager from './components/modules/HeroManager';
import ContentManager from './components/modules/ContentManager';
import SettingsManager from './components/modules/SettingsManager';
import SiteBuilder from './components/modules/SiteBuilder';
import SiteAppearance from './components/modules/SiteAppearance';
import adminConfig from './adminConfig';

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token and fetch admin info
      setAdmin({ name: 'Admin', email: 'admin@lords-salon.com', role: 'owner' });
    }
    setLoading(false);
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    setAdmin(null);
    setCurrentPage('dashboard');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: adminConfig.colors.background }}
      >
        <p className="font-inter text-lg" style={{ color: adminConfig.colors.primary }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!admin) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'site-builder':
        return <SiteBuilder admin={admin} />;
      case 'site-appearance':
        return <SiteAppearance admin={admin} />;
      case 'hero':
        return <HeroManager />;
      case 'services':
        return <ServicesManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'content':
        return <ContentManager />;
      case 'settings':
        return <SettingsManager />;
      case 'dashboard':
      default:
        return <Dashboard admin={admin} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-auto">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden sticky top-0 z-40">
        <AdminHeader admin={admin} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar - Desktop Fixed, Mobile Overlay */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 lg:z-auto transform lg:transform-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:block sticky top-0 z-10">
          <AdminHeader admin={admin} onLogout={handleLogout} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: adminConfig.colors.background }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
