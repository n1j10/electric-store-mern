import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { Input } from "@/components/ui/Input";

const categories = ["Laptops", "Workstations", "Peripherals", "Audio", "Storage", "Mobile"];
const brands = ["Apple", "Samsung", "Dell Pro", "Razer", "TECH_ARTIFACT", "Vector", "Aural"];

export function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [isLoading, setIsLoading] = useState(false);





  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || 1);
  const maxPrice = Number(searchParams.get("maxPrice") || 3000);

  useEffect(() => {
    setIsLoading(true);
    getProducts({
      search,
      category,
      brand,
      maxPrice,
      sort,
      page,
      limit: 6
    }).then((result) => setData(result))
      .finally(() => setIsLoading(false));
  }, [search, category, brand, maxPrice, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== "page") {
      next.set("page", "1");
    }
    setSearchParams(next);
  };

  const filtersSummary = useMemo(() => {
    const out = [];
    if (category) out.push(category);
    if (brand) out.push(brand);
    if (search) out.push(`"${search}"`);
    return out.join(" · ");
  }, [category, brand, search]);

  return (
    <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 md:grid-cols-[260px_1fr] md:px-6">
      <aside className="space-y-6 rounded-xl border border-outline-variant/50 bg-surface-container-low p-5">
        <div>
          <h3 className="font-manrope font-bold">Search</h3>
          <Input
            value={search}
            onChange={(event) => updateParam("search", event.target.value)}
            className="mt-3"
            placeholder="Find artifact..."
          />
        </div>

        <div>
          <h3 className="font-manrope font-bold">Categories</h3>
          <div className="mt-3 space-y-2 text-sm">
            <button
              onClick={() => updateParam("category", "")}
              className={`block w-full rounded-lg px-3 py-2 text-left ${
                !category ? "bg-primary text-white" : "hover:bg-surface-container"
              }`}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => updateParam("category", item)}
                className={`block w-full rounded-lg px-3 py-2 text-left ${
                  category === item ? "bg-primary text-white" : "hover:bg-surface-container"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-manrope font-bold">Brands</h3>
          <select
            value={brand}
            onChange={(event) => updateParam("brand", event.target.value)}
            className="mt-3 h-11 w-full rounded-xl border border-outline-variant bg-white px-3 text-sm"
          >
            <option value="">All Brands</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-manrope font-bold">Price Range</h3>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={maxPrice}
            onChange={(event) => updateParam("maxPrice", event.target.value)}
            className="mt-4 w-full"
          />
          <p className="mt-1 text-sm text-on-surface-variant">Up to ${maxPrice.toLocaleString()}</p>
        </div>
      </aside>













      <section>
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-outline-variant/50 bg-surface-container-low p-5 md:flex-row md:items-center">
          <div>
            <h1 className="font-manrope text-2xl font-extrabold">Precision Workstations</h1>
            <p className="text-sm text-on-surface-variant">
              {filtersSummary || "All artifacts"} · {data.pagination.total || 0} results
            </p>
          </div>

          <select
            value={sort}
            onChange={(event) => updateParam("sort", event.target.value)}
            className="h-11 rounded-xl border border-outline-variant bg-white px-3 text-sm"
          >
            <option value="">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
          </select>
        </div>

        {isLoading ? (
          <div className="mt-8 text-sm text-on-surface-variant">Loading products...</div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
                className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-on-surface-variant">
                Page {page} of {data.pagination.totalPages || 1}
              </span>
              <button
                disabled={page >= (data.pagination.totalPages || 1)}
                onClick={() => updateParam("page", String(page + 1))}
                className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
