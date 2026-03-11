// Config file - Central place for all environment and site data
const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  },

  // Salon Business Information - Load from environment variables (set by admin in Settings)
  salon: {
    name: import.meta.env.VITE_SALON_NAME || "Your Beauty Studio",
    phone: import.meta.env.VITE_SALON_PHONE || "Contact Number",
    email: import.meta.env.VITE_SALON_EMAIL || "contact@salon.com",
    address: import.meta.env.VITE_SALON_ADDRESS || "Your Salon Address",
    lat: parseFloat(import.meta.env.VITE_SALON_LAT) || 23.0152,
    lng: parseFloat(import.meta.env.VITE_SALON_LNG) || 72.4644,
    website: import.meta.env.VITE_WEBSITE_URL || "http://localhost:3000",
  },

  // Google Maps
  maps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "GOOGLE_MAPS_API_KEY",
  },

  // Branding Colors - Professional Luxury Minimal
  colors: {
    primary: "#1A1A1A", // Deep black
    secondary: "#6B6B6B", // Professional gray
    accent: "#1B4D3E", // Elegant forest green
    buttonColor: "#1a3a52", // Luxury navy blue
    gold: "#D4AF37", // Luxury gold
    white: "#FFFFFF", // Clean white
    light: "#F5F5F5", // Off-white background
    border: "#E0E0E0", // Light border
    success: "#1B4D3E", // Green
    warning: "#D4AF37", // Gold
    danger: "#8B4513", // Warm brown
  },

  // Business Hours
  hours: {
    monday: "10:00 AM - 8:00 PM",
    tuesday: "10:00 AM - 8:00 PM",
    wednesday: "10:00 AM - 8:00 PM",
    thursday: "10:00 AM - 8:00 PM",
    friday: "10:00 AM - 8:00 PM",
    saturday: "10:00 AM - 9:00 PM",
    sunday: "11:00 AM - 7:00 PM",
    closed: [],
  },

  // Social Media
  social: {
    instagram: import.meta.env.VITE_SALON_INSTAGRAM || "https://instagram.com",
    facebook: import.meta.env.VITE_SALON_FACEBOOK || "https://facebook.com",
    whatsapp: import.meta.env.VITE_SALON_WHATSAPP || "Contact via WhatsApp",
    youtube: import.meta.env.VITE_SALON_YOUTUBE || "https://youtube.com",
  },

  // Cloudinary - Load from environment variables
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "cloudinary_name",
    uploadPreset:
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset",
  },

  // Google Maps - Load from environment variables
  googleMapsKey:
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "GOOGLE_MAPS_API_KEY",
};

export default config;
