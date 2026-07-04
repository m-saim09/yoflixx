const express = require("express");
const { getWebsiteSettings, updateWebsiteSettings } = require("../controllers/websiteSettingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getWebsiteSettings);
router.put("/", protect, updateWebsiteSettings);

module.exports = router;
