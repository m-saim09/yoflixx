import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Navbar, Footer, FinalCTA, PageHero } from "@/components/sections";

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

const CATEGORIES = [
  {
    name: "Services",
    items: [
      { q: "What services do you offer?", a: "Product research, listing creation, SEO, store management, customer support and order processing — full-service eBay growth." },
      { q: "Do you work with sellers outside the US?", a: "Yes — US, UK, EU, Canada and Australia. Our team operates across timezones." },
      { q: "Can you handle multiple stores?", a: "Absolutely. Enterprise plans include multi-store management with consolidated reporting." },
    ],
  },
  {
    name: "Pricing",
    items: [
      { q: "Are there any setup fees?", a: "No setup fees on any plan. Pay monthly, cancel anytime." },
      { q: "Can I switch plans?", a: "Yes — upgrade or downgrade anytime. Changes take effect the following billing cycle." },
      { q: "Do you offer custom enterprise pricing?", a: "Yes. For high-volume stores we build custom packages — talk to sales." },
    ],
  },
  {
    name: "Support",
    items: [
      { q: "What's your response time?", a: "Under 2 hours during business hours on all plans. Growth & Enterprise get priority queues." },
      { q: "Do you handle buyer messages?", a: "Yes, included in Growth and Enterprise plans. We respond in your brand voice within hours." },
    ],
  },
  {
    name: "Account Management",
    items: [
      { q: "Will I have a dedicated point of contact?", a: "Growth and Enterprise clients get a dedicated account manager. Starter clients work with our shared success team." },
      { q: "Do I keep ownership of my account?", a: "Always. We work inside your seller account with secure permissions; you retain 100% ownership." },
    ],
  },
  {
    name: "Store Growth",
    items: [
      { q: "How quickly will I see results?", a: "Most clients see meaningful lift within 30–60 days. Compounding growth typically kicks in around month 3." },
      { q: "What if my niche is highly competitive?", a: "Competition is where strategy matters most — we specialize in finding angle, pricing and SEO wins in saturated categories." },
    ],
  },
];

function FAQPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="FAQ"
        title="Questions,"
        accent="answered"
        sub="Browse by category. Still have questions? Contact us — we're happy to help."
      />

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 space-y-14">
          {CATEGORIES.map((cat, ci) => (
            <Category key={cat.name} cat={cat} delay={ci * 0.05} />
          ))}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}

function Category({ cat, delay }: { cat: typeof CATEGORIES[number]; delay: number }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay }}>
      <h2 className="text-2xl font-semibold tracking-tight">{cat.name}</h2>
      <div className="mt-5 space-y-3">
        {cat.items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-medium">{f.q}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary text-white">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
