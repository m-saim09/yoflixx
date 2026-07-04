const {
  BUDGET_OPTIONS,
  CONTACT_SOURCES,
  LEAD_STATUSES,
  PLAN_OPTIONS,
  TIMELINE_OPTIONS,
} = require("./constants");

const isEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const isPhone = (value = "") => /^[\d\s\-+()]+$/.test(String(value).trim());

const sanitizeLeadPayload = (payload = {}) => ({
  fullName: String(payload.fullName || "").trim(),
  email: String(payload.email || "").trim().toLowerCase(),
  phone: String(payload.phone || "").trim(),
  companyName: String(payload.companyName || "").trim(),
  selectedPlan: String(payload.selectedPlan || "").trim(),
  projectType: String(payload.projectType || "").trim(),
  budget: String(payload.budget || "").trim(),
  timeline: String(payload.timeline || "").trim(),
  message: String(payload.message || "").trim(),
  requirements: String(payload.requirements || payload.message || "").trim(),
  source: CONTACT_SOURCES.includes(payload.source) ? payload.source : "Website Inquiry",
});

const validateLeadPayload = (payload = {}) => {
  const errors = {};
  const lead = sanitizeLeadPayload(payload);

  if (lead.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
  if (!isEmail(lead.email)) errors.email = "A valid email is required";
  if (!isPhone(lead.phone)) errors.phone = "A valid phone number is required";
  if (lead.companyName.length < 2) errors.companyName = "Company name is required";
  if (!lead.selectedPlan) errors.selectedPlan = "Please choose a valid plan";
  if (!lead.projectType) errors.projectType = "Project type is required";
  if (!BUDGET_OPTIONS.includes(lead.budget)) errors.budget = "Please choose a valid budget range";
  if (!TIMELINE_OPTIONS.includes(lead.timeline)) errors.timeline = "Please choose a valid timeline";
  if (lead.message.length < 20) errors.message = "Message must be at least 20 characters";

  return { errors, value: lead };
};

const sanitizeContactPayload = (payload = {}) => ({
  name: String(payload.name || "").trim(),
  email: String(payload.email || "").trim().toLowerCase(),
  phone: String(payload.phone || "").trim(),
  message: String(payload.message || "").trim(),
});

const validateContactPayload = (payload = {}) => {
  const errors = {};
  const contact = sanitizeContactPayload(payload);

  if (contact.name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!isEmail(contact.email)) errors.email = "A valid email is required";
  if (!isPhone(contact.phone)) errors.phone = "A valid phone number is required";
  if (contact.message.length < 10) errors.message = "Message must be at least 10 characters";

  return { errors, value: contact };
};

const validateStatus = (status) => LEAD_STATUSES.includes(status);

module.exports = {
  sanitizeLeadPayload,
  validateLeadPayload,
  sanitizeContactPayload,
  validateContactPayload,
  validateStatus,
};
