const express = require("express");
const { loginAdmin, getAdminProfile, logoutAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.post("/logout", protect, logoutAdmin);

module.exports = router;
