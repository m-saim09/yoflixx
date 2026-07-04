const express = require("express");
const { createContact, deleteContact, getContacts } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, getContacts);
router.delete("/:id", protect, deleteContact);

module.exports = router;
