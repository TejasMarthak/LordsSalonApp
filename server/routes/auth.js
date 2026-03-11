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

    // Exchange authorization code for tokens with Google
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: "OAuth not properly configured",
        details:
          "Missing GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, or GOOGLE_OAUTH_REDIRECT_URI",
      });
    }

    // Exchange code for tokens with Google's token endpoint
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return res.status(401).json({
        error: "Failed to exchange authorization code",
        details: error.error_description || error.error,
      });
    }

    const tokenData = await tokenResponse.json();
    const { id_token } = tokenData;

    if (!id_token) {
      return res
        .status(401)
        .json({ error: "No ID token received from Google" });
    }

    // Decode the ID token (without verification for now, but you should verify in production)
    // The token format is: header.payload.signature
    const parts = id_token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ error: "Invalid ID token format" });
    }

    // Decode the payload (second part)
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    );

    // Extract user information from the ID token
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Find or create admin user
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // Create new admin account (with a default role - owner or manager based on your logic)
      admin = new Admin({
        email,
        name: name || email.split("@")[0],
        googleId,
        googleProfile: picture ? { picture } : undefined,
        // Don't set password for Google OAuth users initially
        isActive: true,
        role: "manager", // Default role - adjust as needed
      });

      await admin.save();
    } else {
      // Update existing admin with Google info if they don't have it yet
      if (!admin.googleId) {
        admin.googleId = googleId;
        if (picture) {
          admin.googleProfile = { picture };
        }
        await admin.save();
      }
    }

    // Generate JWT token for the app
    const token = generateToken(admin._id);

    res.json({
      message: "OAuth authentication successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        picture: admin.googleProfile?.picture,
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({
      error: "OAuth authentication failed",
      details: error.message,
    });
  }
});

export default router;
