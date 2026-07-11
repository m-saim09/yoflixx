import { motion } from "framer-motion";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AdminHeader } from "./Header";
import { AdminSidebar } from "./Sidebar";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("admin_token"));
    if (pathname !== "/login" && !hasToken && !import.meta.env.DEV) {
      navigate({ to: "/login" });
    }
  }, [navigate, pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(109,93,252,0.08),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,1),_rgba(245,247,255,1))] text-foreground">
      <AdminSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader
          title={title}
          description={description}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-5 lg:px-5 xl:px-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[20px] border border-border/70 bg-card/95 p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.28)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "success" | "warning" | "destructive";
}) {
  const tone = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[accent];

  return (
    <Card className="transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(109,93,252,0.42)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</div>
          {delta && <div className="mt-1 text-xs font-medium text-success">{delta}</div>}
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "destructive";
}) {
  const cls = {
    neutral: "bg-secondary text-secondary-foreground",
    primary: "bg-primary-soft text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}
