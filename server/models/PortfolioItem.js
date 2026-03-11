import mongoose from "mongoose";

const portfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Bridal Makeup",
        "Editorial",
        "Party Makeup",
        "Skincare",
        "Hair",
        "Special Effects",
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    beforeImageUrl: {
      type: String,
      default: null, // for before/after photos
    },
    stylistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffMember",
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("PortfolioItem", portfolioItemSchema);
