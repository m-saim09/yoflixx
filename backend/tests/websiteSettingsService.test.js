const test = require("node:test");
const assert = require("node:assert/strict");

const WebsiteSettings = require("../models/WebsiteSettings");

const originalNodeEnv = process.env.NODE_ENV;
const originalDevOverride = process.env.DEV_OVERRIDE;

const resetEnv = () => {
  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }

  if (originalDevOverride === undefined) {
    delete process.env.DEV_OVERRIDE;
  } else {
    process.env.DEV_OVERRIDE = originalDevOverride;
  }
};

test("ensureWebsiteSettings returns a safe fallback when the database is unavailable", async () => {
  process.env.NODE_ENV = "development";
  process.env.DEV_OVERRIDE = "false";

  const originalFindOne = WebsiteSettings.findOne;
  const originalCreate = WebsiteSettings.create;

  WebsiteSettings.findOne = async () => {
    throw new Error("Cannot call `websitesettings.findOne()` before initial connection is complete");
  };
  WebsiteSettings.create = async () => {
    throw new Error("create should not be called");
  };

  try {
    const { ensureWebsiteSettings } = require("../services/websiteSettingsService");
    const settings = await ensureWebsiteSettings();

    assert.equal(settings._id, "dev-settings");
    assert.equal(settings.businessInfo?.websiteName, "Yoflix");
  } finally {
    WebsiteSettings.findOne = originalFindOne;
    WebsiteSettings.create = originalCreate;
    resetEnv();
  }
});
