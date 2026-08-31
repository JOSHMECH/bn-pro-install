import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Users,
  Wrench,
  CalendarClock,
  Settings,
  BarChart3,
  ShoppingBag,
  Plus,
  Edit3,
  Trash2,
  Search,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  XCircle,
  Lightbulb,
  Home,
  LogOut,
  Eye,
  Save,
  X,
  Star,
  Database,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { products as initialProducts, services as initialServices, categories } from "@/lib/catalog";
import type { Product, Service } from "@/lib/catalog";
import { cresco, type CrescoOrder, type CrescoBooking } from "@/lib/cresco";
import { naira } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Lumora" },
      {
        name: "description",
        content: "Internal dashboard for managing Lumora products, services, orders and customers.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type AdminTab =
  | "dashboard"
  | "products"
  | "services"
  | "orders"
  | "customers"
  | "bookings"
  | "settings";

const statusStyle: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "In transit": "bg-blue-100 text-blue-700 border-blue-200",
  Processing: "bg-amber-100 text-amber-700 border-amber-200",
  Pending: "bg-gray-100 text-gray-700 border-gray-200",
  Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Assigned: "bg-blue-100 text-blue-700 border-blue-200",
};

function StatusBadge({ status }: { status: string }) {
  const cls = statusStyle[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status === "Delivered" || status === "Confirmed" ? (
        <CheckCircle2 className="size-3" />
      ) : status === "Pending" ? (
        <Clock className="size-3" />
      ) : status === "Processing" || status === "Assigned" ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <XCircle className="size-3" />
      )}
      {status}
    </span>
  );
}

// Product edit modal
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
}) {
  const [form, setForm] = useState<Partial<Product>>(product ?? {});
  if (!product && product !== null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">
            {form.slug ? "Edit product" : "Add new product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "name", label: "Product name", type: "text" },
              { key: "brand", label: "Brand", type: "text" },
              { key: "price", label: "Price (₦)", type: "number" },
              { key: "oldPrice", label: "Original price (₦)", type: "number" },
              { key: "installFee", label: "Install fee (₦)", type: "number" },
              { key: "installTime", label: "Install time", type: "text" },
              { key: "warranty", label: "Warranty", type: "text" },
              { key: "badge", label: "Badge label", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  {label}
                </label>
                <input
                  type={type}
                  value={(form as Record<string, unknown>)[key] as string ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [key]: type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Category
              </label>
              <select
                value={form.category ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as Product["category"],
                  }))
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Summary
              </label>
              <textarea
                rows={3}
                value={form.summary ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)}>
            <Save className="size-4" /> Save product
          </Button>
        </div>
      </div>
    </div>
  );
}

