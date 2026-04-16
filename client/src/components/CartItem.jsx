import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * This component represents a single item in the shopping cart. It displays the product image, name, variant, price, and quantity.
 * It also provides buttons to increase or decrease the quantity of the item, as well as a button to remove the item from the cart.
 * The component uses Tailwind CSS for styling and assumes that the `Button` component is defined elsewhere in the project.
 */
export function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 md:flex-row">
      <img src={item.image} alt={item.name} className="h-28 w-full rounded-lg object-cover md:w-36" />
      <div className="flex-1">
        <p className="font-manrope text-lg font-bold">{item.name}</p>
        <p className="text-sm text-on-surface-variant">{item.variant}</p>
        <p className="mt-2 font-semibold">${item.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onDecrease}>
          <Minus size={14} />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button variant="outline" size="sm" onClick={onIncrease}>
          <Plus size={14} />
        </Button>
      </div>

      <Button variant="outline" size="sm" className="text-error" onClick={onRemove}>
        <Trash2 size={14} />
      </Button>
    </div>
  );
}