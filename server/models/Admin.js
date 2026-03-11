import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 8,
      // Optional: users can sign up with Google OAuth without a password
    },
    name: {
      type: String,
      default: "Owner",
    },
    role: {
      type: String,
      enum: ["owner", "manager"],
      default: "owner",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      index: true,
      sparse: true, // Allow null values for non-OAuth users
    },
    googleProfile: {
      picture: String,
    },
  },
  { timestamps: true },
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  // Only hash if password exists and is modified
  if (!this.password || !this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Admin", adminSchema);
