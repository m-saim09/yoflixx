const Lead = require("../models/Lead");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { validateLeadPayload, validateStatus } = require("../utils/validation");

const getLeadList = asyncHandler(async (req, res) => {
  const { status, plan, search, page = 1, limit = 10 } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (plan) {
    filter.selectedPlan = plan;
  }

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { projectType: { $regex: search, $options: "i" } },
    ];
  }

  const [total, leads] = await Promise.all([
    Lead.countDocuments(filter),
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
  ]);

  res.json({
    success: true,
    message: "Leads fetched successfully",
    data: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber) || 1,
      leads,
      inquiries: leads,
    },
  });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  res.json({
    success: true,
    message: "Lead fetched successfully",
    data: { lead, inquiry: lead },
  });
});

const createLead = asyncHandler(async (req, res) => {
  const { errors, value } = validateLeadPayload(req.body);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const lead = await Lead.create(value);

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully",
    data: { lead, inquiry: lead },
  });
});

const updateLead = asyncHandler(async (req, res) => {
  const updates = {};
  const stringFields = [
    "fullName",
    "email",
    "phone",
    "companyName",
    "selectedPlan",
    "projectType",
    "budget",
    "timeline",
    "message",
    "requirements",
    "source",
  ];

  stringFields.forEach((field) => {
    if (typeof req.body[field] !== "string") {
      return;
    }

    const nextValue = field === "email" ? req.body[field].trim().toLowerCase() : req.body[field].trim();

    if (field === "requirements") {
      updates[field] = nextValue;
      return;
    }

    if (nextValue) {
      updates[field] = nextValue;
    }
  });

  if (req.body.status) {
    if (!validateStatus(req.body.status)) {
      throw new AppError("Invalid status value", 400);
    }
    updates.status = req.body.status;
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  res.json({
    success: true,
    message: "Lead updated successfully",
    data: { lead, inquiry: lead },
  });
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  res.json({
    success: true,
    message: "Lead deleted successfully",
    data: null,
  });
});

module.exports = {
  getLeadList,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
