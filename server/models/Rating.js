import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    serviceName: {
      type: String,
      default: "General Experience",
    },
    ratingType: {
      type: String,
      enum: ["service", "overall"],
      default: "service",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDisplayed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent duplicate reviews from same email for same service
ratingSchema.index({ clientEmail: 1, serviceId: 1 }, { sparse: true });

export default mongoose.model("Rating", ratingSchema);
