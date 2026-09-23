import api from "@/lib/axios";

export function adminLogin(credentials) {
  return api.post("/auth/login", credentials).then((res) => res.data);
}
