import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ComponentType, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  LayoutGrid,
  Compass,
  Image,
  Box,
  CheckCircle2,
  MessageSquare,
  Activity,
  Rocket,
  TrendingUp,
  ShieldCheck,
  FileText,
  Store,
  Headphones,
  Package,
  Users,
  BarChart3,
  UserCog,
  Zap,
  Wallet,
  Sprout,
  Globe,
  Check,
  Star,
  Quote,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { PricingCard } from "@/components/pricing-card";
import useWebsiteSettings from "@/hooks/use-website-settings";
import heroBg from "@/assets/hero-bg.png";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

type PricingPlanOption = {
  _id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  price?: string;
  billingType?: string;
  features?: string[];
  buttonText?: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
};

type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

const homeTestimonials: Testimonial[] = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = homeTestimonials.slice(0, 3);
const secondColumn = homeTestimonials.slice(3, 6);
const thirdColumn = homeTestimonials.slice(6, 9);

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  sub?: string;
};

export function PageHero({ eyebrow, title, accent, sub }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,110,245,0.16),transparent_52%)]" />

      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary shadow-soft backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
          {typeof title === "string" ? title : title}
          {accent ? <span className="ml-2 font-display italic gradient-text">{accent}</span> : null}
        </h1>
        {sub ? <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{sub}</p> : null}
      </div>
    </section>
  );
}

// Keyframes for the animated bar defined globally within this module
const _ = ``;
/*
Keyframes injected via global stylesheet elsewhere if needed. If your build strips
CSS-in-JS, consider adding these keyframes to your main stylesheet.
@keyframes yoflixShift {
  0% { background-position: 0% 50%; }
  100% { background-position: -100% 50%; }
}
*/

