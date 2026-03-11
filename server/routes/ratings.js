import express from "express";
import Rating from "../models/Rating.js";
import Service from "../models/Service.js";

const router = express.Router();

// Create rating
router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, serviceId, rating, review, ratingType } =
      req.body;

    if (!clientName || !clientEmail || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    let serviceName = "General Experience";
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (service) serviceName = service.name;
    }

    const ratingObj = new Rating({
      clientName,
      clientEmail,
      serviceId: serviceId || null,
      serviceName,
      rating,
      review,
      ratingType: ratingType || (serviceId ? "service" : "overall"),
    });

    await ratingObj.save();

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: ratingObj,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all approved ratings
router.get("/", async (req, res) => {
  try {
    const { limit = 10, serviceId } = req.query;

    let query = { isApproved: true, isDisplayed: true };
    if (serviceId) query.serviceId = serviceId;

    const ratings = await Rating.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get average rating for service
router.get("/average/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;

    const result = await Rating.aggregate([
      {
        $match: {
          serviceId: { $oid: serviceId },
          isApproved: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ratings (admin)
router.get("/all", async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    const query = {};
    if (status === "pending") query.isApproved = false;
    if (status === "approved") query.isApproved = true;

    const ratings = await Rating.find(query).sort({
      createdAt: -1,
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve rating (admin)
router.patch("/:id/approve", async (req, res) => {
  try {
    const { isDisplayed = true } = req.body;

    const rating = await Rating.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, isDisplayed },
      { new: true },
    );

    if (!rating) return res.status(404).json({ error: "Rating not found" });

    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject rating (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
