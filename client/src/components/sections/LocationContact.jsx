import React, { useEffect, useRef, useState } from 'react';
import config from '../../config';

export default function LocationContact() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [businessHours] = useState([
    { day: 'Monday - Friday', hours: '10:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '11:00 AM - 9:00 PM' },
    { day: 'Sunday', hours: '12:00 PM - 7:00 PM' },
  ]);

  const salonCoordinates = {
    lat: 23.0152,
    lng: 72.4644,
  };

  const salonInfo = {
    name: 'Lords Professional Makeup Studio & Salon',
    address: '104, First Floor, HarshEvoq, opp. Flora Ixora Road, nr. Meri Gold Circle, South Bopal, Bopal, Ahmedabad, Gujarat, India - 380058',
    phone: '+91 9733681843',
    email: 'tejasmarthak1909@gmail.com',
  };

  useEffect(() => {
    initMap();
  }, []);

  const initMap = () => {
    // Small delay to ensure Google Maps is loaded
    setTimeout(() => {
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
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
    }, 500);
  };

  const handleWhatsApp = () => {
    const message = "Hi Lords Salon! I'd like to book an appointment or know more about your services.";
    window.open(`https://wa.me/${salonInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${salonInfo.email}?subject=Appointment Request - Lords Salon`;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-xl" style={{ borderColor: config.colors.border, borderWidth: '1px' }}>
            <div ref={mapRef} style={{ width: '100%', height: '500px', backgroundColor: config.colors.light }}></div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Address */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-inter text-xl" style={{ color: config.colors.accent }}>📍</span>
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
                    <span style={{ color: config.colors.primary }} className="font-medium">{hour.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Methods */}
            <div style={{ borderTopWidth: '1px', borderColor: config.colors.border, paddingTop: '2rem' }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-inter text-xl" style={{ color: config.colors.accent }}>✉️</span>
                <h3 className="font-playfair text-2xl" style={{ color: config.colors.primary }}>
                  Get In Touch
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {/* Phone */}
                <button
                  onClick={handleCall}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all"
                  style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                >
                  <span className="text-2xl">📞</span>
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Call Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>{salonInfo.phone}</p>
                  </div>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all"
                  style={{ backgroundColor: '#E8F5E9', borderWidth: '1px', borderColor: '#4CAF50' }}
                >
                  <span className="text-2xl">💬</span>
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: '#2E7D32' }}>WhatsApp Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>Quick messaging</p>
                  </div>
                </button>

                {/* Email */}
                <button
                  onClick={handleEmail}
                  className="w-full flex items-center gap-4 p-4 rounded-lg transition-all"
                  style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                >
                  <span className="text-2xl">📧</span>
                  <div className="text-left">
                    <p className="font-inter text-xs uppercase tracking-wider" style={{ color: config.colors.secondary }}>Email Us</p>
                    <p className="font-inter font-medium" style={{ color: config.colors.primary }}>{salonInfo.email}</p>
                  </div>
                </button>
              </div>

              {/* Social Media */}
              <div>
                <p className="font-inter text-xs uppercase tracking-wider mb-3" style={{ color: config.colors.secondary }}>Follow Us</p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/lordssalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all"
                    style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                  >
                    Photo
                  </a>
                  <a
                    href="https://facebook.com/lordssalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all"
                    style={{ backgroundColor: config.colors.white, borderWidth: '1px', borderColor: config.colors.border }}
                  >
                    f
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
