const normalizeApiBase = (raw?: string) => {
  if (!raw) return undefined;
  const trimmed = raw.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

export const API_BASE =
  normalizeApiBase(import.meta.env.VITE_API_URL) ||
  normalizeApiBase(import.meta.env.VITE_API_BASE) ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || response.statusText || "Request failed");
  }

  return payload as T;
}
