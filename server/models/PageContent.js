import mongoose from "mongoose";

const pageContentSchema = new mongoose.Schema(
  {
    pageId: {
      type: String,
      required: true,
      enum: ["home", "about", "services", "portfolio", "contact"],
      unique: true,
    },
    pageName: String,
    sections: [
      {
        sectionId: String,
        type: {
          type: String,
          enum: [
            "hero",
            "services",
            "portfolio",
            "testimonials",
            "about",
            "contact",
            "custom-section",
          ],
        },
        isVisible: { type: Boolean, default: true },
        order: Number,
        // Hero Section Fields
        headline: String,
        subheadline: String,
        description: String,
        ctaText: String,
        ctaLink: String,
        heroImage: String, // Legacy single image
        heroImages: [String], // New carousel images array
        // Generic Fields
        title: String,
        subtitle: String,
        backgroundImage: String,
        backgroundColor: String,
        content: mongoose.Schema.Types.Mixed,
        layout: {
          columns: { type: Number, default: 3 },
          spacing: { type: String, default: "medium" },
        },
        items: [
          {
            id: String,
            title: String,
            description: String,
            image: String,
            beforeImage: String,
            afterImage: String,
            price: Number,
            duration: Number,
            category: String,
          },
        ],
      },
    ],
    meta: {
      title: String,
      description: String,
      keywords: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("PageContent", pageContentSchema);
