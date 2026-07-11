import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  ExternalLink,
  Filter,
  Globe2,
  Mail,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Badge, Card } from "@/components/admin/Shell";
import { apiRequest } from "@/lib/api";

type ConsultationStatus = "New" | "Contacted" | "Meeting Scheduled" | "Converted" | "Closed";

type Consultation = {
  _id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  marketplace: string;
  monthlyRevenue: string;
  storeUrl: string;
  storeStatus: string;
  businessDescription: string;
  preferredMeetingDate: string;
  preferredMeetingTime: string;
  country: string;
  consent: boolean;
  status: ConsultationStatus;
  createdAt: string;
};

type ConsultationsResponse = {
  data: {
    consultations: Consultation[];
    total: number;
  };
};

export const Route = createFileRoute("/admin/consultations")({
  head: () => ({
    meta: [
      { title: "Consultation Requests — Yoflix Admin" },
      {
        name: "description",
        content: "Review and manage consultation requests submitted from the site.",
      },
    ],
  }),
  component: ConsultationsPage,
});

const statusTone: Record<
  ConsultationStatus,
  "primary" | "success" | "warning" | "destructive" | "neutral"
> = {
  New: "primary",
  Contacted: "warning",
  "Meeting Scheduled": "warning",
  Converted: "success",
  Closed: "neutral",
};

const statusOptions: ConsultationStatus[] = [
  "New",
  "Contacted",
  "Meeting Scheduled",
  "Converted",
  "Closed",
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 650;
    const start = performance.now();

    const step = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display}</span>;
}

function ConsultationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ConsultationStatus>("All");
  const [marketplaceFilter, setMarketplaceFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin/consultations"],
    queryFn: () => apiRequest<ConsultationsResponse>("/admin/consultations/get"),
  });

  const consultations = data?.data.consultations ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filteredItems = consultations.filter((item) => {
      const matchesSearch =
        !term ||
        [
          item.fullName,
          item.businessName,
          item.email,
          item.marketplace,
          item.status,
          item.country,
        ].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesMarketplace =
        marketplaceFilter === "All" || item.marketplace === marketplaceFilter;
      const matchesCountry = countryFilter === "All" || item.country === countryFilter;
      return matchesSearch && matchesStatus && matchesMarketplace && matchesCountry;
    });

    return [...filteredItems].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [consultations, countryFilter, marketplaceFilter, search, sortOrder, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const selected =
    consultations.find((item) => item._id === selectedId) ??
    filtered.find((item) => item._id === selectedId) ??
    null;

  const availableMarketplaces = useMemo(
    () => [...new Set(consultations.map((item) => item.marketplace).filter(Boolean))],
    [consultations],
  );
  const availableCountries = useMemo(
    () => [...new Set(consultations.map((item) => item.country).filter(Boolean))],
    [consultations],
  );

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConsultationStatus }) =>
      apiRequest(`/admin/consultations/status/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin/consultations"] });
      const previous = queryClient.getQueryData<ConsultationsResponse>(["admin/consultations"]);
      queryClient.setQueryData(
        ["admin/consultations"],
        (old: ConsultationsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              consultations: old.data.consultations.map((item) =>
                item._id === id ? { ...item, status } : item,
              ),
            },
          };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("Consultation status updated.");
      queryClient.invalidateQueries({ queryKey: ["admin/consultations"] });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin/consultations"], context.previous);
      }
      toast.error("Unable to update consultation status.");
    },
  });

  const deleteConsultation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/admin/consultations/delete/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin/consultations"] });
      const previous = queryClient.getQueryData<ConsultationsResponse>(["admin/consultations"]);
      queryClient.setQueryData(
        ["admin/consultations"],
        (old: ConsultationsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              consultations: old.data.consultations.filter((item) => item._id !== id),
            },
          };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("Consultation removed.");
      queryClient.invalidateQueries({ queryKey: ["admin/consultations"] });
      setSelectedId(null);
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin/consultations"], context.previous);
      }
      toast.error("Unable to delete consultation.");
    },
  });

  const totalRequests = consultations.length;
  const newRequests = consultations.filter((item) => item.status === "New").length;
  const scheduled = consultations.filter((item) => item.status === "Meeting Scheduled").length;
  const converted = consultations.filter((item) => item.status === "Converted").length;

  const handleExport = () => {
    const rows = filtered.length > 0 ? filtered : consultations;
    const csvRows = [
      ["Name", "Business", "Marketplace", "Status", "Country", "Submitted"],
      ...rows.map((item) => [
        item.fullName,
        item.businessName,
        item.marketplace,
        item.status,
        item.country,
        item.createdAt,
      ]),
    ];
    const csvContent = csvRows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "consultation-requests.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  };

  const statCards = [
    { label: "Total Requests", value: totalRequests, icon: Sparkles, accent: "primary" as const },
    {
      label: "New Requests",
      value: newRequests,
      icon: MessageSquareText,
      accent: "warning" as const,
    },
    {
      label: "Meeting Scheduled",
      value: scheduled,
      icon: CalendarDays,
      accent: "warning" as const,
    },
    { label: "Converted", value: converted, icon: CheckCircle2, accent: "success" as const },
  ];

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <AdminShell
      title="Consultation Requests"
      description="Review, manage and convert consultation requests."
    >
      <div className="rounded-[24px] border border-border/70 bg-gradient-to-br from-white via-violet-50/70 to-white p-4 shadow-[0_20px_60px_-35px_rgba(109,93,252,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Premium queue
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Consultation Requests
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Review, manage and convert consultation requests with a calm, focused workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-background text-foreground transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50">
              <Bell className="h-4 w-4" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-violet-200">
              AS
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const tone = {
            primary: "from-violet-600 via-violet-500 to-indigo-500",
            warning: "from-amber-500 via-orange-400 to-rose-400",
            success: "from-emerald-500 via-green-400 to-teal-400",
          }[card.accent];

          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="rounded-[24px] border border-border/70 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    {card.label}
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    <AnimatedNumber value={card.value} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Live from the consultations pipeline
                  </div>
                </div>
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-sm`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="mt-6 overflow-hidden border-border/70 p-0">
        <div className="border-b border-border/70 bg-white/70 px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-lg font-semibold text-foreground">Request queue</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Search, filter and keep every consultation moving.
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <label className="relative sm:col-span-2 xl:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search requests"
                  className="h-10 w-full rounded-2xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-violet-400"
                />
              </label>
              <label className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as "All" | ConsultationStatus);
                    setPage(1);
                  }}
                  className="h-11 w-full appearance-none rounded-2xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="All">Status</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative">
                <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={marketplaceFilter}
                  onChange={(event) => {
                    setMarketplaceFilter(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 w-full appearance-none rounded-2xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="All">Marketplace</option>
                  {availableMarketplaces.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative">
                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={countryFilter}
                  onChange={(event) => {
                    setCountryFilter(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 w-full appearance-none rounded-2xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition focus:border-violet-400"
                >
                  <option value="All">Country</option>
                  {availableCountries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{filtered.length}</span>
            requests matched
          </div>
          <label className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
            <span>Sort</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
              className="bg-transparent text-sm text-foreground outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Marketplace</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-t border-border/70">
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-16 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-8 animate-pulse rounded-full bg-slate-200" />
                      </td>
                    </tr>
                  ))}
                {isError && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Unable to load consultations."}
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && paged.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-muted-foreground"
                    >
                      No consultation requests matched your filters.
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  paged.map((item) => (
                    <tr
                      key={item._id}
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelectedId(item._id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(item._id);
                        }
                      }}
                      className={`cursor-pointer border-t border-border/70 bg-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50/70 ${selected?._id === item._id ? "bg-violet-50/80" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-sm">
                          {item.fullName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{item.fullName}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{item.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {item.businessName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {item.marketplace}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusTone[item.status]}>{item.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{item.country}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end text-violet-600">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border/70 xl:border-l xl:border-t-0">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="flex h-full flex-col bg-slate-50/70"
                >
                  <div className="flex items-start justify-between border-b border-border/70 p-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {selected.fullName}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {selected.businessName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteConsultation.mutate(selected._id)}
                        className="grid h-9 w-9 place-items-center rounded-2xl border border-border bg-background text-destructive transition hover:bg-destructive/10"
                        aria-label="Delete consultation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="grid h-9 w-9 place-items-center rounded-2xl border border-border bg-background text-foreground transition hover:bg-secondary"
                        aria-label="Close details"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
                    <div className="rounded-[24px] border border-border/70 bg-white p-4 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.25)]">
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white">
                          {selected.fullName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{selected.fullName}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {selected.businessName}
                          </div>
                          <div className="mt-2 inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            {selected.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Mail className="h-4 w-4 text-violet-600" />
                        Contact details
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Email
                          </div>
                          <div className="mt-1 break-all text-sm font-medium text-foreground">
                            {selected.email}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Phone
                          </div>
                          <div className="mt-1 text-sm font-medium text-foreground">
                            {selected.phone}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Marketplace
                          </div>
                          <div className="mt-1 text-sm font-medium text-foreground">
                            {selected.marketplace}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Revenue
                          </div>
                          <div className="mt-1 text-sm font-medium text-foreground">
                            {selected.monthlyRevenue || "Not provided"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Briefcase className="h-4 w-4 text-violet-600" />
                        Business context
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                          <span>Store URL</span>
                          {selected.storeUrl ? (
                            <a
                              href={selected.storeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-violet-600 hover:underline"
                            >
                              Open <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span>Not provided</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                          <span>Country</span>
                          <span className="font-medium text-foreground">{selected.country}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                          <span>Meeting date</span>
                          <span className="font-medium text-foreground">
                            {selected.preferredMeetingDate || "TBD"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                          <span>Meeting time</span>
                          <span className="font-medium text-foreground">
                            {selected.preferredMeetingTime || "TBD"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                          <span>Consent</span>
                          <span className="font-medium text-foreground">
                            {selected.consent ? "Granted" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MessageSquareText className="h-4 w-4 text-violet-600" />
                        Notes & activity
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-border/70 bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Business description
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-foreground">
                            {selected.businessDescription ||
                              "No business description was provided."}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-slate-50 p-3">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Activity
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-foreground">
                            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                              <span className="inline-flex items-center gap-2">
                                <Clock3 className="h-3.5 w-3.5 text-violet-600" /> Submitted
                              </span>
                              <span className="text-muted-foreground">
                                {formatDateTime(selected.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                              <span className="inline-flex items-center gap-2">
                                <CircleDollarSign className="h-3.5 w-3.5 text-violet-600" /> Revenue
                              </span>
                              <span className="text-muted-foreground">
                                {selected.monthlyRevenue || "Not provided"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                              <span className="inline-flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-violet-600" /> Location
                              </span>
                              <span className="text-muted-foreground">{selected.country}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <UserRound className="h-4 w-4 text-violet-600" />
                        Status update
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              updateStatus.mutate({ id: selected._id, status: option })
                            }
                            className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${selected.status === option ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "bg-slate-100 text-muted-foreground hover:bg-violet-50 hover:text-violet-700"}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground"
                >
                  Select a consultation request to review the full details.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing {Math.min(pageSize, filtered.length)} of {filtered.length} requests
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="rounded-full bg-secondary/80 px-3 py-2 text-sm text-foreground">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </AdminShell>
  );
}
