// Config file - Central place for all environment and site data
const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  },

  // Salon Business Information
  salon: {
    name: "Lords Professional Makeup Studio & Salon",
    phone: "+91 9733681843",
    email: "tejasmarthak1909@gmail.com",
    address:
      "104, First Floor, HarshEvoq, opp. Flora Ixora Road, nr. Meri Gold Circle, South Bopal, Bopal, Ahmedabad, Gujarat, India - 380058",
    lat: 23.0152,
    lng: 72.4644,
    website: "http://localhost:3000",
  },

  // Google Maps
  maps: {
    apiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBLSrAZWW6NQWR6Ck5YBbYn1HvmwQSo72E",
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
    instagram: "https://instagram.com/lordssalon",
    facebook: "https://facebook.com/lordssalon",
    whatsapp: "+91 9733681843",
    youtube: "https://youtube.com",
  },

  // Cloudinary
  cloudinary: {
    cloudName: "dsjfrpbsh",
    apiKey: "591717727461881",
    uploadPreset: "lords_salon", // You may need to create this
  },
};

export default config;
