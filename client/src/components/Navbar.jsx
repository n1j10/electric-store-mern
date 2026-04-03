import { NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Collections", to: "/products" },
  { label: "New Arrivals", to: "/products?sort=newest" },
  { label: "Specials", to: "/products?sort=price_desc" }
];

export function Navbar() {
  const { itemCount } = useCart();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onSearch = (event) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface-container-lowest/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <NavLink to="/" className="font-manrope text-lg font-extrabold tracking-tight text-primary">
          TECH_ARTIFACT
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form onSubmit={onSearch} className="hidden items-center gap-2 md:flex">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search artifacts..."
              className="h-10 w-56 rounded-xl border border-outline-variant bg-surface-container px-3 text-sm outline-none focus:border-secondary"
            />
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high">
              <Search size={18} />
            </button>
          </form>

          <NavLink
            to="/admin/login"
            className="grid h-10 w-10 place-items-center rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high"
          >
            <User size={18} />
          </NavLink>

          <NavLink
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high"
          >
            <ShoppingCart size={18} />
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-secondary px-1 text-center text-xs font-semibold text-white">
              {itemCount}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
