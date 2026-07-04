const WebsiteSettings = require("../models/WebsiteSettings");
const { defaultWebsiteSettings } = require("../utils/defaultWebsiteSettings");

const ensureWebsiteSettings = async () => {
  let settings = await WebsiteSettings.findOne();

  if (!settings) {
    settings = await WebsiteSettings.create(defaultWebsiteSettings);
  }

  return settings;
};

module.exports = { ensureWebsiteSettings };
