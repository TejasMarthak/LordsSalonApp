import { verifyToken } from "../config/jwt.js";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = verifyToken(token);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized", details: error.message });
  }
};

export { adminAuth };
