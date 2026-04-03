import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/Button";

export function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeItem } = useCart();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto mt-16 max-w-3xl px-4 text-center">
        <h1 className="font-manrope text-4xl font-bold">The Cart is Empty</h1>
        <p className="mt-3 text-on-surface-variant">Add an artifact to start your order.</p>
        <Link to="/products" className="mt-8 inline-flex">
          <Button variant="gradient" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_360px] md:px-6">
      <section>
        <h1 className="font-manrope text-3xl font-extrabold">Review Your Order ({itemCount})</h1>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>
      </section>

      <aside className="h-fit space-y-4 rounded-xl border border-outline-variant/50 bg-surface-container-low p-5 md:sticky md:top-24">
        <div className="rounded-lg bg-primary-container p-4 text-sm text-white">
          Precision Logistics Included
        </div>
        <h2 className="font-manrope text-xl font-bold">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-outline-variant pt-2 text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="rounded-lg border border-outline-variant/50 bg-white p-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            Secure Encrypted Transaction
          </div>
          <p className="mt-1">1-Year Technical Guarantee</p>
        </div>
        <Link to="/checkout" className="block">
          <Button variant="gradient" size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
      </aside>
    </div>
  );
}
