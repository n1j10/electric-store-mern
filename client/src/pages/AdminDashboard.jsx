import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Trash2
} from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getAdminStats,
  getOrders,
  getProducts,
  updateOrderStatus,
  updateProduct
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const sideNav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inventory", icon: Package },
  { label: "Orders", icon: ShoppingBag },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "Peripherals",
  brand: "TECH_ARTIFACT",
  stock: "",
  image: ""
};

export function AdminDashboard() {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState({ totalRevenue: 0, activeOrders: 0, lowStockAlerts: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, productData, orderData] = await Promise.all([
        getAdminStats(token),
        getProducts({ limit: 100, sort: "newest" }),
        getOrders(token)
      ]);
      setStats(statsData);
      setProducts(productData.items || []);
      setOrders(orderData || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleProducts = useMemo(
    () =>
      products.filter((item) =>
        `${item.name} ${item.category} ${item.brand}`.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const resetForm = () => {
    setProductForm(emptyProduct);
    setEditingId("");
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setError("");
    const payload = {
      name: productForm.name,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, "-"),
      description: productForm.description || "TECH_ARTIFACT item",
      price: Number(productForm.price || 0),
      category: productForm.category,
      brand: productForm.brand,
      stock: Number(productForm.stock || 0),
      rating: 4.5,
      reviewCount: 0,
      images: [
        productForm.image ||
          "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80"
      ],
      specs: {
        processor: "N/A",
        gpu: "N/A",
        ram: "N/A",
        storage: "N/A",
        display: "N/A",
        battery: "N/A"
      }
    };

    try {
      if (editingId) {
        await updateProduct(token, editingId, payload);
      } else {
        await createProduct(token, payload);
      }
      resetForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to save product.");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setProductForm({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: String(item.price),
      category: item.category,
      brand: item.brand,
      stock: String(item.stock),
      image: item.images?.[0] || ""
    });
  };

  const onDelete = async (id) => {
    try {
      await deleteProduct(token, id);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Delete failed.");
    }
  };

  const onStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(token, orderId, status);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Status update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[250px_1fr] md:px-6">
        <aside className="rounded-2xl bg-primary-container p-5 text-white">
          <h1 className="font-manrope text-2xl font-extrabold">TECH_ARTIFACT</h1>
          <p className="mt-1 text-xs text-slate-300">Admin Console / Technical Operations</p>
          <nav className="mt-8 space-y-2">
            {sideNav.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
                <item.icon size={15} />
                {item.label}
              </div>
            ))}
          </nav>
          <button onClick={logout} className="mt-10 flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <LogOut size={16} /> Logout
          </button>
        </aside>

        <main className="space-y-6">
          <header className="rounded-2xl border border-outline-variant/50 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              TECH_ARTIFACT / Global Inventory Node
            </p>
            <h2 className="mt-2 font-manrope text-2xl font-extrabold">Dashboard</h2>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-outline-variant/50 bg-white p-4">
              <p className="text-sm text-on-surface-variant">Total Revenue</p>
              <p className="mt-2 font-manrope text-2xl font-extrabold">${stats.totalRevenue.toLocaleString()}</p>
            </article>
            <article className="rounded-xl border border-outline-variant/50 bg-white p-4">
              <p className="text-sm text-on-surface-variant">Active Orders</p>
              <p className="mt-2 font-manrope text-2xl font-extrabold">{stats.activeOrders}</p>
            </article>
            <article className="rounded-xl border border-outline-variant/50 bg-white p-4">
              <p className="text-sm text-on-surface-variant">Stock Health Alerts</p>
              <p className="mt-2 font-manrope text-2xl font-extrabold">{stats.lowStockAlerts}</p>
            </article>
          </section>

          <section className="rounded-xl border border-outline-variant/50 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-manrope text-xl font-bold">Artifact Inventory</h3>
              <Input
                placeholder="Search inventory"
                className="max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <form onSubmit={submitProduct} className="grid gap-2 rounded-xl bg-surface-container-low p-3 md:grid-cols-4">
              <Input
                placeholder="Name"
                value={productForm.name}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                placeholder="Slug"
                value={productForm.slug}
                onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <Input
                placeholder="Category"
                value={productForm.category}
                onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
              />
              <Input
                placeholder="Brand"
                value={productForm.brand}
                onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))}
              />
              <Input
                placeholder="Price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
              <Input
                placeholder="Stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                required
              />
              <Input
                placeholder="Image URL"
                value={productForm.image}
                onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
              />
              <Input
                placeholder="Description"
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex gap-2 md:col-span-4">
                <Button type="submit" variant="gradient">
                  {editingId ? "Update Artifact" : "+ New Artifact"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="text-left text-on-surface-variant">
                  <tr>
                    <th className="pb-2">Artifact</th>
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((item) => (
                    <tr key={item._id} className="border-t border-outline-variant/40">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3 text-xs">{item._id.slice(-6)}</td>
                      <td className="py-3">
                        <div className="h-2 w-28 rounded-full bg-surface-container">
                          <div
                            className="h-2 rounded-full bg-secondary"
                            style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3">{item.category}</td>
                      <td className="py-3">${item.price}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-error" onClick={() => onDelete(item._id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-on-surface-variant">
              Showing {visibleProducts.length} of {products.length} precision artifacts
            </p>
          </section>

          <section className="rounded-xl border border-outline-variant/50 bg-white p-5">
            <h3 className="font-manrope text-xl font-bold">Orders</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="text-left text-on-surface-variant">
                  <tr>
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Created</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-outline-variant/40">
                      <td className="py-3 font-medium">{order.orderId}</td>
                      <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">{order.items.length}</td>
                      <td className="py-3">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order._id, e.target.value)}
                          className="rounded-lg border border-outline-variant bg-white px-2 py-1 text-sm"
                        >
                          <option value="pending">pending</option>
                          <option value="processing">processing</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {loading && <p className="text-sm text-on-surface-variant">Loading admin data...</p>}
          {error && <p className="text-sm text-error">{error}</p>}
        </main>
      </div>
    </div>
  );
}
