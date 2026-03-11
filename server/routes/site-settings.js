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

export default router;
