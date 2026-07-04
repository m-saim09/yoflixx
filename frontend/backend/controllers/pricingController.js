const PricingPlan = require("../models/PricingPlan");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");

const normalizeFeatures = (features = []) =>
  features
    .map((feature) => String(feature || "").trim())
    .filter(Boolean);

const sanitizePricingPayload = (payload = {}) => ({
  title: String(payload.title || "").trim(),
  slug: String(payload.slug || "").trim().toLowerCase(),
  shortDescription: String(payload.shortDescription || "").trim(),
  price: String(payload.price || "").trim(),
  billingType: String(payload.billingType || "project").trim(),
  features: normalizeFeatures(payload.features || []),
  buttonText: String(payload.buttonText || "Choose Plan").trim(),
  badge: String(payload.badge || "").trim(),
  isPopular: Boolean(payload.isPopular),
  isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
  order: Number(payload.order) || 0,
});

const getPublicPricingPlans = asyncHandler(async (req, res) => {
  const pricingPlans = await PricingPlan.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

  res.json({
    success: true,
    message: "Pricing plans fetched successfully",
    data: { pricingPlans },
  });
});

const getAdminPricingPlans = asyncHandler(async (req, res) => {
  const pricingPlans = await PricingPlan.find().sort({ order: 1, createdAt: 1 });

  res.json({
    success: true,
    message: "Pricing plans fetched successfully",
    data: { pricingPlans },
  });
});

const createPricingPlan = asyncHandler(async (req, res) => {
  const payload = sanitizePricingPayload(req.body);

  if (!payload.title || !payload.slug || !payload.shortDescription || !payload.price) {
    throw new AppError("Title, slug, description, and price are required", 400);
  }

  const pricingPlan = await PricingPlan.create(payload);

  res.status(201).json({
    success: true,
    message: "Pricing plan created successfully",
    data: { pricingPlan },
  });
});

const updatePricingPlan = asyncHandler(async (req, res) => {
  const existingPlan = await PricingPlan.findById(req.params.id);

  if (!existingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  const payload = sanitizePricingPayload({
    ...existingPlan.toObject(),
    ...req.body,
    isActive: req.body.isActive !== undefined ? req.body.isActive : existingPlan.isActive,
  });

  const pricingPlan = await PricingPlan.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Pricing plan updated successfully",
    data: { pricingPlan },
  });
});

const deletePricingPlan = asyncHandler(async (req, res) => {
  const pricingPlan = await PricingPlan.findByIdAndDelete(req.params.id);

  if (!pricingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  res.json({
    success: true,
    message: "Pricing plan deleted successfully",
    data: null,
  });
});

const togglePricingPlanStatus = asyncHandler(async (req, res) => {
  const pricingPlan = await PricingPlan.findById(req.params.id);

  if (!pricingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  pricingPlan.isActive = !pricingPlan.isActive;
  await pricingPlan.save();

  res.json({
    success: true,
    message: "Pricing plan status updated successfully",
    data: { pricingPlan },
  });
});

module.exports = {
  getPublicPricingPlans,
  getAdminPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  togglePricingPlanStatus,
};
