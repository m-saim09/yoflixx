const Contact = require("../models/Contact");
const Lead = require("../models/Lead");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { validateContactPayload } = require("../utils/validation");

const createContact = asyncHandler(async (req, res) => {
  const { errors, value } = validateContactPayload(req.body);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const contact = await Contact.create(value);

  try {
    await Lead.create({
      fullName: value.name,
      email: value.email,
      phone: value.phone,
      companyName: value.name || "Website Contact",
      selectedPlan: value.selectedPlan || "Level 1",
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
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Contacts fetched successfully",
    data: { contacts, total: contacts.length },
  });
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
