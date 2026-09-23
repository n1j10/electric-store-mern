import api from "@/lib/axios";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const createOrder = (payload) => api.post("/orders", payload).then((res) => res.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((res) => res.data);
export const getOrders = (token) => api.get("/orders", authHeader(token)).then((res) => res.data);
export const updateOrderStatus = (token, id, status) =>
  api.put(`/orders/${id}`, { status }, authHeader(token)).then((res) => res.data);
