// Admin Panel Configuration
// Professional Luxury Minimal Design Theme

const adminConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
  },

  // Professional Admin Colors - Minimal Luxury
  colors: {
    primary: "#1A1A1A", // Deep Black
    secondary: "#6B6B6B", // Professional Gray
    accent: "#1a3a52", // Navy Blue (luxury)
    background: "#FFFFFF", // Clean White
    lightBg: "#F8F8F8", // Almost White
    border: "#E5E5E5", // Light Border
    success: "#22863A", // Success Green
    warning: "#CB2431", // Warning Red
    info: "#0366D6", // Info Blue
    gold: "#D4AF37", // Accent Gold
    text: "#1A1A1A", // Text Black
    textLight: "#6B6B6B", // Light Text
    white: "#FFFFFF",
  },

  // Navigation items for Sidebar
  navigation: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      description: "Overview & Analytics",
    },
    {
      id: "hero",
      label: "Hero Section",
      icon: "🎯",
      description: "Customize Hero Content",
    },
    {
      id: "services",
      label: "Services",
      icon: "💼",
      description: "Manage Services",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: "🖼️",
      description: "Manage Portfolio Items",
    },
    {
      id: "content",
      label: "Content",
      icon: "📝",
      description: "Manage All Text Content",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      description: "Business Settings",
    },
  ],

  // Portfolio categories
  portfolioCategories: [
    "Bridal Makeup",
    "Editorial",
    "Party Makeup",
    "Skincare",
    "Hair",
    "Special Effects",
  ],

  // Service categories
  serviceCategories: [
    "Professional Bridal Makeup",
    "Hair Styling",
    "Advanced Skincare",
    "Special Occasions",
    "Consultation",
  ],

  // Supported file types for uploads
  uploadConfig: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },

  // Default Hero Section Content
  defaultHeroContent: {
    headline: "Elevate Your Beauty",
    subheadline: "Professional makeup and styling at Lords Salon",
    ctaText: "Book Appointment",
    backgroundImage: "",
    featuredService: "",
  },

  // Content Management Schema
  contentSchema: {
    about: {
      label: "About Section",
      fields: {
        title: "About Lords",
        description: "Professional description of the salon",
      },
    },
    services: {
      label: "Services Section",
      fields: {
        title: "Our Services",
        description: "Professional beauty services",
      },
    },
    portfolio: {
      label: "Portfolio Section",
      fields: {
        title: "Our Lookbook",
        description: "Before & after transformations",
      },
    },
    contact: {
      label: "Contact Section",
      fields: {
        title: "Get In Touch",
        description: "Contact information and booking",
      },
    },
  },
};

export default adminConfig;
