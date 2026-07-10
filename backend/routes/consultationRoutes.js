const express = require("express");
const { createConsultation } = require("../controllers/consultationController");
const { runValidator } = require("../middleware/validateMiddleware");
const { validateConsultation } = require("../validators/consultationValidator");

const router = express.Router();

router.post("/create", runValidator(validateConsultation), createConsultation);
router.post("/", runValidator(validateConsultation), createConsultation);
router.post("/post", runValidator(validateConsultation), createConsultation);

module.exports = router;
