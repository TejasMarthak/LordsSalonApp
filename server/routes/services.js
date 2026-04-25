import express from "express";
import Service from "../models/Service.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get all services (public)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single service
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || !description || !price || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const service = new Service({
      name,
      description,
      price,
      duration,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
