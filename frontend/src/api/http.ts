import { API_BASE } from "./routes";

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) return Promise.reject(await res.json());
  return res.json() as Promise<T>;
}
