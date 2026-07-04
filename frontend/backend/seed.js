const dotenv = require("dotenv");
const { connectDatabase } = require("./config/db");
const Admin = require("./models/Admin");
const Lead = require("./models/Lead");
const Contact = require("./models/Contact");
const PricingPlan = require("./models/PricingPlan");
const WebsiteSettings = require("./models/WebsiteSettings");
const { defaultWebsiteSettings } = require("./utils/defaultWebsiteSettings");

dotenv.config();

const leadSeed = [
  {
    fullName: "Ariana Wells",
    email: "ariana@northlanehealth.com",
    phone: "+1 (415) 555-0182",
    companyName: "Northlane Health",
    selectedPlan: "Level 3",
    projectType: "SaaS platform",
    budget: "$20k - $35k",
    timeline: "2-3 months",
    message: "We need a premium site and a cleaner lead qualification workflow for enterprise buyers.",
    requirements: "Needs investor-grade design, analytics reporting, and sales handoff visibility.",
    status: "In Progress",
    source: "Website Inquiry",
  },
  {
    fullName: "Daniel Cho",
    email: "daniel@stackform.io",
    phone: "+1 (646) 555-0121",
    companyName: "Stackform",
    selectedPlan: "Level 2",
    projectType: "Lead funnel rebuild",
    budget: "$10k - $20k",
    timeline: "1-2 months",
    message: "Our pricing page underperforms and the current inquiry flow is too generic for qualified inbound.",
    requirements: "Needs CRM dashboard, better filtering, and fast admin response workflows.",
    status: "Contacted",
    source: "Website Inquiry",
  },
  {
    fullName: "Maya Rahman",
    email: "maya@baysideadvisory.com",
    phone: "+1 (917) 555-0144",
    companyName: "Bayside Advisory",
    selectedPlan: "Level 1",
    projectType: "Business website",
    budget: "$5k - $10k",
    timeline: "2-4 weeks",
    message: "We need a polished business site with a clean intake flow and better contact management internally.",
    requirements: "Needs fast launch, clean content architecture, and inquiry tracking.",
    status: "New",
    source: "Website Inquiry",
  },
];

const contactSeed = [
  {
    name: "Sophie Bennett",
    email: "sophie@meridiancapital.com",
    phone: "+1 (213) 555-0163",
    message: "Looking for a discovery call next week about redesigning our consulting site.",
  },
  {
    name: "Julian Price",
    email: "julian@atlasops.com",
    phone: "+1 (312) 555-0190",
    message: "Need a quick overview of your Level 2 engagement and implementation process.",
  },
];

const pricingSeed = [
  {
    title: "Level 1",
    slug: "level-1",
    shortDescription: "Launch-ready business presence for serious teams.",
    price: "$6.5k",
    billingType: "project",
    features: [
      "Custom website strategy and messaging",
      "Five premium marketing pages",
      "Responsive design system and motion pass",
      "Lead capture form with CRM handoff",
    ],
    buttonText: "Choose Level 1",
    badge: "",
    isPopular: false,
    isActive: true,
    order: 1,
  },
  {
    title: "Level 2",
    slug: "level-2",
    shortDescription: "Growth stack for teams that need stronger storytelling and CRM structure.",
    price: "$12k",
    billingType: "project",
    features: [
      "Everything in Level 1",
      "Expanded case studies and proof sections",
      "Advanced inquiry qualification fields",
      "Admin dashboard with lead workflow states",
    ],
    buttonText: "Choose Level 2",
    badge: "Most Popular",
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    title: "Level 3",
    slug: "level-3",
    shortDescription: "High-trust platform and operating layer for established businesses.",
    price: "$20k+",
    billingType: "project",
    features: [
      "Everything in Level 2",
      "Deeper UX refinement and interaction systems",
      "Extended admin workflows and reporting",
      "Launch support and iteration window",
    ],
    buttonText: "Discuss Level 3",
    badge: "Executive",
    isPopular: false,
    isActive: true,
    order: 3,
  },
];

const seed = async () => {
  try {
    await connectDatabase();

    const existingAdmin = await Admin.findOne({ email: "admin@yoflix.com" });
    if (!existingAdmin) {
      await Admin.create({
        name: "Platform Admin",
        email: "admin@yoflix.com",
        password: "admin123",
        role: "admin",
      });
    }

    await Lead.deleteMany({});
    await Contact.deleteMany({});
    await PricingPlan.deleteMany({});
    await WebsiteSettings.deleteMany({});
    await Lead.insertMany(leadSeed);
    await Contact.insertMany(contactSeed);
    await PricingPlan.insertMany(pricingSeed);
    await WebsiteSettings.create(defaultWebsiteSettings);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

void seed();
