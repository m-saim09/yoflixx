const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    businessName: {
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
    marketplace: {
      type: String,
      required: true,
      trim: true,
      enum: ["eBay", "Walmart", "TikTok Shop", "Amazon"],
      default: "eBay",
    },
    monthlyRevenue: {
      type: String,
      trim: true,
      default: "",
    },
    storeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    storeStatus: {
      type: String,
      required: true,
      trim: true,
      enum: ["Just Starting", "Existing Business", "Scaling Business", "Enterprise", "New", "Existing", "Scaling"],
      default: "Existing Business",
    },
    businessDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    preferredMeetingDate: {
      type: String,
      trim: true,
      default: "",
    },
    preferredMeetingTime: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    consent: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Meeting Scheduled", "Converted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

consultationSchema.index({ createdAt: -1, status: 1, marketplace: 1 });

module.exports = mongoose.model("Consultation", consultationSchema, "consultationRequests");
