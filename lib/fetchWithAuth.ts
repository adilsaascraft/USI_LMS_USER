// lib/fetchWithAuth.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization only if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // optional: include cookies (recommended for auth)
  });
}
