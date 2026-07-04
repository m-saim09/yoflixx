const express = require("express");
const {
  createLead,
  deleteLead,
  getLeadById,
  getLeadList,
  updateLead,
} = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");

const createLeadRoutes = () => {
  const router = express.Router();

  router.post("/", createLead);
  router.get("/", protect, getLeadList);
  router.get("/:id", protect, getLeadById);
  router.patch("/:id", protect, updateLead);
  router.delete("/:id", protect, deleteLead);

  return router;
};

module.exports = { createLeadRoutes };
