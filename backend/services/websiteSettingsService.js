const WebsiteSettings = require("../models/WebsiteSettings");
const { defaultWebsiteSettings } = require("../utils/defaultWebsiteSettings");

const isDevOverrideEnabled = () => {
  const isProduction = (process.env.NODE_ENV || "development").toLowerCase() === "production";
  return !isProduction && String(process.env.DEV_OVERRIDE || "").toLowerCase() === "true";
};

const ensureWebsiteSettings = async () => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create(defaultWebsiteSettings);
    }

    return settings;
  } catch (error) {
    if (isDevOverrideEnabled()) {
      return {
        ...defaultWebsiteSettings,
        _id: "dev-settings",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
};

module.exports = { ensureWebsiteSettings };
