import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      lowercase: true,
      default: "",
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in minutes
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffMember",
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    createdFrom: {
      type: String,
      enum: ["website", "whatsapp", "phone", "walk-in"],
      default: "website",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
