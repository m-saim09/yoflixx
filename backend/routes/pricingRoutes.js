const express = require("express");
const pricingController = require("../controllers/pricingController");
const { protect } = require("../middleware/authMiddleware");
const { runValidator } = require("../middleware/validateMiddleware");
const { validateObjectIdParam } = require("../validators/objectIdValidator");
const { validateCreateOrUpdate } = require("../validators/pricingValidator");

const router = express.Router();

router.get("/get", pricingController.getPublicPricingPlans);
router.get("/admin", protect, pricingController.getAdminPricingPlans);
router.get(
  "/get/:id",
  (req, res, next) => runValidator(validateObjectIdParam("id"))(req, res, next),
  pricingController.getPublicPricingPlans
);
router.post("/create", protect, runValidator(validateCreateOrUpdate), pricingController.createPricingPlan);
router.patch(
  "/update/:id",
  protect,
  (req, res, next) => runValidator(validateObjectIdParam("id"))(req, res, next),
  runValidator(validateCreateOrUpdate),
  pricingController.updatePricingPlan
);
router.patch(
  "/toggle/:id",
  protect,
  (req, res, next) => runValidator(validateObjectIdParam("id"))(req, res, next),
  pricingController.togglePricingPlanStatus
);
router.delete(
  "/delete/:id",
  protect,
  (req, res, next) => runValidator(validateObjectIdParam("id"))(req, res, next),
  pricingController.deletePricingPlan
);

module.exports = router;
