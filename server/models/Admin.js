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
    phone: {
      type: String,
      sparse: true,
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
      name: String,
    },
    // Password reset fields
    resetToken: {
      type: String,
      sparse: true,
    },
    resetTokenExpiry: {
      type: Date,
      sparse: true,
    },
    // OTP for password reset via email
    otp: {
      type: String,
      sparse: true,
    },
    otpExpiry: {
      type: Date,
      sparse: true,
    },
    // Last activity timestamp for session timeout
    lastActivityAt: {
      type: Date,
      default: Date.now,
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

// Method to generate OTP
adminSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
  return otp;
};

// Method to verify OTP
adminSchema.methods.verifyOTP = function (providedOtp) {
  if (!this.otp || !this.otpExpiry) {
    return false;
  }
  if (Date.now() > this.otpExpiry) {
    this.otp = null;
    this.otpExpiry = null;
    return false;
  }
  return this.otp === providedOtp;
};

// Method to clear OTP
adminSchema.methods.clearOTP = function () {
  this.otp = null;
  this.otpExpiry = null;
};

export default mongoose.model("Admin", adminSchema);
