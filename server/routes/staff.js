import express from "express";
import StaffMember from "../models/StaffMember.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Get all staff members (public)
router.get("/", async (req, res) => {
  try {
    const staff = await StaffMember.find({ available: true }).sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single staff member
router.get("/:id", async (req, res) => {
  try {
    const member = await StaffMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create staff member (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, role, bio, specializations, experience } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const member = new StaffMember({
      name,
      role,
      bio,
      specializations,
      experience,
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff member (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const member = await StaffMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!member) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete staff member (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const member = await StaffMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
