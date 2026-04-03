import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { getOrder } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(id)
      .then((result) => setOrder(result))
      .catch((requestError) => setError(requestError.response?.data?.message || "Order not found."));
  }, [id]);

  if (error) {
    return <div className="mx-auto mt-16 max-w-3xl px-4 text-center text-error">{error}</div>;
  }

  if (!order) {
    return <div className="mx-auto mt-16 max-w-3xl px-4 text-center text-on-surface-variant">Loading order...</div>;
  }

  return (
    <div className="mx-auto mt-12 max-w-4xl px-4">
      <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-8 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={72} />
        <h1 className="mt-5 font-manrope text-4xl font-extrabold">Thank You for Your Order!</h1>
        <p className="mt-2 text-on-surface-variant">
          Order ID: <span className="font-semibold text-on-surface">{order.orderId}</span>
        </p>
        <p className="text-on-surface-variant">Estimated Arrival: {order.estimatedArrival}</p>
      </section>

      <section className="mt-8 rounded-2xl border border-outline-variant/50 bg-white p-6">
        <h2 className="font-manrope text-2xl font-bold">Order Summary</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={`${item.product}-${item.name}`} className="flex items-center justify-between border-b border-outline-variant/40 pb-3 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-on-surface-variant">Qty {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${order.shipping.cost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-outline-variant pt-2 text-base font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-3">
        <Button variant="outline" onClick={() => window.print()}>
          Print Receipt
        </Button>
        <Link to="/products">
          <Button variant="gradient" className="w-full">
            Continue Shopping
          </Button>
        </Link>
        <a href="mailto:support@techartifact.com">
          <Button variant="secondary" className="w-full">
            Need Help?
          </Button>
        </a>
      </section>

      <section className="mt-6 mb-20 rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck size={16} />
          Secure & Verified
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">Your payment and shipping details are encrypted.</p>
      </section>
    </div>
  );
}
