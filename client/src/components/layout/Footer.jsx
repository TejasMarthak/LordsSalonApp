import React from 'react';
import config from '../../config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: config.colors.primary, color: config.colors.white }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl mb-4">Lords</h3>
            <p className="font-inter text-sm" style={{ color: config.colors.white, opacity: 0.8 }}>
              Professional Makeup Studio & Salon
            </p>
            <p className="font-inter text-xs mt-4" style={{ color: config.colors.white, opacity: 0.6 }}>
              Elevating beauty through expert artistry
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.gold }}>
              Quick Links
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              <li>
                <button className="hover:text-yellow-200 transition-colors" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Services
                </button>
              </li>
              <li>
                <button className="hover:text-yellow-200 transition-colors" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Portfolio
                </button>
              </li>
              <li>
                <button className="hover:text-yellow-200 transition-colors" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Location
                </button>
              </li>
              <li>
                <a href={`mailto:${config.salon.email}`} className="hover:text-yellow-200 transition-colors" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.gold }}>
              Services
            </h4>
            <ul className="space-y-3 font-inter text-sm">
              <li style={{ color: config.colors.white, opacity: 0.8 }}>Bridal Makeup</li>
              <li style={{ color: config.colors.white, opacity: 0.8 }}>Hair Styling</li>
              <li style={{ color: config.colors.white, opacity: 0.8 }}>Skincare</li>
              <li style={{ color: config.colors.white, opacity: 0.8 }}>Special Events</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter text-xs uppercase tracking-widest mb-6" style={{ color: config.colors.gold }}>
              Contact Us
            </h4>
            <div className="space-y-3 font-inter text-sm">
              <p>
                <a
                  href={`tel:${config.salon.phone}`}
                  className="hover:text-yellow-200 transition-colors flex items-center gap-2"
                  style={{ color: config.colors.white, opacity: 0.8 }}
                >
                  {config.salon.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${config.salon.email}`}
                  className="hover:text-yellow-200 transition-colors flex items-center gap-2 break-all"
                  style={{ color: config.colors.white, opacity: 0.8 }}
                >
                  {config.salon.email}
                </a>
              </p>
              <p className="flex items-start gap-2" style={{ color: config.colors.white, opacity: 0.8 }}>
                <span>{config.salon.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: config.colors.white, opacity: 0.2, marginBottom: '2rem' }}></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-inter text-sm" style={{ color: config.colors.white, opacity: 0.6 }}>
            © {currentYear} Lords Professional Makeup Studio & Salon. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="https://instagram.com/lordssalon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 font-inter text-xs"
              style={{ backgroundColor: config.colors.white, opacity: 0.2, color: config.colors.white }}
              title="Instagram"
            >
              IG
            </a>
            <a 
              href="https://facebook.com/lordssalon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 font-inter text-xs"
              style={{ backgroundColor: config.colors.white, opacity: 0.2, color: config.colors.white }}
              title="Facebook"
            >
              FB
            </a>
            <a 
              href={`https://wa.me/${config.salon.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 font-inter text-xs"
              style={{ backgroundColor: config.colors.white, opacity: 0.2, color: config.colors.white }}
              title="WhatsApp"
            >
              WA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
