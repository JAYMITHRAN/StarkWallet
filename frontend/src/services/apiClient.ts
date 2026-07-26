import type { ApiResponse } from "@stark/shared/types/index";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || ""}/api/v1`;
const TOKEN_STORAGE_KEY = "stark_auth_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

export class ApiRequestError extends Error {
  constructor(public code: string, message: string, public status: number, public details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // attach Authorization header (default: true)
}

/**
 * Every API call goes through this single function so error handling,
 * auth headers, and the `ApiResponse` envelope are handled in one place —
 * feature services (auth, transactions, ...) just describe *what* to call.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new ApiRequestError(json.error.code, json.error.message, response.status, json.error.details);
  }

  return json.data;
}
