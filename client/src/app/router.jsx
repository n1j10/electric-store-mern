import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/constants/routes";
import { AdminDashboard } from "@/pages/AdminDashboardPage";
import { AdminLogin } from "@/pages/AdminLoginPage";
import { Cart } from "@/pages/CartPage";
import { Checkout } from "@/pages/CheckoutPage";
import { Home } from "@/pages/HomePage";
import { OrderConfirmation } from "@/pages/OrderConfirmationPage";
import { ProductDetail } from "@/pages/ProductDetailPage";
import { ProductListing } from "@/pages/ProductListingPage";

function StoreLayout() {
  return (
    <div className="min-h-screen bg-background font-inter text-on-surface">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}

function AdminRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={ROUTES.adminLogin} replace />;
}

function NotFound() {
  return (
    <div className="mx-auto mt-16 max-w-2xl px-4 text-center">
      <h1 className="font-manrope text-4xl font-bold">404</h1>
      <p className="mt-2 text-on-surface-variant">The requested page could not be found.</p>
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.products} element={<ProductListing />} />
        <Route path={ROUTES.productDetail} element={<ProductDetail />} />
        <Route path={ROUTES.cart} element={<Cart />} />
        <Route path={ROUTES.checkout} element={<Checkout />} />
        <Route path={ROUTES.orderConfirmation} element={<OrderConfirmation />} />
      </Route>
      <Route path={ROUTES.adminLogin} element={<AdminLogin />} />
      <Route path={ROUTES.admin} element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
