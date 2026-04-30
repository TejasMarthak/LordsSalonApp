import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    occasion: {
      type: String,
      default: '',
      trim: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableServices: [String], // e.g., ['Bridal', 'Makeup', 'All']
    applicableCategories: [String], // e.g., ['womens', 'bridal']
  },
  { timestamps: true }
);

// Ensure validFrom is before validTo
discountSchema.pre('save', function (next) {
  if (this.validFrom > this.validTo) {
    next(new Error('Valid From date must be before Valid To date'));
  } else {
    next();
  }
});

// Static method to get active discounts
discountSchema.statics.getActiveDiscounts = async function () {
  const now = new Date();
  return await this.find({
    isActive: true,
    validFrom: { $lte: now },
    validTo: { $gte: now },
  });
};

export default mongoose.model('Discount', discountSchema);
