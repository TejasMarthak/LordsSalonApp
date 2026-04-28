import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    siteId: { type: String, default: "default", unique: true },
    branding: {
      siteName: String,
      logo: String,
      favicon: String,
      tagline: String,
    },
    appearance: {
      primaryColor: { type: String, default: "#1A1A1A" },
      secondaryColor: { type: String, default: "#6B6B6B" },
      accentColor: { type: String, default: "#1a3a52" },
      backgroundColor: { type: String, default: "#FFFFFF" },
      headerBackground: String,
      headerOpacity: { type: Number, default: 0.1 },
      footerBackground: String,
      globalBackground: String,
      useGlobalBackground: { type: Boolean, default: false },
    },
    contact: {
      phone: String,
      email: String,
      address: String,
      latitude: Number,
      longitude: Number,
    },
    addresses: [
      {
        id: { type: Number, required: true },
        address: String,
        latitude: Number,
        longitude: Number,
        googleMapsLink: String,
      }
    ],
    social: {
      instagram: String,
      facebook: String,
      whatsapp: String,
      twitter: String,
    },
    gallery: {
      allowPortfolioUpload: { type: Boolean, default: true },
      allowServiceImages: { type: Boolean, default: true },
      maxImageSize: { type: Number, default: 5242880 },
    },
    businessHours: [
      {
        day: String,
        open: String,
        close: String,
        isClosed: { type: Boolean, default: false },
      },
    ],
    fonts: {
      headerFont: { type: String, default: "Playfair Display" },
      bodyFont: { type: String, default: "Inter" },
    },
    stats: {
      happyClients: { type: Number, default: 500 },
      totalBookings: { type: Number, default: 400 },
      averageRating: { type: Number, default: 4.8 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
