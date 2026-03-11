import express from "express";
import PortfolioItem from "../models/PortfolioItem.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get all portfolio items (public)
router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (featured === "true") {
      filter.featured = true;
    }

    const items = await PortfolioItem.find(filter)
      .populate("stylistId", "name role")
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single portfolio item
router.get("/:id", async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id).populate(
      "stylistId",
      "name role bio",
    );

    if (!item) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create portfolio item (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      imageUrl,
      beforeImageUrl,
      stylistId,
    } = req.body;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = new PortfolioItem({
      title,
      category,
      description,
      imageUrl,
      beforeImageUrl,
      stylistId,
    });

    await item.save();
    await item.populate("stylistId", "name role");
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update portfolio item (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("stylistId", "name role");

    if (!item) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete portfolio item (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
