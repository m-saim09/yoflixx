const mongoose = require("mongoose");
const PricingPlan = require("../models/PricingPlan");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { getDatabaseStatus } = require("../config/db");

const devPricingPlansStore = [];

const isDatabaseAvailable = () => getDatabaseStatus() === "connected";
const generateDevPricingPlanId = () => new mongoose.Types.ObjectId().toString();

const getDevPricingPlans = () =>
  [...devPricingPlansStore].sort((a, b) => {
    const orderA = Number(a.order) || 0;
    const orderB = Number(b.order) || 0;

    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

const findDevPricingPlanById = (id) =>
  devPricingPlansStore.find((plan) => String(plan._id) === String(id));

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
  isFeatured: Boolean(payload.isFeatured),
  isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
  order: Number(payload.order) || 0,
});

const buildSuccessResponse = (message, data, errors = {}) => ({
  success: true,
  message,
  data,
  errors,
});

const getRequestPayload = (req) => {
  if (req.validated && typeof req.validated === "object") {
    return sanitizePricingPayload(req.validated);
  }

  return sanitizePricingPayload(req.body);
};

const promoteFeaturedPlan = (plans) => {
  const index = plans.findIndex((plan) => plan.isFeatured);
  if (index === -1) return plans;

  const featured = plans.splice(index, 1)[0];
  const insertAt = Math.floor(plans.length / 2);
  plans.splice(insertAt, 0, featured);
  return plans;
};

const ensureNoDuplicatePricingPlan = async (payload, currentId = null) => {
  if (!isDatabaseAvailable()) return;

  const query = {
    $or: [{ slug: payload.slug }, { title: payload.title }],
  };

  if (currentId) {
    query._id = { $ne: currentId };
  }

  const existingPlan = await PricingPlan.findOne(query).lean();
  if (!existingPlan) return;

  if (existingPlan.slug === payload.slug) {
    throw new AppError("A pricing plan with this slug already exists", 409, { slug: "A pricing plan with this slug already exists" });
  }

  throw new AppError("A pricing plan with this title already exists", 409, { title: "A pricing plan with this title already exists" });
};

const unsetPreviousFeaturedPlan = async (keepId) => {
  if (isDatabaseAvailable()) {
    const existingFeatured = await PricingPlan.find({ isFeatured: true }).select("_id");
    await Promise.all(
      existingFeatured
        .filter((plan) => String(plan._id) !== String(keepId))
        .map((plan) => PricingPlan.findByIdAndUpdate(plan._id, { isFeatured: false }))
    );
    return;
  }

  devPricingPlansStore.forEach((plan) => {
    if (String(plan._id) !== String(keepId) && plan.isFeatured) {
      plan.isFeatured = false;
    }
  });
};

const getPublicPricingPlans = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!isDatabaseAvailable()) {
    if (id) {
      const plan = findDevPricingPlanById(id);
      if (!plan) throw new AppError("Pricing plan not found", 404);
      return res.json(buildSuccessResponse("Pricing plan fetched", { pricingPlan: plan }));
    }

    const pricingPlans = getDevPricingPlans().filter((plan) => plan.isActive);
    return res.json(buildSuccessResponse("Pricing plans fetched successfully", { pricingPlans }));
  }

  if (id) {
    const plan = await PricingPlan.findById(id).lean();
    if (!plan) throw new AppError("Pricing plan not found", 404);
    return res.json(buildSuccessResponse("Pricing plan fetched", { pricingPlan: plan }));
  }

  const pricingPlans = await PricingPlan.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
  const orderedPlans = promoteFeaturedPlan(pricingPlans.slice());

  return res.json(buildSuccessResponse("Pricing plans fetched successfully", { pricingPlans: orderedPlans }));
});

const getAdminPricingPlans = asyncHandler(async (req, res) => {
  if (!isDatabaseAvailable()) {
    const pricingPlans = getDevPricingPlans();
    return res.json(buildSuccessResponse("Pricing plans fetched successfully", { pricingPlans }));
  }

  const pricingPlans = await PricingPlan.find().sort({ order: 1, createdAt: 1 }).lean();
  return res.json(buildSuccessResponse("Pricing plans fetched successfully", { pricingPlans }));
});

