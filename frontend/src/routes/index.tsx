import { createFileRoute } from "@tanstack/react-router";
import {
  Navbar, Hero, LogoStrip, CoreExpertise, MarketplaceSupport, Services, Stats, Reviews, Testimonials, HowItWorks,
  WhyChoose, Pricing, FinalCTA, Footer,
} from "@/components/sections";
import ServicesMarquee from "@/components/services-marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yoflix — Smart eBay Solutions That Drive Real Growth" },
      { name: "description", content: "Premium eBay services agency. Product research, listings, SEO, store management & 24/7 support to scale your store." },
      { property: "og:title", content: "Yoflix — Smart eBay Solutions That Drive Real Growth" },
      { property: "og:description", content: "Premium eBay services agency for ambitious sellers." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <LogoStrip />
      <ServicesMarquee />
      <CoreExpertise />
      <MarketplaceSupport />
      <Services />
      <Stats />
      <Reviews />
      <HowItWorks />
      <WhyChoose />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
