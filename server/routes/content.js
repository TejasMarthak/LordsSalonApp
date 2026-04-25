import express from "express";
import PageContent from "../models/PageContent.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get all site content
router.get("/pages", async (req, res) => {
  try {
    const pages = await PageContent.find().populate("sections.items");
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific page content
router.get("/pages/:pageId", async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageId: req.params.pageId });
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entire page
router.put("/pages/:pageId", adminAuth, async (req, res) => {
  try {
    const page = await PageContent.findOneAndUpdate(
      { pageId: req.params.pageId },
      req.body,
      { new: true, upsert: true },
    );
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add section to page
router.post("/pages/:pageId/sections", adminAuth, async (req, res) => {
  try {
    let page = await PageContent.findOne({ pageId: req.params.pageId });

    if (!page) {
      page = new PageContent({
        pageId: req.params.pageId,
        pageName: req.params.pageId,
        sections: [],
      });
    }

    const newSection = {
      sectionId: `${req.body.type}-${Date.now()}`,
      ...req.body,
      order: page.sections.length,
    };

    page.sections.push(newSection);
    await page.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update section
router.put(
  "/pages/:pageId/sections/:sectionId",
  adminAuth,
  async (req, res) => {
    try {
      const page = await PageContent.findOne({ pageId: req.params.pageId });

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      const section = page.sections.find(
        (s) => s.sectionId === req.params.sectionId,
      );

      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }

      Object.assign(section, req.body);
      await page.save();
      res.json(section);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete section
router.delete(
  "/pages/:pageId/sections/:sectionId",
  adminAuth,
  async (req, res) => {
    try {
      const page = await PageContent.findOne({ pageId: req.params.pageId });

      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      page.sections = page.sections.filter(
        (s) => s.sectionId !== req.params.sectionId,
      );
      await page.save();
      res.json({ message: "Section deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Reorder sections
router.post("/pages/:pageId/reorder-sections", adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    const page = await PageContent.findOne({ pageId: req.params.pageId });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    page.sections.forEach((section) => {
      const newIndex = order.indexOf(section.sectionId);
      section.order = newIndex;
    });

    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HERO SECTION ROUTES ============
// Get hero section (stored in PageContent as special section)
router.get("/hero", async (req, res) => {
  try {
    const page = await PageContent.findOne({ pageId: "home" });
    const heroSection = page?.sections.find((s) => s.type === "hero");

    if (!heroSection) {
      return res.json({
        sectionId: "hero-1",
        type: "hero",
        headline: "Welcome to Luxury",
        subheadline: "Premium Beauty Services",
        description: "Experience sophisticated beauty artistry",
        ctaText: "Book Appointment",
        ctaLink: "/booking",
        heroImages: [],
        order: 0,
      });
    }
    res.json(heroSection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update hero section with carousel images
router.post("/hero", adminAuth, async (req, res) => {
  try {
    const { headline, subheadline, description, ctaText, ctaLink, heroImage, heroImages } = req.body;

    // Validate required fields
    if (!headline || !subheadline) {
      return res.status(400).json({ error: "Headline and subheadline are required" });
    }

    // Validate at least one image
    if (!heroImages || (Array.isArray(heroImages) && heroImages.length === 0)) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    let page = await PageContent.findOne({ pageId: "home" });

    if (!page) {
      page = new PageContent({
        pageId: "home",
        pageName: "Home",
        sections: [],
      });
    }

    const heroIndex = page.sections.findIndex((s) => s.type === "hero");
    const heroData = {
      sectionId: "hero-1",
      type: "hero",
      order: 0,
      headline,
      subheadline,
      description: description || "",
      ctaText: ctaText || "Book Appointment",
      ctaLink: ctaLink || "/booking",
      heroImage: heroImage || heroImages?.[0] || "", // Fallback for legacy support
      heroImages: Array.isArray(heroImages) ? heroImages : [heroImages], // Store all images
    };

    if (heroIndex >= 0) {
      page.sections[heroIndex] = heroData;
    } else {
      page.sections.push(heroData);
    }

    const savedPage = await page.save();
    const savedHero = savedPage.sections.find((s) => s.type === "hero");
    
    res.status(200).json(savedHero);
  } catch (error) {
    console.error("Error saving hero section:", error);
    res.status(500).json({ error: error.message || "Failed to save hero section" });
  }
});

// PUBLIC: Update hero section from client side (without authentication)
router.post("/hero/update", async (req, res) => {
  try {
    const { headline, subheadline, description, ctaText, ctaLink, heroImages } = req.body;

    // Validate required fields
    if (!headline || !subheadline) {
      return res.status(400).json({ error: "Headline and subheadline are required" });
    }

    // Validate at least one image
    if (!heroImages || (Array.isArray(heroImages) && heroImages.length === 0)) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    let page = await PageContent.findOne({ pageId: "home" });

    if (!page) {
      page = new PageContent({
        pageId: "home",
        pageName: "Home",
        sections: [],
      });
    }

    const heroIndex = page.sections.findIndex((s) => s.type === "hero");
    const heroData = {
      sectionId: "hero-1",
      type: "hero",
      order: 0,
      headline,
      subheadline,
      description: description || "",
      ctaText: ctaText || "Book Appointment",
      ctaLink: ctaLink || "/booking",
      heroImage: heroImages?.[0] || "",
      heroImages: Array.isArray(heroImages) ? heroImages : [heroImages],
    };

    if (heroIndex >= 0) {
      page.sections[heroIndex] = heroData;
    } else {
      page.sections.push(heroData);
    }

    const savedPage = await page.save();
    const savedHero = savedPage.sections.find((s) => s.type === "hero");
    
    res.status(200).json(savedHero);
  } catch (error) {
    console.error("Error updating hero section:", error);
    res.status(500).json({ error: error.message || "Failed to update hero section" });
  }
});

export default router;
