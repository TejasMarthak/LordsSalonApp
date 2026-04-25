import express from "express";
import Admin from "../models/Admin.js";
import { generateToken } from "../config/jwt.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { sendOTPEmail, sendPasswordResetConfirmation } from "../utils/emailService.js";

const router = express.Router();

// ==================== AUTHENTICATION ====================

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
      lastActivityAt: new Date(),
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

    // Check if admin has a password (password login not available for OAuth-only users)
    if (!admin.password) {
      return res.status(401).json({
        error: "Please use Google OAuth to login",
        useGoogleOAuth: true,
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last activity
    admin.lastActivityAt = new Date();
    await admin.save();

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

// ==================== SESSION MANAGEMENT ====================

// Get current admin
router.get("/me", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password -otp -resetToken");
    
    // Update last activity
    if (admin) {
      admin.lastActivityAt = new Date();
      await admin.save();
    }
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update activity timestamp (called periodically from frontend)
router.post("/activity", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (admin) {
      admin.lastActivityAt = new Date();
      await admin.save();
    }
    res.json({ success: true, lastActivityAt: admin.lastActivityAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN MANAGEMENT ====================

// Get all admins (owner only)
router.get("/admins", adminAuth, async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.adminId);
    if (currentAdmin.role !== "owner") {
      return res.status(403).json({ error: "Only owners can view all admins" });
    }

    const admins = await Admin.find().select("-password -otp -resetToken");
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
    ).select("-password -otp -resetToken");

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

    if (!admin.password) {
      return res.status(400).json({
        error: "Cannot delete OAuth-only account with password",
      });
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

// ==================== PASSWORD RESET - FORGOT PASSWORD ====================

// Step 1: Request password reset - Send OTP to email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // For security, don't reveal if email exists
      return res.json({
        message: "If email exists, OTP has been sent",
        success: true,
      });
    }

    // Generate OTP
    const otp = admin.generateOTP();
    await admin.save();

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      admin.clearOTP();
      await admin.save();
      return res.status(500).json({
        error: "Failed to send OTP email",
        details: emailError.message,
      });
    }

    res.json({
      message: "OTP sent to your email",
      success: true,
      masked_email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
    });
  } catch (error) {
    console.error("❌ Forgot-password endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!admin.verifyOTP(otp)) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // OTP verified, generate a temporary token for password reset
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // Valid for 30 minutes
    admin.clearOTP();
    await admin.save();

    res.json({
      message: "OTP verified successfully",
      success: true,
      resetToken, // Send this to frontend to use in password reset
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 3: Reset password with OTP verification
router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        error: "Email, reset token, and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify reset token
    if (
      admin.resetToken !== resetToken ||
      !admin.resetTokenExpiry ||
      Date.now() > admin.resetTokenExpiry
    ) {
      return res.status(401).json({
        error: "Invalid or expired reset token",
      });
    }

    // Update password
    admin.password = newPassword;
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    admin.lastActivityAt = new Date();
    await admin.save();

    // Send confirmation email
    try {
      await sendPasswordResetConfirmation(email, admin.name);
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
      // Don't fail the reset, just log the error
    }

    res.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GOOGLE OAUTH ====================

// Google OAuth Token Exchange (for authorization code flow)
router.post("/oauth/google/callback", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({
        error: "OAuth not properly configured",
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

    // Decode the ID token
    const parts = id_token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ error: "Invalid ID token format" });
    }

    // Decode the payload
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    );

    // Extract user information
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Find or create admin user
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // Create new admin account
      admin = new Admin({
        email,
        name: name || email.split("@")[0],
        googleId,
        googleProfile: { 
          name: name,
          picture 
        },
        isActive: true,
        role: "manager",
        lastActivityAt: new Date(),
      });

      await admin.save();
    } else {
      // Update existing admin with Google info if they don't have it
      if (!admin.googleId) {
        admin.googleId = googleId;
        admin.googleProfile = { 
          name: name,
          picture 
        };
      }
      admin.lastActivityAt = new Date();
      await admin.save();
    }

    // Generate JWT token for the app
    const token = generateToken(admin._id);

    res.json({
      message: "Google OAuth authentication successful",
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
      error: "Google OAuth authentication failed",
      details: error.message,
    });
  }
});

// ==================== PROFILE MANAGEMENT ====================

// Update password
router.put("/update-password", adminAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      message: "Password updated successfully",
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile (name, phone)
router.put("/update-profile", adminAuth, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    
    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
