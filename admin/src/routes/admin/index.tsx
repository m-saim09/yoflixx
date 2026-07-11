import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Tag,
  Download,
  Settings,
} from "lucide-react";
import { AdminShell, Badge, Card, StatCard } from "@/components/admin/Shell";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

type AnalyticsResponse = {
  data?: {
    totals?: {
      leads?: number;
      monthlyInquiries?: number;
      contacts?: number;
    };
    leadsByStatus?: Record<string, number>;
    leadsByPlan?: Array<{ _id?: string; count?: number }>;
    monthlyInquiries?: Array<{ label?: string; leads?: number }>;
  };
};

type ContactsResponse = {
  data?: {
    contacts?: Array<{
      _id: string;
      name: string;
      message?: string;
      createdAt?: string;
      status?: string;
    }>;
  };
};

type LeadsResponse = {
  data?: {
    leads?: Array<{
      _id: string;
      fullName?: string;
      name?: string;
      email?: string;
      companyName?: string;
      company?: string;
      selectedPlan?: string;
      status?: string;
      createdAt?: string;
    }>;
  };
};

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Yoflix Admin" },
      { name: "description", content: "Overview of leads, inquiries, deals and conversions." },
    ],
  }),
  component: DashboardPage,
});

const statusTone: Record<string, "primary" | "success" | "warning" | "destructive" | "neutral"> = {
  New: "primary",
  Contacted: "warning",
  Qualified: "primary",
  Closed: "success",
  Lost: "destructive",
};

function DashboardPage() {
  const { data } = useQuery<AnalyticsResponse>({
    queryKey: ["admin/analytics"],
    queryFn: () => apiRequest<AnalyticsResponse>("/analytics"),
    retry: false,
  });

  const { data: contactsData } = useQuery<ContactsResponse>({
    queryKey: ["admin/contacts"],
    queryFn: () => apiRequest<ContactsResponse>("/contacts"),
    retry: false,
  });

  const analytics = data?.data ?? null;

  const kpis = {
    totalLeads: analytics?.totals?.leads ?? 0,
    monthlyInquiries: analytics?.totals?.monthlyInquiries ?? 0,
    closedDeals: analytics?.leadsByStatus?.Closed ?? 0,
    conversionRate: analytics?.totals?.leads
      ? Math.round(((analytics?.leadsByStatus?.Closed || 0) / analytics.totals.leads) * 10) / 10
      : 0,
  };

  const monthlyGrowth = (analytics?.monthlyInquiries || []).map((m) => ({
    m: m.label || "",
    inquiries: m.leads ?? 0,
    leads: m.leads ?? 0,
  }));

  const colors = [`var(--chart-1)`, `var(--chart-2)`, `var(--chart-3)`, `var(--chart-4)`];

  const leadStatus = Object.entries(analytics?.leadsByStatus || {}).map(([name, value], i) => ({
    name,
    value: Number(value),
    color: colors[i % colors.length],
  }));

  const planDistribution = (analytics?.leadsByPlan || []).map((p, i) => ({
    name: p._id ?? "Unknown",
    value: p.count ?? 0,
    color: colors[i % colors.length],
  }));

  const contacts =
    contactsData?.data?.contacts?.map((c) => ({
      id: c._id,
      name: c.name,
      subject: "",
      preview: (c.message || "").slice(0, 80),
      time: new Date(c.createdAt ?? Date.now()).toLocaleDateString(),
      status: c.status,
    })) || [];

  const { data: leadsData } = useQuery<LeadsResponse>({
    queryKey: ["admin/leads"],
    queryFn: () => apiRequest<LeadsResponse>("/leads?limit=5"),
    retry: false,
  });

  const leads =
    leadsData?.data?.leads?.map((l) => ({
      id: l._id,
      name: l.fullName || l.name || "",
      email: l.email || "",
      company: l.companyName || l.company || "",
      plan: l.selectedPlan || "",
      status: l.status || "New",
      created: new Date(l.createdAt ?? Date.now()).toLocaleDateString(),
    })) || [];

  return (
    <AdminShell
      title="Dashboard"
      description="Executive view of pipeline health, customer signals, and growth momentum."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={kpis.totalLeads.toLocaleString()}
          delta="+12.4% this month"
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Monthly Inquiries"
          value={kpis.monthlyInquiries.toString()}
          delta="+5.8% vs last month"
          icon={MessageCircle}
          accent="warning"
        />
        <StatCard
          label="Closed Deals"
          value={kpis.closedDeals.toString()}
          delta="+8.1% this month"
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          delta="+2.3 pts"
          icon={TrendingUp}
          accent="primary"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
            <div>
              <h3 className="font-display text-lg font-semibold">Monthly Inquiry Growth</h3>
              <p className="text-sm text-muted-foreground">Last 8 months of acquisition momentum</p>
            </div>
            <Badge tone="success">↑ 18.4%</Badge>
          </div>
          <div className="h-60 p-4">
            <ResponsiveContainer>
              <AreaChart data={monthlyGrowth}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="m"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    boxShadow: "0 8px 24px rgba(17,24,39,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#gA)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold">Lead Status</h3>
          <p className="mb-3 text-sm text-muted-foreground">Current pipeline distribution</p>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={leadStatus}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {leadStatus.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {leadStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
            <h3 className="font-display text-lg font-semibold">Recent Leads</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-secondary/40 text-left text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Company</th>
                  <th className="py-2 font-medium">Plan</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="px-5 py-2 text-right font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border/60 last:border-0 transition hover:bg-secondary/40"
                  >
                    <td className="px-5 py-2">
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.email}</div>
                    </td>
                    <td className="py-3">{l.company}</td>
                    <td className="py-2">
                      <Badge tone="primary">{l.plan}</Badge>
                    </td>
                    <td className="py-2">
                      <Badge tone={statusTone[l.status]}>{l.status}</Badge>
                    </td>
                    <td className="px-5 py-2 text-right text-muted-foreground">{l.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold">Plan Distribution</h3>
          <div className="mt-3 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={planDistribution} dataKey="value" innerRadius={42} outerRadius={72}>
                  {planDistribution.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                <span className="text-muted-foreground">{p.name}</span>
                <span className="ml-auto font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.85fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <h3 className="font-display text-lg font-semibold">Recent Contacts</h3>
            <button className="text-xs font-semibold text-primary hover:underline">
              Open inbox
            </button>
          </div>
          <div className="divide-y divide-border/70">
            {contacts.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 px-5 py-3 transition hover:bg-secondary/30"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-xs font-semibold text-primary">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">{c.name}</div>
                    <div className="shrink-0 text-xs text-muted-foreground">{c.time}</div>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {c.subject} — {c.preview}
                  </div>
                </div>
                <Badge
                  tone={
                    c.status === "New" ? "primary" : c.status === "Replied" ? "success" : "neutral"
                  }
                >
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: "Add Lead", icon: Plus },
              { label: "Create Plan", icon: Tag },
              { label: "Export Data", icon: Download },
              { label: "Settings", icon: Settings },
            ].map((a) => (
              <button
                key={a.label}
                className="group rounded-[12px] border border-border/70 bg-secondary/30 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-soft"
              >
                <a.icon className="mb-2 h-4 w-4 text-primary" />
                <div className="text-sm font-semibold">{a.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
