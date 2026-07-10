import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/api";

export function AdminHeader({ title, description }: { title: string; description: string }) {
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
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="px-6 lg:px-10 py-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-bold truncate">{title}</h1>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        </div>
        <div className="relative flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
            aria-label="Toggle notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-20 top-12 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl">
              <h2 className="text-sm font-semibold">Notifications</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                New leads, contact replies, and pricing edits appear in their respective pages.
              </p>
            </div>
          )}
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            AS
          </div>
          <button
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-secondary transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
