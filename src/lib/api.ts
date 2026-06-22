import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "./auth";
import type {
  ApiResponse,
  AuthTokens,
  AuthUser,
  Contact,
  ContactListData,
  CreateContactPayload,
  LoginData,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/auth/refresh-tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearSession();
    return null;
  }

  const data = (await res.json()) as {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
  };

  if (data.accessToken) {
    localStorage.setItem("makanify_access_token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("makanify_refresh_token", data.refreshToken);
    }
    return data.accessToken;
  }

  clearSession();
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, false);
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  const json = (await res.json()) as ApiResponse<T> & { message?: string };

  if (!res.ok || json.success === false) {
    throw new ApiError(json.message ?? "Request failed", res.status, json.code);
  }

  return json.data;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginData> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.toLowerCase(), password }),
  });

  const json = (await res.json()) as ApiResponse<LoginData>;

  if (!res.ok || !json.success) {
    throw new ApiError(json.message ?? "Invalid email or password.", res.status, json.code);
  }

  saveSession(json.data.user, json.data.tokens);
  return json.data;
}

export async function getContacts(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
}): Promise<ContactListData> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  query.set("sortBy", params.sortBy ?? "updatedAt:desc");

  return request<ContactListData>(`/contact?${query.toString()}`);
}

export async function createContact(
  body: CreateContactPayload,
): Promise<Contact> {
  return request<Contact>("/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export { ApiError };
