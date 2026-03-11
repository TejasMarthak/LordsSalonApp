import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminConfig from '../adminConfig';

export default function Dashboard({ admin }) {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const StatCard = ({ label, value, icon, color }) => (
    <div
      className="p-6 rounded-lg border flex items-start gap-4"
      style={{
        backgroundColor: adminConfig.colors.lightBg,
        borderColor: adminConfig.colors.border,
      }}
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: color, opacity: 0.1 }}
      >
        {icon}
      </div>
      <div>
        <p className="font-inter text-sm" style={{ color: adminConfig.colors.textLight }}>
          {label}
        </p>
        <p className="font-playfair text-3xl font-bold mt-1" style={{ color: adminConfig.colors.primary }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="font-playfair text-3xl font-bold" style={{ color: adminConfig.colors.primary }}>
          Welcome back, {admin?.name || 'Owner'}!
        </h2>
        <p className="font-inter text-sm mt-2" style={{ color: adminConfig.colors.textLight }}>
          Manage your salon's content and portfolio from here
        </p>
      </div>

      {/* Stats Grid */}
      {!loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Portfolio Items"
            value={portfolioCount}
            icon="🖼️"
            color={adminConfig.colors.accent}
          />
          <StatCard
            label="Featured Items"
            value={featuredCount}
            icon="⭐"
            color={adminConfig.colors.warning}
          />
          <StatCard
            label="Services"
            value={servicesCount}
            icon="💼"
            color={adminConfig.colors.info}
          />
          <StatCard
            label="Admin Panels"
            value="7"
            icon="⚙️"
            color={adminConfig.colors.success}
          />
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-inter" style={{ color: adminConfig.colors.textLight }}>
            Loading dashboard...
          </p>
        </div>
      )}

      {/* Recent Portfolio Section */}
      <div>
        <h3 className="font-playfair text-2xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
          Recent Portfolio Items
        </h3>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentItems.map((item) => (
              <div
                key={item._id}
                className="group rounded-lg overflow-hidden border hover:shadow-lg transition-all"
                style={{
                  borderColor: adminConfig.colors.border,
                  backgroundColor: adminConfig.colors.background,
                }}
              >
                {item.imageUrl && (
                  <div className="relative overflow-hidden h-32">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.featured && (
                      <span
                        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: adminConfig.colors.accent,
                          color: adminConfig.colors.white,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <div className="p-3">
                  <h4
                    className="font-playfair font-bold text-xs mb-1 truncate"
                    style={{ color: adminConfig.colors.primary }}
                  >
                    {item.title}
                  </h4>
                  <p className="font-inter text-xs" style={{ color: adminConfig.colors.textLight }}>
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-12 rounded-lg text-center"
            style={{
              backgroundColor: adminConfig.colors.lightBg,
              borderWidth: '1px',
              borderColor: adminConfig.colors.border,
            }}
          >
            <p className="font-inter" style={{ color: adminConfig.colors.textLight }}>
              No portfolio items yet. Create your first one in the Portfolio section!
            </p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-playfair text-2xl font-bold mb-4" style={{ color: adminConfig.colors.primary }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminConfig.navigation.slice(1).map((navItem) => (
            <div
              key={navItem.id}
              className="p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all"
              style={{
                backgroundColor: adminConfig.colors.lightBg,
                borderColor: adminConfig.colors.border,
              }}
            >
              <div className="text-2xl mb-2">{navItem.icon}</div>
              <h4 className="font-playfair font-bold" style={{ color: adminConfig.colors.primary }}>
                {navItem.label}
              </h4>
              <p className="font-inter text-xs mt-1" style={{ color: adminConfig.colors.textLight }}>
                {navItem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
            <p className="font-inter text-2xl mb-2">💇</p>
            <p className="font-inter text-white text-sm">Manage Services</p>
          </a>
          <a
            href="/dashboard/portfolio"
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <p className="font-inter text-2xl mb-2">📷</p>
            <p className="font-inter text-white text-sm">Update Portfolio</p>
          </a>
          <a
            href="/dashboard/staff"
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <p className="font-inter text-2xl mb-2">👥</p>
            <p className="font-inter text-white text-sm">Staff Management</p>
          </a>
          <a
            href="/dashboard/bookings"
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <p className="font-inter text-2xl mb-2">📅</p>
            <p className="font-inter text-white text-sm">View Bookings</p>
          </a>
        </div>
      </div>
    </div>
  );
}
