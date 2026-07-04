const { getDashboardAnalytics } = require("../services/analyticsService");
const { asyncHandler } = require("../utils/asyncHandler");

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getDashboardAnalytics();

  res.json({
    success: true,
    message: "Analytics fetched successfully",
    data: analytics,
  });
});

module.exports = { getAnalytics };
