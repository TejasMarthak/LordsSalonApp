import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './components/layout/AdminHeader';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import ServicesManager from './components/modules/ServicesManager';
import PortfolioManager from './components/modules/PortfolioManager';
import HeroManager from './components/modules/HeroManager';
import ContentManager from './components/modules/ContentManager';
import SettingsManager from './components/modules/SettingsManager';
import SiteBuilder from './components/modules/SiteBuilder';
import SiteAppearance from './components/modules/SiteAppearance';
import adminConfig from './adminConfig';

// Protected Route Component
function ProtectedRoute({ admin, children }) {
  if (!admin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Main Layout Component for Authenticated Pages
function AdminLayout({ admin, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Map pathname to page name for sidebar
  const getPageNameFromPath = (path) => {
    const pathMap = {
      '/dashboard': 'dashboard',
      '/site-builder': 'site-builder',
      '/appearance': 'site-appearance',
      '/hero-section': 'hero',
      '/services': 'services',
      '/portfolio': 'portfolio',
      '/content': 'content',
      '/settings': 'settings',
    };
    return pathMap[path] || 'dashboard';
  };

  const currentPage = getPageNameFromPath(location.pathname);

  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-auto">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden sticky top-0 z-40">
        <AdminHeader admin={admin} onLogout={onLogout} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar - Desktop Fixed, Mobile Overlay */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 lg:z-auto transform lg:transform-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar currentPage={currentPage} onPageChange={() => setSidebarOpen(false)} />
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
          <AdminHeader admin={admin} onLogout={onLogout} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: adminConfig.colors.background }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// App Component
export default function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

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
    localStorage.removeItem('adminToken');
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

  return (
    <Router>
      <Routes>
        {/* Auth Callback Route */}
        <Route path="/auth/callback" element={<OAuthCallback onLogin={handleLogin} />} />

        {/* Login and Signup Routes */}
        <Route 
          path="/login" 
          element={admin ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/signup" 
          element={admin ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} isSignupDefaultMode={true} onSignupSuccess={() => {}} />} 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <Dashboard admin={admin} />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/site-builder" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <SiteBuilder admin={admin} />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/appearance" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <SiteAppearance admin={admin} />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/hero-section" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <HeroManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/services" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <ServicesManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/portfolio" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <PortfolioManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/content" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <ContentManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleLogout}>
                <SettingsManager />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={admin ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
