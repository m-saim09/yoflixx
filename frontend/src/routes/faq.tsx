import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, BarChart3, MessageCircle, Minus, PieChart, Plus, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/sections";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions | Yoflix" },
      { name: "description", content: "Answers to common questions about Yoflix services, pricing, support, account management and store growth." },
      { property: "og:title", content: "FAQ — Yoflix" },
      { property: "og:description", content: "Everything you need to know about Yoflix." },
    ],
  }),
  component: FAQPage,
});

type CategoryItem = {
  q: string;
  a: string;
};

type Category = {
  name: string;
  eyebrow: string;
  items: CategoryItem[];
};

const CATEGORIES: Category[] = [
  {
    name: "Getting Started",
    eyebrow: "First steps",
    items: [
      { q: "What services do you offer?", a: "Product research, listing creation, SEO, store management, customer support and order processing — full-service eBay growth." },
      { q: "Do you work with sellers outside the US?", a: "Yes — US, UK, EU, Canada and Australia. Our team operates across timezones." },
      { q: "Can you handle multiple stores?", a: "Absolutely. Enterprise plans include multi-store management with consolidated reporting." },
    ],
  },
  {
    name: "Services",
    eyebrow: "Delivery",
    items: [
      { q: "How quickly can we launch your store support?", a: "Most clients are fully onboarded within 3–5 business days after the consultation call." },
      { q: "Will you manage my listings and content?", a: "Yes — we create and optimize listings, refine product pages and keep your store consistent across channels." },
      { q: "Do you support Walmart and TikTok Shop?", a: "Yes. Our team can support multi-channel growth across eBay, Walmart and TikTok Shop with tailored workflows." },
    ],
  },
  {
    name: "Pricing",
    eyebrow: "Plans",
    items: [
      { q: "Are there any setup fees?", a: "No setup fees on any plan. Pay monthly, cancel anytime." },
      { q: "Can I switch plans?", a: "Yes — upgrade or downgrade anytime. Changes take effect the following billing cycle." },
      { q: "Do you offer custom enterprise pricing?", a: "Yes. For high-volume stores we build custom packages — talk to sales." },
    ],
  },
  {
    name: "Account",
    eyebrow: "Ownership",
    items: [
      { q: "Will I have a dedicated point of contact?", a: "Growth and Enterprise clients get a dedicated account manager. Starter clients work with our shared success team." },
      { q: "Do I keep ownership of my account?", a: "Always. We work inside your seller account with secure permissions; you retain 100% ownership." },
    ],
  },
  {
    name: "Orders",
    eyebrow: "Operations",
    items: [
      { q: "How do you handle fulfillment and customer communication?", a: "We help coordinate fulfillment readiness, customer messaging and order workflows so your store stays responsive." },
      { q: "Can you support high-volume periods?", a: "Yes. Our teams are built to handle seasonal surges with flexible resourcing and clear escalation paths." },
    ],
  },
  {
    name: "Support",
    eyebrow: "Always on",
    items: [
      { q: "What's your response time?", a: "Under 2 hours during business hours on all plans. Growth & Enterprise get priority queues." },
      { q: "Do you handle buyer messages?", a: "Yes, included in Growth and Enterprise plans. We respond in your brand voice within hours." },
    ],
  },
];

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name);

  return (
    <main className="relative overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_38%),radial-gradient(circle_at_90%_10%,_rgba(37,99,235,0.12),_transparent_28%)]" />
      <Navbar />

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-[0_12px_40px_-24px_rgba(30,64,175,0.65)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span>FAQ</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.12 }} className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl">
              Questions,
              <span className="block bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent italic">Answered.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.2 }} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Everything you need to know about Yoflix and how we help businesses scale on eBay, Walmart and TikTok Shop with clarity, speed and precision.
            </motion.p>

            <Link
              to="/consultation"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_45px_-18px_rgba(30,64,175,0.85)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_24px_60px_-22px_rgba(37,99,235,0.75)]"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
              <Link to="/pricing" className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_16px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-blue-200 hover:text-blue-700">
                View Pricing
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
              {[
                "Premium onboarding",
                "Dedicated success team",
                "Multi-channel growth",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative mx-auto flex h-[440px] w-full max-w-[520px] items-center justify-center">
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle,_rgba(147,197,253,0.45),_transparent_62%)] blur-3xl" />
            <div className="absolute inset-8 rounded-full bg-white/70 blur-3xl" />
            <motion.div animate={{ y: [0, -12, 0], rotate: [0, 2, 0], scale: [1, 1.02, 1] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute left-2 top-6 h-28 w-28 rounded-[32px] border border-white/80 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 shadow-[0_28px_70px_-28px_rgba(30,64,175,0.75)]">
              <div className="flex h-full items-center justify-center rounded-[24px] bg-gradient-to-br from-[#1e40af] to-[#60a5fa] text-5xl font-semibold text-white shadow-inner">
                ?
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 10, 0], x: [0, -6, 0], rotate: [0, -3, 0] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="absolute right-6 top-16 flex h-20 w-20 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-white via-sky-50 to-blue-100 shadow-[0_28px_70px_-28px_rgba(30,64,175,0.7)]">
              <MessageCircle className="h-9 w-9 text-blue-700" />
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0], x: [0, 8, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute left-10 bottom-20 w-48 rounded-[28px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_30px_80px_-34px_rgba(15,23,42,0.4)] backdrop-blur">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Weekly growth</span>
                <span className="text-blue-600">+24%</span>
              </div>
              <div className="mt-4 flex items-end gap-2">
                {[40, 68, 54, 82, 74].map((height, index) => (
                  <div key={height + index} className="flex-1 rounded-t-full bg-gradient-to-t from-[#1e40af] to-[#60a5fa]" style={{ height: `${height}px` }} />
                ))}
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0], rotate: [0, 6, 0] }} transition={{ duration: 6.3, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} className="absolute right-10 bottom-10 flex h-24 w-24 items-center justify-center rounded-[30px] border border-slate-200/70 bg-white/85 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
              <PieChart className="h-12 w-12 text-blue-700" />
            </motion.div>

            <motion.div animate={{ y: [0, -14, 0], x: [0, 6, 0] }} transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-8 left-1/2 flex h-44 w-64 -translate-x-1/2 items-end justify-center rounded-[40px] border border-white/80 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 shadow-[0_34px_90px_-36px_rgba(30,64,175,0.7)]">
              <div className="relative h-24 w-40 rounded-[26px] border border-slate-200/70 bg-white/70 p-4">
                <div className="absolute right-4 top-3 h-3 w-3 rounded-full bg-blue-600" />
                <div className="mt-2 h-2 rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-slate-200" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-slate-200" />
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0], scale: [1, 1.03, 1] }} transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute right-0 top-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-blue-600 text-white shadow-[0_20px_60px_-24px_rgba(30,64,175,0.85)]">
              <BarChart3 className="h-6 w-6" />
            </motion.div>

            <motion.div animate={{ y: [0, -8, 0], x: [0, 10, 0] }} transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }} className="absolute left-0 top-1/2 h-3 w-3 rounded-full bg-blue-400/70 blur-[1px]" />
            <motion.div animate={{ y: [0, 6, 0], x: [0, -8, 0] }} transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut", delay: 1.7 }} className="absolute right-20 top-1/3 h-2.5 w-2.5 rounded-full bg-sky-400/70 blur-[1px]" />
            <motion.div animate={{ y: [0, 10, 0], x: [0, 5, 0] }} transition={{ duration: 6.9, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute left-20 bottom-2 h-2.5 w-2.5 rounded-full bg-white/80" />
          </motion.div>
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-10 lg:p-14">
          <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Everything you need to make the right decision.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Explore the questions most sellers ask before scaling with Yoflix. Hover any card to expand it instantly.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    onMouseEnter={() => setActiveCategory(category.name)}
                    className={`min-w-[180px] rounded-2xl border px-4 py-4 text-left transition-all duration-300 lg:min-w-0 ${
                      isActive
                        ? "border-blue-600 bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white shadow-[0_24px_50px_-24px_rgba(30,64,175,0.75)]"
                        : "border-slate-200 bg-slate-50/80 text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-blue-700"
                    }`}
                  >
                    <div className="text-sm font-semibold">{category.name}</div>
                    <div className={`mt-1 text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>{category.eyebrow}</div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {CATEGORIES.find((category) => category.name === activeCategory)?.items.map((item, index) => (
                <FAQItem key={`${activeCategory}-${item.q}`} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-blue-100/80 bg-gradient-to-br from-[#0f3fbf] via-[#1e40af] to-[#3b82f6] px-8 py-10 text-white shadow-[0_36px_90px_-38px_rgba(30,64,175,0.75)] sm:px-12 lg:px-16 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(191,219,254,0.22),_transparent_32%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr_0.6fr] lg:items-center">
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/30 bg-white/15 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
              <Rocket className="h-12 w-12" />
            </motion.div>

            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to Scale Your eCommerce Business?
              </h3>
              <p className="mt-4 text-base leading-8 text-blue-50/90 sm:text-lg">
                Let’s build a sharper growth plan for your listings, operations and revenue across your most important channels.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/consultation"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/pricing" className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/20">
                View Pricing
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FAQItem({ item, index }: { item: CategoryItem; index: number }) {
  const [open, setOpen] = useState(false);
  const isOpen = open;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-0 shadow-[0_20px_70px_-36px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_80px_-36px_rgba(30,64,175,0.35)]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
      >
        <span className="text-base font-semibold text-slate-900">{item.q}</span>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      <motion.div
        initial={false}
        animate={{ maxHeight: isOpen ? 180 : 0, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-sm leading-7 text-slate-600">{item.a}</p>
      </motion.div>
    </motion.div>
  );
}
