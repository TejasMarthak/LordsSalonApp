import React from 'react';
import config from '../../config';

export default function Footer({ siteSettings }) {
  const currentYear = new Date().getFullYear();
  
  // Use site settings if available, otherwise fall back to config
  const salonName = siteSettings?.branding?.siteName || config.salon.name;
  const phone = siteSettings?.contact?.phone || config.salon.phone;
  const email = siteSettings?.contact?.email || config.salon.email;
  const address = siteSettings?.contact?.address || config.salon.address;
  const social = siteSettings?.social || config.social || {};

  // Social media icons (SVG-based)
  const SocialIcons = {
    Instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
      </svg>
    ),
    Facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    WhatsApp: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.05 0-2.083.394-2.83 1.104-.748.71-1.112 1.658-1.112 2.654 0 .73.176 1.432.511 2.06l.072.123.576-.186c.766-.248 1.45-.642 2.003-1.155.744-.702 1.123-1.695 1.123-2.643 0-.972-.323-1.828-.741-2.298-.327-.352-.768-.559-1.252-.559m5.421 7.403c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    ),
    Twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 002.856-3.58 10 10 0 01-2.878.98 4.845 4.845 0 002.121-2.665c-.936.56-1.96.969-3.03 1.189a4.823 4.823 0 00-8.239 4.403 13.712 13.712 0 01-9.975-5.074 4.823 4.823 0 001.493 6.44 4.812 4.812 0 01-2.19-.605v.06a4.823 4.823 0 003.866 4.728 4.822 4.822 0 01-2.183.085 4.824 4.824 0 004.504 3.348 9.864 9.864 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a10.002 10.002 0 005.422 1.59c6.507 0 10.045-5.394 10.045-10.055 0-.15-.003-.3-.01-.45a7.14 7.14 0 001.753-1.825z" />
      </svg>
    ),
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: social.instagram,
      icon: SocialIcons.Instagram,
    },
    {
      name: 'Facebook',
      url: social.facebook,
      icon: SocialIcons.Facebook,
    },
    {
      name: 'WhatsApp',
      url: social.whatsapp ? `https://wa.me/${social.whatsapp.replace(/\D/g, '')}` : null,
      icon: SocialIcons.WhatsApp,
    },
    {
      name: 'Twitter',
      url: social.twitter,
      icon: SocialIcons.Twitter,
    },
  ].filter(link => link.url); // Only show links that have URLs

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
                <button className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Services
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
                  Portfolio
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-all duration-300" style={{ color: config.colors.white, opacity: 0.8 }}>
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
          
          {/* Social Media Icons */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-100"
                  style={{
                    backgroundColor: config.colors.white,
                    opacity: 0.8,
                    color: config.colors.primary,
                  }}
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
