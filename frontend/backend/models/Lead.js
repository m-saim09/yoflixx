const mongoose = require("mongoose");
const { BUDGET_OPTIONS, CONTACT_SOURCES, LEAD_STATUSES, PLAN_OPTIONS, TIMELINE_OPTIONS } = require("../utils/constants");

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    selectedPlan: {
      type: String,
      enum: PLAN_OPTIONS,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: String,
      enum: BUDGET_OPTIONS,
      required: true,
    },
    timeline: {
      type: String,
      enum: TIMELINE_OPTIONS,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 4000,
    },
    requirements: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
    },
    source: {
      type: String,
      enum: CONTACT_SOURCES,
      default: "Website Inquiry",
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, selectedPlan: 1 });
leadSchema.index({ fullName: "text", email: "text", companyName: "text", projectType: "text" });

module.exports = mongoose.model("Lead", leadSchema);
