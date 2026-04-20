import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import corsConfig from "./config/cors.js";

// Import routes
import authRoutes from "./routes/auth.js";
import servicesRoutes from "./routes/services.js";
import portfolioRoutes from "./routes/portfolio.js";
import staffRoutes from "./routes/staff.js";
import bookingsRoutes from "./routes/bookings.js";
import ratingsRoutes from "./routes/ratings.js";
import sitemapRoutes from "./routes/sitemap.js";
import contentRoutes from "./routes/content.js";
import siteSettingsRoutes from "./routes/site-settings.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS Configuration
app.use(cors(corsConfig()));

// Root endpoint with API documentation
app.get("/", (req, res) => {
  res.json({
    message: "👑 Lords Professional Makeup Studio & Salon API",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      health: "/api/health",
      authentication: "/api/auth",
      services: "/api/services",
      portfolio: "/api/portfolio",
      staff: "/api/staff",
      bookings: "/api/bookings",
      ratings: "/api/ratings",
      content: "/api/content",
      siteSettings: "/api/site-settings",
      uploads: "/api/upload",
      sitemap: "/sitemap.xml",
      robots: "/robots.txt"
    },
    documentation: "API documentation available at /api/docs (coming soon)"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running", timestamp: new Date().toISOString() });
});

// ============ ROUTES ============
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/upload", uploadRoutes);

// SEO Routes (sitemap & robots.txt)
app.use("/", sitemapRoutes);
// Serve robots.txt from public folder
app.use(express.static("public"));

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

// ============ DATABASE CONNECTION & SERVER START ============
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error(`❌ Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
