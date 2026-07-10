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
import { Save } from "lucide-react";

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

export const Route = createFileRoute("/admin/pricing")({
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

const formatPriceValue = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return "";

  const [whole, fractional = ""] = cleaned.split(".");
  const normalizedWhole = whole.replace(/^0+(?=\d)/, "") || "0";
  const normalizedFraction = fractional.replace(/\./g, "").slice(0, 2);

  return normalizedFraction
    ? `$${normalizedWhole}.${normalizedFraction}`
    : `$${normalizedWhole}`;
};

const validateEditor = (
  state: EditorState,
  existingPlans: PricingPlan[],
  currentId?: string,
) => {
  const errors: FieldErrors = {};
  const title = state.title.trim();
  const price = state.price.trim();
  const shortDescription = state.shortDescription.trim();
  const normalizedSlug = slugify(title);

  if (!title) errors.title = "Plan name is required.";
  else if (title.length > 80) errors.title = "Keep the plan name under 80 characters.";
  else {
    const duplicateTitle = existingPlans.find(
      (plan) =>
        String(plan._id) !== String(currentId) &&
        plan.title.trim().toLowerCase() === title.toLowerCase(),
    );
    if (duplicateTitle) errors.title = "A plan with this name already exists.";
  }

  if (!price) errors.price = "Price is required.";
  else if (!/^\$?\d+(\.\d{1,2})?$/.test(price)) errors.price = "Enter a valid price.";

  if (!shortDescription) errors.shortDescription = "A short description is required.";
  else if (shortDescription.length > 180) {
    errors.shortDescription = "Keep the description under 180 characters.";
  }

  if (!state.billingType.trim()) errors.billingType = "Choose a billing period.";

  if (!state.features.map((feature) => feature.trim()).filter(Boolean).length) {
    errors.features = "Add at least one feature.";
  }

  if (state.badge.trim() && state.badge.trim().length > 24) {
    errors.badge = "Badge text is limited to 24 characters.";
  }

  if (state.buttonText.trim() && state.buttonText.trim().length > 24) {
    errors.buttonText = "Button text is limited to 24 characters.";
  }

  const duplicateSlug = existingPlans.find(
    (plan) =>
      String(plan._id) !== String(currentId) &&
      slugify(plan.title).toLowerCase() === normalizedSlug.toLowerCase(),
  );
  if (duplicateSlug && !errors.title) {
    errors.title = "A plan with a matching slug already exists.";
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
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  inputRef?: Ref<HTMLInputElement>;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
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
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={cx(
            "peer h-[52px] w-full rounded-[16px] border bg-white px-4 pt-4 text-sm text-slate-900 outline-none transition duration-200 placeholder-transparent shadow-sm shadow-slate-200/60 focus:border-primary focus:ring-4 focus:ring-primary/10",
            error
              ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 text-slate-900",
          )}
          aria-invalid={Boolean(error)}
        />
        <span className="pointer-events-none absolute left-4 top-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:uppercase peer-placeholder-shown:tracking-[0.18em] peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-600">
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
          rows={5}
          className={cx(
            "peer min-h-[140px] w-full resize-none rounded-[16px] border bg-white px-4 pt-4 text-sm leading-6 text-slate-900 outline-none transition duration-200 placeholder-transparent shadow-sm shadow-slate-200/60 focus:border-primary focus:ring-4 focus:ring-primary/10",
            error
              ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 text-slate-900",
          )}
          aria-invalid={Boolean(error)}
        />
        <span className="pointer-events-none absolute left-4 top-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:uppercase peer-placeholder-shown:tracking-[0.18em] peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-600">
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
    <p className={cx("mt-2 text-xs", error ? "text-rose-600" : "text-slate-500")}>{error || hint}</p>
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
    <section className="rounded-[24px] border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-200/30">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconPill>{icon}</IconPill>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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

function BillingTypeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const options = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="flex overflow-hidden rounded-2xl border border-border/70 bg-white/80 p-1 shadow-sm backdrop-blur dark:bg-white/[0.06]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cx(
            "flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            value === option.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PricingPreview({ plan, previewMode }: { plan: EditorState; previewMode: PreviewMode }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-50 p-5 shadow-sm shadow-slate-200/30 transition duration-200 ease-out">
      <div className="mb-5 flex items-center justify-between gap-3 rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Live preview</p>
          <p className="text-sm font-semibold text-slate-900">Website pricing card</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {previewMode}
        </span>
      </div>
      <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 transition duration-200 ease-out">
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
  // Stable keys for feature inputs to avoid remounts when feature text changes
  const featureKeysRef = useRef<string[]>([]);

  const genFeatureId = () => Math.random().toString(36).slice(2, 9);

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

      return apiRequest(
    state.id
        ? `/pricing/update/${state.id}`
        : "/pricing/create",
    {
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
      apiRequest(`/pricing/toggle/${plan._id}`, {
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
    mutationFn: (id: string) => apiRequest(`/pricing/delete/${id}`, { method: "DELETE" }),
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

  // Initialize stable feature keys when the editor opens/closes
  useEffect(() => {
    if (!editor) {
      featureKeysRef.current = [];
      return;
    }
    featureKeysRef.current = editor.features.map(() => genFeatureId());
    // run only on open/close
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(editor)]);

  const closeEditor = () => {
    setEditor(null);
    setValidationErrors({});
  };

  const requestSave = useCallback(() => {
    if (!editor || savePlan.isPending) return;

    const errors = validateEditor(editor, pricingPlans, editor.id);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      toast.error("Fix the highlighted fields before saving.");
      return;
    }

    setValidationErrors({});
    savePlan.mutate(editor);
  }, [editor, pricingPlans, savePlan]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requestSave();
  };

  const addFeature = () => {
    const id = genFeatureId();
    featureKeysRef.current.push(id);
    setEditor((current) =>
      current ? { ...current, features: [...current.features, ""] } : current,
    );
  };

  const removeFeature = (index: number) => {
    // keep feature keys in sync so inputs don't remount unexpectedly
    featureKeysRef.current.splice(index, 1);
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
      // also move the stable keys to match the new order
      const keys = [...featureKeysRef.current];
      const [k] = keys.splice(fromIndex, 1);
      keys.splice(toIndex, 0, k);
      featureKeysRef.current = keys;
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
    // Focus the first input only when the editor is opened (editor changes
    // from null -> non-null). Avoid running on every editor field update
    // (which would steal focus while typing).
    if (!editor) return undefined;
    window.requestAnimationFrame(() => firstInputRef.current?.focus());
    // Keep page scrolling as a single global scrollbar — do not lock body overflow.
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(editor)]);

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
          className="mx-auto my-8 px-4 sm:px-6"
          role="dialog"
          aria-labelledby="pricing-builder-title"
        >
          <form
            onSubmit={handleSave}
            className="mx-auto flex w-full max-w-6xl flex-col rounded-[24px] border border-slate-200/80 bg-white shadow-sm"
          >
            <header className="border-b border-slate-200/80 bg-white/95 px-8 py-6 backdrop-blur-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-700">
                    <Sparkles className="h-4 w-4" /> Pricing Builder
                  </div>
                  <div>
                    <h2
                      id="pricing-builder-title"
                      className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
                    >
                      {editor.id ? "Edit pricing plan" : "Create pricing plan"}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                      Build your pricing plan with a live website preview. Press{' '}
                      <kbd className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                        Esc
                      </kbd>{' '}
                      to close or{' '}
                      <kbd className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                        Ctrl/⌘ S
                      </kbd>{' '}
                      to save.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50">
                    {editorHealth}/5 essentials complete
                  </div>
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label="Close pricing editor"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            <div className="grid gap-6 px-8 py-8 lg:flex lg:gap-8 lg:px-10 lg:items-stretch">
              <div className="space-y-6 lg:flex-[0_0_52%]">
                <BuilderSection
                  title="Plan foundation"
                  description="Name, price and customer-facing summary."
                  icon={<CircleDollarSign className="h-4 w-4" />}
                >
                  <div className="grid gap-6 md:grid-cols-2">
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
                      onChange={(price) => setEditor({ ...editor, price: formatPriceValue(price) })}
                      error={validationErrors.price}
                      hint="Enter a rounded price such as $49 or $149."
                      inputRef={null}
                      maxLength={12}
                      autoComplete="off"
                    />
                  </div>
                  <FloatingTextarea
                    label="Short description"
                    value={editor.shortDescription}
                    onChange={(shortDescription) => setEditor({ ...editor, shortDescription })}
                    error={validationErrors.shortDescription}
                    hint={`${editor.shortDescription.length}/180 characters`}
                  />
                </BuilderSection>

                <BuilderSection
                  title="Billing & CTA"
                  description="Choose pricing cadence and button copy."
                  icon={<ArrowUpRight className="h-4 w-4" />}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Billing cadence
                      </span>
                      <BillingTypeSelector
                        value={editor.billingType}
                        onChange={(billingType) => setEditor({ ...editor, billingType })}
                      />
                      <FieldMessage error={validationErrors.billingType} />
                    </label>
                    <FloatingInput
                      label="Button text"
                      value={editor.buttonText}
                      onChange={(buttonText) => setEditor({ ...editor, buttonText })}
                      hint="Defaults to Choose Plan when empty."
                      maxLength={24}
                    />
                  </div>
                </BuilderSection>

                <BuilderSection
                  title="Features"
                  description="Add, delete, and reorder every selling point."
                  icon={<ListPlus className="h-4 w-4" />}
                  action={
                    <button
                      type="button"
                      onClick={addFeature}
                      className="inline-flex items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Plus className="h-4 w-4" /> Add feature
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {editor.features.map((feature, index) => (
                      <div
                        key={featureKeysRef.current[index] || index}
                        draggable
                        onDragStart={(event) => onDragStart(event, index)}
                        onDragOver={onDragOver}
                        onDrop={(event) => onDrop(event, index)}
                        className="group flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-3 py-3 transition hover:border-indigo-200"
                      >
                        <button
                          type="button"
                          className="grid h-12 w-12 place-items-center rounded-[16px] border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200"
                          aria-label="Drag to reorder feature"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <input
                          value={feature}
                          onChange={(event) => updateFeature(index, event.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="h-[52px] flex-1 rounded-[16px] border border-transparent bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="grid h-12 w-12 place-items-center rounded-[16px] border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
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
                  title="Limitations"
                  description="Review the plan scope before publishing."
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Feature count</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">
                        {editor.features.filter((feature) => feature.trim()).length}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Visible plan features.</p>
                    </div>
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Billing limit</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">
                        {editor.billingType === "monthly" ? "Monthly" : "Yearly"}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Choose the right cadence.</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Keep the plan focused and easy to scan. Most customers choose plans with 3–6 strong benefits.
                  </p>
                </BuilderSection>

                <BuilderSection
                  title="Badge"
                  description="Label this plan for better customer guidance."
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  <FloatingInput
                    label="Badge label"
                    value={editor.badge}
                    onChange={(badge) => setEditor({ ...editor, badge })}
                    hint="Optional pill label like Best value."
                    maxLength={24}
                  />
                </BuilderSection>

                <BuilderSection
                  title="Visibility"
                  description="Control whether this plan is shown on the public site."
                  icon={<Eye className="h-4 w-4" />}
                >
                  <div className="space-y-4">
                    <BuilderSwitch
                      title="Visible on website"
                      description="Show this pricing plan on the live page."
                      checked={editor.isActive}
                      onCheckedChange={(isActive) =>
                        setEditor({
                          ...editor,
                          isActive,
                          isFeatured: isActive ? editor.isFeatured : false,
                        })
                      }
                    />
                    <BuilderSwitch
                      title="Featured plan"
                      description="Keep this plan highlighted in layouts."
                      checked={editor.isFeatured}
                      onCheckedChange={(isFeatured) =>
                        setEditor({
                          ...editor,
                          isFeatured,
                          isActive: editor.isActive || isFeatured,
                        })
                      }
                    />
                  </div>
                </BuilderSection>

                <BuilderSection
                  title="SEO / Metadata"
                  description="Preview how this plan appears in search and metadata."
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  <div className="space-y-4">
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">URL slug</p>
                      <p className="mt-3 text-sm text-slate-900">/pricing/{slugify(editor.title)}</p>
                    </div>
                    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Meta preview</p>
                      <p className="mt-3 font-semibold text-slate-900">{editor.title} — {editor.shortDescription}</p>
                    </div>
                  </div>
                </BuilderSection>
              </div>

              <aside className="lg:flex-[0_0_48%] lg:pl-6">
                <div className="lg:sticky lg:top-8 lg:self-start">
                  <DeviceSelector previewMode={previewMode} onChange={setPreviewMode} />
                  <div className="mt-4">
                    <PricingPreview plan={editor} previewMode={previewMode} />
                  </div>
                </div>
              </aside>
            </div>

            <footer className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/95 px-8 py-5 backdrop-blur-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">
                    {Object.keys(validationErrors).length > 0
                      ? "Validation issues need attention"
                      : "All essentials are valid"}
                  </p>
                  <p>{savePlan.isPending ? "Saving changes..." : "Unsaved changes will be saved when you create or update the plan."}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="inline-flex items-center justify-center rounded-[18px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savePlan.isPending}
                    aria-busy={savePlan.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#6D5DF6] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
              </div>
            </footer>

            {savePlan.isError ? (
              <div className="border-t border-rose-200 bg-rose-50 px-8 py-4 text-sm text-rose-700">
                {savePlan.error instanceof Error ? savePlan.error.message : "Unable to save plan."}
              </div>
            ) : null}
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
