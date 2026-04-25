import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get site settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ siteId: "default" });
    if (!settings) {
      settings = new SiteSettings({ siteId: "default" });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update site settings
router.put("/", adminAuth, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ siteId: "default" });
    if (!settings) {
      settings = new SiteSettings({ siteId: "default" });
    }

    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update branding
router.patch("/branding", adminAuth, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { siteId: "default" },
      { branding: req.body },
      { new: true, upsert: true },
    );
    res.json(settings.branding);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appearance
router.patch("/appearance", adminAuth, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { siteId: "default" },
      { appearance: req.body },
      { new: true, upsert: true },
    );
    res.json(settings.appearance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
router.patch("/contact", adminAuth, async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { siteId: "default" },
      { contact: req.body },
      { new: true, upsert: true },
    );
    res.json(settings.contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update addresses (multiple locations)
router.put("/addresses", adminAuth, async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({ error: "Addresses must be an array" });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { siteId: "default" },
      { addresses },
      { new: true, upsert: true },
    );
    res.json({
      message: "Addresses updated successfully",
      addresses: settings.addresses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update social media links
router.put("/social", adminAuth, async (req, res) => {
  try {
    const { instagram, facebook, whatsapp, twitter } = req.body;

    const settings = await SiteSettings.findOneAndUpdate(
      { siteId: "default" },
      { 
        social: {
          instagram: instagram || "",
          facebook: facebook || "",
          whatsapp: whatsapp || "",
          twitter: twitter || ""
        }
      },
      { new: true, upsert: true },
    );
    res.json({
      message: "Social media links updated successfully",
      social: settings.social
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
