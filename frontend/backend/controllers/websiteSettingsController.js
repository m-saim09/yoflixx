const { asyncHandler } = require("../utils/asyncHandler");
const { ensureWebsiteSettings } = require("../services/websiteSettingsService");

const stringValue = (value = "") => String(value || "").trim();
const keywordsValue = (value) =>
  Array.isArray(value)
    ? value.map((item) => stringValue(item)).filter(Boolean)
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const getWebsiteSettings = asyncHandler(async (req, res) => {
  const settings = await ensureWebsiteSettings();

  res.json({
    success: true,
    message: "Website settings fetched successfully",
    data: { settings },
  });
});

const updateWebsiteSettings = asyncHandler(async (req, res) => {
  const settings = await ensureWebsiteSettings();

  settings.businessInfo = {
    ...settings.businessInfo.toObject(),
    ...(req.body.businessInfo || {}),
  };
  settings.heroSection = {
    ...settings.heroSection.toObject(),
    ...(req.body.heroSection || {}),
  };
  settings.aboutSection = {
    ...settings.aboutSection.toObject(),
    ...(req.body.aboutSection || {}),
  };
  settings.contactInfo = {
    ...settings.contactInfo.toObject(),
    ...(req.body.contactInfo || {}),
  };
  settings.socialLinks = {
    ...settings.socialLinks.toObject(),
    ...(req.body.socialLinks || {}),
  };
  settings.branding = {
    ...settings.branding.toObject(),
    ...(req.body.branding || {}),
  };
  settings.seoSettings = {
    ...settings.seoSettings.toObject(),
    ...(req.body.seoSettings || {}),
    keywords: keywordsValue(req.body.seoSettings?.keywords ?? settings.seoSettings.keywords),
  };
  if (Array.isArray(req.body.services)) {
    settings.services = req.body.services;
  }
  if (Array.isArray(req.body.caseStudies)) {
    settings.caseStudies = req.body.caseStudies;
  }

  settings.businessInfo.websiteName = stringValue(settings.businessInfo.websiteName);
  settings.businessInfo.companyName = stringValue(settings.businessInfo.companyName);
  settings.businessInfo.tagline = stringValue(settings.businessInfo.tagline);
  settings.businessInfo.aboutText = stringValue(settings.businessInfo.aboutText);
  settings.businessInfo.footerDescription = stringValue(settings.businessInfo.footerDescription);
  settings.heroSection.badge = stringValue(settings.heroSection.badge);
  settings.heroSection.title = stringValue(settings.heroSection.title);
  settings.heroSection.highlightText = stringValue(settings.heroSection.highlightText);
  settings.heroSection.description = stringValue(settings.heroSection.description);
  settings.heroSection.primaryButtonText = stringValue(settings.heroSection.primaryButtonText);
  settings.heroSection.primaryButtonLink = stringValue(settings.heroSection.primaryButtonLink);
  settings.heroSection.secondaryButtonText = stringValue(settings.heroSection.secondaryButtonText);
  settings.heroSection.secondaryButtonLink = stringValue(settings.heroSection.secondaryButtonLink);
  settings.heroSection.backgroundImage = stringValue(settings.heroSection.backgroundImage);
  settings.aboutSection.title = stringValue(settings.aboutSection.title);
  settings.aboutSection.description = stringValue(settings.aboutSection.description);
  settings.aboutSection.bullets = (settings.aboutSection.bullets || []).map((item) => stringValue(item)).filter(Boolean);
  settings.aboutSection.cards = (settings.aboutSection.cards || [])
    .map((card) => ({
      title: stringValue(card.title),
      body: stringValue(card.body),
    }))
    .filter((card) => card.title || card.body);

  settings.contactInfo.businessEmail = stringValue(settings.contactInfo.businessEmail).toLowerCase();
  settings.contactInfo.supportEmail = stringValue(settings.contactInfo.supportEmail).toLowerCase();
  settings.contactInfo.phoneNumber = stringValue(settings.contactInfo.phoneNumber);
  settings.contactInfo.whatsappNumber = stringValue(settings.contactInfo.whatsappNumber);
  settings.contactInfo.officeAddress = stringValue(settings.contactInfo.officeAddress);
  settings.contactInfo.googleMapsLink = stringValue(settings.contactInfo.googleMapsLink);

  settings.socialLinks.facebook = stringValue(settings.socialLinks.facebook);
  settings.socialLinks.instagram = stringValue(settings.socialLinks.instagram);
  settings.socialLinks.linkedIn = stringValue(settings.socialLinks.linkedIn);
  settings.socialLinks.twitter = stringValue(settings.socialLinks.twitter);
  settings.socialLinks.youtube = stringValue(settings.socialLinks.youtube);

  settings.branding.logo = stringValue(settings.branding.logo);
  settings.branding.favicon = stringValue(settings.branding.favicon);
  settings.branding.footerLogo = stringValue(settings.branding.footerLogo);
  settings.branding.primaryColor = stringValue(settings.branding.primaryColor || "#2563eb");
  settings.branding.secondaryColor = stringValue(settings.branding.secondaryColor || "#0f172a");
  settings.branding.ogImage = stringValue(settings.branding.ogImage);

  settings.seoSettings.metaTitle = stringValue(settings.seoSettings.metaTitle);
  settings.seoSettings.metaDescription = stringValue(settings.seoSettings.metaDescription);
  settings.services = (settings.services || []).map((service) => ({
    id: stringValue(service.id),
    title: stringValue(service.title),
    eyebrow: stringValue(service.eyebrow),
    description: stringValue(service.description),
    bullets: (service.bullets || []).map((item) => stringValue(item)).filter(Boolean),
    stat: stringValue(service.stat),
    icon: stringValue(service.icon || "layers"),
  }));
  settings.caseStudies = (settings.caseStudies || []).map((study) => ({
    id: stringValue(study.id),
    title: stringValue(study.title),
    category: stringValue(study.category),
    summary: stringValue(study.summary),
    outcomes: (study.outcomes || []).map((item) => stringValue(item)).filter(Boolean),
  }));

  await settings.save();

  res.json({
    success: true,
    message: "Website settings updated successfully",
    data: { settings },
  });
});

module.exports = {
  getWebsiteSettings,
  updateWebsiteSettings,
};
