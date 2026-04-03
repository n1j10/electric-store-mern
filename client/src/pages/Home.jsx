import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";

const categories = [
  {
    title: "Laptops",
    description: "Portable power engineered for deep work.",
    image:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Mobile",
    description: "Always-on computational tools in your pocket.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Audio",
    description: "Studio clarity for calls, focus, and flow.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
  }
];

export function Home() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    getProducts({ limit: 3 }).then((data) => setTrending(data.items)).catch(() => setTrending([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <section className="mt-8 overflow-hidden rounded-2xl bg-primary-container px-6 py-12 text-white md:px-12 md:py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Flagship Collection</p>
        <h1 className="mt-4 max-w-2xl font-manrope text-4xl font-extrabold leading-tight md:text-6xl">
          THE NEURAL ARTIFACT X
        </h1>
        <p className="mt-5 max-w-xl text-slate-300">
          Deploy elite-grade technology artifacts with secure architecture, engineered materials,
          and zero-latency interaction.
        </p>
        <Link to="/products" className="mt-8 inline-flex">
          <Button variant="gradient" size="lg" className="gap-2">
            Shop Now <ArrowRight size={18} />
          </Button>
        </Link>
      </section>

      <section className="mt-14">
        <h2 className="font-manrope text-2xl font-bold">Explore by Category</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {categories.map((item) => (
            <Link key={item.title} to={`/products?category=${item.title}`} className="group">
              <article className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container-high">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="font-manrope text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant">{item.description}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-manrope text-2xl font-bold">Trending Artifacts</h2>
          <Link to="/products" className="text-sm font-semibold text-secondary">
            View all
          </Link>
        </div>


        <div className="grid gap-5 md:grid-cols-3">
          {trending.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      </section>

      <section className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-container to-slate-900 px-6 py-12 text-white md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Precision Logistics</p>
        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-manrope text-3xl font-bold">Next-day dispatch for all core artifacts</h3>
            <p className="mt-2 text-slate-300">
              Certified packaging, encrypted checkout, and 1-year technical guarantee.
            </p>
          </div>
          <Link to="/checkout">
            <Button variant="gradient" size="lg">
              Start Checkout
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
