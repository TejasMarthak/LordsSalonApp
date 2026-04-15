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
  const [featuredCount, setFeaturedCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [portfolioRes, servicesRes] = await Promise.all([
        axios.get(`${adminConfig.api.baseUrl}/api/portfolio`),
        axios.get(`${adminConfig.api.baseUrl}/api/services`),
      ]);

      const portfolio = portfolioRes.data || [];
      const featured = portfolio.filter((item) => item.featured).length;
      
      setPortfolioCount(portfolio.length);
      setFeaturedCount(featured);
      setServicesCount(servicesRes.data?.length || 0);
      setRecentItems(portfolio.slice(0, 5)); // Last 5 items
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, icon: Icon }) => (
    <div className="p-8 rounded-2xl border bg-white hover:shadow-xl hover:border-gray-400 transition-all duration-300 group border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gray-50 flex-shrink-0 group-hover:scale-110 transition-transform">
          <Icon size={28} color="#000000" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">
            {label}
          </p>
          <p className="text-4xl font-bold mt-2 text-black group-hover:text-gray-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {admin?.name || 'Owner'}
        </h1>
        <p className="text-gray-300">
          Here's what's happening with your salon today
        </p>
      </div>

      {/* Stats Grid */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Portfolio Items"
            value={portfolioCount}
            icon={GalleryIcon}
          />
          <StatCard
            label="Featured Items"
            value={featuredCount}
            icon={StarIcon}
          />
          <StatCard
            label="Services"
            value={servicesCount}
            icon={BriefcaseIcon}
          />
          <StatCard
            label="Admin Panels"
            value="8"
            icon={SettingsIcon}
          />
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
          <LoadingIcon size={32} color="#000000" className="inline-block mb-4" />
          <p className="text-gray-600 mt-4">
            Loading dashboard...
          </p>
        </div>
      )}

      {/* Recent Portfolio Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-2xl p-8 mb-0">
          <h2 className="text-3xl font-bold">Recent Portfolio</h2>
          <p className="text-gray-300 text-sm mt-1">
            Your latest portfolio items
          </p>
        </div>

        {recentItems.length > 0 ? (
          <div className="bg-white rounded-b-2xl border border-t-0 border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {recentItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg border border-gray-200"
                >
                  {item.imageUrl && (
                    <div className="relative overflow-hidden h-48 bg-gray-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {item.featured && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black text-white flex items-center gap-1">
                          <StarIcon size={14} color="#FFFFFF" />
                          Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-sm mb-2 line-clamp-2 text-black">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 border-t border-gray-200 pt-2">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-b-2xl p-16 text-center">
            <ImageIcon size={48} color="#CCCCCC" className="mx-auto mb-4" />
            <p className="text-gray-800 font-medium">
              No portfolio items yet
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Create your first one to showcase your work
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-t-2xl p-8 mb-0">
          <h2 className="text-3xl font-bold">Quick Actions</h2>
          <p className="text-gray-300 text-sm mt-1">
            Navigate to any section quickly
          </p>
        </div>
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminConfig.navigation.slice(1).map((navItem) => {
              const Icon = getIconFromId(navItem.id);
              return (
              <button
                key={navItem.id}
                onClick={() => handleQuickAction(navItem.id)}
                className="p-6 rounded-xl border border-gray-200 text-left transition-all duration-300 hover:shadow-lg hover:border-black hover:bg-gray-50 group cursor-pointer"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={36} color="#000000" />
                </div>
                <h4 className="font-bold text-lg mb-2 text-black">
                  {navItem.label}
                </h4>
                <p className="text-sm text-gray-600">
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
