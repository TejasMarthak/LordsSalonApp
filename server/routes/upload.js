import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import UploadedImage from "../models/UploadedImage.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const imageId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${imageId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP allowed"));
    }
  },
});

// Upload image
router.post("/", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageId = path.parse(req.file.filename).name;
    // Construct full URL including protocol and host
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const fullUrl = `${protocol}://${host}/uploads/images/${req.file.filename}`;
    const relativeUrl = `/uploads/images/${req.file.filename}`;
    
    const uploadedImage = new UploadedImage({
      imageId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: relativeUrl,
      uploadedBy: req.adminId,
      metadata: {
        location: req.body.location || "general",
      },
    });

    await uploadedImage.save();

    res.status(201).json({
      message: "Image uploaded successfully",
      imageId,
      url: fullUrl, // Return full URL so frontend can access it from any origin
      uploadedImage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all uploaded images
router.get("/", async (req, res) => {
  try {
    const images = await UploadedImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image
router.delete("/:imageId", adminAuth, async (req, res) => {
  try {
    const image = await UploadedImage.findOne({ imageId: req.params.imageId });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete file from disk
    const filePath = path.join("public", image.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await UploadedImage.deleteOne({ imageId: req.params.imageId });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
