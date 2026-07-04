const Contact = require("../models/Contact");
const Lead = require("../models/Lead");
const { LEAD_STATUSES, PLAN_OPTIONS } = require("../utils/constants");

const getMonthlyAnalytics = async () => {
  const start = new Date();
  start.setMonth(start.getMonth() - 11);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const monthlyLeads = await Lead.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        leads: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthMap = new Map(
    monthlyLeads.map((item) => [
      `${item._id.year}-${item._id.month}`,
      item.leads,
    ])
  );

  const result = [];
  const cursor = new Date(start);

  for (let index = 0; index < 12; index += 1) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const key = `${year}-${month}`;
    result.push({
      label: cursor.toLocaleString("en-US", { month: "short" }),
      year,
      month,
      leads: monthMap.get(key) || 0,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return result;
};

const getDashboardAnalytics = async () => {
  const [
    totalLeads,
    totalContacts,
    recentLeads,
    leadsByStatusRaw,
    leadsByPlanRaw,
    monthlyInquiries,
    recentLeadsList,
  ] = await Promise.all([
    Lead.countDocuments(),
    Contact.countDocuments(),
    Lead.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
    }),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$selectedPlan", count: { $sum: 1 } } }]),
    getMonthlyAnalytics(),
    Lead.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const leadsByStatus = LEAD_STATUSES.reduce((accumulator, status) => {
    const match = leadsByStatusRaw.find((item) => item._id === status);
    accumulator[status] = match ? match.count : 0;
    return accumulator;
  }, {});

  const leadsByPlan = PLAN_OPTIONS.map((plan) => {
    const match = leadsByPlanRaw.find((item) => item._id === plan);
    return { _id: plan, count: match ? match.count : 0 };
  });

  return {
    totals: {
      leads: totalLeads,
      contacts: totalContacts,
      newInquiries: leadsByStatus.New || 0,
      activeProjects: (leadsByStatus["Contacted"] || 0) + (leadsByStatus["In Progress"] || 0),
      monthlyInquiries: recentLeads,
    },
    leadsByStatus,
    leadsByPlan,
    monthlyInquiries,
    recentLeads: recentLeadsList,
  };
};

module.exports = { getDashboardAnalytics };
