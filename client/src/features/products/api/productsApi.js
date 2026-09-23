import api from "@/lib/axios";

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getProducts = (params = {}) => api.get("/products", { params }).then((res) => res.data);
export const getProduct = (id) => api.get(`/products/${id}`).then((res) => res.data);
export const createProduct = (token, payload) => api.post("/products", payload, authHeader(token)).then((res) => res.data);
export const updateProduct = (token, id, payload) => api.put(`/products/${id}`, payload, authHeader(token)).then((res) => res.data);
export const deleteProduct = (token, id) => api.delete(`/products/${id}`, authHeader(token)).then((res) => res.data);
