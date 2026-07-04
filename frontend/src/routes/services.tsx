import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Navbar, Footer, FinalCTA, PageHero, Services, HowItWorks } from "@/components/sections";
import { TrendingUp, Clock, Award, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Everything You Need To Succeed On eBay | Yoflix" },
      { name: "description", content: "Product research, listing creation, SEO, store management, customer support and order processing — full-service eBay growth from Yoflix." },
      { property: "og:title", content: "Services — Yoflix" },
      { property: "og:description", content: "Six dedicated capabilities, one premium team." },
    ],
  }),
  component: ServicesPage,
});

const BENEFITS = [
  { icon: TrendingUp, t: "Faster Growth", d: "Average client sees 2.4x revenue in 90 days." },
  { icon: Clock, t: "Time Back", d: "Reclaim 20+ hours weekly to focus on your brand." },
  { icon: Award, t: "Higher Ratings", d: "Maintain 99%+ positive feedback at scale." },
  { icon: BarChart3, t: "Data Clarity", d: "Monthly reports with actionable next steps." },
];

const RESULTS = [
  { v: "+240%", l: "Avg. Revenue Growth" },
  { v: "+85%", l: "Listing Conversion" },
  { v: "4.9★", l: "Seller Rating" },
  { v: "<2h", l: "Support Response" },
];

function ServicesPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="Our Services"
        title="Everything You Need To"
        accent="Succeed On eBay"
        sub="From product discovery to full store ops, we cover every angle that drives growth on eBay."
      />

      <Services />

      {/* Benefits */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Why It Works</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">Real benefits, <span className="font-display italic gradient-text">measurable</span> outcomes</h2>
          </motion.div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -6 }} className="glass-strong rounded-3xl p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-white">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Results */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Results</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">Numbers that <span className="font-display italic gradient-text">speak</span></h2>
          </motion.div>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {RESULTS.map((r, i) => (
              <motion.div key={r.l} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="glass-strong rounded-3xl p-8 text-center">
                <div className="text-4xl font-semibold tracking-tight gradient-text sm:text-5xl">{r.v}</div>
                <div className="mt-2 text-sm text-muted-foreground">{r.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  );
}
