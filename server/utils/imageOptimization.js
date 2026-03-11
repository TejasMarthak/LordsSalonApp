import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

/**
 * Image Optimization Middleware
 * Converts uploaded images to WebP, creates thumbnails, and optimizes file sizes
 *
 * Usage in routes:
 * router.post('/upload', optimizeImages, ...handler)
 */

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const OPTIMIZED_DIR = path.join(UPLOAD_DIR, "optimized");
const THUMBNAIL_DIR = path.join(UPLOAD_DIR, "thumbnails");

/**
 * Ensure directories exist
 */
const ensureDirectories = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(OPTIMIZED_DIR, { recursive: true });
    await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating directories:", error);
  }
};

// Call on module load
ensureDirectories();

/**
 * Optimize single image file
 * Converts to WebP, maintains aspect ratio, optimizes quality
 */
export const optimizeImage = async (filePath, fileName, type = "main") => {
  try {
    const uniqueName = `${uuidv4()}-${fileName}`;
    const webpPath = path.join(OPTIMIZED_DIR, `${uniqueName}.webp`);
    const jpgPath = path.join(OPTIMIZED_DIR, `${uniqueName}.jpg`);

    // Get image metadata to determine dimensions
    const metadata = await sharp(filePath).metadata();
    const { width, height } = metadata;

    // Determine quality based on image type
    const quality = type === "thumbnail" ? 60 : 80;
    const resizeWidth = type === "thumbnail" ? 300 : undefined;

    if (type === "thumbnail") {
      // Create thumbnail (300x300)
      await sharp(filePath)
        .resize(300, 300, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality })
        .toFile(path.join(THUMBNAIL_DIR, `thumb-${uniqueName}.webp`));

      await sharp(filePath)
        .resize(300, 300, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality })
        .toFile(path.join(THUMBNAIL_DIR, `thumb-${uniqueName}.jpg`));
    } else {
      // Create WebP version (optimized for web)
      await sharp(filePath).webp({ quality }).toFile(webpPath);

      // Create JPEG fallback (for older browsers)
      await sharp(filePath).jpeg({ quality }).toFile(jpgPath);
    }

    // Get file sizes for optimization metrics
    const webpStats = await fs.stat(webpPath);
    const jpgStats = await fs.stat(jpgPath);

    return {
      success: true,
      webpPath: webpPath.replace(process.cwd(), ""),
      jpgPath: jpgPath.replace(process.cwd(), ""),
      webpSize: webpStats.size,
      jpgSize: jpgStats.size,
      originalDimensions: { width, height },
      optimizationRatio: `${((1 - webpStats.size / jpgStats.size) * 100).toFixed(2)}%`,
    };
  } catch (error) {
    console.error("Image optimization error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Batch optimize multiple images
 */
export const optimizeMultipleImages = async (filePaths) => {
  const results = await Promise.all(
    filePaths.map((filePath) => {
      const fileName = path.basename(filePath);
      return optimizeImage(filePath, fileName);
    }),
  );

  return results;
};

/**
 * Express Middleware for automatic image optimization
 * Attach to file upload routes
 */
export const imageOptimizationMiddleware = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    req.optimizedImages = [];

    for (const file of req.files) {
      const optimized = await optimizeImage(
        file.path,
        file.filename,
        file.mimetype.includes("image") ? "main" : "thumbnail",
      );

      if (optimized.success) {
        req.optimizedImages.push({
          filename: file.originalname,
          ...optimized,
        });
      }
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Image optimization failed",
    });
  }
};

/**
 * Responsive Image Helper
 * Generates srcSet string for responsive images
 */
export const generateResponsiveSrcSet = (basePath) => {
  const sizes = [480, 768, 1024, 1280, 1920];
  return sizes.map((size) => `${basePath}?w=${size}&q=80 ${size}w`).join(", ");
};

/**
 * Image Transformation Utility
 * On-the-fly image transformations (resize, quality adjustment, format conversion)
 */
export const transformImage = async (
  sourcePath,
  { width, height, quality = 80, format = "webp" } = {},
) => {
  try {
    let transform = sharp(sourcePath);

    if (width || height) {
      transform = transform.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (format === "webp") {
      transform = transform.webp({ quality });
    } else if (format === "jpeg") {
      transform = transform.jpeg({ quality });
    }

    return await transform.toBuffer();
  } catch (error) {
    console.error("Transform error:", error);
    throw error;
  }
};

export default {
  optimizeImage,
  optimizeMultipleImages,
  imageOptimizationMiddleware,
  generateResponsiveSrcSet,
  transformImage,
};
