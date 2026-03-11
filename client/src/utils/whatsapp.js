import config from "../config";

// Send WhatsApp message
export const sendWhatsAppMessage = (message) => {
  const phone = config.salon.phone.replace(/\D/g, ""); // Remove non-digits
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, "_blank");
};

// Generate booking WhatsApp message
export const generateBookingMessage = (serviceName, date) => {
  return `Hi Lords Salon, I'd like to book a session for ${serviceName} on ${date}. Please confirm availability. Thanks!`;
};

// Generate service inquiry message
export const generateServiceInquiry = (serviceName) => {
  return `Hi Lords Salon, I'm interested in your ${serviceName} service. Can you provide more details and pricing? Thanks!`;
};

// Call salon
export const callSalon = () => {
  window.location.href = `tel:${config.salon.phone}`;
};

// Email salon
export const emailSalon = (subject = "", body = "") => {
  const mailtoLink = `mailto:${config.salon.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};

export default {
  sendWhatsAppMessage,
  generateBookingMessage,
  generateServiceInquiry,
  callSalon,
  emailSalon,
};
