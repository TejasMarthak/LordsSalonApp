import React, { useEffect, useRef, useState } from 'react';
import config from '../../config';
import loadGoogleMaps from '../../utils/loadGoogleMaps';
import { PhoneIcon, EmailIcon, LocationIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from '../utils/Icons';

export default function LocationContact({ siteSettings }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  
  // Use site settings if available, otherwise fall back to config
  const contact = siteSettings?.contact || {
    phone: config.salon.phone,
    email: config.salon.email,
    address: config.salon.address,
    latitude: parseFloat(import.meta.env.VITE_SALON_LAT) || 23.0152,
    longitude: parseFloat(import.meta.env.VITE_SALON_LNG) || 72.4644,
  };
  
  const social = siteSettings?.social || config.social || {};
  const businessHours = siteSettings?.businessHours || [
    { day: 'Monday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Tuesday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Wednesday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Thursday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Friday', open: '10:00', close: '20:00', isClosed: false },
    { day: 'Saturday', open: '11:00', close: '21:00', isClosed: false },
    { day: 'Sunday', open: '12:00', close: '19:00', isClosed: false },
  ];

  const salonCoordinates = {
    lat: parseFloat(contact.latitude) || 23.0152,
    lng: parseFloat(contact.longitude) || 72.4644,
  };

  const salonInfo = {
    name: siteSettings?.branding?.siteName || config.salon.name,
    address: contact.address,
    phone: contact.phone,
    email: contact.email,
  };

  useEffect(() => {
    initMap();
  }, [siteSettings]);

  const initMap = async () => {
    try {
      setMapLoading(true);
      setMapError(null);
      
      // Check if map container is available
      if (!mapRef.current) {
        console.warn('Map container not ready');
        setMapLoading(false);
        return;
      }

      // Dynamically load Google Maps with secure API key
      await loadGoogleMaps();
      
      if (!window.google) {
        throw new Error('Google Maps API not loaded');
      }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: salonCoordinates,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }],
          },
          {
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: config.colors.primary }],
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#e8f4f8' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }],
          },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Custom marker
      const marker = new window.google.maps.Marker({
        position: salonCoordinates,
        map: mapInstance,
        title: salonInfo.name,
        icon: {
          path: 'M 0, 0 C -2.4, -2.4 -2.4, -9.6 0, -9.6 C 2.4, -9.6 2.4, -2.4 0, 0 Z M 0, -4.8 C -1.2, -4.8 -1.2, -7.2 0, -7.2 C 1.2, -7.2 1.2, -4.8 0, -4.8 Z',
          fillColor: config.colors.accent,
          fillOpacity: 1,
          strokeColor: config.colors.white,
          strokeWeight: 2,
          scale: 2,
          anchor: new window.google.maps.Point(0, 0),
        },
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; font-family: 'Inter', sans-serif; color: ${config.colors.primary};">
            <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: ${config.colors.primary};">${salonInfo.name}</h3>
            <p style="margin: 4px 0; font-size: 13px;">${salonInfo.address}</p>
            <p style="margin: 4px 0; font-size: 13px;">📞 ${salonInfo.phone}</p>
          </div>
        `,
        maxWidth: 300,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      // Open info window by default
      infoWindow.open(mapInstance, marker);
      setMap(mapInstance);
      setMapLoading(false);
    } catch (err) {
      console.error('Error loading map:', err);
      setMapError(err.message || 'Failed to load map');
      setMapLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi ${config.salon.name}! I'd like to book an appointment or know more about your services.`;
    window.open(`https://wa.me/${salonInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${salonInfo.email}?subject=Appointment Request - ${config.salon.name}`;
  };

  const handleCall = () => {
    window.location.href = `tel:${salonInfo.phone}`;
  };

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor: config.colors.light }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
            <span className="font-inter text-xs uppercase tracking-widest" style={{ color: config.colors.accent }}>Location & Contact</span>
            <div className="w-12 h-1" style={{ backgroundColor: config.colors.accent }}></div>
          </div>
          <h2 className="font-playfair text-5xl md:text-6xl mb-4" style={{ color: config.colors.primary }}>
            Visit Our Studio
          </h2>
          <p className="font-inter text-lg" style={{ color: config.colors.secondary }}>
            Experience luxury beauty services in the heart of Ahmedabad
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Map - Full width on mobile, responsive height */}
          <div className="rounded-lg overflow-hidden shadow-xl" style={{ borderColor: config.colors.border, borderWidth: '1px' }}>
            <div ref={mapRef} className="w-full md:h-96" style={{ height: '300px', backgroundColor: config.colors.light }}>
              {mapLoading && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: config.colors.accent }}></div>
                </div>
              )}
              {mapError && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <p style={{ color: config.colors.secondary }} className="font-inter text-sm">
                      📍 Map unavailable
                    </p>
                    <p style={{ color: config.colors.textLight }} className="font-inter text-xs mt-2">
                      {salonInfo.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            {/* Address */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LocationIcon size={28} color={config.colors.accent} />
                <h3 className="font-playfair text-2xl" style={{ color: config.colors.primary }}>
                  Location
                </h3>
              </div>
              <p className="font-inter text-lg leading-relaxed" style={{ color: config.colors.secondary }}>
                {salonInfo.address}
              </p>
            </div>

            {/* Business Hours */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-inter text-xl" style={{ color: config.colors.accent }}>⏰</span>
                <h3 className="font-playfair text-2xl" style={{ color: config.colors.primary }}>
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3">
                {businessHours.map((hour, idx) => (
                  <div key={idx} className="flex justify-between font-inter">
                    <span style={{ color: config.colors.secondary }}>{hour.day}</span>
                    <span style={{ color: hour.isClosed ? config.colors.warning : config.colors.primary }} className="font-medium">
                      {hour.isClosed ? 'CLOSED' : `${hour.open} - ${hour.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Methods */}
            <div style={{ borderTopWidth: '1px', borderColor: config.colors.border, paddingTop: '2rem' }}>
              <div className="flex items-center gap-3 mb-6">
                <EmailIcon size={28} color={config.colors.accent} />
                <h3 className="font-playfair text-2xl" style={{ color: config.colors.primary }}>
                  Get In Touch
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {/* Phone */}
                <button
                  onClick={handleCall}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md active:scale-95"
                  style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                >
                  <PhoneIcon size={24} color={config.colors.buttonColor} />
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Call Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>{salonInfo.phone}</p>
                  </div>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md active:scale-95"
                  style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                >
                  <WhatsAppIcon size={24} color={config.colors.buttonColor} />
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>WhatsApp Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>Quick messaging</p>
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={handleEmail}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md active:scale-95"
                  style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                >
                  <EmailIcon size={24} color={config.colors.buttonColor} />
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Email Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>{salonInfo.email}</p>
                  </div>
                </button>
              </div>

              {/* Social Media */}
              <div>
                <p className="font-inter text-xs uppercase tracking-wider mb-4" style={{ color: config.colors.secondary }}>Follow Us</p>
                <div className="flex gap-3 flex-wrap">
                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:shadow-md hover:scale-110 active:scale-95"
                      style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                      title="Instagram"
                    >
                      <InstagramIcon size={20} color={config.colors.buttonColor} />
                    </a>
                  )}
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:shadow-md hover:scale-110 active:scale-95"
                      style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                      title="Facebook"
                    >
                      <FacebookIcon size={20} color={config.colors.buttonColor} />
                    </a>
                  )}
                  {social.whatsapp && (
                    <a
                      href={`https://wa.me/${social.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:shadow-md hover:scale-110 active:scale-95"
                      style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                      title="WhatsApp"
                    >
                      <WhatsAppIcon size={20} color={config.colors.buttonColor} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
