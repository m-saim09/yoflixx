const Contact = require("../models/Contact");
const Lead = require("../models/Lead");
const PricingPlan = require("../models/PricingPlan");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { validateContactPayload } = require("../utils/validation");

const createContact = asyncHandler(async (req, res) => {
  const { errors, value } = req.validated ? { errors: {}, value: req.validated } : validateContactPayload(req.body);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const contact = await Contact.create({
    ...value,
    selectedPlan: value.selectedPlan || undefined,
  });

  try {
    // Resolve plan title for Lead.selectedPlan while storing the plan _id on Contact
    let leadSelectedPlan = value.selectedPlan || "Level 1";
    if (value.selectedPlan) {
      try {
        const plan = await PricingPlan.findById(value.selectedPlan).lean();
        if (plan) {
          leadSelectedPlan = plan.title || plan.slug || String(plan._id);
        }
      } catch (planErr) {
        // ignore and fallback to provided value
      }
    }

    await Lead.create({
      fullName: value.name,
      email: value.email,
      phone: value.phone,
      companyName: value.name || "Website Contact",
      selectedPlan: leadSelectedPlan,
      projectType: "Website Inquiry",
      budget: "$5k - $10k",
      timeline: "Flexible timeline",
      message: value.message,
      requirements: value.message,
      source: "Website Inquiry",
      status: "New",
    });
  } catch (leadError) {
    console.error("Failed to create lead from contact submission:", leadError);
  }

  res.status(201).json({
    success: true,
    message: "Contact request submitted successfully",
    data: { contact },
  });
});

const getContacts = asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      message: "Contacts fetched successfully",
      data: { contacts, total: contacts.length },
    });
  } catch (error) {
    console.error("Contacts fetch failed:", error?.message || error);
    return res.json({
      success: false,
      message: "Contacts unavailable (dev fallback)",
      data: { contacts: [], total: 0 },
    });
  }
});

const updateContact = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.status) {
    const allowedStatuses = ["New", "Read", "Replied"];
    if (!allowedStatuses.includes(req.body.status)) {
      throw new AppError("Invalid contact status", 400);
    }
    updates.status = req.body.status;
  }

  const contact = await Contact.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  res.json({
    success: true,
    message: "Contact updated successfully",
    data: { contact },
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  res.json({
    success: true,
    message: "Contact deleted successfully",
    data: null,
  });
});

module.exports = {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
};
