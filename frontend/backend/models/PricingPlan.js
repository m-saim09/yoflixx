const mongoose = require("mongoose");

const pricingPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    billingType: {
      type: String,
      required: true,
      trim: true,
      default: "project",
    },
    features: {
      type: [String],
      default: [],
    },
    buttonText: {
      type: String,
      default: "Choose Plan",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pricingPlanSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model("PricingPlan", pricingPlanSchema);
