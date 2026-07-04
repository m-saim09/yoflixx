const Contact = require("../models/Contact");
const Lead = require("../models/Lead");
const { LEAD_STATUSES, PLAN_OPTIONS } = require("../utils/constants");

const getMonthlyAnalytics = async () => {
  const start = new Date();
  start.setMonth(start.getMonth() - 11);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const leads = await Lead.find();
  const monthlyLeads = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt || 0);
    return createdAt >= start;
  });

  const monthMap = new Map();
  monthlyLeads.forEach((lead) => {
    const createdAt = new Date(lead.createdAt || 0);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });

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
    Lead.find(),
    Lead.find(),
    getMonthlyAnalytics(),
    Lead.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const leadsByStatus = LEAD_STATUSES.reduce((accumulator, status) => {
    const match = leadsByStatusRaw.filter((item) => item.status === status).length;
    accumulator[status] = match;
    return accumulator;
  }, {});

  const leadsByPlan = PLAN_OPTIONS.map((plan) => {
    const count = leadsByPlanRaw.filter((item) => item.selectedPlan === plan).length;
    return { _id: plan, count };
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
