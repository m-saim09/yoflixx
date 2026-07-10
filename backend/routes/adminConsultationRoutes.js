const express = require("express");
const {
  createConsultation,
  deleteConsultation,
  getConsultation,
  getConsultations,
  updateConsultation,
  updateConsultationStatus,
} = require("../controllers/consultationController");
const { protect } = require("../middleware/authMiddleware");
const { runValidator } = require("../middleware/validateMiddleware");
const { validateConsultation, validateConsultationUpdate } = require("../validators/consultationValidator");
const { validateObjectIdParam } = require("../validators/objectIdValidator");

const router = express.Router();

router.get("/get", protect, getConsultations);
router.get("/get/:id", protect, runValidator(validateObjectIdParam("id")), getConsultation);
router.post("/create", protect, runValidator(validateConsultation), createConsultation);
router.patch("/update/:id", protect, runValidator(validateObjectIdParam("id")), runValidator(validateConsultationUpdate), updateConsultation);
router.patch("/status/:id", protect, runValidator(validateObjectIdParam("id")), updateConsultationStatus);
router.delete("/delete/:id", protect, runValidator(validateObjectIdParam("id")), deleteConsultation);

router.get("/", protect, getConsultations);
router.get("/:id", protect, runValidator(validateObjectIdParam("id")), getConsultation);
router.post("/", protect, runValidator(validateConsultation), createConsultation);
router.patch("/:id", protect, runValidator(validateObjectIdParam("id")), runValidator(validateConsultationUpdate), updateConsultation);
router.patch("/:id/status", protect, runValidator(validateObjectIdParam("id")), updateConsultationStatus);
router.delete("/:id", protect, runValidator(validateObjectIdParam("id")), deleteConsultation);

module.exports = router;
