import React, { useState, useEffect } from 'react';
import AdminHeader from './components/layout/AdminHeader';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ServicesManager from './components/modules/ServicesManager';
import PortfolioManager from './components/modules/PortfolioManager';
import AdminManager from './components/modules/AdminManager';

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
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
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="font-inter text-white">Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <ServicesManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'admins':
        return <AdminManager admin={admin} />;
      case 'dashboard':
      default:
        return <Dashboard admin={admin} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 bg-slate-950 min-h-screen">
        <AdminHeader admin={admin} onLogout={handleLogout} />
        <main className="p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
