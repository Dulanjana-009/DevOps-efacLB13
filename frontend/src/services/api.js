const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("libraryToken");

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export const authApi = {
  login: (username, password) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  register: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiRequest("/auth/me"),
  updateProfile: (data) => apiRequest("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data) => apiRequest("/auth/change-password", { method: "PUT", body: JSON.stringify(data) }),
};

export const booksApi = {
  list: () => apiRequest("/books"),
  create: (data) => apiRequest("/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/books/${id}`, { method: "DELETE" }),
};

export const membersApi = {
  list: () => apiRequest("/members"),
  create: (data) => apiRequest("/members", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/members/${id}`, { method: "DELETE" }),
};

export const transactionsApi = {
  list: () => apiRequest("/transactions"),
  borrow: (memberId, bookId) => apiRequest("/transactions/borrow", { method: "POST", body: JSON.stringify({ memberId, bookId }) }),
  returnBook: (id) => apiRequest(`/transactions/${id}/return`, { method: "PUT" }),
};
