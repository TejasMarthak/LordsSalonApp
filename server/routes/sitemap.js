import express from "express";
import Service from "../models/Service.js";
import PortfolioItem from "../models/PortfolioItem.js";

const router = express.Router();

/**
 * Dynamic Sitemap Generation
 * Route: GET /sitemap.xml
 *
 * Generates XML sitemap containing:
 * - Static pages (home, about, contact)
 * - Dynamic service pages (from MongoDB)
 * - Dynamic portfolio pages (from MongoDB)
 *
 * Google SEO benefit:
 * - Crawlers can find all pages faster
 * - Helps index new/updated content automatically
 * - Signals page priority and update frequency
 */

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || "https://lords-salon.com";

    // Fetch all services from database
    const services = await Service.find({}, "name createdAt updatedAt").lean();

    // Fetch all portfolio items from database
    const portfolioItems = await PortfolioItem.find(
      {},
      "title createdAt updatedAt",
    ).lean();

    // Create URL set XML
    let urlSet = '<?xml version="1.0" encoding="UTF-8"?>\n';
    urlSet += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 1. Static Pages (highest priority, daily update)
    const staticPages = [
      {
        loc: `${baseUrl}/`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: "1.0",
      },
      {
        loc: `${baseUrl}/#services`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${baseUrl}/#portfolio`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        loc: `${baseUrl}/#contact`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: "0.8",
      },
    ];

    staticPages.forEach((page) => {
      urlSet += "  <url>\n";
      urlSet += `    <loc>${escapeXml(page.loc)}</loc>\n`;
      urlSet += `    <lastmod>${page.lastmod}</lastmod>\n`;
      urlSet += `    <changefreq>${page.changefreq}</changefreq>\n`;
      urlSet += `    <priority>${page.priority}</priority>\n`;
      urlSet += "  </url>\n";
    });

    // 2. Dynamic Service Pages (medium priority)
    services.forEach((service) => {
      const serviceSlug = service.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      urlSet += "  <url>\n";
      urlSet += `    <loc>${escapeXml(`${baseUrl}/services/${serviceSlug}`)}</loc>\n`;
      urlSet += `    <lastmod>${new Date(service.updatedAt).toISOString().split("T")[0]}</lastmod>\n`;
      urlSet += "    <changefreq>monthly</changefreq>\n";
      urlSet += "    <priority>0.8</priority>\n";
      urlSet += "  </url>\n";
    });

    // 3. Dynamic Portfolio Pages (medium priority)
    portfolioItems.forEach((item) => {
      const itemSlug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      urlSet += "  <url>\n";
      urlSet += `    <loc>${escapeXml(`${baseUrl}/portfolio/${itemSlug}`)}</loc>\n`;
      urlSet += `    <lastmod>${new Date(item.updatedAt).toISOString().split("T")[0]}</lastmod>\n`;
      urlSet += "    <changefreq>monthly</changefreq>\n";
      urlSet += "    <priority>0.7</priority>\n";
      urlSet += "  </url>\n";
    });

    urlSet += "</urlset>";

    // Set proper headers for XML
    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "max-age=3600"); // Cache for 1 hour
    res.send(urlSet);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

/**
 * Sitemap Index
 * Route: GET /sitemap-index.xml
 *
 * For very large sites (1000+ pages), provides index of multiple sitemaps
 * Current implementation: Single sitemap (can scale later)
 */
router.get("/sitemap-index.xml", (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || "https://lords-salon.com";
  const backendUrl = process.env.BACKEND_URL || "https://api.lords-salon.com";

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(`${backendUrl}/sitemap.xml`)}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.header("Content-Type", "application/xml");
  res.header("Cache-Control", "max-age=3600");
  res.send(sitemapIndex);
});

/**
 * Helper function to escape XML special characters
 */
const escapeXml = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

export default router;
