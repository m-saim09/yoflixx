const express = require("express");
const { createConsultation } = require("../controllers/consultationController");
const { runValidator } = require("../middleware/validateMiddleware");
const { validateConsultation } = require("../validators/consultationValidator");

const router = express.Router();

router.post("/create", runValidator(validateConsultation), createConsultation);

module.exports = router;
