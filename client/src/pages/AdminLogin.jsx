import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export function AdminLogin() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@techartifact.com",
    password: ""
  });
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="mx-auto mt-20 max-w-md px-4">
      <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6">
        <h1 className="font-manrope text-3xl font-extrabold">Admin Console Login</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Authenticate to access inventory and orders.</p>
        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <Input
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Admin Email"
          />
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="Admin Password"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
