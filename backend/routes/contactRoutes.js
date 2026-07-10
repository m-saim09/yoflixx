const express = require("express");
const { createContact, deleteContact, getContacts, updateContact } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const { runValidator } = require("../middleware/validateMiddleware");
const { validateContact } = require("../validators/contactValidator");

const router = express.Router();

router.post("/", runValidator(validateContact), createContact);
router.get("/", protect, getContacts);
router.patch("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
