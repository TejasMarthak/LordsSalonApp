import mongoose from "mongoose";

const uploadedImageSchema = new mongoose.Schema(
  {
    imageId: { type: String, unique: true, required: true },
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    thumbnailUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    uploadedAt: { type: Date, default: Date.now },
    usageCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    metadata: {
      width: Number,
      height: Number,
      aspectRatio: String,
      location: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("UploadedImage", uploadedImageSchema);
