import mongoose from "mongoose";

const staffMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: [
        "Lead Makeup Artist",
        "Hair Stylist",
        "Skincare Specialist",
        "Owner",
        "Assistant",
      ],
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    specializations: [
      {
        type: String, // e.g., 'Bridal Makeup', 'Contouring', 'Hair Extensions'
      },
    ],
    imageUrl: {
      type: String,
      default: null,
    },
    experience: {
      type: Number, // in years
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true },
);

export default mongoose.model("StaffMember", staffMemberSchema);
