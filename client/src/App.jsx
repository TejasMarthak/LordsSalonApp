import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SEO from './components/utils/SEO';
import config from './config';
import { useJsonLd, generateLocalBusinessSchema, generateOrganizationSchema } from './utils/jsonLdSchema';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSectionNew from './components/sections/HeroSectionNew';
import ServiceMenu from './components/sections/ServiceMenu';
import Lookbook from './components/sections/Lookbook';
import LocationContact from './components/sections/LocationContact';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import axios from 'axios';

// Home Page Component
function HomePage({ siteSettings }) {
  return (
    <>
      <SEO
        title={`Professional Beauty Studio | ${siteSettings?.branding?.siteName || config.salon.name}`}
        description={siteSettings?.branding?.tagline || "Premium makeup and salon services. Expert bridal makeup, hair styling, and skincare. Book your appointment now!"}
        canonicalUrl={config.salon.website}
        keywords="makeup salon, bridal makeup, hair styling, skincare, beauty, makeup artist"
      />

      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main className="pt-0">
          <HeroSectionNew />
          <section id="services">
            <ServiceMenu />
          </section>
          <section id="portfolio">
            <Lookbook />
          </section>
          <section id="location">
            <LocationContact siteSettings={siteSettings} />
          </section>
        </main>
        <Footer siteSettings={siteSettings} />
      </div>
    </>
  );
}

export default function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useJsonLd(generateLocalBusinessSchema());
  useJsonLd(generateOrganizationSchema());

  // Fetch site settings and content from MongoDB on mount
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        // Fetch site settings from API
        const settingsRes = await axios.get(`${config.api.baseUrl}/api/site-settings`);
        setSiteSettings(settingsRes.data);
        
        // Update document title with salon name from settings
        if (settingsRes.data?.branding?.siteName) {
          document.title = `${settingsRes.data.branding.siteName} | Professional Beauty Studio`;
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
    
    // Refresh site settings every 30 seconds (in case admin makes changes)
    const interval = setInterval(fetchSiteData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: config.colors.white }}>
        <p className="font-inter" style={{ color: config.colors.secondary }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage siteSettings={siteSettings} />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/lookbook/:id" element={
            <>
              <PortfolioDetailPage />
              <Footer siteSettings={siteSettings} />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

