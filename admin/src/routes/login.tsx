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
  const [email, setEmail] = useState("admin@yoflixx.com");
  const [password, setPassword] = useState("admin123");
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
      navigate({ to: "/" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to login.");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <form
        onSubmit={submitLogin}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-bold">Yoflix Admin</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to manage leads, pricing, contacts, and website settings.
        </p>

        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <p className="mt-3 text-xs text-muted-foreground">
          Demo credentials: admin@yoflixx.com / admin123
        </p>

        <button
          disabled={status === "loading"}
          className="mt-6 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
        {message && <p className="mt-4 text-sm text-destructive">{message}</p>}
      </form>
    </main>
  );
}
