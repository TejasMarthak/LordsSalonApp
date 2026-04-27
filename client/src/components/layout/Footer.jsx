import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

export default function Footer({ siteSettings }) {
  const [services, setServices] = useState([]);
  const currentYear = new Date().getFullYear();
  
  // Use site settings if available, otherwise fall back to config
  const salonName = siteSettings?.branding?.siteName || config.salon.name;
  const phone = siteSettings?.contact?.phone || config.salon.phone;
  const email = siteSettings?.contact?.email || config.salon.email;
  const address = siteSettings?.contact?.address || config.salon.address;
  const social = siteSettings?.social || config.social || {};

  useEffect(() => {
    // Fetch services to display in footer
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${config.api.baseUrl}/api/services`);
        if (response.data && Array.isArray(response.data)) {
          // Show top 4 services in footer
          setServices(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching services for footer:', error);
      }
    };

    fetchServices();
  }, []);

  // Scroll to services section
  const scrollToServices = () => {
    const element = document.getElementById('service-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ backgroundColor: config.colors.primary, color: config.colors.white }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl mb-4">{salonName.split(' ')[0] || 'Studio'}</h3>
            <p className="font-inter text-sm" style={{ color: config.colors.white, opacity: 0.8 }}>
              Professional Beauty Services
            </p>
            <p className="font-inter text-xs mt-4" style={{ color: config.colors.white, opacity: 0.6 }}>
              Elevating beauty through expert artistry
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.white, opacity: 0.7 }}>
              Quick Links
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              <li>
                <button onClick={scrollToServices} className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => {
                  const elem = document.getElementById('portfolio');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => {
                  const elem = document.getElementById('location');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Location
                </button>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.white, opacity: 0.7 }}>
              Popular Services
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <li key={index} className="hover:text-white transition-all duration-300 cursor-pointer" style={{ color: config.colors.white, opacity: 0.8 }} onClick={scrollToServices}>
                    {service.name}
                  </li>
                ))
              ) : (
                <>
                  <li style={{ color: config.colors.white, opacity: 0.8 }}>Bridal Makeup</li>
                  <li style={{ color: config.colors.white, opacity: 0.8 }}>Hair Styling</li>
                  <li style={{ color: config.colors.white, opacity: 0.8 }}>Skincare</li>
                  <li style={{ color: config.colors.white, opacity: 0.8 }}>Special Events</li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.white, opacity: 0.7 }}>
              Contact Us
            </h4>
            <div className="space-y-3 font-inter text-sm">
              {phone && (
                <p>
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-white transition-all duration-300 flex items-center gap-2"
                    style={{ color: config.colors.white, opacity: 0.8 }}
                  >
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition-all duration-300 flex items-center gap-2 break-all"
                    style={{ color: config.colors.white, opacity: 0.8 }}
                  >
                    {email}
                  </a>
                </p>
              )}
              {address && (
                <p className="flex items-start gap-2" style={{ color: config.colors.white, opacity: 0.8 }}>
                  <span>{address}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: config.colors.white, opacity: 0.2, marginBottom: '2rem' }}></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-inter text-sm" style={{ color: config.colors.white, opacity: 0.6 }}>
            © {currentYear} {salonName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
