const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const sanitize = (payload = {}) => ({
  title: String(payload.title || "").trim(),
  slug: String(payload.slug || "").trim().toLowerCase(),
  shortDescription: String(payload.shortDescription || "").trim(),
  price: String(payload.price || "").trim(),
  billingType: String(payload.billingType || "project").trim(),
  features: Array.isArray(payload.features) ? payload.features.map((feature) => String(feature || "").trim()).filter(Boolean) : [],
  buttonText: String(payload.buttonText || "Choose Plan").trim(),
  badge: String(payload.badge || "").trim(),
  isPopular: Boolean(payload.isPopular),
  isFeatured: Boolean(payload.isFeatured),
  isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
  order: Number(payload.order) || 0,
});

const validateCreateOrUpdate = async (req) => {
  const payload = sanitize(req.body || {});
  const errors = {};

  if (!payload.title) {
    errors.title = "Title is required";
  } else if (payload.title.length > 80) {
    errors.title = "Title must be 80 characters or fewer";
  }

  if (!payload.slug) {
    errors.slug = "Slug is required";
  } else if (!slugPattern.test(payload.slug)) {
    errors.slug = "Slug must use lowercase letters, numbers, and hyphens";
  }

  if (!payload.shortDescription) {
    errors.shortDescription = "Short description is required";
  }

  if (!payload.price) {
    errors.price = "Price is required";
  }

  return { errors, value: payload };
};

module.exports = { validateCreateOrUpdate };
