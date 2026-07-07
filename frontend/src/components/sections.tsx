import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import sphereImg from "@/assets/sphere.png";
import { apiRequest } from "@/lib/api";
import { PricingCard } from "@/components/pricing-card";
import useWebsiteSettings from "@/hooks/use-website-settings";
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

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  sub?: string;
};

export function PageHero({ eyebrow, title, accent, sub }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_52%)]" />

      {/* decorative spheres for page heroes */}
      <motion.img
        src={sphereImg}
        alt=""
        aria-hidden
        className="absolute -left-6 top-6 h-10 w-10 opacity-80"
        animate={{ y: [0, 12, 0], rotate: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.img
        src={sphereImg}
        alt=""
        aria-hidden
        className="absolute right-6 bottom-8 h-8 w-8 opacity-70"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

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
  const hero = settings?.heroSection ?? ({} as any);
  const businessInfo = settings?.businessInfo ?? ({} as any);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  const titleText = "Scale Your eBay Business with Expert Marketplace Support";
  const highlightText = "Expert Marketplace Support";
  const heroSupportLine =
    hero.supportLine ||
    "Also supporting Walmart and TikTok Shop operations.";
  const heroDescription =
    hero.description ||
    "YOFLIX helps businesses manage and grow eBay accounts with expert support.";
  const titleSegments = (() => {
    const safeTitle = titleText || "";
    const safeHighlight = highlightText?.trim() || "";

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
  const titleLength = (titleText || "").trim().length;
  const titleClassName =
    titleLength > 70
      ? "text-3xl leading-[1.06] sm:text-4xl lg:text-5xl"
      : titleLength > 45
        ? "text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
        : "text-5xl leading-[1.05] sm:text-6xl lg:text-7xl";
  const heroBadge = hero.badge || "Trusted eBay Growth Partner";
  const primaryButtonText = hero.primaryButtonText || "Book Consultation";
  const primaryButtonLink = hero.primaryButtonLink || "/contact";
  const secondaryButtonText = hero.secondaryButtonText || "View eBay Plans";
  const secondaryButtonLink = hero.secondaryButtonLink || "/pricing";
  const chartHeights = [96, 136, 184, 238, 292, 340, 392];
  const avatarSources = [
    "https://i.pravatar.cc/80?img=12",
    "https://i.pravatar.cc/80?img=32",
    "https://i.pravatar.cc/80?img=47",
    "https://i.pravatar.cc/80?img=68",
    "https://i.pravatar.cc/80?img=5",
  ];

  return (
    <section
      ref={ref}
      id="home"
      className="relative isolate overflow-hidden px-6 py-20 sm:px-8 sm:py-24 lg:px-8 lg:py-28"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.78),transparent_36%),radial-gradient(circle_at_83%_16%,rgba(14,165,233,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,250,252,0.9))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80 [background-image:radial-gradient(rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute left-[-8%] top-[-10%] -z-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-16%] right-[-10%] -z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="mx-auto max-w-4xl">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className={`font-semibold tracking-tight text-slate-900 ${titleClassName}`}>
            {titleSegments.map((segment, idx) =>
              segment.highlight ? (
                <span key={idx} className="text-blue-900 font-bold">
                  {segment.text}
                </span>
              ) : (
                <span key={idx}>{segment.text}</span>
              )
            )}
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {heroDescription}
          </p>

          <p className="mt-2 text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            {heroSupportLine}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to={primaryButtonLink}
              className="group inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition-all hover:scale-105"
            >
              {primaryButtonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to={secondaryButtonLink}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-all hover:bg-slate-50"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </motion.div>
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-transparent px-5 py-3 sm:px-7">
          <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">{siteName}</span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.label}>
              <Link
                to={n.to}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/60 hover:text-foreground"
                activeProps={{
                  className:
                    "rounded-full px-3 py-2 text-sm text-foreground bg-white/60 font-medium",
                }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-full gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.03] sm:inline-block"
          >
            Get Free Consultation
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/70 lg:hidden"
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
          className="mx-auto mt-2 max-w-7xl rounded-3xl bg-white/80 p-4 shadow-lg backdrop-blur-sm lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link
                  onClick={() => setOpen(false)}
                  to={n.to}
                  className="block rounded-xl px-4 py-3 text-sm hover:bg-white/60"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full gradient-primary px-5 py-3 text-center text-sm font-medium text-white"
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
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),transparent_45%),radial-gradient(circle_at_10%_20%,rgba(15,23,42,0.08),transparent_20%)]" />
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
        {/* removed top eyebrow and inline CTA per design: CTA will be shown after cards */}

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
                className={`group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition duration-300 ease-out will-change-transform ${isActive ? "border-blue-600/30 shadow-[0_28px_90px_rgba(37,99,235,0.17)]" : "hover:border-slate-300"}`}
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
                  <div className="grid h-14 w-14 place-items-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-950 shadow-sm">
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="relative z-10 mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                  {s.title}
                </h3>
                {s.desc ? (
                  <p className="relative z-10 mt-3 text-sm leading-6 text-slate-600 opacity-0 max-h-0 overflow-hidden transition-all duration-200 group-hover:opacity-100 group-hover:max-h-40">
                    {s.desc}
                  </p>
                ) : null}

                <div className="relative z-10 mt-6 flex items-center gap-3 text-sm font-semibold text-blue-600">
                  <span>Learn More</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-blue-600 shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition duration-200 ease-out group-hover:bg-blue-50">
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
            className="group inline-flex items-center justify-center rounded-full bg-[#4c83fd] px-7 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-[#3b6ee5] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>View All Services</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============ STATS ============ */
type StatItem = { value: number; label: string; suffix: string };

const STATS: StatItem[] = [
  { value: 5000, label: "Listings Created", suffix: "+" },
  { value: 200, label: "Happy Clients", suffix: "+" },
  { value: 98, label: "Satisfaction Rate", suffix: "%" },
  { value: 24, label: "Support", suffix: "/7" },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function Stats() {
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(() => STATS.map(() => 0));

  useEffect(() => {
    if (!started) return;

    const duration = 1200;
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-primary p-1 shadow-glow">
          <div className="rounded-[calc(2.5rem-4px)] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent_50%)] px-6 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onViewportEnter={() => setStarted(true)}
              className="grid grid-cols-2 gap-8 text-white sm:grid-cols-4"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-center"
                >
                  <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {counts[i]}
                    {stat.suffix}
                  </div>
                  <div className="mt-2 text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
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

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
            TESTIMONIALS
          </span>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            What our clients say
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Real reviews from Amazon sellers we've helped recover, protect and scale.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {CLIENT_TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-28px_rgba(15,23,42,0.2)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={testimonial.img} alt={testimonial.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{testimonial.name}</div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-700">"{testimonial.text}"</p>
              <div className="mt-6 text-xs uppercase tracking-[0.24em] text-slate-500">
                {testimonial.company}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a href="#" className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Fiverr Profile →
          </a>
          <a href="#" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-100">
            Upwork Profile →
          </a>
          <a href="#" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 ring-1 ring-slate-200 transition hover:bg-slate-100">
            All testimonials →
          </a>
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

export function TestimonialsMarquee() {
  const firstDuplicates = [...firstRow, ...firstRow];
  const secondDuplicates = [...secondRow, ...secondRow];

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_35%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
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
                <div className="mx-auto h-20 w-20 rounded-full bg-white flex items-center justify-center font-display italic text-xl shadow-[0_28px_60px_rgba(109,93,252,0.08)] ring-1 ring-white/50">
                  <span className="text-2xl text-[#6d5dfc]">{s.n}</span>
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
          "/pricing",
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
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-32">
      {/* lavender mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(at_15%_20%,rgba(167,139,250,0.25),transparent_50%),radial-gradient(at_85%_80%,rgba(192,132,252,0.22),transparent_50%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-20 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent)] blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[8%] bottom-10 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(109,93,252,0.3),transparent)] blur-3xl"
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
                  className="h-[480px] rounded-[28px] bg-white/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.16)]"
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
                      className="absolute -inset-px rounded-[32px] bg-[linear-gradient(135deg,#6D5DFC,#C084FC,#8B5CF6)] opacity-90"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),transparent)] blur-2xl animate-pulse-glow" />
                  </>
                )}

                <div
                  className={`relative flex h-full flex-col rounded-[28px] p-8 transition-shadow sm:p-10 ${
                    popular
                      ? "bg-white/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(109,93,252,0.45)]"
                      : "glass-strong hover:shadow-[0_20px_50px_-20px_rgba(109,93,252,0.3)]"
                  }`}
                >
                  {popular && (
                    <motion.span
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,#6D5DFC,#C084FC)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(109,93,252,0.45)]"
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
                          ? "gradient-primary text-white shadow-[0_12px_30px_-8px_rgba(109,93,252,0.6)] hover:shadow-[0_18px_40px_-8px_rgba(109,93,252,0.7)]"
                          : "border border-primary/30 bg-white/60 text-primary hover:bg-white hover:shadow-[0_12px_30px_-12px_rgba(109,93,252,0.4)]"
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

/* ============ CONTACT ============ */
export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [pricingPlans, setPricingPlans] = useState<PricingPlanOption[]>([]);
  const [pricingPlansLoading, setPricingPlansLoading] = useState(true);
  const { data: settings } = useWebsiteSettings();
  const contactInfo = settings?.contactInfo ?? {} as any;

  useEffect(() => {
    let active = true;

    const loadPricingPlans = async () => {
      try {
        const response = await apiRequest<{ data?: { pricingPlans?: PricingPlanOption[] } }>(
          "/pricing",
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

    void loadPricingPlans();

    return () => {
      active = false;
    };
  }, []);

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const storeUrl = String(formData.get("storeUrl") || "").trim();
    const userMessage = String(formData.get("message") || "").trim();
    const selectedPlan = String(formData.get("selectedPlan") || "").trim();

    try {
      await apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          selectedPlan,
          message: storeUrl ? `Store URL: ${storeUrl}\n\n${userMessage}` : userMessage,
        }),
      });
      form.reset();
      setStatus("success");
      setMessage("Thanks — your message was saved and our team will reply soon.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit your message.");
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Contact"
          title={
            <>
              Let's build your <span className="font-display italic gradient-text">growth</span>{" "}
              together
            </>
          }
        />
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {[
                { icon: Mail, t: "Email", v: contactInfo.businessEmail || "hello@yoflix.com" },
                { icon: Phone, t: "Phone", v: contactInfo.phoneNumber || "+1 (555) 010-2024" },
                { icon: MapPin, t: "Location", v: contactInfo.officeAddress || "Remote — serving sellers globally" },
              ].map((c) => (
                <div key={c.t} className="glass-strong flex items-center gap-4 rounded-2xl p-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-white">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {c.t}
                    </div>
                    <div className="font-medium">{c.v}</div>
                  </div>
                </div>
              ))}
            <div className="glass-strong rounded-2xl p-5">
              <p className="text-sm text-muted-foreground">
                Average reply time under{" "}
                <span className="font-semibold text-foreground">2 hours</span> during business
                hours.
              </p>
            </div>
          </motion.div>
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={submitContact}
            className="glass-strong rounded-3xl p-8"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Jane Doe" required minLength={2} />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="jane@store.com"
                required
              />
            </div>
            <div className="mt-4">
              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 010-2024"
                required
              />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Select Plan</label>
              <select
                name="selectedPlan"
                required
                disabled={pricingPlansLoading}
                className="mt-1.5 w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="">
                  {pricingPlansLoading ? "Loading plans..." : "Choose a plan"}
                </option>
                {(pricingPlans.length
                  ? pricingPlans
                  : [{ _id: "custom", title: "Custom Project" }]
                ).map((plan) => (
                  <option
                    key={plan._id || plan.slug || plan.title}
                    value={plan.title || "Custom Project"}
                  >
                    {plan.title || "Custom Project"}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                These options are pulled from the pricing plans created in the admin panel.
              </p>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                minLength={10}
                placeholder="Tell us about your store & goals…"
                className="mt-1.5 w-full resize-none rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <button
              disabled={status === "loading"}
              className="mt-6 w-full rounded-full gradient-primary px-5 py-3.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            {message && (
              <p
                className={`mt-4 text-sm ${status === "error" ? "text-ebay-red" : "text-ebay-green"}`}
              >
                {message}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        {...rest}
        className="mt-1.5 w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/15"
      />
    </div>
  );
}

/* ============ FINAL CTA ============ */
export function FinalCTA() {
  return (
    <section className="relative px-6 py-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] gradient-primary p-12 text-center text-white shadow-glow sm:p-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent_40%)]" />
        <motion.img
          src={sphereImg}
          alt=""
          aria-hidden
          width={200}
          height={200}
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-80 mix-blend-screen sm:h-56 sm:w-56"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.img
          src={sphereImg}
          alt=""
          aria-hidden
          width={140}
          height={140}
          className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 opacity-70 mix-blend-screen sm:h-40 sm:w-40"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Limited consultation slots this month
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-medium tracking-tight sm:text-6xl">
            Ready To Scale Your eBay <span className="font-display italic">Business?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Book a free 30-minute consultation. No pressure, no fluff — just a clear plan.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-primary shadow-soft transition-transform hover:scale-[1.04]"
          >
            Book Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
