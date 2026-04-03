import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { getProduct, getProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";

const mockReviews = [
  {
    author: "Samir A.",
    text: "Thermals are excellent under heavy 3D workloads, and the keyboard travel is precise."
  },
  {
    author: "Leila R.",
    text: "Battery longevity exceeded expectations in daily production sessions."
  },
  {
    author: "Noah T.",
    text: "Display calibration accuracy is fantastic out of the box."
  }
];

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProduct(id).then((result) => {
      setProduct(result);
      setActiveImage(result.images?.[0] || "");
      getProducts({ category: result.category, limit: 4 }).then((data) => {
        setRelated(data.items.filter((item) => item._id !== result._id).slice(0, 4));
      });
    });
  }, [id]);

  if (!product) {
    return <div className="mx-auto mt-12 max-w-7xl px-4 text-sm text-on-surface-variant">Loading...</div>;
  }

  const onAddToCart = () => addItem(product, quantity);
  const onBuyNow = () => {
    addItem(product, quantity);
    navigate("/checkout");
  };

  const specs = [
    ["Processor", product.specs?.processor],
    ["GPU", product.specs?.gpu],
    ["RAM", product.specs?.ram],
    ["Storage", product.specs?.storage],
    ["Display", product.specs?.display],
    ["Battery", product.specs?.battery]
  ];

  return (
    <div className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
      <p className="text-sm text-on-surface-variant">
        <Link to="/products" className="hover:text-primary">
          Collections
        </Link>{" "}
        &gt; {product.category} &gt; {product.name}
      </p>

      <section className="mt-5 grid gap-8 md:grid-cols-2">
        <div>
          <img src={activeImage} alt={product.name} className="h-[360px] w-full rounded-2xl object-cover md:h-[460px]" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images?.map((image) => (
              <button key={image} onClick={() => setActiveImage(image)}>
                <img
                  src={image}
                  alt={product.name}
                  className={`h-20 w-full rounded-lg object-cover ${
                    activeImage === image ? "ring-2 ring-secondary" : ""
                  }`}
                />
              </button>
            ))}
          </div>
        </div>





        <div>
          <h1 className="font-manrope text-3xl font-extrabold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            {product.rating?.toFixed(1)} ({product.reviewCount} reviews)
          </div>
          <p className="mt-4 text-on-surface-variant">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
            {specs.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase text-on-surface-variant">{label}</p>
                <p className="font-medium">{value || "N/A"}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-3xl font-bold">${product.price.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-3">
            <button
              className="grid h-11 w-11 place-items-center rounded-xl border border-outline-variant bg-white"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              className="grid h-11 w-11 place-items-center rounded-xl border border-outline-variant bg-white"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="gradient" size="lg" onClick={onBuyNow}>
              Buy Now
            </Button>
            <Button variant="outline" size="lg" onClick={onAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </section>





      <section className="mt-14">
        <h2 className="font-manrope text-2xl font-bold">Community Verified</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {mockReviews.map((review) => (
            <article key={review.author} className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
              <p className="text-sm text-on-surface-variant">"{review.text}"</p>
              <p className="mt-3 font-medium">{review.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-manrope text-2xl font-bold">The Ecosystem</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
