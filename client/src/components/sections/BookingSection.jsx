import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import BookingModal from './BookingModal';

export default function BookingSection() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/services`);
      setServices(response.data || []);
      if (response.data?.length > 0) {
        setSelectedService(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="booking" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4" style={{ color: config.colors.primary }}>
              Ready to Elevate Your Beauty?
            </h2>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Select a service and book your appointment with our expert makeup artists and stylists
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: config.colors.primary }}></div>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No services available for booking at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="group rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  {/* Service Image */}
                  {service.image && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-gray-100" style={{ height: '200px' }}>
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Service Details */}
                  <h3 className="font-playfair text-xl font-bold mb-2" style={{ color: config.colors.primary }}>
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                    <div>
                      {service.price && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold" style={{ color: config.colors.primary }}>
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              minimumFractionDigits: 0,
                            }).format(service.price)}
                          </span>
                        </p>
                      )}
                      {service.duration && (
                        <p className="text-xs text-gray-500">
                          {service.duration} minutes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 group-hover:shadow-md"
                    style={{ backgroundColor: config.colors.buttonColor }}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <a
              href={`mailto:${config.salon.email}`}
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: config.colors.buttonColor }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
        />
      )}
    </>
  );
}
