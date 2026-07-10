const BUSINESS_STAGES = ["Just Starting", "Existing Business", "Scaling Business", "Enterprise"];
const CONSULTATION_STATUSES = ["New", "Contacted", "Meeting Scheduled", "Converted", "Closed"];

const sanitize = (payload = {}) => ({
  fullName: String(payload.fullName ?? "").trim(),
  businessName: String(payload.businessName ?? "").trim(),
  email: String(payload.email ?? "").trim().toLowerCase(),
  phone: String(payload.phone ?? "").trim(),
  marketplace: String(payload.marketplace ?? "eBay").trim(),
  storeStatus: String(payload.storeStatus ?? "Existing Business").trim(),
  businessDescription: String(payload.businessDescription ?? "").trim(),
  country: String(payload.country ?? "").trim(),
  consent: payload.consent === true || payload.consent === "true",
  monthlyRevenue: String(payload.monthlyRevenue ?? "").trim(),
  storeUrl: String(payload.storeUrl ?? "").trim(),
  preferredMeetingDate: String(payload.preferredMeetingDate ?? "").trim(),
  preferredMeetingTime: String(payload.preferredMeetingTime ?? "").trim(),
  status: String(payload.status ?? "New").trim(),
});

const isEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const isPhone = (value = "") => /^[\d\s\-+()]+$/.test(String(value).trim());
const isValidStoreStatus = (value = "") => BUSINESS_STAGES.includes(String(value).trim());
const isValidConsultationStatus = (value = "") => CONSULTATION_STATUSES.includes(String(value).trim());

const validateConsultation = async (req) => {
  const payload = sanitize(req.body || {});
  const errors = {};

  if (payload.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
  if (payload.businessName.length < 2) errors.businessName = "Business name is required";
  if (!isEmail(payload.email)) errors.email = "A valid email is required";
  if (!isPhone(payload.phone)) errors.phone = "A valid phone number is required";
  if (!payload.marketplace) errors.marketplace = "Please select a marketplace";
  if (!payload.storeStatus) errors.storeStatus = "Please select your business stage";
  if (!isValidStoreStatus(payload.storeStatus)) errors.storeStatus = "Please select a valid business stage";
  if (payload.businessDescription.length < 10) errors.businessDescription = "Please describe your business in at least 10 characters";
  if (!payload.country) errors.country = "Please enter your country";
  if (!payload.consent) errors.consent = "You must agree to be contacted";
  if (payload.status && !isValidConsultationStatus(payload.status)) errors.status = "Please select a valid consultation status";

  if (payload.storeUrl && payload.storeUrl.length > 0 && !/^https?:\/\//i.test(payload.storeUrl)) {
    errors.storeUrl = "Store URL must start with http:// or https://";
  }

  return { errors, value: payload };
};

const validateConsultationUpdate = async (req) => {
  const payload = sanitize(req.body || {});
  const errors = {};

  if (!req.body || Object.keys(req.body).length === 0) {
    errors.body = "No update data provided";
    return { errors, value: {} };
  }

  if (payload.fullName && payload.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
  if (payload.businessName && payload.businessName.length < 2) errors.businessName = "Business name is required";
  if (payload.email && !isEmail(payload.email)) errors.email = "A valid email is required";
  if (payload.phone && !isPhone(payload.phone)) errors.phone = "A valid phone number is required";
  if (payload.storeStatus && !isValidStoreStatus(payload.storeStatus)) errors.storeStatus = "Please select a valid business stage";
  if (payload.businessDescription && payload.businessDescription.length < 10) errors.businessDescription = "Please describe your business in at least 10 characters";
  if (payload.country && !payload.country.trim()) errors.country = "Please enter your country";
  if (payload.consent === false) errors.consent = "You must agree to be contacted";
  if (payload.status && !isValidConsultationStatus(payload.status)) errors.status = "Please select a valid consultation status";

  if (payload.storeUrl && payload.storeUrl.length > 0 && !/^https?:\/\//i.test(payload.storeUrl)) {
    errors.storeUrl = "Store URL must start with http:// or https://";
  }

  return { errors, value: payload };
};

module.exports = { validateConsultation, validateConsultationUpdate };
