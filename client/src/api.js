// Central place for all backend calls.
// Dev: Vite proxies /api -> http://localhost:5000 (see vite.config.js)
// Production: set VITE_API_URL to your Render backend URL (e.g. https://shopmate-api.onrender.com)
const BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "shopmate_token";

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
};
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check that the backend is running.");
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    throw new Error((data && data.message) || `Request failed (${res.status})`);
  }
  return data;
}

// Backend sends the JWT inside `user`. Save it, and return the user without it.
function saveSession(data) {
  const { token, ...user } = data.user;
  if (token) setToken(token);
  return user;
}

export async function loginRequest(email, password) {
  const data = await api("/api/auth/login", { method: "POST", body: { email, password }, auth: false });
  return saveSession(data);
}

export async function registerCustomer({ name, email, password }) {
  const data = await api("/api/auth/register", { method: "POST", body: { name, email, password }, auth: false });
  return saveSession(data);
}

export async function registerSellerRequest(form) {
  const data = await api("/api/auth/register-seller", { method: "POST", body: form, auth: false });
  return saveSession(data);
}

export async function fetchMe() {
  const data = await api("/api/auth/me");
  return data.user;
}

// ---------- Admin: seller approvals ----------
// Converts a backend User (role: vendor) into the shape the Admin/Stores pages already use.
export const mapSellerToVendor = (u) => ({
  id: u._id,
  _id: u._id,
  storeName: u.businessName || `${u.name}'s Store`,
  businessName: u.businessName,
  email: u.email,
  phone: u.phone,
  ownerName: u.name,
  name: u.name,
  category: u.businessCategory || "General Merchandise",
  businessAddress: u.businessAddress,
  sampleDocumentId: u.sampleDocumentId,
  approvalStatus: u.vendorStatus,
  vendorStatus: u.vendorStatus,
  rejectionReason: u.rejectionReason,
  registeredDate: u.createdAt ? u.createdAt.slice(0, 10) : undefined,
    registrationType: u.registrationType,
  registrationNumber: u.registrationNumber,
  registrationVerified: u.registrationVerified,
  registrationVerifiedAt: u.registrationVerifiedAt,
  registrationInfo: u.registrationInfo,
});

export const fetchSellers = async () => (await api("/api/admin/sellers")).data.map(mapSellerToVendor);
export const approveSellerRequest = (id) => api(`/api/admin/sellers/${id}/approve`, { method: "PUT" });
export const rejectSellerRequest = (id, reason) =>
  api(`/api/admin/sellers/${id}/reject`, { method: "PUT", body: { reason } });

export const isMongoId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

// ---------- Products ----------
// The website uses `id`; MongoDB gives `_id`. Keep both.
export const mapProduct = (p) => ({ ...p, id: p._id });

export const fetchProducts = async () => (await api("/api/products", { auth: false })).data.map(mapProduct);

export const createVendorProduct = async (fields) =>
  mapProduct((await api("/api/vendors/products", { method: "POST", body: fields })).data);
export const deleteVendorProductRequest = (id) => api(`/api/vendors/products/${id}`, { method: "DELETE" });

export const createAdminProduct = async (fields) =>
  mapProduct((await api("/api/admin/products", { method: "POST", body: fields })).data);
export const deleteAdminProductRequest = (id) => api(`/api/admin/products/${id}`, { method: "DELETE" });

// ---------- Image upload (Cloudinary via backend) ----------
export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  let res;
  try {
    res = await fetch(`${BASE}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type: browser sets the multipart boundary
      body: form,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check that the backend is running.");
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) throw new Error((data && data.message) || "Upload failed");
  return data.url;
}

// ---------- Orders ----------
export const createOrderRequest = (items, shippingAddress, paymentMethod = "COD", upiId = "") =>
  api("/api/orders", {
    method: "POST",
    body: {
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity, size: i.size })),
      shippingAddress,
      paymentMethod,
      upiId,
    },
  });
export const fetchMyOrders = async () => (await api("/api/orders/mine")).data;

export const cancelOrderRequest = async (id) => (await api(`/api/orders/${id}/cancel`, { method: "PUT" })).data;
export const fetchAdminOrders = async () => (await api("/api/admin/orders")).data;
export const updateAdminOrderStatus = async (id, orderStatus) =>
  (await api(`/api/admin/orders/${id}`, { method: "PUT", body: { orderStatus } })).data;

export const fetchAdminStats = async () => (await api("/api/admin/stats")).stats;

export const markOrderPaid = async (id) =>
  (await api(`/api/admin/orders/${id}`, { method: "PUT", body: { paymentStatus: "Paid" } })).data;


export const fetchSellerDocument = async (id) => api(`/api/admin/sellers/${id}/document`);

export const verifySellerRegistrationRequest = (id) =>
  api(`/api/admin/sellers/${id}/verify-registration`, { method: "PUT" });