const createPricingPlan = asyncHandler(async (req, res) => {
  const payload = getRequestPayload(req);

  if (!payload.title || !payload.slug || !payload.shortDescription || !payload.price) {
    throw new AppError("Title, slug, description, and price are required", 400);
  }

  await ensureNoDuplicatePricingPlan(payload);

  if (payload.isFeatured) {
    await unsetPreviousFeaturedPlan();
  }

  if (!isDatabaseAvailable()) {
    const pricingPlan = {
      ...payload,
      _id: generateDevPricingPlanId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    devPricingPlansStore.push(pricingPlan);

    return res.status(201).json(buildSuccessResponse("Pricing plan created successfully", { pricingPlan }));
  }

  const pricingPlan = await PricingPlan.create(payload);

  return res.status(201).json(buildSuccessResponse("Pricing plan created successfully", { pricingPlan }));
});

const updatePricingPlan = asyncHandler(async (req, res) => {
  const currentPayload = getRequestPayload(req);

  if (!isDatabaseAvailable()) {
    const existingPlan = findDevPricingPlanById(req.params.id);
    if (!existingPlan) {
      throw new AppError("Pricing plan not found", 404);
    }

    const payload = sanitizePricingPayload({
      ...existingPlan,
      ...currentPayload,
      isActive: currentPayload.isActive !== undefined ? currentPayload.isActive : existingPlan.isActive,
    });

    if (payload.isFeatured) {
      await unsetPreviousFeaturedPlan(existingPlan._id);
    }

    const pricingPlan = { ...existingPlan, ...payload, updatedAt: new Date() };
    const planIndex = devPricingPlansStore.findIndex((plan) => String(plan._id) === String(req.params.id));
    devPricingPlansStore[planIndex] = pricingPlan;

    return res.json(buildSuccessResponse("Pricing plan updated successfully", { pricingPlan }));
  }

  const existingPlan = await PricingPlan.findById(req.params.id);

  if (!existingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  const payload = sanitizePricingPayload({
    ...existingPlan.toObject(),
    ...currentPayload,
    isActive: currentPayload.isActive !== undefined ? currentPayload.isActive : existingPlan.isActive,
  });

  if (payload.title || payload.slug) {
    await ensureNoDuplicatePricingPlan(payload, existingPlan._id);
  }

  if (payload.isFeatured) {
    await unsetPreviousFeaturedPlan(existingPlan._id);
  }

  const pricingPlan = await PricingPlan.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  return res.json(buildSuccessResponse("Pricing plan updated successfully", { pricingPlan }));
});

const deletePricingPlan = asyncHandler(async (req, res) => {
  if (!isDatabaseAvailable()) {
    const planIndex = devPricingPlansStore.findIndex((plan) => String(plan._id) === String(req.params.id));
    if (planIndex === -1) {
      throw new AppError("Pricing plan not found", 404);
    }

    devPricingPlansStore.splice(planIndex, 1);

    return res.json(buildSuccessResponse("Pricing plan deleted successfully", null));
  }

  const pricingPlan = await PricingPlan.findByIdAndDelete(req.params.id);

  if (!pricingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  return res.json(buildSuccessResponse("Pricing plan deleted successfully", null));
});

const togglePricingPlanStatus = asyncHandler(async (req, res) => {
  if (!isDatabaseAvailable()) {
    const pricingPlan = findDevPricingPlanById(req.params.id);
    if (!pricingPlan) {
      throw new AppError("Pricing plan not found", 404);
    }

    pricingPlan.isActive = !pricingPlan.isActive;
    if (!pricingPlan.isActive) {
      pricingPlan.isFeatured = false;
    }
    pricingPlan.updatedAt = new Date();

    return res.json(buildSuccessResponse("Pricing plan status updated successfully", { pricingPlan }));
  }

  const pricingPlan = await PricingPlan.findById(req.params.id);

  if (!pricingPlan) {
    throw new AppError("Pricing plan not found", 404);
  }

  pricingPlan.isActive = !pricingPlan.isActive;
  if (!pricingPlan.isActive) {
    pricingPlan.isFeatured = false;
  }
  await pricingPlan.save();

  return res.json(buildSuccessResponse("Pricing plan status updated successfully", { pricingPlan }));
});

module.exports = {
  getPublicPricingPlans,
  getAdminPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  togglePricingPlanStatus,
};
