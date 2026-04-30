import express from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      bookingDate,
      duration,
      notes,
      status,
      paymentStatus,
      createdFrom,
    } = req.body;

    if (
      !clientName ||
      !clientPhone ||
      !serviceId ||
      !bookingDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const booking = new Booking({
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      serviceName: service.name,
      bookingDate: new Date(bookingDate),
      duration: duration || service.duration,
      notes,
      totalPrice: service.price,
      status: status || "pending",
      paymentStatus: paymentStatus || "pending",
      createdFrom: createdFrom || "website",
    });

    await booking.save();

    const whatsappPhone = process.env.SALON_PHONE || "919733681843";
    res.status(201).json({
      message: "Booking created successfully",
      booking,
      whatsappLink: `https://wa.me/${whatsappPhone}?text=Hi%20Lords%20Salon,%20I%20have%20booked%20${service.name}%20on%20${bookingDate}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId", "name price duration")
      .sort({ bookingDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("serviceId");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin only)
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status, assignedStaff, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, assignedStaff, paymentStatus },
      { new: true },
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update full booking (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      bookingDate,
      duration,
      notes,
      status,
      paymentStatus,
      createdFrom,
    } = req.body;

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // If serviceId is being updated, verify it exists
    if (serviceId && serviceId !== booking.serviceId.toString()) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      booking.serviceId = serviceId;
      booking.serviceName = service.name;
      booking.totalPrice = service.price;
    }

    // Update booking fields
    booking.clientName = clientName || booking.clientName;
    booking.clientEmail = clientEmail || booking.clientEmail;
    booking.clientPhone = clientPhone || booking.clientPhone;
    booking.bookingDate = bookingDate ? new Date(bookingDate) : booking.bookingDate;
    booking.duration = duration !== undefined ? duration : booking.duration;
    booking.notes = notes !== undefined ? notes : booking.notes;
    booking.status = status || booking.status;
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    booking.createdFrom = createdFrom || booking.createdFrom;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel booking (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Booking deleted successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by date range
router.get("/date-range/:startDate/:endDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const bookings = await Booking.find({
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("serviceId", "name price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
