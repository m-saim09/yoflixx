import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    // Redirect root to dashboard if authenticated, otherwise to login
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    if (token) {
      throw redirect({
        to: "/_admin",
      });
    } else {
      throw redirect({
        to: "/login",
      });
    }
  },
});
