import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/features/auth";
import { CartProvider } from "@/features/cart";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
