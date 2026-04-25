import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from './components/layout/AdminHeader';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import ServicesManager from './components/modules/ServicesManager';
import PortfolioManager from './components/modules/PortfolioManager';
import HeroManager from './components/modules/HeroManager';
import ContactManager from './components/modules/ContactManager';
import SettingsManager from './components/modules/SettingsManager';
import DiscountManager from './components/modules/DiscountManager';
import { useSessionTimeout } from './hooks/useSessionTimeout';
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
      '/hero-section': 'hero',
      '/services': 'services',
      '/portfolio': 'portfolio',
      '/contact': 'contact',
      '/discounts': 'discounts',
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
        <Sidebar currentPage={currentPage} onPageChange={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} onLogout={onLogout} />
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

// Inner App Component - Contains routes and session timeout
function AppContent({ admin, setAdmin, token, handleLogin, handleLogout }) {
  // Initialize session timeout hook inside Router context
  useSessionTimeout(token, () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
  });

  return (
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

      {/* Forgot Password Route */}
      <Route 
        path="/forgot-password" 
        element={admin ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} 
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
        path="/discounts" 
        element={
          <ProtectedRoute admin={admin}>
            <AdminLayout admin={admin} onLogout={handleLogout}>
              <DiscountManager />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/contact" 
        element={
          <ProtectedRoute admin={admin}>
            <AdminLayout admin={admin} onLogout={handleLogout}>
              <ContactManager />
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
      <Route path="/" element={<Navigate to={admin ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

// App Component
export default function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    // Check if admin is logged in and validate token
    const validateSession = async () => {
      if (token) {
        try {
          // Fetch current admin profile to validate token and get user data
          const response = await axios.get(
            `${adminConfig.api.baseUrl}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdmin(response.data);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    validateSession();
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    // Also store admin user data for reference
    localStorage.setItem('adminUser', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
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
      <AppContent 
        admin={admin} 
        setAdmin={setAdmin} 
        token={token} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
      />
    </Router>
  );
}
