const Consultation = require("../models/Consultation");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { validateConsultation, validateConsultationUpdate } = require("../validators/consultationValidator");

const createConsultation = asyncHandler(async (req, res) => {
  const { errors, value } = req.validated ? { errors: {}, value: req.validated } : validateConsultation(req);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const consultation = await Consultation.create(value);

  res.status(201).json({
    success: true,
    message: "Consultation request submitted successfully",
    data: { consultation },
  });
});

const getConsultations = asyncHandler(async (req, res) => {
  const consultations = await Consultation.find().sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    message: "Consultation requests fetched successfully",
    data: { consultations, total: consultations.length },
  });
});

const getConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id).lean();

  if (!consultation) {
    throw new AppError("Consultation request not found", 404);
  }

  res.json({
    success: true,
    message: "Consultation request fetched successfully",
    data: { consultation },
  });
});

const updateConsultation = asyncHandler(async (req, res) => {
  const { errors, value } = req.validated ? { errors: {}, value: req.validated } : await validateConsultationUpdate(req);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const consultation = await Consultation.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });

  if (!consultation) {
    throw new AppError("Consultation request not found", 404);
  }

  res.json({
    success: true,
    message: "Consultation request updated successfully",
    data: { consultation },
  });
});

const updateConsultationStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = ["New", "Contacted", "Meeting Scheduled", "Converted", "Closed"];

  if (!allowedStatuses.includes(req.body?.status)) {
    throw new AppError("Invalid consultation status", 400);
  }

  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!consultation) {
    throw new AppError("Consultation request not found", 404);
  }

  res.json({
    success: true,
    message: "Consultation status updated successfully",
    data: { consultation },
  });
});

const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findByIdAndDelete(req.params.id);

  if (!consultation) {
    throw new AppError("Consultation request not found", 404);
  }

  res.json({
    success: true,
    message: "Consultation request deleted successfully",
    data: null,
  });
});

module.exports = {
  createConsultation,
  getConsultations,
  getConsultation,
  getConsultationById: getConsultation,
  updateConsultation,
  updateConsultationStatus,
  deleteConsultation,
};
