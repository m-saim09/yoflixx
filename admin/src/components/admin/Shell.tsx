import { motion } from "framer-motion";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
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

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("admin_token"));
    if (pathname !== "/login" && !hasToken && !import.meta.env.DEV) {
      navigate({ to: "/login" });
    }
  }, [navigate, pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader title={title} description={description} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl mx-auto w-full"
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
      className={`rounded-2xl bg-card border border-border p-5 shadow-[0_1px_3px_rgba(17,24,39,0.04),0_8px_24px_-12px_rgba(109,93,252,0.08)] ${className}`}
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
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{value}</div>
          {delta && <div className="mt-1 text-xs font-medium text-success">{delta}</div>}
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
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
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
