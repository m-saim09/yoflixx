import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // Check if user is authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

    if (!token) {
      // Redirect to login if not authenticated
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
