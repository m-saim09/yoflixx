import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export type PricingCardPlan = {
  _id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  price?: string;
  billingType?: string;
  features?: string[];
  buttonText?: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
};

type PricingCardProps = {
  plan: PricingCardPlan;
  cta?: ReactNode;
  className?: string;
  previewMode?: "desktop" | "tablet" | "mobile";
  compact?: boolean;
};

export function PricingCard({
  plan,
  cta,
  className = "",
  previewMode = "desktop",
  compact = false,
}: PricingCardProps) {
  const title = plan.title ?? "Plan";
  const description = plan.shortDescription ?? "Flexible plan for growing teams.";
  const price = plan.price ?? "0";
  const billingType = plan.billingType ?? "monthly";
  const features = (plan.features ?? []).filter(Boolean);
  const isVisible = plan.isActive !== false;
  const isHighlighted = Boolean((plan.isFeatured || plan.isPopular) && isVisible);

  const modeClass =
    previewMode === "mobile"
      ? "w-full max-w-[320px]"
      : previewMode === "tablet"
        ? "w-full max-w-[420px]"
        : "w-full max-w-full";

  return (
    <div className={`relative ${modeClass} ${className}`.trim()}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.25)] backdrop-blur"
      >
        {isHighlighted ? (
          <>
            <div className="absolute inset-0 rounded-[30px] bg-[linear-gradient(135deg,#6D5DFC_0%,#8B5CF6_45%,#C084FC_100%)] opacity-95" />
            <div className="absolute inset-x-4 inset-y-4 rounded-[24px] border border-white/20" />
          </>
        ) : null}

        <div className={`relative flex h-full flex-col rounded-[30px] p-6 sm:p-7 ${isHighlighted ? "text-white" : "text-foreground"}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                {plan.isFeatured ? <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]">Featured</span> : null}
              </div>
              <p className={`mt-2 text-sm leading-6 ${isHighlighted ? "text-white/80" : "text-muted-foreground"}`}>{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {plan.badge ? (
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${isHighlighted ? "bg-white/15 text-white" : "bg-primary/10 text-primary"}`}>
                  {plan.badge}
                </span>
              ) : null}
              {plan.isPopular && isVisible ? (
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${isHighlighted ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700"}`}>
                  Most popular
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-7 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight">{price}</span>
            <span className={`pb-1 text-sm ${isHighlighted ? "text-white/70" : "text-muted-foreground"}`}>/{billingType}</span>
          </div>
          <div className={`mt-1 text-xs ${isHighlighted ? "text-white/70" : "text-muted-foreground"}`}>Billed monthly · Cancel anytime</div>

          <div className={`my-7 h-px w-full ${isHighlighted ? "bg-white/20" : "bg-gradient-to-r from-transparent via-primary/20 to-transparent"}`} />

          <ul className="space-y-3.5">
            {features.map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${isHighlighted ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className={isHighlighted ? "text-white/90" : "text-foreground/85"}>{feature}</span>
              </li>
            ))}
          </ul>

          <div className={`mt-8 rounded-2xl border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${isHighlighted ? "border-white/15 bg-white/10 text-white/80" : "border-primary/10 bg-primary/5 text-primary"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              {isVisible ? "Ready to publish" : "Hidden from website"}
            </div>
          </div>

          {cta ? (
            <div className="mt-6">{cta}</div>
          ) : (
            <button
              type="button"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium transition-all ${isHighlighted ? "bg-white text-slate-900 shadow-[0_12px_30px_-8px_rgba(15,23,42,0.35)]" : "border border-primary/25 bg-white/70 text-primary hover:bg-white"}`}
            >
              {plan.buttonText || "Choose Plan"}
            </button>
          )}

          {!compact ? <div className="mt-4 text-center text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Live preview • synced with the website</div> : null}
        </div>
      </motion.div>
    </div>
  );
}