import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer, Contact } from "@/components/sections";

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
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/contact-bg.png')", backgroundColor: "#f3f7ff" }}
      />
      {/* decorative radial removed to show original background */}
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
}
