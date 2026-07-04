export const kpis = {
  totalLeads: 2847,
  monthlyInquiries: 412,
  closedDeals: 168,
  conversionRate: 24.6,
  revenue: 184320,
  growth: 18.4,
};

export const monthlyGrowth = [
  { m: "Jan", inquiries: 180, leads: 240, revenue: 12400 },
  { m: "Feb", inquiries: 210, leads: 280, revenue: 14200 },
  { m: "Mar", inquiries: 245, leads: 320, revenue: 16800 },
  { m: "Apr", inquiries: 280, leads: 360, revenue: 18900 },
  { m: "May", inquiries: 320, leads: 410, revenue: 21400 },
  { m: "Jun", inquiries: 365, leads: 460, revenue: 24600 },
  { m: "Jul", inquiries: 390, leads: 490, revenue: 26800 },
  { m: "Aug", inquiries: 412, leads: 520, revenue: 29200 },
];

export const leadStatus = [
  { name: "New", value: 340, color: "var(--chart-1)" },
  { name: "Contacted", value: 220, color: "var(--chart-2)" },
  { name: "Qualified", value: 180, color: "var(--chart-3)" },
  { name: "Closed", value: 120, color: "var(--chart-4)" },
  { name: "Lost", value: 60, color: "var(--chart-5)" },
];

export const planDistribution = [
  { name: "Starter", value: 540, color: "var(--chart-1)" },
  { name: "Growth", value: 320, color: "var(--chart-2)" },
  { name: "Enterprise", value: 140, color: "var(--chart-3)" },
];

export const trafficSources = [
  { name: "Organic", value: 4200, color: "var(--chart-1)" },
  { name: "Direct", value: 2800, color: "var(--chart-2)" },
  { name: "Referral", value: 1600, color: "var(--chart-3)" },
  { name: "Social", value: 1200, color: "var(--chart-4)" },
];

export const devices = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 34 },
  { name: "Tablet", value: 8 },
];

export const funnel = [
  { stage: "Visitors", value: 12400 },
  { stage: "Signups", value: 4200 },
  { stage: "Qualified", value: 1800 },
  { stage: "Demo", value: 820 },
  { stage: "Closed", value: 168 },
];

export const geo = [
  { country: "United States", value: 38 },
  { country: "United Kingdom", value: 18 },
  { country: "Germany", value: 14 },
  { country: "India", value: 12 },
  { country: "Canada", value: 9 },
  { country: "Australia", value: 9 },
];

export const topServices = [
  { name: "Web Development", value: 86 },
  { name: "SEO & Marketing", value: 72 },
  { name: "UI/UX Design", value: 64 },
  { name: "Mobile Apps", value: 48 },
  { name: "Consulting", value: 32 },
];

export const activity = [
  { time: "2m ago", text: "New lead — Acme Corp signed up for Growth plan", type: "lead" },
  { time: "18m ago", text: "Deal closed — Northwind Studios ($4,200)", type: "deal" },
  { time: "1h ago", text: "Contact reply from Lisa at Pixel & Co.", type: "contact" },
  { time: "3h ago", text: "Pricing plan 'Enterprise' updated", type: "update" },
  { time: "Yesterday", text: "12 new inquiries from organic search", type: "lead" },
];

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: "New" | "Contacted" | "Qualified" | "Closed" | "Lost";
  created: string;
};

