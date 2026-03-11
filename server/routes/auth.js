import express from "express";
import Admin from "../models/Admin.js";
import { generateToken } from "../config/jwt.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Signup - Create new admin account
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password,
      name: name || "Admin",
      role: role || "manager",
      isActive: true,
    });

    await admin.save();

    const token = generateToken(admin._id);
    res.status(201).json({
      message: "Admin account created successfully",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(admin._id);
    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current admin
router.get("/me", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all admins (owner only)
router.get("/admins", adminAuth, async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.role !== "owner") {
      return res.status(403).json({ error: "Only owners can view all admins" });
    }

    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update admin (owner only)
router.patch("/admins/:id", adminAuth, async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.role !== "owner") {
      return res.status(403).json({ error: "Only owners can update admins" });
    }

    const { name, role, isActive } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, role, isActive },
      { new: true },
    ).select("-password");

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete admin (owner only)
router.delete("/admins/:id", adminAuth, async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.role !== "owner") {
      return res.status(403).json({ error: "Only owners can delete admins" });
    }

    if (req.params.id === req.adminId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete own account
router.delete("/account", adminAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ error: "Password required for account deletion" });
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    await Admin.findByIdAndDelete(req.adminId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth Callback Handler
router.post("/oauth/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID token required" });
    }

    // In production, verify the ID token with Google
    // For now, we'll create/update admin based on Google info
    // You'll need to add google-auth-library to verify tokens properly

    const token = generateToken(null); // Temporary token
    res.json({
      message: "OAuth endpoint ready",
      token,
      note: "Implement Google Auth Library for production",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth Token Exchange (for authorization code flow)
router.post("/oauth/google/callback", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code required" });
    }

    // In production, exchange code for tokens with Google OAuth API
    // This is a placeholder implementation

    res.status(501).json({
      error: "OAuth callback processing requires backend configuration",
      note: "Set up Google OAuth credentials and implement token exchange",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
