import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tag,
  Users,
  X,
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

export function AdminSidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const content = (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-6">
        <div className="min-w-0">
          <div className="font-display text-2xl font-semibold tracking-tight text-slate-950">
            Yoflix Admin
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-[12px] border border-[#ECEEF3] bg-white p-2 text-foreground lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== "/admin" && pathname.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className="block" onClick={onClose}>
              <motion.div
                whileHover={{ x: 2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`relative flex h-11 items-center gap-3 rounded-[12px] px-4 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{it.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#ECEEF3] px-6 py-5 text-xs text-slate-500">
        © {new Date().getFullYear()} Yoflix. All rights reserved.
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30">
        {content}
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
              onClick={onClose}
              aria-label="Close navigation"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