export const leads: Lead[] = [
  {
    id: "L-1042",
    name: "Olivia Martin",
    email: "olivia@acme.io",
    company: "Acme Corp",
    plan: "Growth",
    status: "New",
    created: "2026-06-24",
  },
  {
    id: "L-1041",
    name: "Jackson Lee",
    email: "jackson@northwind.com",
    company: "Northwind",
    plan: "Enterprise",
    status: "Qualified",
    created: "2026-06-24",
  },
  {
    id: "L-1040",
    name: "Isabella Nguyen",
    email: "isa@pixelco.com",
    company: "Pixel & Co.",
    plan: "Starter",
    status: "Contacted",
    created: "2026-06-23",
  },
  {
    id: "L-1039",
    name: "William Kim",
    email: "will@lumenlab.io",
    company: "Lumen Lab",
    plan: "Growth",
    status: "Closed",
    created: "2026-06-22",
  },
  {
    id: "L-1038",
    name: "Sofia Davis",
    email: "sofia@hexa.co",
    company: "Hexa",
    plan: "Starter",
    status: "New",
    created: "2026-06-22",
  },
  {
    id: "L-1037",
    name: "Liam Patel",
    email: "liam@orbit.dev",
    company: "Orbit",
    plan: "Enterprise",
    status: "Qualified",
    created: "2026-06-21",
  },
  {
    id: "L-1036",
    name: "Emma Brooks",
    email: "emma@northpeak.co",
    company: "Northpeak",
    plan: "Growth",
    status: "Lost",
    created: "2026-06-20",
  },
  {
    id: "L-1035",
    name: "Noah Singh",
    email: "noah@verge.io",
    company: "Verge",
    plan: "Starter",
    status: "Contacted",
    created: "2026-06-20",
  },
];

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  preview: string;
  status: "New" | "Read" | "Replied";
  time: string;
};

export const contacts: Contact[] = [
  {
    id: "C-501",
    name: "Lisa Carter",
    email: "lisa@pixelco.com",
    subject: "Partnership inquiry",
    preview: "Hi team, we'd love to explore a co-marketing partnership for Q3…",
    status: "New",
    time: "9:42 AM",
  },
  {
    id: "C-500",
    name: "Marcus Allen",
    email: "marcus@brightline.com",
    subject: "Enterprise demo request",
    preview: "Looking for a demo for our 200-seat team next week if possible.",
    status: "Read",
    time: "8:15 AM",
  },
  {
    id: "C-499",
    name: "Priya Shah",
    email: "priya@nimbus.io",
    subject: "Billing question",
    preview: "I was charged twice this cycle — could you take a look?",
    status: "Replied",
    time: "Yesterday",
  },
  {
    id: "C-498",
    name: "Tomás Ruiz",
    email: "tomas@hexa.co",
    subject: "Feature request: SSO",
    preview: "We need SAML SSO before we can roll out company-wide.",
    status: "Read",
    time: "Yesterday",
  },
  {
    id: "C-497",
    name: "Hannah Cole",
    email: "hannah@verge.io",
    subject: "Thank you!",
    preview: "Just wanted to say the onboarding was fantastic.",
    status: "Replied",
    time: "Mon",
  },
];

export const purchases = [
  { id: "P-2210", customer: "Acme Corp", plan: "Growth", amount: 79, date: "2026-06-24" },
  { id: "P-2209", customer: "Northwind", plan: "Enterprise", amount: 299, date: "2026-06-23" },
  { id: "P-2208", customer: "Pixel & Co.", plan: "Starter", amount: 29, date: "2026-06-23" },
  { id: "P-2207", customer: "Lumen Lab", plan: "Growth", amount: 79, date: "2026-06-22" },
  { id: "P-2206", customer: "Orbit", plan: "Enterprise", amount: 299, date: "2026-06-21" },
];

export const plans = [
  {
    name: "Starter",
    price: 29,
    blurb: "For solo founders getting started.",
    features: ["Up to 500 leads", "Basic analytics", "Email support", "1 team member"],
    highlight: false,
  },
  {
    name: "Growth",
    price: 79,
    blurb: "For growing teams that need more power.",
    features: [
      "Up to 10,000 leads",
      "Advanced analytics",
      "Priority support",
      "10 team members",
      "Custom pricing plans",
      "API access",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 299,
    blurb: "For large organizations at scale.",
    features: [
      "Unlimited leads",
      "Dedicated analytics",
      "24/7 support",
      "Unlimited team",
      "SSO & SAML",
      "Custom contracts",
      "SLA guarantee",
    ],
    highlight: false,
  },
];

export const revenueByPlan = [
  { plan: "Starter", revenue: 15660 },
  { plan: "Growth", revenue: 25280 },
  { plan: "Enterprise", revenue: 41860 },
];
