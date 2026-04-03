import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "tech_artifact_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, variant = "Standard") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.productId === product._id);
      if (index >= 0) {
        const next = [...current];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + quantity
        };
        return next;
      }
      return [
        ...current,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity,
          variant
        }
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, ...totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
