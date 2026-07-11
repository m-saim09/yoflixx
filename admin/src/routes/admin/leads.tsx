import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users, UserPlus, X, Mail, Phone, Building2, Calendar, Copy } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Badge, Card, StatCard } from "@/components/admin/Shell";
import { apiRequest } from "@/lib/api";

type Lead = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  selectedPlan: string;
  status: string;
  createdAt: string;
  message?: string;
  projectType?: string;
  requirements?: string;
  source?: string;
  isRead?: boolean;
};

type LeadDetail = Lead;

const PLAN_NAME_TO_BACKEND: Record<string, string> = {
  Starter: "Level 1",
  Growth: "Level 2",
  Enterprise: "Level 3",
};

const PLAN_BACKEND_TO_LABEL: Record<string, string> = {
  "Level 1": "Starter",
  "Level 2": "Growth",
  "Level 3": "Enterprise",
};

type LeadsListResponse = {
  data: {
    total?: number;
    page?: number;
    pages?: number;
    leads?: Lead[];
  };
};

const MAX_LEADS_LIMIT = 100;

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Yoflix Admin" },
      { name: "description", content: "Manage and filter all leads." },
    ],
  }),
  component: LeadsPage,
});

const statusTone: Record<string, "primary" | "success" | "warning" | "destructive" | "neutral"> = {
  New: "primary",
  Contacted: "warning",
  "In Progress": "warning",
  Qualified: "primary",
  Closed: "success",
  Lost: "destructive",
};

function LeadsPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("All");
  const [readLeadIds, setReadLeadIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin/leads", plan, q],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (plan !== "All") {
        const backendPlan = PLAN_NAME_TO_BACKEND[plan] || plan;
        params.append("plan", backendPlan);
      }
      if (q.trim()) params.append("search", q.trim());
      params.append("limit", String(MAX_LEADS_LIMIT));

      const response = await apiRequest<LeadsListResponse>(`/leads?${params.toString()}`);
      return response.data;
    },
  });

  const leads = useMemo(() => data?.leads ?? [], [data]);
  const totalLeads = useMemo(() => data?.total ?? leads.length, [data, leads]);
  const newThisWeek = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return leads.filter((lead) => new Date(lead.createdAt || "").getTime() >= sevenDaysAgo).length;
  }, [leads]);
  const avgLeadAge = useMemo(() => {
    if (!leads.length) return "-";
    const totalHours = leads.reduce((sum, lead) => {
      const createdAt = new Date(lead.createdAt || "").getTime();
      return sum + Math.max(Date.now() - createdAt, 0);
    }, 0);
    return `${Math.round(totalHours / leads.length / (1000 * 60 * 60))}h`;
  }, [leads]);

  const filteredLeads = leads.map((l) => ({
    id: l._id,
    name: l.fullName,
    email: l.email,
    phone: l.phone,
    company: l.companyName,
    plan: PLAN_BACKEND_TO_LABEL[l.selectedPlan] || l.selectedPlan,
    status: l.status,
    message: l.message,
    created: new Date(l.createdAt).toLocaleString(),
  }));

  const selectedLeadSummary = useMemo(
    () => filteredLeads.find((lead) => lead.id === selectedLeadId) ?? null,
    [filteredLeads, selectedLeadId],
  );

  const { data: pricingOptions = [], isLoading: isPricingLoading } = useQuery<string[]>({
    queryKey: ["admin/pricing-plan-titles"],
    queryFn: async () => {
      const response = await apiRequest<{ data: { pricingPlans: { title: string }[] } }>(
        `/pricing/admin`,
      );
      return response.data.pricingPlans.map((plan) => plan.title);
    },
  });

  const {
    data: selectedLeadDetails,
    isLoading: isLeadDetailsLoading,
    isError: isLeadDetailsError,
    error: leadDetailsError,
  } = useQuery({
    queryKey: ["admin/lead", selectedLeadId],
    queryFn: async () => {
      if (!selectedLeadId) {
        throw new Error("No lead selected.");
      }

      const response = await apiRequest<{ data: { lead?: Lead; inquiry?: Lead } }>(
        `/leads/${selectedLeadId}`,
      );
      return response.data.lead ?? response.data.inquiry ?? null;
    },
    enabled: Boolean(selectedLeadId),
  });

  const handleOpenLeadDetails = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsLeadModalOpen(true);
    // mark read on server
    (async () => {
      try {
        await apiRequest(`/leads/${leadId}`, {
          method: "PATCH",
          body: JSON.stringify({ isRead: true }),
        });
        // refresh lead list so read state is up-to-date
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === "admin/leads",
        });
      } catch (e) {
        // ignore
      }
    })();
  };

  const handleCloseLeadDetails = () => {
    setIsLeadModalOpen(false);
    setSelectedLeadId(null);
  };

  const handleCopyValue = async (value?: string, label?: string) => {
    if (!value) return;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      toast.success(`${label ?? "Value"} copied`);
    }
  };

  const activeLeadName =
    selectedLeadDetails?.fullName || selectedLeadSummary?.name || "Lead details";
  const activeLeadEmail =
    selectedLeadDetails?.email || selectedLeadSummary?.email || "Not provided";
  const activeLeadPhone =
    selectedLeadDetails?.phone || selectedLeadSummary?.phone || "Not provided";
  const activeLeadPlan = selectedLeadDetails
    ? PLAN_BACKEND_TO_LABEL[selectedLeadDetails.selectedPlan] ||
      selectedLeadDetails.selectedPlan ||
      "Not provided"
    : selectedLeadSummary?.plan || "Not provided";
  const activeLeadMessage =
    selectedLeadDetails?.message || selectedLeadSummary?.message || "No message provided.";
  const activeLeadCreated = selectedLeadDetails?.createdAt
    ? new Date(selectedLeadDetails.createdAt).toLocaleString()
    : selectedLeadSummary?.created || "Submission date unavailable";

  const recentActivities = useMemo(
    () =>
      filteredLeads.slice(0, 4).map((lead) => {
        const status = lead.status || "New";
        return {
          status,
          description: `${lead.name} from ${lead.company || "Unknown"} is ${status.toLowerCase()}`,
          time: lead.created,
        };
      }),
    [filteredLeads],
  );

  // derive read IDs from backend data whenever leads update
  useEffect(() => {
    setReadLeadIds(leads.filter((l) => l.isRead).map((l) => l._id));
  }, [leads]);

  return (
    <AdminShell
      title="Leads"
      description="Track, filter and convert your pipeline with a clearer operating view."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Leads"
          value={totalLeads.toLocaleString()}
          delta="Live total"
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="New This Week"
          value={newThisWeek.toString()}
          delta="Last 7 days"
          icon={UserPlus}
          accent="warning"
        />
        <StatCard
          label="Avg. Lead Age"
          value={avgLeadAge}
          delta="Average age"
          icon={Calendar}
          accent="primary"
        />
      </div>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, company..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="rounded-2xl border border-border bg-background px-3 py-2 text-sm shadow-sm"
          >
            {[
              "All",
              ...(pricingOptions.length ? pricingOptions : ["Starter", "Growth", "Enterprise"]),
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-secondary/40 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                <th className="px-5 py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Plan</th>
                <th className="py-2 font-medium">Created</th>
                <th className="px-5 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr className="border-b border-border/60 last:border-0">
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
              )}
              {isError && (
                <tr className="border-b border-border/60 last:border-0">
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : "Unable to load leads."}
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredLeads.length === 0 && (
                <tr className="border-b border-border/60 last:border-0">
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No leads found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                filteredLeads.map((l) => (
                  <tr
                    key={l.id}
                    className={`border-b border-border/60 last:border-0 transition hover:bg-secondary/40 ${readLeadIds.includes(l.id) ? "bg-white/70" : "bg-violet-50/40"}`}
                  >
                    <td
                      className={`px-5 py-2 ${readLeadIds.includes(l.id) ? "font-medium" : "font-semibold text-slate-950"}`}
                    >
                      {l.name}
                    </td>
                    <td
                      className={`py-2 ${readLeadIds.includes(l.id) ? "text-muted-foreground" : "text-foreground/90 font-medium"}`}
                    >
                      {l.email}
                    </td>
                    <td className="py-2">{l.company}</td>
                    <td className="py-2">
                      <Badge tone="primary">{l.plan}</Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">{l.created}</td>
                    <td className="px-5 py-2 text-right">
                      <button
                        onClick={() => handleOpenLeadDetails(l.id)}
                        className="text-sm font-semibold text-primary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-4">
        <Card>
          <h3 className="mb-3 font-display text-lg font-semibold">Recent Lead Activity</h3>
          <ul className="space-y-3 text-sm">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-secondary/20 px-3 py-3"
              >
                <Badge tone={statusTone[activity.status] ?? "neutral"}>{activity.status}</Badge>
                <span className="text-muted-foreground">
                  {activity.description} — {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AnimatePresence>
        {isLeadModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseLeadDetails}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200">
                <div className="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-6 py-6 text-slate-900">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.06),_transparent_55%)]" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Lead overview
                      </div>
                      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950">
                        {activeLeadName}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Read-only details fetched from the latest backend record.
                      </p>
                    </div>
                    <button
                      onClick={handleCloseLeadDetails}
                      className="z-10 grid h-12 w-12 place-items-center rounded-[1rem] border border-slate-300 bg-white text-slate-700 shadow-sm"
                      aria-label="Close lead details"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[calc(90vh-168px)] overflow-y-auto px-6 py-7">
                  {isLeadDetailsLoading && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      Loading the latest lead details...
                    </div>
                  )}

                  {isLeadDetailsError && (
                    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                      {leadDetailsError instanceof Error
                        ? leadDetailsError.message
                        : "Unable to load the selected lead."}
                    </div>
                  )}

                  {!isLeadDetailsLoading && !isLeadDetailsError && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleCopyValue(activeLeadEmail, "Email")}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900"
                        >
                          <Copy className="h-4 w-4" /> Copy email
                        </button>
                        <button
                          onClick={() => handleCopyValue(activeLeadPhone, "Phone number")}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900"
                        >
                          <Copy className="h-4 w-4" /> Copy phone
                        </button>
                        <div className="ml-auto rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                          <Calendar className="mr-2 inline h-4 w-4 text-slate-500" />{" "}
                          {activeLeadCreated}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            Full name
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-900">
                            {activeLeadName}
                          </div>
                        </div>
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            Email address
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-900">
                            {activeLeadEmail}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            Phone number
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-900">
                            {activeLeadPhone}
                          </div>
                        </div>
                        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                            Selected pricing plan
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-900">
                            {activeLeadPlan}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Message
                        </div>
                        <div className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {activeLeadMessage}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