// Service edit modal
function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Partial<Service> | null;
  onClose: () => void;
  onSave: (s: Partial<Service>) => void;
}) {
  const [form, setForm] = useState<Partial<Service>>(service ?? {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">
            {form.slug ? "Edit service" : "Add new service"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {[
            { key: "name", label: "Service name", type: "text" },
            { key: "from", label: "Starting price (₦)", type: "number" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "warranty", label: "Warranty", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                {label}
              </label>
              <input
                type={type}
                value={(form as Record<string, unknown>)[key] as string ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [key]: type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>
            <Save className="size-4" /> Save service
          </Button>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [productsList, setProductsList] = useState<Product[]>(initialProducts as Product[]);
  const [servicesList, setServicesList] = useState<Service[]>(initialServices);
  const [ordersList, setOrdersList] = useState<CrescoOrder[]>([]);
  const [bookingsList, setBookingsList] = useState<CrescoBooking[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null | undefined>(
    undefined,
  );
  const [editingService, setEditingService] = useState<Partial<Service> | null | undefined>(
    undefined,
  );
  const [productSearch, setProductSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [prods, servs, ords, bks] = await Promise.all([
          cresco.products.list(),
          cresco.services.list(),
          cresco.orders.list(),
          cresco.bookings.list(),
        ]);
        if (prods && prods.length > 0) setProductsList(prods);
        if (servs && servs.length > 0) setServicesList(servs);
        if (ords && ords.length > 0) setOrdersList(ords);
        if (bks && bks.length > 0) setBookingsList(bks);
      } catch (err) {
        console.warn("CrescoDB load fallback:", err);
      }
    }
    loadAdminData();
  }, []);

  const customersList = useMemo(() => {
    const map = new Map<
      string,
      { name: string; phone: string; city: string; orders: number; spend: number; joined: string }
    >();
    for (const o of ordersList) {
      const key = o.customerPhone || o.customerName;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customerName,
          phone: o.customerPhone,
          city: o.state || o.address || "Nigeria",
          orders: 1,
          spend: o.total || 0,
          joined: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent",
        });
      } else {
        const c = map.get(key)!;
        c.orders += 1;
        c.spend += o.total || 0;
      }
    }
    return Array.from(map.values());
  }, [ordersList]);

  const totalRevenue = useMemo(
    () => ordersList.reduce((acc, o) => acc + (o.total || 0), 0),
    [ordersList],
  );
  const openInstallations = useMemo(
    () =>
      bookingsList.filter(
        (b) => b.status === "Pending" || b.status === "Confirmed" || b.status === "In Progress",
      ).length,
    [bookingsList],
  );

  const revenueTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = new Date().getMonth();
    const last6 = Array.from({ length: 6 }).map((_, i) => {
      const idx = (currentMonthIdx - 5 + i + 12) % 12;
      return { month: months[idx], revenue: 0 };
    });
    for (const o of ordersList) {
      if (o.createdAt) {
        const m = new Date(o.createdAt).getMonth();
        const found = last6.find((x) => x.month === months[m]);
        if (found) found.revenue += o.total || 0;
      }
    }
    return last6;
  }, [ordersList]);

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "services", label: "Services", icon: Wrench },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "bookings", label: "Bookings", icon: CalendarClock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredProducts = productsList.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-card shadow-card lg:w-60">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 shadow-glow-gold">
            <Lightbulb className="size-3.5 text-white" />
          </span>
          <span className="hidden font-display text-base font-extrabold lg:block">
            lumora<span className="ml-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admin</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
              {tab === item.id && <ChevronRight className="ml-auto hidden size-4 lg:block" />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary"
          >
            <Home className="size-4 shrink-0" />
            <span className="hidden lg:block">View store</span>
          </Link>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary">
            <LogOut className="size-4 shrink-0" />
            <span className="hidden lg:block">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 shadow-card">
          <div>
            <h1 className="font-display text-lg font-bold capitalize">
              {tab === "dashboard" ? "Dashboard overview" : tab}
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden items-center gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-700 sm:inline-flex">
              <Database className="size-3 text-emerald-600" /> CrescoDB Connected
            </Badge>
            <button className="relative rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-secondary">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* ── Dashboard ─────────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    icon: TrendingUp,
                    label: "Total revenue",
                    value: naira(totalRevenue),
                    change: ordersList.length > 0 ? `${ordersList.length} orders` : "No sales yet",
                    up: ordersList.length > 0,
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: ShoppingBag,
                    label: "Orders",
                    value: `${ordersList.length}`,
                    change: ordersList.length > 0 ? "Live orders" : "0 pending",
                    up: ordersList.length > 0,
                    color: "bg-emerald-500/10 text-emerald-600",
                  },
                  {
                    icon: Wrench,
                    label: "Active bookings",
                    value: `${openInstallations}`,
                    change: openInstallations > 0 ? "In schedule" : "None scheduled",
                    up: openInstallations > 0,
                    color: "bg-amber-500/10 text-amber-600",
                  },
                  {
                    icon: Users,
                    label: "Customer accounts",
                    value: `${customersList.length}`,
                    change: customersList.length > 0 ? "Active clients" : "0 registered",
                    up: customersList.length > 0,
                    color: "bg-violet-500/10 text-violet-600",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`flex size-10 items-center justify-center rounded-xl ${s.color}`}>
                        <s.icon className="size-5" />
                      </span>
                      <span
                        className={`flex items-center gap-1 text-xs font-bold ${s.up ? "text-emerald-600" : "text-muted-foreground"}`}
                      >
                        {s.change}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-extrabold">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue chart */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-bold">Revenue trend</h2>
                    <p className="text-xs text-muted-foreground">
                      {ordersList.length > 0 ? "Monthly sales breakdown" : "Awaiting first completed order"}
                    </p>
                  </div>
                  <BarChart3 className="size-5 text-muted-foreground" />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueTrendData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                      tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v: number) => [naira(v), "Revenue"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-primary)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-border bg-card shadow-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="font-display font-bold">Recent orders</h2>
                  {ordersList.length > 0 && (
                    <button
                      onClick={() => setTab("orders")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View all →
                    </button>
                  )}
                </div>
                {ordersList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersList.slice(0, 4).map((o) => (
                          <TableRow key={o.ref}>
                            <TableCell className="font-medium">{o.ref}</TableCell>
                            <TableCell>{o.customerName}</TableCell>
                            <TableCell className="whitespace-nowrap font-semibold">
                              {naira(o.total)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={o.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingBag className="mx-auto size-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm font-medium">No orders recorded yet</p>
                    <p className="text-xs text-muted-foreground">
                      Customer checkouts and payment records will appear here in real time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Products ──────────────────────────────────────────────────── */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full max-w-sm rounded-xl border border-input bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button onClick={() => setEditingProduct({})}>
                  <Plus className="size-4" /> Add product
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Install fee</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((p) => (
                        <TableRow key={p.slug}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="size-10 rounded-lg object-cover border border-border/60 shrink-0"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground shrink-0">
                                  {p.brand[0]}
                                </div>
                              )}
                              <div>
                                <p className="max-w-[14rem] truncate font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.brand}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize">
                              {p.category.replace(/-/g, " ")}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            {naira(p.price)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {p.installFee ? naira(p.installFee) : "—"}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm font-medium">
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              {p.rating}
                              <span className="text-xs text-muted-foreground">
                                ({p.reviewCount})
                              </span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                              >
                                <Edit3 className="size-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(p.slug)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Delete confirm */}
              {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl">
                    <h3 className="font-display text-lg font-bold">Delete product?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This action cannot be undone. The product will be permanently removed.
                    </p>
                    <div className="mt-5 flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={async () => {
                          if (deleteConfirm) {
                            try {
                              await cresco.products.delete(deleteConfirm);
                              toast.success("Product deleted from CrescoDB");
                            } catch (e) {
                              console.warn("CrescoDB product delete fallback:", e);
                            }
                            setProductsList((prev) => prev.filter((p) => p.slug !== deleteConfirm));
                          }
                          setDeleteConfirm(null);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Services ──────────────────────────────────────────────────── */}
          {tab === "services" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {servicesList.length} services listed
                </p>
                <Button onClick={() => setEditingService({})}>
                  <Plus className="size-4" /> Add service
                </Button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Warranty</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servicesList.map((s) => (
                        <TableRow key={s.slug}>
                          <TableCell>
                            <p className="font-medium">{s.name}</p>
                            <p className="max-w-xs truncate text-xs text-muted-foreground">
                              {s.description}
                            </p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            {naira(s.from)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {s.duration}
                          </TableCell>
                          <TableCell className="max-w-[14rem] truncate text-sm text-muted-foreground">
                            {s.warranty}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingService(s)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                              >
                                <Edit3 className="size-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await cresco.services.delete(s.slug);
                                    toast.success("Service deleted from CrescoDB");
                                  } catch (e) {
                                    console.warn("CrescoDB service delete fallback:", e);
                                  }
                                  setServicesList((prev) =>
                                    prev.filter((sv) => sv.slug !== s.slug),
                                  );
                                }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ── Orders ────────────────────────────────────────────────────── */}
          {tab === "orders" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {ordersList.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersList.map((o) => (
                        <TableRow key={o.ref}>
                          <TableCell className="font-medium">{o.ref}</TableCell>
                          <TableCell>{o.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {Array.isArray(o.items) ? o.items.length : 1} items
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            {naira(o.total)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={o.status} />
                          </TableCell>
                          <TableCell>
                            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
                              <Eye className="size-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <ShoppingBag className="mx-auto size-10 text-muted-foreground/40" />
                  <h3 className="mt-3 font-display text-base font-bold">No customer orders yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    When customers place orders on the storefront, they will be tracked and managed here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Customers ─────────────────────────────────────────────────── */}
          {tab === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {customersList.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Lifetime spend</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customersList.map((c) => (
                        <TableRow key={c.phone || c.name}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {c.name
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")}
                              </span>
                              <span className="font-medium">{c.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm">{c.phone}</TableCell>
                          <TableCell className="text-muted-foreground">{c.city}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{c.orders}</Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-semibold">
                            {naira(c.spend)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{c.joined}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="mx-auto size-10 text-muted-foreground/40" />
                  <h3 className="mt-3 font-display text-base font-bold">No customer profiles yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Registered users and buyers will automatically populate this customer directory.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Bookings ──────────────────────────────────────────────────── */}
          {tab === "bookings" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {bookingsList.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ref</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & slot</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingsList.map((b) => (
                        <TableRow key={b.ref}>
                          <TableCell className="font-medium">{b.ref}</TableCell>
                          <TableCell>{b.customerName}</TableCell>
                          <TableCell className="capitalize">{b.serviceSlug.replace(/-/g, " ")}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarClock className="size-3.5 text-primary" />
                              {b.date} · {b.slot}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={b.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
                                <Edit3 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CalendarClock className="mx-auto size-10 text-muted-foreground/40" />
                  <h3 className="mt-3 font-display text-base font-bold">No technician bookings yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Scheduled appliance installations and maintenance requests will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Settings ──────────────────────────────────────────────────── */}
          {tab === "settings" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Store info */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-base font-bold">Store information</h2>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Store name", value: "Lumora" },
                    { label: "Tagline", value: "Illuminate Your Space. Build Your World." },
                    { label: "Contact phone", value: "+234 803 000 0000" },
                    { label: "Contact email", value: "hello@lumora.ng" },
                    { label: "Address", value: "Lagos Island, Lagos, Nigeria" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                        {label}
                      </label>
                      <input
                        defaultValue={value}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                  <Button className="mt-2">
                    <Save className="size-4" /> Save changes
                  </Button>
                </div>
              </div>

              {/* Feature flags */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-base font-bold">Feature flags</h2>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Flash sale banner", desc: "Show countdown timer on homepage", on: true },
                    {
                      label: "Newsletter popup",
                      desc: "Show email capture after 30s",
                      on: false,
                    },
                    { label: "WhatsApp FAB", desc: "Floating WhatsApp button", on: true },
                    { label: "Installation booking", desc: "Allow customers to book installs", on: true },
                    { label: "Guest checkout", desc: "Allow checkout without account", on: true },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{f.label}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                      <button
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          f.on ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
                            f.on ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement text */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
                <h2 className="font-display text-base font-bold">Announcement bar</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage the scrolling text in the announcement banner at the top of the site.
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    "Same-day delivery in Lagos",
                    "Certified technicians nationwide",
                    "12-month workmanship warranty",
                    "4,800+ orders delivered",
                    "Pay by card, transfer or USSD",
                    "Trusted since 2014",
                  ].map((msg, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        defaultValue={msg}
                        className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" /> Add message
                  </Button>
                  <Button size="sm">
                    <Save className="size-4" /> Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product modal */}
      {editingProduct !== undefined && editingProduct !== null && (
        <ProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(undefined)}
          onSave={async (updated) => {
            if (updated.slug) {
              try {
                await cresco.products.update(updated.slug, updated);
                toast.success("Product updated in CrescoDB");
              } catch (e) {
                console.warn("CrescoDB product update fallback:", e);
              }
              setProductsList((prev) =>
                prev.map((p) => (p.slug === updated.slug ? { ...p, ...updated } : p)),
              );
            } else {
              const newSlug = (updated.name ?? "product")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              const newProd: Product = {
                slug: newSlug,
                name: updated.name ?? "New Product",
                brand: updated.brand ?? "Lumora",
                category: updated.category ?? "home-appliances",
                price: updated.price ?? 0,
                warranty: updated.warranty ?? "1 Year",
                summary: updated.summary ?? "",
                specs: updated.specs ?? [],
                rating: 5,
                reviewCount: 1,
                image: updated.image ?? "",
                ...updated,
              };
              try {
                await cresco.products.create(newProd);
                toast.success("Product created in CrescoDB");
              } catch (e) {
                console.warn("CrescoDB product create fallback:", e);
              }
              setProductsList((prev) => [...prev, newProd]);
            }
            setEditingProduct(undefined);
          }}
        />
      )}
      {editingProduct === null && (
        <ProductModal
          product={{}}
          onClose={() => setEditingProduct(undefined)}
          onSave={async (updated) => {
            const newSlug = (updated.name ?? "product")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            const newProd: Product = {
              slug: newSlug,
              name: updated.name ?? "New Product",
              brand: updated.brand ?? "Lumora",
              category: updated.category ?? "home-appliances",
              price: updated.price ?? 0,
              warranty: updated.warranty ?? "1 Year",
              summary: updated.summary ?? "",
              specs: updated.specs ?? [],
              rating: 5,
              reviewCount: 1,
              image: updated.image ?? "",
              ...updated,
            };
            try {
              await cresco.products.create(newProd);
              toast.success("Product created in CrescoDB");
            } catch (e) {
              console.warn("CrescoDB product create fallback:", e);
            }
            setProductsList((prev) => [...prev, newProd]);
            setEditingProduct(undefined);
          }}
        />
      )}

      {/* Service modal */}
      {editingService !== undefined && (
        <ServiceModal
          service={editingService ?? {}}
          onClose={() => setEditingService(undefined)}
          onSave={async (updated) => {
            if (updated.slug) {
              try {
                await cresco.services.update(updated.slug, {
                  name: updated.name,
                  startingPrice: updated.from,
                  duration: updated.duration,
                  warranty: updated.warranty,
                  tagline: updated.description,
                  highlights: updated.includes,
                  image: updated.image,
                });
                toast.success("Service updated in CrescoDB");
              } catch (e) {
                console.warn("CrescoDB service update fallback:", e);
              }
              setServicesList((prev) =>
                prev.map((s) => (s.slug === updated.slug ? { ...s, ...updated } : s)),
              );
            } else {
              const newSlug = (updated.name ?? "service")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              const newServ: Service = {
                ...(updated as Service),
                slug: newSlug,
                includes: updated.includes ?? [],
              };
              try {
                await cresco.services.create({
                  slug: newSlug,
                  name: updated.name ?? "New Service",
                  startingPrice: updated.from ?? 0,
                  duration: updated.duration ?? "1 – 2 hours",
                  warranty: updated.warranty ?? "3 months warranty",
                  tagline: updated.description ?? "",
                  highlights: updated.includes ?? [],
                  image: updated.image ?? "",
                });
                toast.success("Service created in CrescoDB");
              } catch (e) {
                console.warn("CrescoDB service create fallback:", e);
              }
              setServicesList((prev) => [...prev, newServ]);
            }
            setEditingService(undefined);
          }}
        />
      )}
    </div>
  );
}
