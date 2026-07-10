import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  MessageSquare,
  Tag,
  Settings,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/consultations", label: "Consultation", icon: CalendarClock },
  { to: "/admin/pricing", label: "Pricing Management", icon: Tag },
  { to: "/admin/settings", label: "Website Settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-30">
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold">
            Y
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-base leading-tight text-sidebar-foreground">
              Yoflix Admin
            </div>
            <div className="text-xs text-muted-foreground">Management Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className="block">
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgba(109,93,252,0.5)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{it.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 space-y-3">
        <div className="rounded-2xl border border-sidebar-border bg-secondary/60 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-foreground">
            <ShieldCheck className="h-4 w-4" /> Protected Session
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            End-to-end encrypted. Expires in 42 min.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-card p-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-semibold text-sm">
            AS
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">Admin Sky</div>
            <div className="text-xs text-muted-foreground truncate">admin@yoflix.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
