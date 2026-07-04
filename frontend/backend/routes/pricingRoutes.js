const express = require("express");
const {
  createPricingPlan,
  deletePricingPlan,
  getAdminPricingPlans,
  getPublicPricingPlans,
  togglePricingPlanStatus,
  updatePricingPlan,
} = require("../controllers/pricingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublicPricingPlans);
router.get("/admin", protect, getAdminPricingPlans);
router.post("/", protect, createPricingPlan);
router.patch("/:id", protect, updatePricingPlan);
router.patch("/:id/toggle", protect, togglePricingPlanStatus);
router.delete("/:id", protect, deletePricingPlan);

module.exports = router;
