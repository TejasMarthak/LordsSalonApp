import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SEO from './components/utils/SEO';
import config from './config';
import { useJsonLd, generateLocalBusinessSchema, generateOrganizationSchema } from './utils/jsonLdSchema';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DiscountBanner from './components/sections/DiscountBanner';
import HeroSectionScrollable from './components/sections/HeroSectionScrollable';
import CustomerCounterSection from './components/sections/CustomerCounterSection';
import ServiceSection from './components/sections/ServiceSection';
import Lookbook from './components/sections/Lookbook';
import LocationContact from './components/sections/LocationContact';
import DiscountSection from './components/sections/DiscountSection';
import RatingsSection from './components/sections/RatingsSection';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import BookingPage from './pages/BookingPage';
import axios from 'axios';

// Home Page Component
// OPTIMIZATION: Fetches hero data and passes it to HeroSectionScrollable
// This eliminates the separate API call and race conditions
function HomePage({ siteSettings }) {
  const [heroData, setHeroData] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);

  // Fetch hero data when component mounts
  useEffect(() => {
    const fetchHero = async () => {
      try {
        setHeroLoading(true);
        const response = await axios.get(`${config.api.baseUrl}/api/content/hero`);
        if (response.data) {
          setHeroData(response.data);
        }
      } catch (err) {
        console.error('Error fetching hero data:', err);
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHero();
  }, []);

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
        <DiscountBanner />
        <main className="pt-16 sm:pt-20 md:pt-0">
          <HeroSectionScrollable heroData={heroData} isLoading={heroLoading} />
          <CustomerCounterSection />
          <section id="services">
            <ServiceSection />
          </section>
          <section id="portfolio">
            <Lookbook />
          </section>
          <DiscountSection />
          <RatingsSection />
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

  // Fetch site settings and content from MongoDB on mount (only once)
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
    
    // No polling - data updates happen via WebSocket events or manual refresh
    // This eliminates 2,880 unnecessary API calls per user per day
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
      <main className="pt-16 sm:pt-20 md:pt-0">
        <Routes>
          <Route path="/" element={<HomePage siteSettings={siteSettings} />} />
          <Route path="/booking" element={
            <>
              <BookingPage />
              <Footer siteSettings={siteSettings} />
            </>
          } />
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

