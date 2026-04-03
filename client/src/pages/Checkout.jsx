import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    method: "standard"
  });
  const [payment, setPayment] = useState({
    method: "card",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingCost = shipping.method === "express" ? 25 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shippingCost;

  const canSubmit = useMemo(() => {
    const hasShipping = shipping.fullName && shipping.street && shipping.city && shipping.postalCode;
    if (!hasShipping) return false;
    if (payment.method === "card") {
      return payment.cardNumber && payment.expiry && payment.cvc;
    }
    return true;
  }, [shipping, payment]);

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError("Please complete shipping and payment fields.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          variant: item.variant
        })),
        shipping,
        payment: {
          method: payment.method,
          last4: payment.cardNumber?.slice(-4) || ""
        }
      });
      clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-16 max-w-3xl px-4 text-center">
        <h1 className="font-manrope text-3xl font-bold">Checkout is waiting for your cart.</h1>
        <Link to="/products" className="mt-6 inline-flex">
          <Button variant="gradient">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submitOrder} className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_360px] md:px-6">
      <section className="space-y-6">
        <article className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-5">
          <h2 className="font-manrope text-xl font-bold">Step 01: Shipping Address</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Full Name"
              value={shipping.fullName}
              onChange={(e) => setShipping((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            <Input
              placeholder="Street"
              value={shipping.street}
              onChange={(e) => setShipping((prev) => ({ ...prev, street: e.target.value }))}
            />
            <Input
              placeholder="City"
              value={shipping.city}
              onChange={(e) => setShipping((prev) => ({ ...prev, city: e.target.value }))}
            />
            <Input
              placeholder="Postal Code"
              value={shipping.postalCode}
              onChange={(e) => setShipping((prev) => ({ ...prev, postalCode: e.target.value }))}
            />
          </div>
        </article>

        <article className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-5">
          <h2 className="font-manrope text-xl font-bold">Step 02: Shipping Method</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/50 bg-white p-4">
              <input
                type="radio"
                name="shipping-method"
                checked={shipping.method === "standard"}
                onChange={() => setShipping((prev) => ({ ...prev, method: "standard" }))}
              />
              <span className="text-sm">
                <strong>Standard Priority</strong>
                <br />
                Free
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant/50 bg-white p-4">
              <input
                type="radio"
                name="shipping-method"
                checked={shipping.method === "express"}
                onChange={() => setShipping((prev) => ({ ...prev, method: "express" }))}
              />
              <span className="text-sm">
                <strong>Express Artifact</strong>
                <br />
                $25.00
              </span>
            </label>
          </div>
        </article>

        <article className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-5">
          <h2 className="font-manrope text-xl font-bold">Step 03: Payment Options</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={payment.method === "card"}
                onChange={() => setPayment((prev) => ({ ...prev, method: "card" }))}
              />
              Credit Card
            </label>
            {payment.method === "card" && (
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  className="md:col-span-3"
                  placeholder="Card Number"
                  value={payment.cardNumber}
                  onChange={(e) => setPayment((prev) => ({ ...prev, cardNumber: e.target.value }))}
                />
                <Input
                  placeholder="Expiry"
                  value={payment.expiry}
                  onChange={(e) => setPayment((prev) => ({ ...prev, expiry: e.target.value }))}
                />
                <Input
                  placeholder="CVC"
                  value={payment.cvc}
                  onChange={(e) => setPayment((prev) => ({ ...prev, cvc: e.target.value }))}
                />
              </div>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={payment.method === "paypal"}
                onChange={() => setPayment((prev) => ({ ...prev, method: "paypal" }))}
              />
              PayPal
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={payment.method === "cod"}
                onChange={() => setPayment((prev) => ({ ...prev, method: "cod" }))}
              />
              Cash on Delivery
            </label>
          </div>
        </article>

        {error && <p className="text-sm text-error">{error}</p>}
      </section>

      <aside className="h-fit rounded-xl bg-primary-container p-5 text-white md:sticky md:top-24">
        <h2 className="font-manrope text-xl font-bold">Order Review</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-slate-300">Qty {item.quantity}</p>
              </div>
              <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-slate-700 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-700 pt-2 text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button disabled={!canSubmit || isSubmitting} type="submit" variant="gradient" className="mt-6 w-full">
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-300">
          <Lock size={12} /> SSL Encrypted Checkout
        </p>
      </aside>
    </form>
  );
}
