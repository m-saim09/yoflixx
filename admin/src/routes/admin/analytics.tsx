import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  Globe2,
  MonitorSmartphone,
} from "lucide-react";
import { AdminShell, Badge, Card, StatCard } from "@/components/admin/Shell";
import {
  activity,
  devices,
  funnel,
  geo,
  kpis,
  leadStatus,
  monthlyGrowth,
  topServices,
  trafficSources,
} from "@/lib/admin/data";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Yoflix Admin" },
      {
        name: "description",
        content: "Deep insights across revenue, traffic, devices, and geography.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <AdminShell title="Analytics" description="Performance, traffic and revenue insights.">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={`$${kpis.revenue.toLocaleString()}`}
          delta="+22.1%"
          icon={DollarSign}
          accent="success"
        />
        <StatCard
          label="Leads"
          value={kpis.totalLeads.toLocaleString()}
          delta="+12.4%"
          icon={Users}
          accent="primary"
        />
        <StatCard
          label="Conversions"
          value={`${kpis.conversionRate}%`}
          delta="+2.3 pts"
          icon={Target}
          accent="warning"
        />
        <StatCard
          label="Growth"
          value={`${kpis.growth}%`}
          delta="MoM"
          icon={TrendingUp}
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold mb-1">Monthly Growth</h3>
          <p className="text-xs text-muted-foreground mb-3">Leads vs Inquiries</p>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={monthlyGrowth}>
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
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="inquiries"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-1">Traffic Sources</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 30 days</p>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={trafficSources}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {trafficSources.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2">
            {trafficSources.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-semibold">{s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card>
          <h3 className="font-display font-semibold mb-1">Revenue</h3>
          <p className="text-xs text-muted-foreground mb-3">Monthly</p>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthlyGrowth}>
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
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-primary" /> Devices
          </h3>
          <p className="text-xs text-muted-foreground mb-3">% of sessions</p>
          <div className="space-y-3 mt-4">
            {devices.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{d.name}</span>
                  <span className="font-semibold">{d.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${d.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-3">Conversion Funnel</h3>
          <div className="space-y-2">
            {funnel.map((f, i) => {
              const pct = (f.value / funnel[0].value) * 100;
              return (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{f.stage}</span>
                    <span className="font-semibold">{f.value.toLocaleString()}</span>
                  </div>
                  <div className="h-7 rounded-lg bg-secondary overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center pl-2 text-[10px] font-semibold text-primary-foreground"
                      style={{ width: `${pct}%`, background: `var(--chart-${(i % 5) + 1})` }}
                    >
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" /> Geographic Analytics
          </h3>
          <div className="space-y-2">
            {geo.map((g) => (
              <div key={g.country} className="flex items-center gap-3">
                <span className="text-sm w-40 truncate">{g.country}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${g.value * 2}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-10 text-right">{g.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-3">Top Services</h3>
          <div className="space-y-3">
            {topServices.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{s.name}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-semibold mb-3">Lead Status</h3>
          <div className="space-y-2">
            {leadStatus.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-sm">{s.name}</span>
                </div>
                <span className="font-semibold text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold mb-3">Activity Timeline</h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            {activity.map((a, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                <div className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary-soft" />
                <div className="text-sm">{a.text}</div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-primary-soft via-card to-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="font-display font-semibold">AI Insights</h3>
          </div>
          <p className="text-sm text-foreground/80">
            Conversion is trending <span className="font-semibold text-primary">+2.3 pts</span> this
            month, led by organic search. Consider doubling down on SEO content and review the
            Starter→Growth upgrade flow.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li className="flex gap-2">
              <Badge tone="success">Win</Badge> Organic traffic up 28%
            </li>
            <li className="flex gap-2">
              <Badge tone="warning">Watch</Badge> Mobile drop-off at signup
            </li>
            <li className="flex gap-2">
              <Badge tone="primary">Try</Badge> A/B test pricing page
            </li>
          </ul>
        </Card>
      </div>
    </AdminShell>
  );
}
