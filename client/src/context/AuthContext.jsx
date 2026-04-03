import { createContext, useContext, useMemo, useState } from "react";
import { adminLogin } from "@/lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "tech_artifact_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const data = await adminLogin({ email, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.response?.data?.message || "Login failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), isLoading, login, logout }),
    [token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
