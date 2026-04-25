import { verifyToken } from "../config/jwt.js";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.adminId = decoded.id;

    // Check for session timeout (1 hour of inactivity)
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    const lastActivity = new Date(admin.lastActivityAt);
    const now = new Date();
    const inactivityTimeMs = process.env.INACTIVITY_TIMEOUT_MS || 3600000; // 1 hour

    if (now - lastActivity > inactivityTimeMs) {
      return res.status(401).json({
        error: "Session expired due to inactivity",
        sessionExpired: true,
      });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized", details: error.message });
  }
};

export { adminAuth };
