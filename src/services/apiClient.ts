const DEFAULT_API_BASE_URL = "http://localhost:3000/api/mc/";

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
);

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), API_BASE_URL);
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

