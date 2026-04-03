import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export function getProducts(params = {}) {
  
  return api.get("/products", { params }).then((res) => res.data);
}

export function getProduct(id) {
  return api.get(`/products/${id}`).then((res) => res.data);
}

export function createOrder(payload) {
  return api.post("/orders", payload).then((res) => res.data);
}

export function getOrder(id) {
  return api.get(`/orders/${id}`).then((res) => res.data);
}

export function adminLogin(credentials) {
  return api.post("/auth/login", credentials).then((res) => res.data);
}

function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export function getAdminStats(token) {
  return api.get("/admin/stats", authHeader(token)).then((res) => res.data);
}

export function createProduct(token, payload) {
  return api.post("/products", payload, authHeader(token)).then((res) => res.data);
}

export function updateProduct(token, id, payload) {
  return api.put(`/products/${id}`, payload, authHeader(token)).then((res) => res.data);
}

export function deleteProduct(token, id) {
  return api.delete(`/products/${id}`, authHeader(token)).then((res) => res.data);
}

export function getOrders(token) {
  return api.get("/orders", authHeader(token)).then((res) => res.data);
}

export function updateOrderStatus(token, id, status) {
  return api.put(`/orders/${id}`, { status }, authHeader(token)).then((res) => res.data);
}

export default api;
