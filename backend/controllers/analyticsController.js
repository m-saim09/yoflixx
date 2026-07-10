const { getDashboardAnalytics } = require("../services/analyticsService");
const { asyncHandler } = require("../utils/asyncHandler");

const getAnalytics = asyncHandler(async (req, res) => {
  try {
    const analytics = await getDashboardAnalytics();
    return res.json({
      success: true,
      message: "Analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    // If DB is unavailable in development, return safe defaults so the admin
    // dashboard can render without crashing.
    console.error("Analytics fetch failed:", error?.message || error);
    return res.json({
      success: true,
      message: "Analytics unavailable (dev fallback)",
      data: {
        totals: { leads: 0, contacts: 0, newInquiries: 0, activeProjects: 0, monthlyInquiries: 0 },
        leadsByStatus: {},
        leadsByPlan: [],
        monthlyInquiries: [],
        recentLeads: [],
      },
    });
  }
});

module.exports = { getAnalytics };
