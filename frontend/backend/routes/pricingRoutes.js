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

router.get("/get", getPublicPricingPlans);
router.get("/admin", protect, getAdminPricingPlans);
router.post("/post", protect, createPricingPlan);
router.patch("/update/:id", protect, updatePricingPlan);
router.patch("/toggle/:id", protect, togglePricingPlanStatus);
router.delete("/delete/:id", protect, deletePricingPlan);

module.exports = router;
