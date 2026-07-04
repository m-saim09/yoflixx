import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { Navbar, Footer, FinalCTA, PageHero, Pricing, FAQ } from "@/components/sections";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Plans That Scale With Your Store | Yoflix" },
      { name: "description", content: "Flexible monthly pricing for eBay sellers. Starter, Growth and Enterprise plans. No setup fees. Cancel anytime." },
      { property: "og:title", content: "Pricing — Yoflix" },
      { property: "og:description", content: "Premium eBay services pricing." },
    ],
  }),
  component: PricingPage,
});

const ROWS: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { label: "Listings per month", values: ["50", "200", "Unlimited"] },
  { label: "Product Research", values: [true, true, "In-depth"] },
  { label: "SEO Optimization", values: ["Basic", "Advanced", "Advanced+"] },
  { label: "Store Management", values: [false, true, true] },
  { label: "Order Processing", values: [false, false, true] },
  { label: "Customer Support", values: ["Email", "Priority", "24/7 + Dedicated"] },
  { label: "Account Manager", values: [false, true, "Dedicated"] },
  { label: "Monthly Reports", values: [true, true, "Custom analytics"] },
  { label: "Onboarding", values: ["Self-serve", "Guided", "White-glove"] },
];

function PricingPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with"
        accent="your store"
        sub="Transparent monthly pricing. No setup fees. Cancel anytime."
      />

      <Pricing />

      {/* Comparison */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Compare</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">Feature <span className="font-display italic gradient-text">comparison</span></h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-strong mt-12 overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-white/50 bg-white/30">
                    <th className="px-6 py-5 text-left font-semibold">Feature</th>
                    <th className="px-6 py-5 text-center font-semibold">Starter</th>
                    <th className="px-6 py-5 text-center font-semibold text-primary">Growth</th>
                    <th className="px-6 py-5 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <tr key={r.label} className={i % 2 ? "bg-white/20" : ""}>
                      <td className="px-6 py-4 font-medium">{r.label}</td>
                      {r.values.map((v, j) => (
                        <td key={j} className="px-6 py-4 text-center">
                          {v === true ? <Check className="mx-auto h-5 w-5 text-ebay-green" strokeWidth={3} />
                            : v === false ? <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
                            : <span className="text-foreground/80">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}