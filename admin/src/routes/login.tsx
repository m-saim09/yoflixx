import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

type LoginResponse = {
  token: string;
  data: {
    admin: {
      name: string;
      email: string;
      role: string;
    };
  };
};

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Yoflix" },
      { name: "description", content: "Secure Yoflix admin login." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await apiRequest<LoginResponse>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("admin_token", response.token);
      navigate({ to: "/admin" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to login.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(109,93,252,0.16),_transparent_45%),linear-gradient(135deg,_#f9f7ff_0%,_#f6f8fb_100%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-border/70 bg-white/80 shadow-[0_40px_120px_-45px_rgba(109,93,252,0.45)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(109,93,252,0.2),_transparent_55%)] p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure access
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
                Welcome back to your command center.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                Manage leads, pricing, consultations, contacts, and website settings from a single
                polished workspace.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Need a quick start?</div>
              <div className="mt-2 text-sm text-slate-600">
                Use the demo admin credentials shown below to explore the dashboard.
              </div>
            </div>
          </div>

          <form onSubmit={submitLogin} className="p-8 sm:p-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-violet-200">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-center font-display text-2xl font-semibold text-slate-950">
              Yoflix Admin
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sign in to continue to the control center.
            </p>

            <label className="mt-6 block text-sm font-medium text-slate-700">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                minLength={6}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo credentials: admin@yoflixx.com / admin123
            </p>

            <button
              disabled={status === "loading"}
              className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
            {message && <p className="mt-4 text-sm text-destructive">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
