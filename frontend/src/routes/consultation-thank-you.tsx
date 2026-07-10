import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/sections";

export const Route = createFileRoute("/consultation-thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Consultation Scheduled" },
      { name: "description", content: "Thank you for submitting your consultation request. We will contact you soon." },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_24%)]" />
      <Navbar />
      <section className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl flex-col items-center justify-center px-6 py-28 text-center sm:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Your consultation request is on its way.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            We’ve received your details and our team will reach out within 24 hours with a custom strategy and next steps.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" /> Thank you for choosing Yoflix
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Back to Home
            </Link>
            <Link to="/consultation" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Schedule another consultation
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
