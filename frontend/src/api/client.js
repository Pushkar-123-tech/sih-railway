const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("railplan_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

  if (!response.ok) {
    const message = data.message || data.detail || `API error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  login: (role) => request("/auth/login", { method: "POST", body: JSON.stringify({ role }) }),
  me: () => request("/auth/me"),
  dashboard: () => request("/analytics/dashboard"),
  works: (params = "") => request(`/work-items${params ? `?${params}` : ""}`),
  work: (id) => request(`/work-items/${id}`),
  createWork: (payload) => request("/work-items", { method: "POST", body: JSON.stringify(payload) }),
  updateWork: (id, payload) => request(`/work-items/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  predict: (payload) => request("/ml/predict", { method: "POST", body: JSON.stringify(payload) }),
  mlHealth: () => request("/ml/health"),
  plans: () => request("/plans"),
  generatePlan: (payload) => request("/plans/generate", { method: "POST", body: JSON.stringify(payload) }),
  approvePlan: (id, payload = {}) => request(`/plans/${id}/approve`, { method: "POST", body: JSON.stringify(payload) }),
  rejectPlan: (id, payload = {}) => request(`/plans/${id}/reject`, { method: "POST", body: JSON.stringify(payload) }),
  publishPlan: (id) => request(`/plans/${id}/publish`, { method: "POST" }),
  startExecution: (id) => request(`/execution/${id}/start`, { method: "POST" }),
  completeExecution: (id, payload) => request(`/execution/${id}/complete`, { method: "POST", body: JSON.stringify(payload) }),
  verifyCompletion: (id, payload) => request(`/execution/${id}/verify`, { method: "POST", body: JSON.stringify(payload) }),
  analytics: () => request("/analytics/overview"),
};
