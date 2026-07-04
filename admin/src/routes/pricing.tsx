import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  type DragEvent,
  type FormEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { AdminShell, Badge, Card } from "@/components/admin/Shell";
import { PricingCard } from "@/components/pricing-card";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/api";
import {
  Layers3,
  Eye,
  Star,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Check,
  EyeOff,
  Trash2,
  X,
  CircleDollarSign,
  ListPlus,
  GripVertical,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";

type PricingPlan = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: string;
  billingType: string;
  features: string[];
  buttonText: string;
  badge: string;
  isPopular: boolean;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
};

type PricingResponse = { data: { pricingPlans: PricingPlan[] } };

type EditorState = {
  id?: string;
  title: string;
  price: string;
  billingType: string;
  shortDescription: string;
  features: string[];
  badge: string;
  buttonText: string;
  isPopular: boolean;
  isFeatured: boolean;
  isActive: boolean;
};

type FieldErrors = Partial<Record<keyof Omit<EditorState, "id">, string>>;
type PreviewMode = "desktop" | "tablet" | "mobile";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Management - Yoflix Admin" },
      { name: "description", content: "Manage pricing plans, features and subscriptions." },
    ],
  }),
  component: PricingPage,
});

const emptyEditor = (): EditorState => ({
  title: "New Plan",
  price: "0",
  billingType: "monthly",
  shortDescription: "A short summary for this pricing plan.",
  features: ["Unlimited projects", "Priority support", "Detailed reporting"],
  badge: "",
  buttonText: "Choose Plan",
  isPopular: false,
  isFeatured: false,
  isActive: true,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `plan-${Date.now()}`;

const validateEditor = (state: EditorState) => {
  const errors: FieldErrors = {};
  if (!state.title.trim()) errors.title = "Plan name is required.";
  if (!state.price.trim()) errors.price = "Price is required.";
  else if (!/^\$?\d+(\.\d{1,2})?$/.test(state.price.trim())) errors.price = "Enter a valid price.";
  if (!state.shortDescription.trim()) errors.shortDescription = "A short description is required.";
  if (!state.billingType.trim()) errors.billingType = "Choose a billing period.";
  if (!state.features.map((feature) => feature.trim()).filter(Boolean).length) {
    errors.features = "Add at least one feature.";
  }
  return errors;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconPill({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/50 bg-white/70 text-primary shadow-sm shadow-primary/10 backdrop-blur dark:border-white/10 dark:bg-white/10">
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "neutral";
}) {
  const toneClass = {
    primary: "from-primary/18 to-violet-500/8 text-primary",
    success: "from-emerald-500/18 to-teal-500/8 text-emerald-600 dark:text-emerald-300",
    warning: "from-amber-500/18 to-orange-500/8 text-amber-600 dark:text-amber-300",
    neutral: "from-slate-500/14 to-slate-500/5 text-slate-600 dark:text-slate-300",
  }[tone];

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/75 p-5 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-34px_rgba(109,93,252,0.45)] dark:border-white/10 dark:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
        <div
          className={cx(
            "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br",
            toneClass,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  error,
  hint,
  inputRef,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  inputRef?: Ref<HTMLInputElement>;
  type?: string;
}) {
  return (
    <label className="group block">
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder=" "
          className={cx(
            "peer h-14 w-full rounded-2xl border bg-white/75 px-4 pt-4 text-sm text-foreground outline-none transition placeholder-transparent shadow-sm backdrop-blur dark:bg-white/[0.06]",
            error
              ? "border-destructive/50 focus:border-destructive focus:ring-destructive/15"
              : "border-border/70 focus:border-primary focus:ring-primary/20",
            "focus:ring-4",
          )}
          aria-invalid={Boolean(error)}
        />
        <span className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary">
          {label}
        </span>
      </div>
      <FieldMessage error={error} hint={hint} />
    </label>
  );
}

function FloatingTextarea({
  label,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="group block">
      <div className="relative">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder=" "
          rows={4}
          className={cx(
            "peer min-h-28 w-full resize-none rounded-2xl border bg-white/75 px-4 pt-6 text-sm leading-6 text-foreground outline-none transition placeholder-transparent shadow-sm backdrop-blur dark:bg-white/[0.06]",
            error
              ? "border-destructive/50 focus:border-destructive focus:ring-destructive/15"
              : "border-border/70 focus:border-primary focus:ring-primary/20",
            "focus:ring-4",
          )}
          aria-invalid={Boolean(error)}
        />
        <span className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary">
          {label}
        </span>
      </div>
      <FieldMessage error={error} hint={hint} />
    </label>
  );
}

function FieldMessage({ error, hint }: { error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <p className={cx("mt-2 text-xs", error ? "text-destructive" : "text-muted-foreground")}>
      {error || hint}
    </p>
  );
}

function BuilderSection({
  title,
  description,
  icon,
  children,
  action,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/60 bg-white/65 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconPill>{icon}</IconPill>
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BuilderSwitch({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-sm transition hover:border-primary/30 hover:bg-white dark:bg-white/[0.04]">
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

function DeviceSelector({
  previewMode,
  onChange,
}: {
  previewMode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/75 p-1 shadow-sm backdrop-blur dark:bg-white/[0.06]">
      {[
        { key: "desktop", label: "Desktop", icon: Monitor },
        { key: "tablet", label: "Tablet", icon: Tablet },
        { key: "mobile", label: "Mobile", icon: Smartphone },
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key as PreviewMode)}
          className={cx(
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
            previewMode === key
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
          aria-pressed={previewMode === key}
          aria-label={`${label} preview`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

function PricingPreview({ plan, previewMode }: { plan: EditorState; previewMode: PreviewMode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-[radial-gradient(circle_at_20%_0%,rgba(109,93,252,0.16),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.55))] p-4 shadow-inner backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.26),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.75),rgba(15,23,42,0.38))]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex min-h-[560px] items-start justify-center overflow-y-auto rounded-[1.35rem] border border-white/60 bg-white/45 p-4 dark:border-white/10 dark:bg-slate-950/25">
        <PricingCard plan={plan} previewMode={previewMode} />
      </div>
    </div>
  );
}

function PlanTile({
  plan,
  onEdit,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: {
  plan: PricingPlan;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.4)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_26px_80px_-38px_rgba(109,93,252,0.5)] dark:border-white/10 dark:bg-white/[0.055]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {plan.badge ? <Badge tone="primary">{plan.badge}</Badge> : null}
            {plan.isPopular ? <Badge tone="warning">Popular</Badge> : null}
            {plan.isFeatured ? <Badge tone="success">Featured</Badge> : null}
          </div>
          <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{plan.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {plan.shortDescription}
          </p>
        </div>
        <Badge tone={plan.isActive ? "success" : "neutral"}>
          {plan.isActive ? "Active" : "Hidden"}
        </Badge>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="font-display text-4xl font-bold tracking-tight">{plan.price}</span>
        <span className="pb-1 text-sm text-muted-foreground">/{plan.billingType}</span>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.slice(0, 5).map((feature, index) => (
          <li key={`${feature}-${index}`} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-foreground/85">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:scale-[1.01]"
        >
          Edit <ArrowUpRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          disabled={isToggling}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-white/70 text-muted-foreground transition hover:text-foreground disabled:opacity-60 dark:bg-white/[0.04]"
          aria-label={plan.isActive ? "Hide pricing plan" : "Show pricing plan"}
          title={plan.isActive ? "Hide from website" : "Show on website"}
        >
          {plan.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-destructive/25 bg-destructive/5 text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          aria-label="Delete pricing plan"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function PricingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [validationErrors, setValidationErrors] = useState<FieldErrors>({});
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin/pricing"],
    queryFn: () => apiRequest<PricingResponse>("/pricing/admin"),
  });

  const pricingPlans = data?.data.pricingPlans ?? [];
  const activePlans = pricingPlans.filter((plan) => plan.isActive).length;
  const featuredPlans = pricingPlans.filter((plan) => plan.isFeatured).length;
  const popularPlans = pricingPlans.filter((plan) => plan.isPopular).length;

  const editorHealth = useMemo(() => {
    if (!editor) return 0;
    return [
      editor.title.trim(),
      editor.price.trim(),
      editor.shortDescription.trim(),
      editor.features.some((feature) => feature.trim()),
      editor.buttonText.trim(),
    ].filter(Boolean).length;
  }, [editor]);

  const savePlan = useMutation({
    mutationFn: (state: EditorState) => {
      const payload = {
        title: state.title.trim(),
        slug: slugify(state.title),
        shortDescription: state.shortDescription.trim(),
        price: state.price.trim(),
        billingType: state.billingType,
        features: state.features.map((feature) => feature.trim()).filter(Boolean),
        badge: state.badge.trim(),
        buttonText: state.buttonText.trim() || "Choose Plan",
        isPopular: state.isPopular,
        isFeatured: state.isFeatured,
        isActive: state.isActive,
      };

      return apiRequest(state.id ? `/pricing/${state.id}` : "/pricing", {
        method: state.id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      setValidationErrors({});
      queryClient.invalidateQueries({ queryKey: ["admin/pricing"] });
      window.dispatchEvent(new Event("pricing:updated"));
      toast.success("Pricing plan saved successfully.");
      closeEditor();
    },
    onError: (mutationError) => {
      toast.error(
        mutationError instanceof Error ? mutationError.message : "Unable to save pricing plan.",
      );
    },
  });

  const togglePlan = useMutation({
    mutationFn: (plan: PricingPlan) =>
      apiRequest(`/pricing/${plan._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !plan.isActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/pricing"] });
      window.dispatchEvent(new Event("pricing:updated"));
      toast.success("Visibility updated.");
    },
    onError: () => toast.error("Unable to update visibility."),
  });

  const deletePlan = useMutation({
    mutationFn: (id: string) => apiRequest(`/pricing/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/pricing"] });
      window.dispatchEvent(new Event("pricing:updated"));
      toast.success("Pricing plan deleted.");
    },
    onError: () => toast.error("Unable to delete pricing plan."),
  });

  const openEditor = (plan: PricingPlan) => {
    setEditor({
      id: plan._id,
      title: plan.title,
      price: plan.price,
      billingType: plan.billingType,
      shortDescription: plan.shortDescription,
      features: plan.features,
      badge: plan.badge || "",
      buttonText: plan.buttonText || "Choose Plan",
      isPopular: plan.isPopular,
      isFeatured: plan.isFeatured,
      isActive: plan.isActive,
    });
  };

  const closeEditor = () => {
    setEditor(null);
    setValidationErrors({});
  };

  const requestSave = useCallback(() => {
    if (!editor || savePlan.isPending) return;

    const errors = validateEditor(editor);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      toast.error("Fix the highlighted fields before saving.");
      return;
    }

    setValidationErrors({});
    savePlan.mutate(editor);
  }, [editor, savePlan]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestSave();
  };

  const addFeature = () => {
    setEditor((current) =>
      current ? { ...current, features: [...current.features, ""] } : current,
    );
  };

  const removeFeature = (index: number) => {
    setEditor((current) =>
      current
        ? { ...current, features: current.features.filter((_, idx) => idx !== index) }
        : current,
    );
  };

  const updateFeature = (index: number, value: string) => {
    setEditor((current) =>
      current
        ? {
            ...current,
            features: current.features.map((feature, idx) => (idx === index ? value : feature)),
          }
        : current,
    );
  };

  const moveFeature = (fromIndex: number, toIndex: number) => {
    setEditor((current) => {
      if (!current) return current;
      const next = [...current.features];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return { ...current, features: next };
    });
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("text/plain", String(index));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from) && from !== index) moveFeature(from, index);
  };

  const exportPlans = () => {
    const blob = new Blob([JSON.stringify(pricingPlans, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pricing-plans.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Pricing plans exported.");
  };

  const confirmDelete = (plan: PricingPlan) => {
    if (window.confirm(`Delete "${plan.title}"? This cannot be undone.`)) {
      deletePlan.mutate(plan._id);
    }
  };

  useEffect(() => {
    if (!editor) return undefined;
    window.requestAnimationFrame(() => firstInputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeEditor();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        requestSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, requestSave]);

  return (
    <AdminShell
      title="Pricing Management"
      description="Plans, visibility and public pricing previews."
    >
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total plans"
          value={String(pricingPlans.length)}
          detail="Stored pricing tiers"
          icon={<Layers3 className="h-5 w-5" />}
        />
        <MetricCard
          label="Visible"
          value={String(activePlans)}
          detail="Live on the website"
          icon={<Eye className="h-5 w-5" />}
          tone="success"
        />
        <MetricCard
          label="Featured"
          value={String(featuredPlans)}
          detail="Promoted in layout"
          icon={<Star className="h-5 w-5" />}
          tone="primary"
        />
        <MetricCard
          label="Popular"
          value={String(popularPlans)}
          detail="Marked most popular"
          icon={<Sparkles className="h-5 w-5" />}
          tone="warning"
        />
      </div>

      {isError ? (
        <Card className="mt-6 border-destructive/20 bg-destructive/5">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load pricing plans."}
          </p>
        </Card>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055]">
        <div className="flex items-center gap-3 px-2">
          <IconPill>
            <ShieldCheck className="h-4 w-4" />
          </IconPill>
          <div>
            <p className="text-sm font-semibold text-foreground">Production-safe controls</p>
            <p className="text-xs text-muted-foreground">
              Create, edit, hide, delete, export, and preview without changing API contracts.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditor(emptyEditor())}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" /> New plan
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {isLoading ? (
          <Card className="lg:col-span-3">
            <div className="h-40 animate-pulse rounded-2xl bg-secondary" />
          </Card>
        ) : null}

        {!isLoading && pricingPlans.length === 0 ? (
          <Card className="lg:col-span-3 border-dashed bg-white/70 text-center dark:bg-white/[0.05]">
            <Sparkles className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 font-display text-xl font-semibold">No pricing plans yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first plan and preview it exactly like the public website.
            </p>
            <button
              type="button"
              onClick={() => setEditor(emptyEditor())}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Create first plan
            </button>
          </Card>
        ) : null}

        {!isLoading &&
          pricingPlans.map((plan) => (
            <PlanTile
              key={plan._id}
              plan={plan}
              onEdit={() => openEditor(plan)}
              onToggle={() => togglePlan.mutate(plan)}
              onDelete={() => confirmDelete(plan)}
              isToggling={togglePlan.isPending}
              isDeleting={deletePlan.isPending}
            />
          ))}
      </div>

      {editor ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-2 backdrop-blur-xl sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pricing-builder-title"
        >
          <form
            onSubmit={handleSave}
            className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.82))] shadow-[0_40px_140px_-42px_rgba(15,23,42,0.65)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.86))]"
          >
            <header className="relative overflow-hidden border-b border-border/70 px-5 py-5 sm:px-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(109,93,252,0.18),transparent_38%)]" />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Pricing Builder
                  </div>
                  <h2
                    id="pricing-builder-title"
                    className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl"
                  >
                    {editor.id ? "Edit pricing plan" : "Create pricing plan"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Changes update the existing public PricingCard instantly. Press{" "}
                    <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">Esc</kbd>{" "}
                    to close or{" "}
                    <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">Ctrl/⌘ S</kbd>{" "}
                    to save.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden rounded-2xl border border-border/70 bg-white/70 px-4 py-2 text-sm font-semibold text-muted-foreground dark:bg-white/[0.05] sm:block">
                    {editorHealth}/5 essentials complete
                  </div>
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-white/75 text-muted-foreground transition hover:bg-white hover:text-foreground dark:bg-white/[0.05]"
                    aria-label="Close pricing editor"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="grid min-h-0 flex-1 gap-5 overflow-hidden p-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.9fr)] lg:p-5">
              <section className="min-h-0 overflow-y-auto rounded-[1.6rem] border border-white/60 bg-white/45 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] sm:p-4">
                <div className="space-y-4">
                  <BuilderSection
                    title="Plan foundation"
                    description="Name, price and customer-facing summary."
                    icon={<CircleDollarSign className="h-4 w-4" />}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FloatingInput
                        label="Plan name"
                        value={editor.title}
                        onChange={(title) => setEditor({ ...editor, title })}
                        error={validationErrors.title}
                        hint={`${editor.title.length}/80 characters`}
                        inputRef={firstInputRef}
                      />
                      <FloatingInput
                        label="Price"
                        value={editor.price}
                        onChange={(price) => setEditor({ ...editor, price })}
                        error={validationErrors.price}
                        hint="Numbers only, optional $ prefix."
                      />
                    </div>
                    <div className="mt-4">
                      <FloatingTextarea
                        label="Short description"
                        value={editor.shortDescription}
                        onChange={(shortDescription) => setEditor({ ...editor, shortDescription })}
                        error={validationErrors.shortDescription}
                        hint={`${editor.shortDescription.length}/180 characters`}
                      />
                    </div>
                  </BuilderSection>

                  <BuilderSection
                    title="Billing and CTA"
                    description="Set cadence, labels, badges and conversion copy."
                    icon={<Sparkles className="h-4 w-4" />}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Billing type
                        </span>
                        <select
                          value={editor.billingType}
                          onChange={(event) =>
                            setEditor({ ...editor, billingType: event.target.value })
                          }
                          className="h-14 w-full rounded-2xl border border-border/70 bg-white/75 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 dark:bg-white/[0.06]"
                        >
                          <option value="project">Project</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <FieldMessage error={validationErrors.billingType} />
                      </label>
                      <FloatingInput
                        label="Button text"
                        value={editor.buttonText}
                        onChange={(buttonText) => setEditor({ ...editor, buttonText })}
                        hint="Defaults to Choose Plan when empty."
                      />
                      <FloatingInput
                        label="Badge"
                        value={editor.badge}
                        onChange={(badge) => setEditor({ ...editor, badge })}
                        hint="Optional pill label like Best value."
                      />
                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Visibility
                        </span>
                        <select
                          value={editor.isActive ? "active" : "inactive"}
                          onChange={(event) =>
                            setEditor({
                              ...editor,
                              isActive: event.target.value === "active",
                              isFeatured:
                                event.target.value === "active" ? editor.isFeatured : false,
                            })
                          }
                          className="h-14 w-full rounded-2xl border border-border/70 bg-white/75 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 dark:bg-white/[0.06]"
                        >
                          <option value="active">Visible on website</option>
                          <option value="inactive">Hidden from website</option>
                        </select>
                      </label>
                    </div>
                  </BuilderSection>

                  <BuilderSection
                    title="Feature manager"
                    description="Add, delete and drag features into the exact display order."
                    icon={<ListPlus className="h-4 w-4" />}
                    action={
                      <button
                        type="button"
                        onClick={addFeature}
                        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/75 px-3 py-2 text-sm font-semibold transition hover:bg-white dark:bg-white/[0.05]"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    }
                  >
                    <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                      {editor.features.map((feature, index) => (
                        <div
                          key={`${index}-${feature}`}
                          draggable
                          onDragStart={(event) => onDragStart(event, index)}
                          onDragOver={onDragOver}
                          onDrop={(event) => onDrop(event, index)}
                          className="group/feature flex items-center gap-3 rounded-2xl border border-border/70 bg-white/75 p-2 shadow-sm transition hover:border-primary/25 dark:bg-white/[0.045]"
                        >
                          <button
                            type="button"
                            className="grid h-10 w-10 shrink-0 cursor-grab place-items-center rounded-xl border border-border bg-background text-muted-foreground active:cursor-grabbing"
                            aria-label="Drag to reorder feature"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <input
                            value={feature}
                            onChange={(event) => updateFeature(index, event.target.value)}
                            placeholder={`Feature ${index + 1}`}
                            className="h-11 flex-1 rounded-xl border border-transparent bg-transparent px-3 text-sm outline-none transition focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/15"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive transition hover:bg-destructive/10"
                            aria-label="Remove feature"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FieldMessage
                      error={validationErrors.features}
                      hint={`${editor.features.filter((feature) => feature.trim()).length} published features`}
                    />
                  </BuilderSection>

                  <BuilderSection
                    title="Display emphasis"
                    description="Control highlighting without changing backend behavior."
                    icon={<Star className="h-4 w-4" />}
                  >
                    <div className="space-y-3">
                      <BuilderSwitch
                        title="Most popular"
                        description="Show the popular badge on the pricing card."
                        checked={editor.isPopular}
                        onCheckedChange={(isPopular) => setEditor({ ...editor, isPopular })}
                      />
                      <BuilderSwitch
                        title="Featured plan"
                        description="Promote this plan and keep it visible."
                        checked={editor.isFeatured}
                        onCheckedChange={(isFeatured) =>
                          setEditor({
                            ...editor,
                            isFeatured,
                            isActive: editor.isActive || isFeatured,
                          })
                        }
                      />
                      <BuilderSwitch
                        title="Active on website"
                        description="Hide or display this pricing card dynamically."
                        checked={editor.isActive}
                        onCheckedChange={(isActive) =>
                          setEditor({
                            ...editor,
                            isActive,
                            isFeatured: isActive ? editor.isFeatured : false,
                          })
                        }
                      />
                    </div>
                  </BuilderSection>
                </div>
              </section>

              <aside className="flex min-h-0 flex-col overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/45 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                      Live Preview
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold">Website-exact card</h3>
                  </div>
                  <DeviceSelector previewMode={previewMode} onChange={setPreviewMode} />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <PricingPreview plan={editor} previewMode={previewMode} />
                </div>
              </aside>
            </div>

            <footer className="flex flex-col gap-3 border-t border-border/70 bg-white/70 px-5 py-4 backdrop-blur-xl dark:bg-slate-950/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Validations, React Query mutations, MongoDB fields, and API routes remain unchanged.
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-white/70 px-5 py-3 text-sm font-semibold transition hover:bg-white dark:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savePlan.isPending}
                  aria-busy={savePlan.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savePlan.isPending ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savePlan.isPending ? "Saving plan..." : editor.id ? "Save plan" : "Create plan"}
                </button>
              </div>
            </footer>

            {savePlan.isError ? (
              <div className="border-t border-destructive/20 bg-destructive/5 px-6 py-3 text-sm text-destructive">
                {savePlan.error instanceof Error ? savePlan.error.message : "Unable to save plan."}
              </div>
            ) : null}
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
