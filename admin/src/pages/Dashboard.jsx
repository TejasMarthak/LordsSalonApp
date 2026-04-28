import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminConfig from '../adminConfig';
import {
  GalleryIcon,
  StarIcon,
  BriefcaseIcon,
  SettingsIcon,
  ImageIcon,
  LoadingIcon,
  DashboardIcon,
  LayoutIcon,
  PaletteIcon,
  FileTextIcon,
} from '../utils/Icons';

export default function Dashboard({ admin }) {
  const navigate = useNavigate();
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Map navigation IDs to icons
  const getIconFromId = (id) => {
    const iconMap = {
      'dashboard': DashboardIcon,
      'site-builder': LayoutIcon,
      'site-appearance': PaletteIcon,
      'hero': ImageIcon,
      'services': BriefcaseIcon,
      'portfolio': GalleryIcon,
      'content': FileTextIcon,
      'settings': SettingsIcon,
    };
    return iconMap[id] || DashboardIcon;
  };

  // Map navigation IDs to routes
  const getPathFromId = (id) => {
    const pathMap = {
      'dashboard': '/dashboard',
      'site-builder': '/site-builder',
      'site-appearance': '/appearance',
      'hero': '/hero-section',
      'services': '/services',
      'portfolio': '/portfolio',
      'content': '/content',
      'settings': '/settings',
    };
    return pathMap[id] || '/dashboard';
  };

  const handleQuickAction = (navId) => {
    navigate(getPathFromId(navId));
  };

  const handleSaveEdit = async (cardId) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const updatedStats = { ...siteSettings.stats };
      
      if (cardId === 'happyClients') {
        updatedStats.happyClients = parseInt(editValue);
      } else if (cardId === 'totalBookings') {
        updatedStats.totalBookings = parseInt(editValue);
      } else if (cardId === 'rating') {
        updatedStats.averageRating = parseFloat(editValue);
      }

      await axios.put(
        `${adminConfig.api.baseUrl}/api/site-settings`,
        { stats: updatedStats },
        { headers }
      );

      // Update local state
      setSiteSettings(prev => ({
        ...prev,
        stats: updatedStats
      }));

      setEditingCard(null);
    } catch (err) {
      console.error('Error saving edit:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [portfolioRes, servicesRes, settingsRes, bookingsRes] = await Promise.all([
        axios.get(`${adminConfig.api.baseUrl}/api/portfolio`),
        axios.get(`${adminConfig.api.baseUrl}/api/services`),
        axios.get(`${adminConfig.api.baseUrl}/api/site-settings`),
        axios.get(`${adminConfig.api.baseUrl}/api/bookings`, { headers }),
      ]);

      const portfolio = portfolioRes.data || [];
      
      setPortfolioCount(portfolio.length);
      setServicesCount(servicesRes.data?.length || 0);
      setSiteSettings(settingsRes.data);
      setBookingsCount(bookingsRes.data?.length || 0);
      setRecentItems(portfolio.slice(0, 5)); // Last 5 items
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, icon: Icon, editable = false, cardId = null }) => (
    <div className="p-4 sm:p-5 rounded-lg border bg-white hover:shadow-md hover:border-gray-400 transition-all duration-300 group border-gray-200">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
          <Icon size={20} color="#000000" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 truncate">
            {label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-black group-hover:text-gray-800 truncate">
              {editingCard === cardId && editable ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-2 py-1 text-lg border border-black rounded"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(cardId);
                    if (e.key === 'Escape') setEditingCard(null);
                  }}
                />
              ) : (
                value
              )}
            </p>
            {editable && (
              <button
                onClick={() => {
                  if (editingCard === cardId) {
                    handleSaveEdit(cardId);
                  } else {
                    setEditingCard(cardId);
                    setEditValue(value.toString());
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                disabled={saving}
              >
                {editingCard === cardId ? (saving ? 'Saving...' : 'Save') : 'Edit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-4 sm:p-5 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">
          Welcome back, {admin?.name || 'Owner'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Here's what's happening with your salon today
        </p>
      </div>

      {/* Stats Grid */}
      {!loading && siteSettings ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            label="Portfolio Items"
            value={portfolioCount}
            icon={GalleryIcon}
          />
          <StatCard
            label="Ratings"
            value={`${siteSettings?.stats?.averageRating || 4.8}/5`}
            icon={StarIcon}
            editable={true}
            cardId="rating"
          />
          <StatCard
            label={`Services`}
            value={servicesCount}
            icon={BriefcaseIcon}
          />
          <StatCard
            label="Happy Clients"
            value={siteSettings?.stats?.happyClients || 500}
            icon={SettingsIcon}
            editable={true}
            cardId="happyClients"
          />
          <StatCard
            label="Total Bookings"
            value={siteSettings?.stats?.totalBookings || bookingsCount}
            icon={ImageIcon}
            editable={true}
            cardId="totalBookings"
          />
        </div>
      ) : (
        <div className="py-8 text-center bg-white rounded-lg border border-gray-200">
          <LoadingIcon size={24} color="#000000" className="inline-block mb-3" />
          <p className="text-sm text-gray-600 mt-2">
            Loading dashboard...
          </p>
        </div>
      )}

      {/* Recent Portfolio Section */}
      <div className="mt-5">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-lg p-4 sm:p-5 md:p-6 mb-0">
          <h2 className="text-lg sm:text-xl font-bold">Recent Portfolio</h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
            Your latest portfolio items
          </p>
        </div>

        {recentItems.length > 0 ? (
          <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-md border border-gray-200"
                >
                  {item.imageUrl && (
                    <div className="relative overflow-hidden h-28 sm:h-32 bg-gray-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.featured && (
                        <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-black text-white flex items-center gap-1">
                          <StarIcon size={12} color="#FFFFFF" />
                          <span className="hidden sm:inline">Featured</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-2">
                    <h4 className="font-bold text-xs line-clamp-2 text-black">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 border-t border-gray-200 pt-1 mt-1">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-b-lg p-8 text-center">
            <ImageIcon size={36} color="#CCCCCC" className="mx-auto mb-3" />
            <p className="text-gray-800 font-medium text-sm">
              No portfolio items yet
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Create your first one to showcase your work
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-5">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-lg p-4 sm:p-5 md:p-6 mb-0">
          <h2 className="text-lg sm:text-xl font-bold">Quick Actions</h2>
          <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
            Navigate to any section quickly
          </p>
        </div>
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {adminConfig.navigation.slice(1).map((navItem) => {
              const Icon = getIconFromId(navItem.id);
              return (
              <button
                key={navItem.id}
                onClick={() => handleQuickAction(navItem.id)}
                className="p-4 rounded-lg border border-gray-200 text-left transition-all duration-300 hover:shadow-md hover:border-black hover:bg-gray-50 group cursor-pointer"
              >
                <div className="mb-2 group-hover:scale-105 transition-transform duration-300">
                  <Icon size={24} color="#000000" />
                </div>
                <h4 className="font-bold text-sm mb-1 text-black">
                  {navItem.label}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {navItem.description}
                </p>
              </button>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
