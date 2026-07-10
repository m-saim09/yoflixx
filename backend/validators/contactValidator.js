const sanitize = (payload = {}) => ({
  name: String(payload.name || "").trim(),
  email: String(payload.email || "").trim().toLowerCase(),
  phone: String(payload.phone || "").trim(),
  selectedPlan: String(payload.selectedPlan || "").trim(),
  message: String(payload.message || "").trim(),
});

const isEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const isPhone = (value = "") => /^[\d\s\-+()]+$/.test(String(value).trim());

const validateContact = async (req) => {
  const payload = sanitize(req.body || {});
  const errors = {};
  if (payload.name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!isEmail(payload.email)) errors.email = "A valid email is required";
  if (!isPhone(payload.phone)) errors.phone = "A valid phone number is required";
  if (!payload.selectedPlan) errors.selectedPlan = "Please choose a valid plan";
  if (payload.message.length < 10) errors.message = "Message must be at least 10 characters";
  return { errors, value: payload };
};

module.exports = { validateContact };
