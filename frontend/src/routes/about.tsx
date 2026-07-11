import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Navbar, Footer, FinalCTA, PageHero, Stats, SellersMapLight, WhyChoose } from "@/components/sections";
import { Target, Eye, Heart, Shield, Sparkles, Users } from "lucide-react";
import sphereImg from "@/assets/sphere.png";
import hero3d from "@/assets/hero-3d.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Yoflix — Helping eBay Sellers Scale Smarter" },
      { name: "description", content: "Learn about Yoflix — the premium eBay growth partner helping ambitious sellers scale with strategy, listings & dedicated support." },
      { property: "og:title", content: "About Yoflix — Helping eBay Sellers Scale Smarter" },
      { property: "og:description", content: "Meet the team behind the premium eBay growth partner." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Heart, t: "Client-First", d: "Your growth is the only metric that matters to us." },
  { icon: Shield, t: "Transparency", d: "Clear reports, honest advice, no hidden agendas." },
  { icon: Sparkles, t: "Craft", d: "Premium-quality work on every listing, every time." },
  { icon: Users, t: "Partnership", d: "We work as an extension of your team, not a vendor." },
];

const TEAM = [
  { name: "Maya Rosen", role: "Founder & CEO", img: "https://i.pravatar.cc/240?img=47" },
  { name: "Daniel Hart", role: "Head of Strategy", img: "https://i.pravatar.cc/240?img=12" },
  { name: "Priya Shah", role: "Lead Listing Specialist", img: "https://i.pravatar.cc/240?img=44" },
  { name: "Marcus Lee", role: "Head of Operations", img: "https://i.pravatar.cc/240?img=33" },
];

function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
      <Navbar />
      <PageHero
        eyebrow="About Yoflix"
        title="Helping eBay Sellers Scale"
        accent="Smarter"
        sub="Born from years on the front lines of eBay, Yoflix is the premium growth partner ambitious sellers turn to when they're ready to scale."
      />

      {/* Story */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Our Story</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">From sellers, <span className="font-display italic gradient-text">for sellers</span></h2>
            <p className="mt-5 text-muted-foreground">
              Yoflix started in 2019 when our founders — top-100 eBay sellers themselves — realized most agencies didn't actually understand the platform. We built the team we wished we'd had: specialists who live and breathe eBay every day.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today, we partner with 200+ sellers across 18 countries, turning struggling stores into category leaders. No fluff, no smoke — just measurable growth, month after month.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(59,110,245,0.22),transparent_70%)] blur-2xl" />
            <motion.img src={hero3d} alt="3D glass ring" className="relative h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(59,110,245,0.24)]" animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src={sphereImg} alt="" aria-hidden className="absolute -left-4 top-12 h-16 w-16 opacity-80" animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }} />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
          {[
            { icon: Target, t: "Our Mission", d: "Empower every eBay seller — from one-person shops to global brands — with the tools, strategy and execution to win." },
            { icon: Eye, t: "Our Vision", d: "A world where ambitious sellers don't have to choose between growth and quality of life. Yoflix runs the storefront; you build the brand." },
          ].map((b, i) => (
            <motion.div key={b.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="glass-strong rounded-3xl p-10">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-white shadow-[0_16px_36px_-20px_rgba(59,110,245,0.38)]">
                <b.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{b.t}</h3>
              <p className="mt-3 text-muted-foreground">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">Our Values</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">What we <span className="font-display italic gradient-text">stand for</span></h2>
          </motion.div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div key={v.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -6 }} className="glass-strong rounded-3xl p-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-soft text-primary border border-primary/10">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />
      <SellersMapLight />

      {/* Team */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium text-primary">The Team</span>
            <h2 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">Meet the <span className="font-display italic gradient-text">specialists</span></h2>
          </motion.div>
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -6 }} className="glass-strong rounded-3xl p-5 text-center">
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-white shadow-soft">
                  <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <FinalCTA />
      <Footer />
    </main>
  );
}
