const normalizeApiBase = (raw?: string) => {
  if (!raw) return undefined;
  const trimmed = raw.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

export const API_BASE =
  normalizeApiBase(import.meta.env.VITE_API_URL) ||
  normalizeApiBase(import.meta.env.VITE_API_BASE) ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (token) {
    return { Authorization: `Yoflix ${token}` };
  }

  if (import.meta.env.DEV) {
    return { Authorization: "Yoflix dev-admin-token" };
  }

  return {};
};

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  const authHeaders = getAuthHeaders();
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || response.statusText || "Request failed");
  }

  return payload as T;
}