/* ============ HERO ============ */
export function Hero() {
  const { data: settings } = useWebsiteSettings();
  const hero = (settings?.heroSection ?? {}) as Record<string, any>;

  const titleText = hero.title || "Scale Your eBay Business with Expert Marketplace Support";
  const highlightText = hero.highlightText || "eBay";
  const heroSupportLine = hero.supportLine || "Trusted by leading marketplaces";
  const heroDescription =
    hero.description || "From store setup to scaling, Yoflix provides end-to-end eCommerce solutions to help you grow faster.";

  const titleSegments = (() => {
    const safeTitle = titleText || "";
    const safeHighlight = String(highlightText || "").trim();

    if (!safeHighlight) {
      return [{ text: safeTitle, highlight: false }];
    }

    const titleLower = safeTitle.toLowerCase();
    const highlightLower = safeHighlight.toLowerCase();
    const index = titleLower.indexOf(highlightLower);

    if (index === -1) {
      return [{ text: safeTitle, highlight: false }];
    }

    const segments = [] as Array<{ text: string; highlight: boolean }>;
    const start = index;
    const end = index + safeHighlight.length;

    if (start > 0) {
      segments.push({ text: safeTitle.slice(0, start), highlight: false });
    }

    segments.push({ text: safeTitle.slice(start, end), highlight: true });

    if (end < safeTitle.length) {
      segments.push({ text: safeTitle.slice(end), highlight: false });
    }

    return segments;
  })();

  const heroBadge = hero.badge || "YOUR GROWTH PARTNER";
  const primaryButtonText = hero.primaryButtonText || "Get Free Consultation";
  const primaryButtonLink = hero.primaryButtonLink || "/consultation";
  const secondaryButtonText = hero.secondaryButtonText || "Explore Services";
  const secondaryButtonLink = hero.secondaryButtonLink || "/services";

  const featureCards = [
    "Expert Support",
    "Proven Strategies",
    "End-to-End Solution",
    "Grow Faster",
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-slate-50">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-5 py-2 text-sm font-semibold text-[#2563EB] shadow-[0_10px_24px_rgba(37,99,235,0.08)]">
            {heroBadge}
          </span>

          <h1 className="mt-8 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {titleSegments.map((segment, idx) =>
              segment.highlight ? (
                <span key={idx} className="text-[#2563EB]">
                  {segment.text}
                </span>
              ) : (
                <span key={idx}>{segment.text}</span>
              ),
            )}
          </h1>

          <p className="mt-8 text-lg leading-9 text-gray-600 sm:text-xl">
            {heroDescription}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to={primaryButtonLink}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-[linear-gradient(135deg,#3B6EF5_0%,#2563EB_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(37,99,235,0.22)]"
            >
              {primaryButtonText}
              <ArrowRight size={18} />
            </Link>
            <Link
              to={secondaryButtonLink}
              className="inline-flex items-center justify-center rounded-xl border border-[#DBEAFE] bg-white/90 px-8 py-4 text-base font-semibold text-[#1E3A8A] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
            >
              {secondaryButtonText}
            </Link>
          </div>

          <div className="mt-16">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
              {heroSupportLine}
            </p>
            <div className="flex flex-wrap gap-6 text-2xl font-bold text-slate-700 sm:gap-10 sm:text-3xl">
              <span className="text-red-500">eBay</span>
              <span className="text-blue-500">Walmart</span>
              <span>TikTok Shop</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-7xl gap-8 rounded-[28px] border border-[#E2E8F0] bg-white/90 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:grid-cols-4">
          {featureCards.map((item) => (
            <div key={item}>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF]">
                <ShoppingCart className="text-[#2563EB]" />
              </div>
              <h3 className="mt-4 font-bold text-slate-950">{item}</h3>
              <p className="mt-2 text-gray-500">Lorem ipsum dolor sit amet.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ NAVBAR ============ */
const NAV = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useWebsiteSettings();
  const siteName = settings?.businessInfo?.websiteName || "Yoflix";
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#E2E8F0] bg-white/90 px-5 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur sm:px-7">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-xl font-black tracking-[0.12em] text-slate-950 sm:text-[1.45rem]"
          >
            <span className="text-[#2563EB]">Yo</span>
            <span className="text-slate-700">{siteName.replace(/^Yo/i, "") || "flix"}</span>
          </motion.span>
        </Link>
        <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((n) => (
            <motion.li key={n.label} whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={n.to}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                activeProps={{
                  className:
                    "rounded-full bg-[linear-gradient(135deg,#3B6EF5_0%,#2563EB_100%)] px-3 py-2 text-sm font-semibold text-white shadow-sm",
                }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            to="/consultation"
            className="hidden rounded-full bg-[linear-gradient(135deg,#3B6EF5_0%,#2563EB_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(37,99,235,0.3)] sm:inline-block"
          >
            Get Free Consultation
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#2563EB] shadow-sm lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-[0_20px_60px_-24px_rgba(37,99,235,0.16)] lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => (
              <motion.li key={n.label} whileHover={{ x: 4, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link
                  onClick={() => setOpen(false)}
                  to={n.to}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                >
                  {n.label}
                </Link>
              </motion.li>
            ))}
            <Link
              to="/consultation"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#3B6EF5_0%,#2563EB_100%)] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm"
            >
              Get Free Consultation
            </Link>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}

/* ============ LOGO STRIP ============ */
const PLATFORMS = [
  {
    name: "Walmart",
    src: "https://companieslogo.com/img/orig/WMT_BIG-4dae0070.png?t=1737085433",
    alt: "Walmart logo",
    className: "h-10 sm:h-12",
  },
  {
    name: "eBay",
    src: "https://logos-world.net/wp-content/uploads/2020/11/eBay-Logo.png",
    alt: "eBay logo",
    className: "h-20 sm:h-22 mx-auto",
  },
  {
    name: "TikTok Shop",
    src: "https://static.freepnglogo.com/images/all_img/1714299055tiktok-shop-logo-png.png",
    alt: "TikTok Shop logo",
    className: "h-8 sm:h-10",
  },
];

export function LogoStrip() {
  return (
    <section className="border-y border-white/40 bg-white py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Trusted across leading platforms
        </p>
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-16 sm:gap-20 lg:flex-nowrap">
          {PLATFORMS.map((platform) => (
            <div key={platform.name} className="flex items-center justify-center transition hover:opacity-100">
              <img
                src={platform.src}
                alt={platform.alt}
                loading="lazy"
                decoding="async"
                className={`${platform.className} object-contain grayscale transition-all hover:grayscale-0`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION TITLE ============ */
function SectionTitle({
  eyebrow,
  title,
  sub,
  light,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-2xl text-center"
    >
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${light ? "bg-white/10 text-white/80" : "glass text-primary"}`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-4xl font-medium tracking-tight sm:text-5xl ${light ? "text-white" : ""}`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-base ${light ? "text-white/70" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

export function TrustStrip() {
  const items = [
    { quote: "EBAY FOCUSED SERVICES", name: "", title: "" },
    { quote: "ACCOUNT CREATION", name: "", title: "" },
    { quote: "ACCOUNT MANAGEMENT", name: "", title: "" },
    { quote: "VIRTUAL ASSISTANT SUPPORT", name: "", title: "" },
  ];

  return (
    <section className="w-full bg-[#f7f6f5]/90 backdrop-blur-sm border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-full border border-white/20 bg-white/80 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden">
          <InfiniteMovingCards
            items={items}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      </div>
    </section>
  );
}

export function CoreExpertise() {
  const items = [
    {
      title: "eBay Account Creation",
      desc: "Structured store setup, account launch guidance and marketplace readiness.",
    },
    {
      title: "eBay Account Management",
      desc: "Daily store oversight, health monitoring, compliance and performance updates.",
    },
    {
      title: "Product Listing & Optimization",
      desc: "High-converting listings with SEO, photography, and category-optimized content.",
    },
    {
      title: "Order, Customer & Store Support",
      desc: "Order processing, buyer messaging, returns management and store care.",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Core Expertise"
          title={<>eBay is Our Core Marketplace <span className="font-display italic gradient-text">Expertise</span></>}
          sub="From account creation to daily store management, YOFLIX provides structured eBay support for businesses looking to build and scale with professional execution."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-strong rounded-3xl p-7 transition-shadow hover:shadow-glow"
            >
              <div className="inline-flex rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketplaceSupport() {
  const marketplaces = [
    {
      label: "eBay",
      badge: "Primary Expertise",
      description: "Complete account creation, management, listing, VA and store operations.",
      highlight: true,
    },
    {
      label: "Walmart",
      badge: "Supported Marketplace",
      description: "Account setup support, product listing assistance and operational help.",
      highlight: false,
    },
    {
      label: "TikTok Shop",
      badge: "Supported Marketplace",
      description: "Shop setup support, product handling, order assistance and VA services.",
      highlight: false,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Marketplace Support"
          title={<>Marketplace Support <span className="font-display italic gradient-text">Beyond eBay</span></>}
          sub="Walmart and TikTok Shop are supported as secondary platforms while eBay remains the primary engine of our services."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {marketplaces.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`rounded-3xl p-8 transition-all ${item.highlight ? "glass-strong shadow-glow lg:col-span-1" : "glass"}`}
            >
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {item.badge}
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{item.label}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ OUR WORKING PROCESS ============ */
const PROCESS = [
  {
    n: "01",
    title: "Discovery & Strategy",
    desc: "We understand your business goals, current challenges, and create a custom growth plan.",
    points: ["Business Audit", "Growth Roadmap"],
  },
  {
    n: "02",
    title: "Account Optimization",
    desc: "We optimize your eBay account, listings, store design, and SEO for maximum visibility.",
    points: ["Listing Optimization", "Store Improvements"],
  },
  {
    n: "03",
    title: "Growth Execution",
    desc: "We implement proven growth strategies, PPC campaigns, and marketplace expansion.",
    points: ["PPC Management", "Sales Growth"],
  },
  {
    n: "04",
    title: "Scale & Support",
    desc: "We continuously monitor, optimize, and scale your business for long-term success.",
    points: ["Performance Reports", "Dedicated Support"],
  },
];

const PROCESS_CONTAINER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.16,
    },
  },
};

const PROCESS_STEP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: "easeOut" } },
};

export function OurWorkingProcess() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<Record<number, { rx: number; ry: number }>>({});

  const handleMove = (index: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height - 0.5) * 6) * -1;
    const ry = (x / rect.width - 0.5) * 6;
    setTilt((t) => ({ ...t, [index]: { rx, ry } }));
  };
  const handleLeave = (index: number) => setTilt((t) => ({ ...t, [index]: { rx: 0, ry: 0 } }));

  return (
    <section className="relative bg-white py-20 sm:py-28">
      {/* subtle background curves and particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left, rgba(15,23,42,0.04), transparent 20%), radial-gradient(ellipse_at_bottom_right, rgba(37,99,235,0.03), transparent 20%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="HOW IT WORKS" title={<>Our Working Process</>} sub="A simple, transparent process that helps eBay sellers grow their business with confidence." />

        {/* timeline with badges */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="relative w-full max-w-5xl">
            <div className="absolute left-4 right-4 top-9 hidden md:block">
              <motion.div
                className="process-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left center" }}
              />
            </div>

            <motion.div
              className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              variants={PROCESS_CONTAINER}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
            >
              {PROCESS.map((p, i) => {
                const t = tilt[i] ?? { rx: 0, ry: 0 };
                return (
                  <motion.div
                    key={p.n}
                    variants={PROCESS_STEP}
                    whileHover={{ scale: 1.02 }}
                    onMouseMove={(e) => handleMove(i, e)}
                    onMouseLeave={() => handleLeave(i)}
                    className="relative z-10 flex flex-col items-center px-3"
                    style={{ transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
                  >
                    <motion.div
                      initial={{ scale: 0.64, rotate: -6 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="process-badge h-24 w-24 flex items-center justify-center rounded-full"
                      whileHover={{ rotate: 6 }}
                    >
                      <span className="text-2xl font-bold" style={{ color: "#0F172A" }}>{p.n}</span>
                    </motion.div>

                    {/* timeline dot for desktop */}
                    <div className="mt-4 hidden md:block">
                      <div className="process-dot pulse" />
                    </div>

                    <h4 className="mt-6 text-center text-lg font-semibold text-[#0F172A]">{p.title}</h4>
                    <p className="mt-2 text-center text-sm text-slate-600 max-w-xs">{p.desc}</p>

                    <ul className="mt-3 space-y-1 text-sm text-slate-600">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ============ SERVICES ============ */
const SERVICES = [
  {
    icon: Search,
    number: "01",
    title: "eBay Account Setup",
    desc: "Launch your eBay presence with structured onboarding, account configuration, and marketplace readiness.",
  },
  {
    icon: FileText,
    number: "02",
    title: "eBay Listing Optimization",
    desc: "Refine titles, descriptions, bullet points, and listing structure to boost search visibility and conversion.",
  },
  {
    icon: Store,
    number: "03",
    title: "eBay Store Design",
    desc: "Create a polished store experience with branded layouts, category structure, and premium presentation.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "eBay SEO",
    desc: "Drive better organic discovery with keyword strategy, competitor research, and listing-level SEO.",
  },
  {
    icon: TrendingUp,
    number: "05",
    title: "eBay PPC Management",
    desc: "Scale ad performance through smart campaigns, bid optimization, and conversion-focused strategy.",
  },
  {
    icon: Package,
    number: "06",
    title: "Product Research",
    desc: "Find winning inventory opportunities using demand signals, pricing insights, and market analysis.",
  },
  {
    icon: Sparkles,
    number: "07",
    title: "Listing Images & A+ Style Graphics",
    desc: "Elevate product presentation with premium imagery, lifestyle visuals, and brand-ready graphics.",
  },
  {
    icon: Users,
    number: "08",
    title: "Inventory Management",
    desc: "Stay organized with stock updates, replenishment planning, and efficient catalog maintenance.",
  },
  {
    icon: Package,
    number: "09",
    title: "Order Management",
    desc: "Deliver a smoother fulfillment experience with order processing support and operational consistency.",
  },
  {
    icon: Headphones,
    number: "10",
    title: "Customer Support",
    desc: "Protect buyer trust with responsive communication, issue handling, and professional service standards.",
  },
  {
    icon: Check,
    number: "11",
    title: "Account Health & Performance",
    desc: "Monitor seller performance, account compliance, and growth health with proactive support.",
  },
  {
    icon: Zap,
    number: "12",
    title: "eBay Growth Strategy",
    desc: "Build a scalable roadmap for expansion with data-led planning, positioning, and marketplace growth.",
  },
];

export function Services() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [cardMotion, setCardMotion] = useState<Record<number, { x: number; y: number; rotateX: number; rotateY: number; glowX: number; glowY: number }>>({});

  const updateCardMotion = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width - 0.5) * 12;
    const py = (0.5 - y / rect.height) * 12;

    setActiveCard(index);
    setCardMotion((prev) => ({
      ...prev,
      [index]: { x: px * 0.7, y: py * 0.7, rotateX: py, rotateY: px, glowX: x, glowY: y },
    }));
  };

  const resetCardMotion = (index: number) => {
    setActiveCard(null);
    setCardMotion((prev) => ({
      ...prev,
      [index]: { x: 0, y: 0, rotateX: 0, rotateY: 0, glowX: 0, glowY: 0 },
    }));
  };

  return (
    <section id="services" className="relative bg-white py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(59,110,245,0.14),transparent_45%),radial-gradient(circle_at_10%_20%,rgba(17,24,39,0.06),transparent_20%)]" />
      <div className="mx-auto max-w-7xl px-6 relative">
        <SectionTitle
          eyebrow="OUR SERVICES"
          title={
            <>
              Everything Your <span className="font-display text-slate-950">eBay Business</span> Needs
            </>
          }
          sub="Helping eBay sellers scale through account management, listing optimization, SEO, advertising, store management, and marketplace growth."
        />
        <div className="mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const motionState = cardMotion[i] ?? { x: 0, y: 0, rotateX: 0, rotateY: 0, glowX: 0, glowY: 0 };
            const isActive = activeCard === i;

            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.01 }}
                onMouseMove={(event) => updateCardMotion(i, event)}
                onMouseLeave={() => resetCardMotion(i)}
                style={{
                  transformPerspective: 1400,
                  transformStyle: "preserve-3d",
                  rotateX: isActive ? motionState.rotateX : 0,
                  rotateY: isActive ? motionState.rotateY : 0,
                  x: isActive ? motionState.x : 0,
                  y: isActive ? motionState.y : 0,
                }}
                className={`group relative overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white p-7 shadow-[0_16px_40px_rgba(17,24,39,0.05)] transition duration-300 ease-out will-change-transform ${isActive ? "border-[#3B6EF5]/40 shadow-[0_24px_70px_rgba(59,110,245,0.14)]" : "hover:border-[#3B6EF5]/30 hover:shadow-[0_24px_60px_rgba(17,24,39,0.08)]"}`}
              >
                <div className="pointer-events-none absolute inset-x-5 top-5 h-32 rounded-[20px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.14),transparent_72%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[20px]"
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    background: `radial-gradient(220px circle at ${motionState.glowX}px ${motionState.glowY}px, rgba(37,99,235,0.12), transparent 60%)`,
                  }}
                />
                <span className="pointer-events-none absolute right-6 top-6 text-[3.6rem] font-semibold tracking-[0.14em] text-slate-900/5">
                  {s.number}
                </span>

                <div className="relative z-10 flex items-center justify-start gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-3xl border border-[#E5E7EB] bg-[#EAF2FF] text-[#3B6EF5] shadow-sm">
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="relative z-10 mt-6 text-2xl font-semibold tracking-tight text-[#111827]">
                  {s.title}
                </h3>
                {s.desc ? (
                  <p className="relative z-10 mt-3 text-sm leading-6 text-[#6B7280] opacity-0 max-h-0 overflow-hidden transition-all duration-200 group-hover:opacity-100 group-hover:max-h-40">
                    {s.desc}
                  </p>
                ) : null}

                <div className="relative z-10 mt-6 flex items-center gap-3 text-sm font-semibold text-[#3B6EF5]">
                  <span>Learn More</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-[#3B6EF5] shadow-[0_12px_30px_rgba(59,110,245,0.08)] transition duration-200 ease-out group-hover:bg-[#DCEBFF]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/services"
            className="group inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#4A7BFF_0%,#2F5FE0_100%)] px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(59,110,245,0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(59,110,245,0.24)] active:translate-y-0"
          >
            <span>View All Services</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ServicesDecisionCTA() {
  const { data: settings } = useWebsiteSettings();
  const contactInfo = settings?.contactInfo ?? ({} as any);
  const whatsappNumber = String(contactInfo.whatsappNumber || "15550102024").replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col px-6">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.05),transparent_22%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700 shadow-sm">
                Not sure which service you need?
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                Get expert service guidance tailored to your eCommerce goals.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Share your store details and we’ll recommend the highest-impact services for your eBay, Walmart, or TikTok Shop business in one clear action plan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
              >
                <Link
                  to="/consultation"
                  className="group inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-[#0F172A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.18)] transition duration-300 hover:bg-slate-950"
                >
                  <span>Get a free audit</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full border border-[#0F172A] bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] transition duration-300 hover:bg-[#0F172A] hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                Chat on WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ STATS ============ */
type StatItem = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon: ComponentType<{ className?: string }>;
};

const STATS: StatItem[] = [
  { value: 5200, label: "Satisfied Clients", suffix: "+", icon: Users },
  { value: 5000000, label: "Revenue Generated", prefix: "$", suffix: "+", icon: Wallet },
  { value: 6, label: "Years Experience", suffix: "+", icon: Sprout },
  { value: 25, label: "Countries Served", suffix: "+", icon: Globe },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatStatValue(value: number, stat: StatItem) {
  const base = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

  if (stat.value >= 1000000 && stat.label === "Revenue Generated") {
    return `${stat.prefix ?? ""}${Math.round(stat.value / 1000000)}M${stat.suffix ?? ""}`;
  }

  return `${stat.prefix ?? ""}${base}${stat.suffix ?? ""}`;
}

function StatCard({ stat, count, index }: { stat: StatItem; count: number; index: number }) {
  const showDivider = index > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className={`relative flex flex-col items-center gap-4 border-t border-transparent px-6 py-10 transition-all duration-300 md:border-t-0`}
    >
      {showDivider ? (
        <div
          aria-hidden
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-20 w-px bg-[#E2E8F0]"
        />
      ) : null}

      <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE]">
        <stat.icon className="h-6 w-6 text-[#2563EB]" />
      </div>

      <div className="text-4xl font-semibold tracking-[-0.03em] text-[#0F172A] sm:text-5xl">
        {formatStatValue(count, stat)}
      </div>
      <p className="text-sm text-slate-500">{stat.label}</p>
    </motion.article>
  );
}

export function Stats() {
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(() => STATS.map(() => 0));

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const startTime = performance.now();
    let frameId = 0;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = easeOutCubic(progress);

      setCounts(STATS.map((stat) => Math.round(stat.value * eased)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  return (
    <section className="w-full bg-white py-[100px] sm:py-[120px] px-0">
      <div className="mx-auto flex max-w-[1400px] w-full flex-col px-0">
        {/* Header and description removed per request */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          onViewportEnter={() => setStarted(true)}
          className="overflow-hidden rounded-none border border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_24px_80px_rgba(15,23,42,0.06)]"
        >
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} count={counts[i]} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function SellersMapLight() {
  const locations = [
    { label: "USA", x: 220, y: 170, anchor: "end" },
    { label: "Canada", x: 280, y: 135, anchor: "start" },
    { label: "UK", x: 570, y: 145, anchor: "start" },
    { label: "Germany", x: 625, y: 165, anchor: "start" },
    { label: "France", x: 620, y: 195, anchor: "end" },
    { label: "UAE", x: 820, y: 235, anchor: "start" },
    { label: "Australia", x: 1010, y: 280, anchor: "start" },
  ];

  const connections = [
    { from: locations[0], to: locations[2] },
    { from: locations[0], to: locations[5] },
    { from: locations[2], to: locations[3] },
    { from: locations[3], to: locations[4] },
    { from: locations[5], to: locations[6] },
  ];

  return (
    <section className="w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#2563EB]">Worldwide reach</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Trusted by sellers across global marketplaces
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A clean snapshot of the regions where Yoflix supports high-growth eCommerce brands with strategic marketplace expertise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mt-10 overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.05),transparent_25%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:18px_18px]" />

          <svg viewBox="0 0 1100 360" className="relative z-10 h-[320px] w-full overflow-visible">
            <defs>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#2563EB" floodOpacity="0.12" />
              </filter>
            </defs>
            <rect x="0" y="0" width="1100" height="360" rx="28" fill="transparent" />
            {connections.map((conn, index) => {
              const path = `M ${conn.from.x} ${conn.from.y} C ${conn.from.x + 80} ${conn.from.y - 20}, ${conn.to.x - 80} ${conn.to.y + 20}, ${conn.to.x} ${conn.to.y}`;
              return (
                <motion.path
                  key={`${conn.from.label}-${conn.to.label}`}
                  d={path}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.85, ease: "easeOut", delay: index * 0.08 }}
                />
              );
            })}

            {locations.map((location, index) => (
              <motion.g
                key={location.label}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <circle cx={location.x} cy={location.y} r="14" fill="#EFF6FF" />
                <circle cx={location.x} cy={location.y} r="6" fill="#0F172A" />
                <text
                  x={location.x + (location.anchor === "end" ? -18 : 18)}
                  y={location.y + 4}
                  textAnchor={location.anchor as "start" | "end"}
                  fontSize="14"
                  fontWeight="600"
                  fill="#0F172A"
                >
                  {location.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ GLOBAL PRESENCE ============ */
export function GlobalPresence() {
  const locations = [
    { label: "USA", x: 245, y: 182, anchor: "end" },
    { label: "Canada", x: 310, y: 148, anchor: "start" },
    { label: "UK", x: 600, y: 154, anchor: "start" },
    { label: "Germany", x: 650, y: 172, anchor: "start" },
    { label: "France", x: 645, y: 198, anchor: "end" },
    { label: "Spain", x: 630, y: 225, anchor: "end" },
    { label: "Italy", x: 688, y: 214, anchor: "start" },
    { label: "Sweden", x: 700, y: 120, anchor: "start" },
    { label: "UAE", x: 825, y: 240, anchor: "start" },
    { label: "Saudi Arabia", x: 790, y: 222, anchor: "end" },
    { label: "Australia", x: 1018, y: 278, anchor: "start" },
  ];

  const connections = [
    { from: locations[0], to: locations[1] },
    { from: locations[1], to: locations[2] },
    { from: locations[2], to: locations[3] },
    { from: locations[3], to: locations[4] },
    { from: locations[4], to: locations[5] },
    { from: locations[5], to: locations[6] },
    { from: locations[3], to: locations[7] },
    { from: locations[6], to: locations[8] },
    { from: locations[8], to: locations[9] },
    { from: locations[9], to: locations[10] },
  ];

  return (
    <section className="w-full bg-white py-[100px] sm:py-[120px]">
      <div className="mx-auto flex max-w-[1400px] flex-col px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#2563EB]">Global Presence</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
            Helping sellers grow worldwide
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Supporting eBay, Walmart, and TikTok Shop sellers across international marketplaces with premium operations, strategy, and growth support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative mt-14 overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:px-8 lg:px-10 lg:py-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:18px_18px]" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <svg viewBox="0 0 1100 340" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mapSoftGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EFF6FF" />
                  <stop offset="100%" stopColor="#F8FAFC" />
                </linearGradient>
                <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.04" />
                </filter>
              </defs>

              <rect width="1100" height="340" rx="24" fill="url(#mapSoftGlow)" />

              <g fill="#E8EEF7" filter="url(#mapShadow)">
                <path d="M110 132c25-26 60-45 98-42 24 2 45 10 65 24 16 12 28 31 45 38 15 5 31 3 45-3 15-7 27-19 45-23 20-4 41 1 58 12 17 11 31 28 49 37 22 11 49 12 72 4 18-7 33-18 52-23 24-7 51-4 73 9 16 10 28 24 44 32 15 8 32 12 48 12v94H110z" />
                <path d="M220 238c28-14 55-24 89-20 29 4 56 19 85 24 28 5 58 1 82-14 19-12 33-31 56-36 30-7 61 4 86 18 21 12 40 30 63 36 24 6 49 3 72-7 21-9 40-23 63-27 24-5 49-2 72 10 15 8 29 20 42 30v45H220z" />
              </g>

              {connections.map((conn, index) => {
                const path = `M ${conn.from.x} ${conn.from.y} C ${conn.from.x + 60} ${conn.from.y - 20}, ${conn.to.x - 60} ${conn.to.y + 20}, ${conn.to.x} ${conn.to.y}`;
                return (
                  <motion.path
                    key={`${conn.from.label}-${conn.to.label}`}
                    d={path}
                    stroke="#2563EB"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="4 6"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.9, delay: index * 0.06, ease: "easeOut" }}
                  />
                );
              })}

              {locations.map((location, index) => (
                <motion.g
                  key={location.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                  whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                >
                  <circle cx={location.x} cy={location.y} r="14" fill="#EFF6FF" />
                  <motion.circle
                    cx={location.x}
                    cy={location.y}
                    r="6"
                    fill="#0F172A"
                    animate={{ scale: [1, 1.16, 1], opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.12 }}
                  />
                  <circle cx={location.x} cy={location.y} r="16" fill="none" stroke="#BFDBFE" strokeWidth="2" />
                </motion.g>
              ))}
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ HOW IT WORKS ============ */
const STEPS = [
  {
    n: "01",
    t: "Consultation",
    d: "Free discovery call to understand your store, goals and challenges.",
  },
  {
    n: "02",
    t: "Research",
    d: "Deep market analysis, competitor audit and growth opportunity mapping.",
  },
  {
    n: "03",
    t: "Implementation",
    d: "We execute the plan — listings, SEO, store ops, support, the works.",
  },
  {
    n: "04",
    t: "Growth",
    d: "Measure, optimize, scale. Monthly reports and continuous iteration.",
  },
];
export function Reviews() {
  const REVIEWS = [
    {
      name: "Marcus Chen",
      role: "Auto Parts Seller",
      img: "https://i.pravatar.cc/80?img=33",
      text: "Yoflix took our cluttered storefront and made it premium. We went from 50 orders a month to 400 in under a quarter.",
    },
    {
      name: "Elena Rodriguez",
      role: "Fashion Boutique",
      img: "https://i.pravatar.cc/80?img=5",
      text: "Their listing copy alone doubled our click-through rate. The team genuinely gets eBay in a way other agencies don't.",
    },
    {
      name: "David Park",
      role: "Collectibles",
      img: "https://i.pravatar.cc/80?img=68",
      text: "Communication is incredible. Weekly updates, monthly strategy calls, dedicated Slack channel. Worth every dollar.",
    },
    {
      name: "Nadia Hassan",
      role: "Beauty & Wellness",
      img: "https://i.pravatar.cc/80?img=32",
      text: "I tried 3 agencies before Yoflix. They're the only one that delivered. Our product research alone uncovered $40k in new SKUs.",
    },
    {
      name: "Oliver Brandt",
      role: "Tools & Hardware",
      img: "https://i.pravatar.cc/80?img=15",
      text: "Customer support handling has been a game-changer. My ratings are higher than ever and I have weekends back.",
    },
    {
      name: "Priya Reddy",
      role: "Jewelry",
      img: "https://i.pravatar.cc/80?img=23",
      text: "Premium service at fair pricing. The dedicated account manager feels like a true partner, not a vendor.",
    },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-strong relative rounded-3xl p-7"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" />
              <div className="flex gap-1 text-ebay-yellow">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">"{review.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={review.img} alt={review.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-soft" />
                <div>
                  <div className="text-sm font-semibold">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CLIENT_TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "eBay Seller",
    company: "ElectroHub",
    img: "https://i.pravatar.cc/120?img=47",
    text: "Yoflix helped us transform our eBay business with a complete growth strategy. In four months, revenue increased 240% and our listings now convert far better.",
  },
  {
    name: "James O'Connor",
    role: "Vintage Reseller",
    company: "RetroFinds",
    img: "https://i.pravatar.cc/120?img=12",
    text: "Their expert store refresh and marketplace optimization delivered steady visibility and reduced returns by 35%. Growth became predictable.",
  },
  {
    name: "Aisha Patel",
    role: "Home & Garden Seller",
    company: "Garden Grove",
    img: "https://i.pravatar.cc/120?img=44",
    text: "From product listings to customer messaging, the team created a repeatable process that increased average order value and buyer satisfaction.",
  },
  {
    name: "Carlos Reyes",
    role: "Fashion Seller",
    company: "StyleStreet",
    img: "https://i.pravatar.cc/120?img=68",
    text: "Yoflix brought clarity to our operations with standout listings and smarter ad campaigns. Our daily sales velocity improved significantly.",
  },
  {
    name: "Nadia Hassan",
    role: "Beauty & Wellness Seller",
    company: "GlowHaus",
    img: "https://i.pravatar.cc/120?img=32",
    text: "I tried multiple agencies before Yoflix. They're the only one that delivered. Our product research alone uncovered $40k in new SKUs.",
  },
  {
    name: "Marcus Chen",
    role: "Auto Parts Seller",
    company: "GearLane",
    img: "https://i.pravatar.cc/120?img=33",
    text: "The team turned our storefront from cluttered to premium. We went from 50 orders a month to 400 in under a quarter.",
  },
];

type TestimonialCardProps = {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
};

const TestimonialCard = ({ quote, authorName, authorTitle, avatarUrl }: TestimonialCardProps) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
    whileHover={{ y: -6, scale: 1.01 }}
    className="group relative flex h-full min-h-[280px] w-[320px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-7 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.18)] backdrop-blur transition-all duration-300 hover:border-sky-200 hover:shadow-[0_32px_90px_-34px_rgba(37,99,235,0.22)]"
  >
    <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600">
          <Quote className="h-4 w-4" />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Verified
        </span>
      </div>

      <p className="mt-6 flex-1 text-sm leading-7 text-slate-600">“{quote}”</p>

      <div className="mt-7 flex items-center gap-3">
        <img src={avatarUrl} alt={authorName} className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-100" />
        <div>
          <h4 className="text-sm font-semibold text-slate-950">{authorName}</h4>
          <p className="text-sm text-slate-500">{authorTitle}</p>
        </div>
      </div>
    </div>
  </motion.article>
);

type HorizontalScrollerProps = {
  children: React.ReactNode;
  speed?: string;
  direction?: "left" | "right";
};

const HorizontalScroller = ({ children, speed = "32s", direction = "left" }: HorizontalScrollerProps) => {
  const animationClass = direction === "right" ? "marquee-right" : "marquee-left";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 px-4 py-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.16)] backdrop-blur">
      <div className={`marquee ${animationClass}`} style={{ animationDuration: speed }}>
        <div className="flex items-stretch gap-6 pr-6">{children}</div>
        <div className="flex items-stretch gap-6 pr-6" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export function TestimonialsSection() {
  const testimonialRows = [
    {
      id: "top-row",
      speed: "34s",
      direction: "left" as const,
      testimonials: CLIENT_TESTIMONIALS.slice(0, 3),
    },
    {
      id: "bottom-row",
      speed: "36s",
      direction: "right" as const,
      testimonials: CLIENT_TESTIMONIALS.slice(3),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_32%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Testimonials"
          title={
            <>
              Seller stories, <span className="font-display italic gradient-text">backed by results</span>
            </>
          }
          sub="Real feedback from marketplace sellers who trusted Yoflix to sharpen their operations and scale with confidence."
        />

        <div className="mt-14 space-y-6">
          {testimonialRows.map((row) => (
            <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
              {row.testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  quote={testimonial.text}
                  authorName={testimonial.name}
                  authorTitle={`${testimonial.role} · ${testimonial.company}`}
                  avatarUrl={testimonial.img}
                />
              ))}
            </HorizontalScroller>
          ))}
        </div>
      </div>
    </section>
  );
}

const MARQUEE_REVIEWS = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = MARQUEE_REVIEWS.slice(0, MARQUEE_REVIEWS.length / 2);
const secondRow = MARQUEE_REVIEWS.slice(MARQUEE_REVIEWS.length / 2);

const ReviewMarqueeCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => (
  <figure className="relative h-full w-72 min-w-[18rem] flex-shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.15)] transition duration-300 ease-out hover:-translate-y-1 hover:bg-slate-50">
    <div className="flex items-center gap-3">
      <img className="h-12 w-12 rounded-full object-cover" src={img} alt={name} />
      <div>
        <figcaption className="text-sm font-semibold text-slate-950">{name}</figcaption>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{username}</p>
      </div>
    </div>

    <blockquote className="mt-4 text-sm leading-6 text-slate-600">"{body}"</blockquote>
  </figure>
);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  const items = [...props.testimonials, ...props.testimonials];

  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateX: "-50%",
        }}
        transition={{
          duration: props.duration || 12,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex gap-6 pb-6"
      >
        {items.map(({ text, image, name, role }, i) => (
          <motion.div
            key={`${name}-${i}`}
            aria-hidden={i >= props.testimonials.length ? "true" : "false"}
            tabIndex={i >= props.testimonials.length ? -1 : 0}
            whileHover={{
              scale: 1.03,
              y: -4,
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileFocus={{
              scale: 1.03,
              y: -4,
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            className="p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-black/5 min-w-[18rem] w-full bg-white dark:bg-neutral-900 transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <blockquote className="m-0 p-0">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal m-0 transition-colors duration-300">
                {text}
              </p>
              <footer className="flex items-center gap-3 mt-6">
                <img
                  width={40}
                  height={40}
                  src={image}
                  alt={`Avatar of ${name}`}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 group-hover:ring-primary/30 transition-all duration-300 ease-in-out"
                />
                <div className="flex flex-col">
                  <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300">
                    {name}
                  </cite>
                  <span className="text-sm leading-5 tracking-tight text-neutral-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                    {role}
                  </span>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export function HomepageTestimonialsSection() {
  return (
    <section aria-labelledby="home-testimonials-heading" className="bg-transparent py-24 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], opacity: { duration: 0.8 } }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <div className="flex justify-center">
            <div className="border border-neutral-300 dark:border-neutral-700 py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-400 bg-neutral-100/50 dark:bg-neutral-800/50 transition-colors">
              Testimonials
            </div>
          </div>

          <h2 id="home-testimonials-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white transition-colors">
            What our users say
          </h2>
          <p className="text-center mt-5 text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-sm transition-colors">
            Discover how thousands of teams streamline their operations with our platform.
          </p>
        </div>

        <div
          className="mt-10 space-y-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} />
        </div>
      </motion.div>
    </section>
  );
}

export function TestimonialsMarquee() {
  const firstDuplicates = [...firstRow, ...firstRow];
  const secondDuplicates = [...secondRow, ...secondRow];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_35%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2563EB]">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Seller stories in motion.
          </h2>
          <p className="mt-4 text-base text-slate-600">A continuous marquee of review highlights from Yoflix clients.</p>
        </div>

        <div className="mt-14 space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.16)]">
            <div className="marquee marquee-left px-6 py-8">
              {firstDuplicates.map((review, index) => (
                <ReviewMarqueeCard key={`${review.username}-${index}`} {...review} />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_32px_120px_-48px_rgba(15,23,42,0.16)]">
            <div className="marquee marquee-right px-6 py-8">
              {secondDuplicates.map((review, index) => (
                <ReviewMarqueeCard key={`${review.username}-${index}`} {...review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="How It Works" title={<>How We Partner With Sellers — Simple, Predictable, Effective</>} />

        <div className="mt-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-slate-600">A clear four-step process focused on measurable results.</p>
          </div>

          {/* Connector bar (thin, animated subtle gradient like screenshot) */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-4xl overflow-hidden bg-transparent flex items-center" style={{ height: 2 }}>
              <div
                className="w-full h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(124,94,246,0.18), rgba(255,255,255,0))',
                  backgroundSize: '200% 100%',
                  animation: 'yoflixShift 6s linear infinite',
                }}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative text-center"
              >
                <div className="mx-auto h-20 w-20 rounded-full bg-white flex items-center justify-center font-display italic text-xl shadow-[0_28px_60px_rgba(37,99,235,0.08)] ring-1 ring-[#DBEAFE]">
                  <span className="text-2xl text-[#2563EB]">{s.n}</span>
                </div>
                <h3 className="mt-6 text-center text-lg font-semibold text-[#042c54]">{s.t}</h3>
                <p className="mt-2 text-center text-sm text-slate-600 max-w-xs mx-auto">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ WHY CHOOSE ============ */
const WHY = [
  {
    icon: Users,
    t: "Expert Team",
    d: "10+ year eBay specialists across categories.",
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    t: "Data-Driven Strategy",
    d: "Every decision backed by analytics.",
    span: "",
  },
  { icon: UserCog, t: "Dedicated Account Manager", d: "One point of contact, always.", span: "" },
  { icon: Zap, t: "Fast Delivery", d: "Turnaround in days, not weeks.", span: "md:col-span-2" },
  { icon: Wallet, t: "Affordable Pricing", d: "Flexible plans that scale with you.", span: "" },
  {
    icon: Sprout,
    t: "Long-Term Growth",
    d: "We optimize for compounding returns.",
    span: "md:col-span-2",
  },
];
export function WhyChoose() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Why Yoflix"
          title={
            <>
              Built for sellers who refuse to{" "}
              <span className="font-display italic gradient-text">settle</span>
            </>
          }
        />
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {WHY.map((w, i) => (
            <motion.div
              key={w.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group glass-strong relative overflow-hidden rounded-3xl p-7 transition-all hover:shadow-glow ${w.span}`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-soft transition-transform group-hover:scale-110">
                <w.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{w.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ PRICING ============ */
const PLANS = [
  {
    name: "Starter",
    price: 129,
    popular: false,
    desc: "Perfect for new eBay sellers finding their footing.",
    features: [
      "50 Listings Creation",
      "Product Research",
      "Basic SEO Optimization",
      "Email Support",
    ],
  },
  {
    name: "Growth",
    price: 249,
    popular: true,
    desc: "Our most chosen plan for serious growth.",
    features: [
      "200 Listings Creation",
      "Product Research",
      "Advanced SEO Optimization",
      "Store Management",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: 499,
    popular: false,
    desc: "Full-service partnership for high-volume stores.",
    features: [
      "Unlimited Listings",
      "In-depth Product Research",
      "Full Store Management",
      "Order & Customer Support",
      "Dedicated Account Manager",
    ],
  },
];
export function Pricing() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlanOption[]>([]);
  const [pricingPlansLoading, setPricingPlansLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPricingPlans = async () => {
      try {
        const response = await apiRequest<{ data?: { pricingPlans?: PricingPlanOption[] } }>(
          "/pricing/get",
        );
        if (active) {
          setPricingPlans(response?.data?.pricingPlans ?? []);
        }
      } catch {
        if (active) {
          setPricingPlans([]);
        }
      } finally {
        if (active) {
          setPricingPlansLoading(false);
        }
      }
    };

    const handlePricingUpdated = () => {
      setPricingPlansLoading(true);
      void loadPricingPlans();
    };

    void loadPricingPlans();
    window.addEventListener("pricing:updated", handlePricingUpdated);
    return () => {
      active = false;
      window.removeEventListener("pricing:updated", handlePricingUpdated);
    };
  }, []);

  const PLANS = pricingPlans;

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#F8FAFC] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(at_15%_20%,rgba(59,110,245,0.12),transparent_50%),radial-gradient(at_85%_80%,rgba(59,110,245,0.08),transparent_50%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-20 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(59,110,245,0.2),transparent)] blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] bottom-10 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(59,110,245,0.16),transparent)] blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Pricing"
          title={<>Affordable Plans For <span className="font-display italic gradient-text">Every Business</span></>}
          sub="Choose the perfect plan that suits your needs and budget."
        />

        <div className="mt-20 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {(pricingPlansLoading ? Array.from({ length: 3 }) : PLANS).map((p, i) => {
            if (pricingPlansLoading) {
              return (
                <div
                  key={i}
                  className="h-[480px] rounded-[28px] border border-[#E5E7EB] bg-white p-8 shadow-[0_16px_40px_rgba(17,24,39,0.05)]"
                />
              );
            }

            const plan = p as Required<PricingPlanOption>;
            const popular = plan.isPopular;

            return (
              <motion.div
                key={plan._id ?? i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className={`group relative flex flex-col ${popular ? "lg:-my-4 lg:scale-[1.04]" : ""} ${
                  popular ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Gradient border wrapper for featured */}
                {popular && (
                  <>
                    <motion.div
                      aria-hidden
                      className="absolute -inset-px rounded-[32px] bg-[linear-gradient(135deg,#4A7BFF_0%,#2F5FE0_100%)] opacity-90"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent)] blur-2xl animate-pulse-glow" />
                  </>
                )}

                <div
                  className={`relative flex h-full flex-col rounded-[28px] p-8 transition-shadow sm:p-10 ${
                    popular
                      ? "bg-white shadow-[0_24px_70px_rgba(59,110,245,0.16)]"
                      : "border border-[#E5E7EB] bg-white shadow-[0_16px_40px_rgba(17,24,39,0.05)] transition-all duration-300 hover:shadow-[0_24px_60px_rgba(17,24,39,0.08)]"
                  }`}
                >
                  {popular && (
                    <motion.span
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,#4A7BFF_0%,#2F5FE0_100%)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(59,110,245,0.24)]"
                    >
                      ★ Most Popular
                    </motion.span>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">{plan.title}</h3>
                    {popular && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">Best Value</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.shortDescription}</p>

                  <div className="mt-7 flex items-baseline gap-1">
                    <span className="text-6xl font-semibold tracking-tight text-foreground">
                      {typeof plan.price === "string"
                        ? `$${plan.price.replace(/^\$/u, "")}`
                        : `$${plan.price}`}
                    </span>
                    <span className="text-sm text-muted-foreground">/{plan.billingType}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Billed monthly · Cancel anytime</div>

                  <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                  <ul className="space-y-3.5">
                    {(plan.features ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${popular ? "gradient-primary text-white" : "bg-primary/10 text-primary"}`}>
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Link
                      to="/contact"
                      className={`group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                        popular
                          ? "bg-[linear-gradient(135deg,#4A7BFF_0%,#2F5FE0_100%)] text-white shadow-[0_12px_30px_-8px_rgba(59,110,245,0.24)] hover:shadow-[0_18px_40px_-8px_rgba(59,110,245,0.28)]"
                          : "border border-[#E5E7EB] bg-white text-[#3B6EF5] hover:border-[#3B6EF5]/30 hover:bg-[#EAF2FF] hover:shadow-[0_12px_30px_-12px_rgba(59,110,245,0.16)]"
                      }`}
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                      {popular ? "Start Growing Now" : "Get Started"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Need something custom? <Link to="/contact" className="font-medium text-primary underline-offset-4 hover:underline">Talk to sales →</Link>
        </p>
      </div>
    </section>
  );
}

/* ============ TESTIMONIALS ============ */
const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "eBay Seller",
    company: "ElectroHub",
    marketplace: "eBay",
    country: "🇺🇸",
    img: "https://i.pravatar.cc/120?img=47",
    text: "Yoflix helped us transform our eBay business with a complete growth strategy. In four months, revenue increased 240% and our listings now convert far better.",
  },
  {
    name: "James O'Connor",
    role: "Vintage Reseller",
    company: "RetroFinds",
    marketplace: "Walmart",
    country: "🇬🇧",
    img: "https://i.pravatar.cc/120?img=12",
    text: "Their expert store refresh and marketplace optimization delivered steady visibility and reduced returns by 35%. Growth became predictable.",
  },
  {
    name: "Aisha Patel",
    role: "Home & Garden Seller",
    company: "Garden Grove",
    marketplace: "TikTok Shop",
    country: "🇦🇺",
    img: "https://i.pravatar.cc/120?img=44",
    text: "From product listings to customer messaging, the team created a repeatable process that increased average order value and buyer satisfaction.",
  },
  {
    name: "Carlos Reyes",
    role: "Fashion Seller",
    company: "StyleStreet",
    marketplace: "eBay",
    country: "🇨🇦",
    img: "https://i.pravatar.cc/120?img=68",
    text: "Yoflix brought clarity to our operations with standout listings and smarter ad campaigns. Our daily sales velocity improved significantly.",
  },
];

export const MARQUEE_TESTIMONIALS = [
  ...TESTIMONIALS,
  ...TESTIMONIALS,
  ...TESTIMONIALS,
  ...TESTIMONIALS,
];

const TESTIMONIAL_CARD = (
  testimonial: (typeof TESTIMONIALS)[number],
  index: number
) => (
  <motion.div
    key={`${testimonial.name}-${index}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{
      duration: 0.7,
      delay: (index % TESTIMONIALS.length) * 0.08,
      ease: [0.22, 1, 0.36, 1],
    }}
    whileHover={{
      y: -10,
      scale: 1.03,
      rotateX: 2,
      rotateY: -2,
    }}
    className="group relative flex-shrink-0 w-[320px] overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.18)] transition-all duration-300"
  >
    {/* Hover Gradient */}
    <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative z-10 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={testimonial.img}
            alt={testimonial.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-100"
          />

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {testimonial.name}
            </h4>

            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {testimonial.company}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            {testimonial.marketplace}
          </div>

          <span className="text-xl">{testimonial.country}</span>
        </div>
      </div>

      {/* Rating */}

      <div className="flex gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className="h-4 w-4 fill-current"
          />
        ))}
      </div>

      {/* Review */}

      <p className="text-sm leading-7 text-slate-600">
        {testimonial.text}
      </p>
    </div>
  </motion.div>
);

/* ============ FAQ ============ */
const FAQS = [
  {
    q: "How quickly can you start managing my eBay store?",
    a: "Most clients are fully onboarded within 3–5 business days after the consultation call.",
  },
  {
    q: "Do you work with sellers outside the US?",
    a: "Yes — we work with eBay sellers across the US, UK, EU, Canada and Australia.",
  },
  {
    q: "Will I keep ownership of my listings & store?",
    a: "Always. You retain 100% ownership. We work inside your seller account with secure permissions.",
  },
  {
    q: "Can I switch or cancel my plan?",
    a: "Absolutely. Plans are month-to-month and you can upgrade, downgrade or cancel anytime.",
  },
  {
    q: "What's included in the free consultation?",
    a: "A 30-minute audit of your store, opportunities analysis, and a tailored growth roadmap — no commitment.",
  },
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="font-display italic gradient-text">answered</span>
            </>
          }
        />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="glass overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary text-white">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT HERO ============ */
export function ContactHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/src/assets/contact-bg.png')",
            backgroundColor: '#f0f4ff'
          }}
        />
        
        {/* Overlay Gradient - White from left to transparent (slightly lighter) */}
        {/* no overlay on hero - let image show through */}

        <div className="relative w-full py-16 sm:py-24 lg:py-32 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col z-10"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 border border-blue-200">
                    <div className="relative">
                      <div className="h-2 w-2 bg-blue-600 rounded-full" />
                      <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-sm" />
                    </div>
                    <span className="text-xs font-medium text-blue-700">We're Here to Help</span>
                  </div>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-6 text-slate-900"
                >
                  Let's Grow Your{" "}
                  <span className="block">eCommerce Business</span>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Together.
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-base sm:text-lg text-slate-600 leading-relaxed mb-12 max-w-lg"
                >
                  Have questions or ready to get started? Our team is here to help you scale on eBay, Walmart & TikTok Shop.
                </motion.p>

                {/* Info Cards */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3"
                >
                  {[
                    { icon: "💬", title: "Quick Response", desc: "We reply within 24 hours" },
                    { icon: "🔒", title: "100% Confidential", desc: "Your information is always safe" },
                    { icon: "👨‍💼", title: "Expert Support", desc: "Talk to real eCommerce specialists" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Side - Image Space */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="hidden lg:block h-full"
              >
                {/* Background image is displayed via absolute positioning */}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [pricingPlans, setPricingPlans] = useState<PricingPlanOption[]>([]);
  const [pricingPlansLoading, setPricingPlansLoading] = useState(true);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage("");
      setStatus("idle");
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [message, status]);
  useEffect(() => {
    let active = true;

    const loadPricingPlans = async () => {
      try {
        const response = await apiRequest<{ data?: { pricingPlans?: PricingPlanOption[] } }>(
          "/pricing/get",
        );
        if (active) setPricingPlans(response?.data?.pricingPlans ?? []);
      } catch {
        if (active) setPricingPlans([]);
      } finally {
        if (active) setPricingPlansLoading(false);
      }
    };

    void loadPricingPlans();
    return () => {
      active = false;
    };
  }, []);
  const { data: settings } = useWebsiteSettings();
  const contactInfo = settings?.contactInfo ?? ({} as any);
  const mapQuery = encodeURIComponent(
    `${contactInfo.officeAddress || "Lahore"}, ${contactInfo.officeCity || "Pakistan"}`
  );

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const userMessage = String(formData.get("message") || "").trim();
    const phone = String(formData.get("phone") || "").replace(/\D/g, "").trim();
    const email = String(formData.get("email") || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phone || phone.length < 7) {
      setStatus("error");
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      await apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          email,
          phone,
          company: String(formData.get("company") || "").trim(),
          selectedPlan: String(formData.get("selectedPlan") || "").trim(),
          subject: String(formData.get("subject") || "").trim(),
          message: userMessage,
        }),
      });
      form.reset();
      setPhoneValue("");
      setEmailValue("");
      setStatus("success");
      setMessage("Thanks — your message was saved and our team will reply soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit your message.");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/contact-bg.png')",
          backgroundColor: "#FFFFFF",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.06),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white/90 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
            Get in Touch with <span className="text-[#2563EB]">Yoflix</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#64748B] sm:text-lg">
            Have questions or ready to grow your eCommerce business? Our team is here to help you scale on eBay, Walmart & TikTok Shop.
          </p>
        </motion.div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-[1fr_1fr] lg:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="order-2 flex flex-col justify-between space-y-6 rounded-[24px] lg:rounded-tr-none lg:rounded-br-none border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-10 lg:order-1"
          >
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#0F172A]">Get in touch</h3>
              <p className="mb-6 text-sm text-[#64748B]">
                We'd love to hear from you. Reach out through any of the following channels.
              </p>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-start gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#2563EB] hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,_#0F172A_0%,_#1E3A8A_55%,_#2563EB_100%)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.20)]"
                  >
                    <MapPin className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                      Head Office
                    </div>
                    <div className="mt-1 text-sm font-medium text-[#0F172A]">
                      {contactInfo.officeAddress || "Lahore"}
                      <br />
                      {contactInfo.officeCity || "Punjab, Pakistan"}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-start gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#2563EB] hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,_#0F172A_0%,_#1E3A8A_55%,_#2563EB_100%)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.20)]"
                  >
                    <Mail className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                      Email Us
                    </div>
                    <div className="mt-1">
                      <div className="text-sm font-medium text-[#0F172A]">
                        {contactInfo.businessEmail || "hello@yoflix.com"}
                      </div>
                      <div className="text-sm text-[#64748B]">
                        {contactInfo.supportEmail || "support@yoflix.com"}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex items-start gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-[#2563EB] hover:shadow-[0_18px_40px_rgba(37,99,235,0.12)]"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,_#0F172A_0%,_#1E3A8A_55%,_#2563EB_100%)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.20)]"
                  >
                    <Phone className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                      Call Us
                    </div>
                    <div className="mt-1">
                      <div className="text-sm font-medium text-[#0F172A]">
                        {contactInfo.phoneNumber || "+1 (800) 632 5234"}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Mon - Fri, 9:00 AM - 6:00 PM (EST)
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
              <iframe
                title="Yoflix location"
                src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#0F172A]">Follow us</h3>
              <div className="flex gap-3">
                {[
                  { icon: "f", label: "Facebook" },
                  { icon: "t", label: "Twitter" },
                  { icon: "l", label: "LinkedIn" },
                  { icon: "y", label: "YouTube" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ y: -6, scale: 1.04, rotate: 5 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#E2E8F0] bg-white text-[#2563EB] shadow-sm transition-all duration-300 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
                    aria-label={social.label}
                  >
                    {social.icon === "f" && <Mail className="h-4 w-4" />}
                    {social.icon === "t" && <MessageSquare className="h-4 w-4" />}
                    {social.icon === "l" && <Users className="h-4 w-4" />}
                    {social.icon === "y" && <Activity className="h-4 w-4" />}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onSubmit={submitContact}
            className="order-1 rounded-[24px] lg:rounded-tl-none lg:rounded-bl-none border border-[#E2E8F0] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-10 lg:order-2"
          >
            <h3 className="mb-6 text-lg font-semibold text-[#0F172A]">Send us a message</h3>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  minLength={2}
                  className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company"
                  className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Your phone"
                  required
                  value={phoneValue}
                  onChange={(event) => setPhoneValue(event.target.value.replace(/\D/g, "").slice(0, 15))}
                  className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Your email"
                  required
                  value={emailValue}
                  onChange={(event) => setEmailValue(event.target.value.trim())}
                  className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                Choose Plan
              </label>
              <select
                name="selectedPlan"
                required
                className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB]"
                defaultValue={pricingPlans.length ? pricingPlans[0]._id || pricingPlans[0].slug || "" : ""}
              >
                {pricingPlansLoading ? (
                  <option value="" disabled>
                    Loading plans...
                  </option>
                ) : null}
                {pricingPlans.map((plan) => (
                  <option key={plan._id} value={plan._id || plan.slug || ""}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help you?"
                required
                className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748B]">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Type your message here..."
                required
                minLength={10}
                className="mt-2 w-full rounded-[14px] border border-[#CBD5E1] bg-white px-4 py-2.75 text-base text-[#0F172A] placeholder:text-[#94A3B8] placeholder:transition-all placeholder:duration-300 focus:placeholder:translate-x-[-2px] outline-none resize-none shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all duration-300 focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#2563EB] bg-[linear-gradient(135deg,_#0F172A_0%,_#1E3A8A_55%,_#2563EB_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,0.24)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_22px_60px_rgba(37,99,235,0.28)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
              {status !== "loading" && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="pointer-events-none fixed right-4 bottom-4 z-[60] max-w-sm">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    key={`${status}-${message}`}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    role="alert"
                    aria-live="polite"
                    className={`flex items-start gap-2 rounded-[14px] border px-4 py-3 text-sm shadow-[0_20px_50px_rgba(15,23,42,0.16)] ${
                      status === "error"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {status === "error" ? (
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span>{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ============ FINAL CTA ============ */
export function FinalCTA() {
  const { data: settings } = useWebsiteSettings();
  const contactInfo = settings?.contactInfo ?? ({} as any);
  const whatsappNumber = String(contactInfo.whatsappNumber || "15550102024").replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="relative w-full bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center px-0 sm:px-0 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-[#F8FAFC] px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10 sm:py-14 lg:px-14 lg:py-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.08),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.06),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="pointer-events-none absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-8 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-700"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Let&apos;s grow together
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]"
              >
                Ready to Scale Your eCommerce Business?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.22 }}
                className="mt-4 max-w-xl text-base leading-8 text-slate-600 sm:text-lg"
              >
                Whether you&apos;re selling on eBay, Walmart Marketplace, or TikTok Shop, Yoflix provides expert account management, listing optimization, marketplace growth, and long-term business support to help you achieve sustainable success.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="relative flex flex-col gap-3 sm:flex-row sm:justify-start lg:flex-col lg:items-end"
            >
              <div className="pointer-events-none absolute left-0 top-1/2 h-14 w-36 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl sm:left-2" />
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={{ scale: [1, 1.008, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Link
                  to="/consultation"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(15,23,42,0.18)] transition-all duration-300 hover:bg-slate-800"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03, y: -2, backgroundColor: "#0F172A", color: "#FFFFFF" }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Chat on WhatsApp</span>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const { data: settings } = useWebsiteSettings();
  const businessInfo = settings?.businessInfo ?? {} as any;
  const contactInfo = settings?.contactInfo ?? {} as any;

  const submitNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus("loading");
    setNewsletterMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    try {
      await apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: email.split("@")[0] || "Newsletter subscriber",
          email,
          phone: "+1 000 000 0000",
          message: "Newsletter subscription request from website footer.",
        }),
      });
      form.reset();
      setNewsletterStatus("success");
      setNewsletterMessage("Subscribed — thanks for joining.");
    } catch (error) {
      setNewsletterStatus("error");
      setNewsletterMessage(error instanceof Error ? error.message : "Unable to subscribe.");
    }
  };

  return (
    <footer className="mt-10 bg-[#0E0B1F] text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-xl font-semibold text-white">{businessInfo.websiteName || "Yoflix"}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              {businessInfo.footerDescription ||
                "Premium eBay growth partner helping sellers scale with strategy, listings and dedicated support."}
            </p>
            <form
              onSubmit={submitNewsletter}
              className="mt-6 flex max-w-sm items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button
                disabled={newsletterStatus === "loading"}
                className="rounded-full gradient-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
              >
                {newsletterStatus === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
            {newsletterMessage && (
              <p
                className={`mt-2 text-xs ${newsletterStatus === "error" ? "text-ebay-red" : "text-ebay-green"}`}
              >
                {newsletterMessage}
              </p>
            )}
          </div>
            {[
            { h: "Company", l: ["About", "Careers", "Blog", "Press"] },
            { h: "Services", l: ["Product Research", "Listings", "SEO", "Store Mgmt"] },
            { h: "Resources", l: ["Guides", "Case Studies", "Support", "Status"] },
            { h: "Contact", l: [contactInfo.businessEmail || "hello@yoflix.com", contactInfo.phoneNumber || "+1 (555) 010-2024", contactInfo.officeAddress || "Global · Remote"] },
          ].map((c) => (
            <div key={c.h}>
              <h4 className="text-sm font-semibold text-white">{c.h}</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                {c.l.map((it) => {
                  const routeMap: Record<string, string> = {
                    About: "/about",
                    Blog: "/faq",
                    "Product Research": "/services",
                    Listings: "/services",
                    SEO: "/services",
                    "Store Mgmt": "/services",
                    Guides: "/how-it-works",
                    "Case Studies": "/testimonials",
                    Support: "/contact",
                  };
                  const route = routeMap[it];
                  return (
                    <li key={it}>
                      {route ? (
                        <Link to={route} className="hover:text-white transition-colors">
                          {it}
                        </Link>
                      ) : (
                        <span className="text-white/50">{it}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Yoflix. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/faq" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/faq" className="hover:text-white">
              Terms
            </Link>
            <Link to="/faq" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
