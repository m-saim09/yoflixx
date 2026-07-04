import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Navbar, Footer, FinalCTA, PageHero } from "@/components/sections";
import { MessageCircle, Search, Lightbulb, Rocket, LineChart, Sprout } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Our Process | Yoflix" },
      { name: "description", content: "From consultation to scale — our six-step process turns eBay stores into category leaders. See how Yoflix delivers results." },
      { property: "og:title", content: "How It Works — Yoflix" },
      { property: "og:description", content: "Our six-step growth process explained." },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  { icon: MessageCircle, n: "01", t: "Consultation", d: "We start with a 30-minute discovery call. You share your goals, we listen, ask the right questions, and audit your store on the spot." },
  { icon: Search, n: "02", t: "Research", d: "Deep market analysis: competitor audits, keyword maps, niche opportunities. Every recommendation backed by data, not gut feel." },
  { icon: Lightbulb, n: "03", t: "Strategy", d: "We craft a custom roadmap — listings, SEO, pricing, ops — with clear milestones and KPIs. You approve before anything ships." },
  { icon: Rocket, n: "04", t: "Implementation", d: "Our specialists execute: writing, photography, listing builds, store organization. Fast turnarounds, premium quality." },
  { icon: LineChart, n: "05", t: "Optimization", d: "We monitor every metric — CTR, conversion, ranking — and iterate weekly. What works gets scaled; what doesn't gets cut." },
  { icon: Sprout, n: "06", t: "Growth", d: "Month over month, your store compounds. New categories, new revenue streams, dedicated reviews — long-term partnership." },
];

function HowItWorksPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="Our Process"
        title="From first call to"
        accent="full scale"
        sub="A proven six-step process refined over 200+ client engagements."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative">
            {/* vertical line */}
            <div className="pointer-events-none absolute left-8 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:block" />

            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                  className="relative flex flex-col items-start gap-5 sm:flex-row sm:gap-8"
                >
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl gradient-primary text-white shadow-glow">
                    <s.icon className="h-7 w-7" />
                    <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-primary shadow-soft">{s.n}</span>
                  </div>
                  <motion.div whileHover={{ y: -4 }} className="glass-strong flex-1 rounded-3xl p-7">
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{s.t}</h3>
                    <p className="mt-3 text-muted-foreground">{s.d}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}
