import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/api";

export function AdminHeader({
  title,
  description,
  onMenuClick,
}: {
  title: string;
  description: string;
  onMenuClick: () => void;
}) {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate({ to: "/admin/leads", search: query ? { search: query } : {} });
  };

  const logout = async () => {
    try {
      await apiRequest("/admin/logout", { method: "POST" });
    } catch {
      // Cookie may already be expired; local session cleanup still matters.
    } finally {
      localStorage.removeItem("admin_token");
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-4 lg:px-5">
        <button
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-700">
              <Sparkles className="h-3 w-3" />
              Premium workspace
            </span>
          </div>
          <h1 className="mt-2 truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="truncate text-sm text-muted-foreground">{description}</p>
        </div>

        <form onSubmit={submitSearch} className="hidden items-center gap-2 rounded-2xl border border-border/80 bg-card px-3 py-2 shadow-sm md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads"
            className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>

        <div className="relative flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary"
            aria-label="Toggle notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-destructive" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-14 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl">
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                New leads, contact replies, and pricing edits appear here in real time.
              </p>
            </div>
          )}
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-200">
            AS
          </div>
          <button
            onClick={logout}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary"
            aria-label="Logout"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
