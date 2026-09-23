import api from "@/lib/axios";

export function getAdminStats(token) {
  return api.get("/admin/stats", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
}
