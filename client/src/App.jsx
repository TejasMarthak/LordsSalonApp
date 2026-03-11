import React from 'react';
import SEO from './components/utils/SEO';
import { useJsonLd, generateLocalBusinessSchema, generateOrganizationSchema } from './utils/jsonLdSchema';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSectionNew from './components/sections/HeroSectionNew';
import ServiceMenu from './components/sections/ServiceMenu';
import Lookbook from './components/sections/Lookbook';
import LocationContact from './components/sections/LocationContact';

export default function App() {
  useJsonLd(generateLocalBusinessSchema());
  useJsonLd(generateOrganizationSchema());

  return (
    <>
      <SEO
        title="Lords Professional Makeup Studio & Salon | Luxury Beauty Services"
        description="Premium makeup and salon services. Expert bridal makeup, hair styling, and skincare. Book your appointment now!"
        canonicalUrl="https://lords-salon.com"
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
            <LocationContact />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
