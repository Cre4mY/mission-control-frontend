const DEFAULT_API_BASE_URL = "http://localhost:3000/api/mc/";

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? `${value}/` : value;
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
);

// Token from environment or default
const API_TOKEN = import.meta.env.VITE_MC_API_TOKEN || "8adcd91f3acb85076a54c9437bd1e15c62087ace4d3f69fd15560cb4b60b59d2";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL);
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorData.error || "Unknown error"}`);
  }

  return (await response.json()) as T;
}

