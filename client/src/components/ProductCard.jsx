import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <Card className="flex h-full flex-col p-0">
      <Link to={`/products/${product.slug}`} className="overflow-hidden rounded-t-xl">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-52 w-full object-cover transition duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-on-surface-variant">{product.category}</p>
        <Link to={`/products/${product.slug}`} className="mt-1 font-manrope text-lg font-bold">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-1 text-sm text-on-surface-variant">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          {product.rating?.toFixed(1)} ({product.reviewCount})
        </div>

        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold">${product.price.toLocaleString()}</p>
          <Button size="sm" variant="gradient" onClick={() => addItem(product, 1)}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
