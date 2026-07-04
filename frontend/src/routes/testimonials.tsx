import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star, Play, Quote } from "lucide-react";
import { Navbar, Footer, FinalCTA, PageHero, Stats, Reviews } from "@/components/sections";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Client Success Stories | Yoflix" },
      { name: "description", content: "Read what eBay sellers say about Yoflix. Real reviews, real growth, real results from sellers worldwide." },
      { property: "og:title", content: "Testimonials — Yoflix" },
      { property: "og:description", content: "Hear from sellers who scaled with Yoflix." },
    ],
  }),
  component: TestimonialsPage,
});

const VIDEOS = [
  { name: "Sarah Mitchell", role: "Electronics Seller · USA", img: "https://i.pravatar.cc/600?img=47", metric: "+240% revenue in 4 months" },
  { name: "James O'Connor", role: "Vintage Reseller · UK", img: "https://i.pravatar.cc/600?img=12", metric: "+180% listing conversion" },
  { name: "Aisha Patel", role: "Home & Garden · CA", img: "https://i.pravatar.cc/600?img=44", metric: "99.7% positive feedback" },
];

const REVIEWS = [
  { name: "Marcus Chen", role: "Auto Parts Seller", img: "https://i.pravatar.cc/80?img=33", text: "Yoflix took our cluttered storefront and made it premium. We went from 50 orders a month to 400 in under a quarter." },
  { name: "Elena Rodriguez", role: "Fashion Boutique", img: "https://i.pravatar.cc/80?img=5", text: "Their listing copy alone doubled our click-through rate. The team genuinely gets eBay in a way other agencies don't." },
  { name: "David Park", role: "Collectibles", img: "https://i.pravatar.cc/80?img=68", text: "Communication is incredible. Weekly updates, monthly strategy calls, dedicated Slack channel. Worth every dollar." },
  { name: "Nadia Hassan", role: "Beauty & Wellness", img: "https://i.pravatar.cc/80?img=32", text: "I tried 3 agencies before Yoflix. They're the only one that delivered. Our product research alone uncovered $40k in new SKUs." },
  { name: "Oliver Brandt", role: "Tools & Hardware", img: "https://i.pravatar.cc/80?img=15", text: "Customer support handling has been a game-changer. My ratings are higher than ever and I have weekends back." },
  { name: "Priya Reddy", role: "Jewelry", img: "https://i.pravatar.cc/80?img=23", text: "Premium service at fair pricing. The dedicated account manager feels like a true partner, not a vendor." },
];

function TestimonialsPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="Reviews"
        title="Sellers who"
        accent="scaled with Yoflix"
        sub="200+ eBay sellers trust Yoflix. Hear their stories, see their numbers."
      />

      {/* Video testimonials */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VIDEOS.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group glass-strong relative overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={v.img} alt={v.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <button aria-label="Play video" className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-glow transition-transform hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">{v.metric}</div>
                    <h3 className="mt-3 text-lg font-semibold">{v.name}</h3>
                    <p className="text-xs text-white/70">{v.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* Written reviews */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Reviews</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">What our clients <span className="font-display italic gradient-text">say</span></h2>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-strong relative rounded-3xl p-7"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/15" />
                <div className="flex gap-1 text-ebay-yellow">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">"{r.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={r.img} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-soft" />
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
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
