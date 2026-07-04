import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer, FinalCTA, PageHero, Contact, FAQ } from "@/components/sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Yoflix — Let's Build Your Growth Together" },
      { name: "description", content: "Get in touch with Yoflix. Book your free 30-minute consultation. Average reply under 2 hours during business hours." },
      { property: "og:title", content: "Contact Yoflix" },
      { property: "og:description", content: "Book your free consultation today." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PageHero
        eyebrow="Contact"
        title="Let's build your growth"
        accent="together"
        sub="Book a free consultation or send us a message — we usually reply within 2 hours."
      />
      <Contact />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
