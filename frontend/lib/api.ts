const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || data.detail || `Request failed (${res.status})`);
    } catch {
      throw new Error(text || `Request failed (${res.status})`);
    }
  }

  if (res.status === 204) return null;
  return res.json();
}

// Auth helper functions
export async function login(email: string, password: string) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (response.token) {
    setToken(response.token);
  }
  return response;
}

export async function signup(data: {
  email: string;
  agency_name: string;
  full_name: string;
  password: string;
  payment_method_id: string;
  device_fingerprint?: string;
}) {
  return await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createSetupIntent() {
  return await apiFetch("/stripe/create-setup-intent", {
    method: "POST",
  });
}

export async function forgotPassword(email: string) {
  return await apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, new_password: string) {
  return await apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password }),
  });
}

export async function verifyEmail(token: string) {
  return await apiFetch(`/auth/verify-email/${token}`, {
    method: "POST",
  });
}

export function logout() {
  removeToken();
}

export async function getCurrentUser() {
  return apiFetch("/auth/me");
}

// Admin API functions
export async function getAdminStats() {
  return apiFetch("/admin/stats");
}

export async function getAdminUsers(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  subscription_status?: string;
  is_active?: boolean;
}) {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.subscription_status) queryParams.append("subscription_status", params.subscription_status);
  if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
  
  const query = queryParams.toString();
  return apiFetch(`/admin/users${query ? `?${query}` : ""}`);
}

export async function getAdminUser(userId: number) {
  return apiFetch(`/admin/users/${userId}`);
}

export async function updateAdminUser(userId: number, data: {
  is_active?: boolean;
  is_admin?: boolean;
  role?: string;
  email_verified?: boolean;
  subscription_status?: string;
}) {
  return apiFetch(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminUser(userId: number) {
  return apiFetch(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export async function resetUserTrial(userId: number) {
  return apiFetch(`/admin/users/${userId}/reset-trial`, {
    method: "POST",
  });
}

export async function extendUserTrial(userId: number, days: number) {
  return apiFetch(`/admin/users/${userId}/extend-trial?days=${days}`, {
    method: "POST",
  });
}

export async function getSignupAttempts(params?: {
  skip?: number;
  limit?: number;
  success?: boolean;
  blocked_reason?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.success !== undefined) queryParams.append("success", params.success.toString());
  if (params?.blocked_reason) queryParams.append("blocked_reason", params.blocked_reason);
  
  const query = queryParams.toString();
  return apiFetch(`/admin/logs/signup-attempts${query ? `?${query}` : ""}`);
}

export async function getBlockedIPs() {
  return apiFetch("/admin/logs/blocked-ips");
}
