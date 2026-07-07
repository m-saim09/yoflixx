const mongoose = require("mongoose");

const websiteSettingsSchema = new mongoose.Schema(
  {
    businessInfo: {
      websiteName: { type: String, default: "Yoflix", trim: true },
      companyName: { type: String, default: "Yoflix Studio", trim: true },
      tagline: { type: String, default: "", trim: true },
      aboutText: { type: String, default: "", trim: true },
      footerDescription: { type: String, default: "", trim: true },
    },
    heroSection: {
      badge: { type: String, default: "", trim: true },
      title: { type: String, default: "", trim: true },
      highlightText: { type: String, default: "", trim: true },
      description: { type: String, default: "", trim: true },
      primaryButtonText: { type: String, default: "", trim: true },
      primaryButtonLink: { type: String, default: "", trim: true },
      secondaryButtonText: { type: String, default: "", trim: true },
      secondaryButtonLink: { type: String, default: "", trim: true },
      backgroundImage: { type: String, default: "", trim: true },
    },
    aboutSection: {
      title: { type: String, default: "", trim: true },
      description: { type: String, default: "", trim: true },
      bullets: { type: [String], default: [] },
      cards: {
        type: [
          {
            title: { type: String, default: "", trim: true },
            body: { type: String, default: "", trim: true },
          },
        ],
        default: [],
      },
    },
    contactInfo: {
      businessEmail: { type: String, default: "", trim: true, lowercase: true },
      supportEmail: { type: String, default: "", trim: true, lowercase: true },
      phoneNumber: { type: String, default: "", trim: true },
      whatsappNumber: { type: String, default: "", trim: true },
      officeAddress: { type: String, default: "", trim: true },
      googleMapsLink: { type: String, default: "", trim: true },
    },
    socialLinks: {
      facebook: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
      linkedIn: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
    },
    branding: {
      logo: { type: String, default: "", trim: true },
      favicon: { type: String, default: "", trim: true },
      footerLogo: { type: String, default: "", trim: true },
      primaryColor: { type: String, default: "#2563eb", trim: true },
      secondaryColor: { type: String, default: "#0f172a", trim: true },
      ogImage: { type: String, default: "", trim: true },
    },
    seoSettings: {
      metaTitle: { type: String, default: "", trim: true },
      metaDescription: { type: String, default: "", trim: true },
      keywords: { type: [String], default: [] },
    },
    services: {
      type: [
        {
          id: { type: String, default: "", trim: true },
          title: { type: String, default: "", trim: true },
          eyebrow: { type: String, default: "", trim: true },
          description: { type: String, default: "", trim: true },
          bullets: { type: [String], default: [] },
          stat: { type: String, default: "", trim: true },
          icon: { type: String, default: "layers", trim: true },
        },
      ],
      default: [],
    },
    caseStudies: {
      type: [
        {
          id: { type: String, default: "", trim: true },
          title: { type: String, default: "", trim: true },
          category: { type: String, default: "", trim: true },
          summary: { type: String, default: "", trim: true },
          outcomes: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    contentSections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WebsiteSettings", websiteSettingsSchema);
