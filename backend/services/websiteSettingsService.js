const WebsiteSettings = require("../models/WebsiteSettings");
const { defaultWebsiteSettings } = require("../utils/defaultWebsiteSettings");
const { getDatabaseStatus } = require("../config/db");

const isProduction = () => (process.env.NODE_ENV || "development").toLowerCase() === "production";
const isDevOverrideEnabled = () => !isProduction() && String(process.env.DEV_OVERRIDE || "").toLowerCase() === "true";
const shouldUseDevFallback = () => !isProduction() && (isDevOverrideEnabled() || getDatabaseStatus() !== "connected");

const createDevFallbackSettings = () => ({
  ...defaultWebsiteSettings,
  _id: "dev-settings",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const ensureWebsiteSettings = async () => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create(defaultWebsiteSettings);
    }

    return settings;
  } catch (error) {
    if (shouldUseDevFallback()) {
      return createDevFallbackSettings();
    }

    throw error;
  }
};

module.exports = { ensureWebsiteSettings };
