import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, CalendarDays, Globe, Sparkles, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/sections";
import { apiRequest } from "@/lib/api";
import useWebsiteSettings from "@/hooks/use-website-settings";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Book Your Free Consultation — Yoflix" },
      { name: "description", content: "Ready to grow your eCommerce business? Book a free consultation with our Yoflix experts." },
      { property: "og:title", content: "Book Your Free Consultation" },
      { property: "og:description", content: "Schedule a free consultation with Yoflix experts today." },
    ],
  }),
  component: ConsultationPage,
});

const MARKETPLACES = ["eBay", "Walmart", "TikTok Shop", "Amazon"];
const BUSINESS_STAGES = ["Just Starting", "Existing Business", "Scaling Business", "Enterprise"];

const CONSULTATION_BENEFITS = [
  { icon: CheckCircle2, title: "Free Consultation", desc: "No hidden costs, 100% free session" },
  { icon: Globe, title: "Marketplace Experts", desc: "Specialized in eBay, Walmart, TikTok Shop & Amazon" },
  { icon: CalendarDays, title: "Fast Response", desc: "We reply within 24 hours" },
  { icon: Sparkles, title: "Personalized Strategy", desc: "Custom growth plan for your business" },
];

type FormState = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  marketplace: string;
  businessStage: string;
  businessDescription: string;
  consent: boolean;
};

const initialForm: FormState = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  country: "",
  marketplace: "eBay",
  businessStage: "Existing Business",
  businessDescription: "",
  consent: false,
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function ConsultationPage() {
  const router = useRouter();
  const { data: settings } = useWebsiteSettings();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const contactInfo = settings?.contactInfo ?? ({} as any);
  const socialLinks = settings?.socialLinks ?? ({} as any);

  const validation = useMemo(() => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) nextErrors.fullName = "Full name must be at least 2 characters";
    if (!form.businessName.trim() || form.businessName.trim().length < 2) nextErrors.businessName = "Business name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Valid email is required";
    if (!/^[\d\s\-+()]{7,}$/.test(form.phone.trim())) nextErrors.phone = "Valid phone number is required";
    if (!form.country.trim()) nextErrors.country = "Country is required";
    if (!form.marketplace) nextErrors.marketplace = "Marketplace selection is required";
    if (!form.businessStage) nextErrors.businessStage = "Business stage is required";
    if (!form.businessDescription.trim() || form.businessDescription.trim().length < 10) nextErrors.businessDescription = "Please describe your business in at least 10 characters";
    if (!form.consent) nextErrors.consent = "You must agree to be contacted";
    return nextErrors;
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/consultations/create", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          businessName: form.businessName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
          marketplace: form.marketplace,
          storeStatus: form.businessStage,
          businessDescription: form.businessDescription.trim(),
          consent: form.consent,
        }),
      });
      toast.success("Consultation request submitted successfully!");
      setForm(initialForm);
      setErrors({});
      setTimeout(() => router.navigate("/consultation-thank-you"), 600);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit consultation request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,58,138,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_35%)]" />
      <Navbar />

      {/* Header Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
            <Sparkles className="h-4 w-4" />
            Free Consultation
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-950 mb-6">
            Book a Consultation
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Ready to grow your eCommerce business? Book a free consultation with our experts.
          </p>
        </motion.div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="relative mx-auto max-w-7xl px-6 pb-20 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12">
          {/* Left Column - Info & Contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Benefits Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONSULTATION_BENEFITS.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + idx * 0.05 }}
                    className="rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-sm p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 mb-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm">{benefit.title}</h3>
                    <p className="text-xs text-slate-600">{benefit.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/80 to-slate-100/60 backdrop-blur-sm p-8"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6">Get in Touch</h3>

              {/* Address */}
              {contactInfo.officeAddress && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex gap-4 mb-5 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Office Address</p>
                    <p className="text-sm font-medium text-slate-900 mt-1">{contactInfo.officeAddress}</p>
                  </div>
                </motion.div>
              )}

              {/* Email */}
              {contactInfo.businessEmail && (
                <motion.a
                  whileHover={{ x: 4 }}
                  href={`mailto:${contactInfo.businessEmail}`}
                  className="flex gap-4 mb-5 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">{contactInfo.businessEmail}</p>
                  </div>
                </motion.a>
              )}

              {/* Phone */}
              {contactInfo.phoneNumber && (
                <motion.a
                  whileHover={{ x: 4 }}
                  href={`tel:${contactInfo.phoneNumber}`}
                  className="flex gap-4 mb-5 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">{contactInfo.phoneNumber}</p>
                  </div>
                </motion.a>
              )}

              {/* Map Link */}
              {contactInfo.googleMapsLink && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={contactInfo.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-6 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-600">View on Google Maps</p>
                    </div>
                  </div>
                </motion.a>
              )}
            </motion.div>

            {/* Social Links */}
            {Object.keys(socialLinks).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex gap-3"
              >
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-slate-100 hover:bg-blue-400 hover:text-white text-slate-600 transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-slate-100 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white text-slate-600 transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-600 transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Consultation Form</h2>
            <p className="text-slate-600 text-sm mb-8">Fill in your details and we'll contact you shortly</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.fullName
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1.5">{errors.fullName}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.businessName
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                    placeholder="Your Store"
                  />
                  {errors.businessName && <p className="text-xs text-red-600 mt-1.5">{errors.businessName}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.phone
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1.5">{errors.phone}</p>}
                </div>
              </div>

              {/* Country & Marketplace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Country *</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.country
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-xs text-red-600 mt-1.5">{errors.country}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-900 mb-2">Marketplace *</label>
                  <select
                    value={form.marketplace}
                    onChange={(e) => setForm({ ...form, marketplace: e.target.value })}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                      errors.marketplace
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                        : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    }`}
                  >
                    <option value="">Select marketplace</option>
                    {MARKETPLACES.map((mp) => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                  {errors.marketplace && <p className="text-xs text-red-600 mt-1.5">{errors.marketplace}</p>}
                </div>
              </div>

              {/* Business Stage */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 mb-2">Business Stage *</label>
                <select
                  value={form.businessStage}
                  onChange={(e) => setForm({ ...form, businessStage: e.target.value })}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
                    errors.businessStage
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  }`}
                >
                  <option value="">Select business stage</option>
                  {BUSINESS_STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                {errors.businessStage && <p className="text-xs text-red-600 mt-1.5">{errors.businessStage}</p>}
              </div>

              {/* Business Description */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-900 mb-2">Business Description *</label>
                <textarea
                  value={form.businessDescription}
                  onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
                  rows={4}
                  className={`px-4 py-3 rounded-lg border transition-all duration-200 outline-none resize-none ${
                    errors.businessDescription
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                      : "border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  }`}
                  placeholder="Tell us about your business, products, and goals..."
                />
                {errors.businessDescription && <p className="text-xs text-red-600 mt-1.5">{errors.businessDescription}</p>}
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50/50 cursor-pointer hover:bg-blue-100/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="w-5 h-5 rounded border-blue-400 text-blue-600 mt-0.5 cursor-pointer"
                />
                <span className="text-sm text-slate-700">
                  I agree to be contacted by the Yoflix team with personalized consultation and growth strategies.
                </span>
              </label>
              {errors.consent && <p className="text-xs text-red-600 -mt-2">{errors.consent}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Book Free Consultation
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
