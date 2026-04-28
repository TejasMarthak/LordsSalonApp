import express from 'express';
import Discount from '../models/Discount.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// GET - Fetch all discounts (public)
router.get('/', async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch active discounts only (public)
router.get('/active', async (req, res) => {
  try {
    const discounts = await Discount.getActiveDiscounts();
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch single discount by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    res.json(discount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create a new discount (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, discountPercentage, occasion, validFrom, validTo, isActive, applicableServices, applicableCategories } = req.body;

    if (!title || discountPercentage === undefined || !validFrom || !validTo) {
      return res.status(400).json({ error: 'Required fields: title, discountPercentage, validFrom, validTo' });
    }

    const discount = new Discount({
      title,
      description,
      discountPercentage,
      occasion,
      validFrom,
      validTo,
      isActive,
      applicableServices: applicableServices || [],
      applicableCategories: applicableCategories || [],
    });

    const savedDiscount = await discount.save();
    res.status(201).json(savedDiscount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update a discount (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, discountPercentage, occasion, validFrom, validTo, isActive, applicableServices, applicableCategories } = req.body;

    let discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    // Update fields
    discount.title = title || discount.title;
    discount.description = description || discount.description;
    discount.discountPercentage = discountPercentage !== undefined ? discountPercentage : discount.discountPercentage;
    discount.occasion = occasion || discount.occasion;
    discount.validFrom = validFrom || discount.validFrom;
    discount.validTo = validTo || discount.validTo;
    discount.isActive = isActive !== undefined ? isActive : discount.isActive;
    discount.applicableServices = applicableServices || discount.applicableServices;
    discount.applicableCategories = applicableCategories || discount.applicableCategories;

    const updatedDiscount = await discount.save();
    res.json(updatedDiscount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete a discount (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    res.json({ message: 'Discount deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
