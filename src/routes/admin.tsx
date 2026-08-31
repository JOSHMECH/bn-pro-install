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
} from "lucide-react";
import { useState } from "react";
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

const revenueData = [
  { month: "Mar", revenue: 8200000 },
  { month: "Apr", revenue: 9800000 },
  { month: "May", revenue: 11200000 },
  { month: "Jun", revenue: 10500000 },
  { month: "Jul", revenue: 13800000 },
  { month: "Aug", revenue: 14850000 },
];

const orders = [
  {
    id: "ORD-5512",
    customer: "Adaeze Okafor",
    items: 3,
    total: 1240000,
    status: "Delivered",
    date: "28 Aug 2026",
  },
  {
    id: "ORD-5513",
    customer: "Musa Bello",
    items: 1,
    total: 585000,
    status: "In transit",
    date: "29 Aug 2026",
  },
  {
    id: "ORD-5514",
    customer: "Chidinma Eze",
    items: 2,
    total: 895000,
    status: "Processing",
    date: "30 Aug 2026",
  },
  {
    id: "ORD-5515",
    customer: "Fatima Yusuf",
    items: 4,
    total: 348000,
    status: "Pending",
    date: "30 Aug 2026",
  },
  {
    id: "ORD-5516",
    customer: "Emeka Okonkwo",
    items: 1,
    total: 265000,
    status: "Delivered",
    date: "27 Aug 2026",
  },
];

const bookings = [
  {
    ref: "BK-2291",
    customer: "Adaeze Okafor",
    service: "AC Installation",
    date: "18 Aug 2026",
    slot: "10:00 AM – 12:00 PM",
    status: "Confirmed",
  },
  {
    ref: "BK-2293",
    customer: "Musa Bello",
    service: "Inverter Setup",
    date: "19 Aug 2026",
    slot: "8:00 AM – 10:00 AM",
    status: "Pending",
  },
  {
    ref: "BK-2295",
    customer: "Chuka Eze",
    service: "TV Wall Mounting",
    date: "20 Aug 2026",
    slot: "2:00 PM – 4:00 PM",
    status: "Assigned",
  },
  {
    ref: "BK-2298",
    customer: "Fatima Yusuf",
    service: "House Wiring",
    date: "22 Aug 2026",
    slot: "8:00 AM – 10:00 AM",
    status: "Pending",
  },
  {
    ref: "BK-2301",
    customer: "Tunde Adeyemi",
    service: "CCTV Installation",
    date: "23 Aug 2026",
    slot: "10:00 AM – 2:00 PM",
    status: "Confirmed",
  },
];

const customers = [
  {
    name: "Adaeze Okafor",
    phone: "+234 803 111 2233",
    city: "Lekki, Lagos",
    orders: 4,
    spend: 1860000,
    joined: "Jan 2025",
  },
  {
    name: "Musa Bello",
    phone: "+234 806 555 7788",
    city: "Wuse, Abuja",
    orders: 2,
    spend: 1620000,
    joined: "Mar 2025",
  },
  {
    name: "Chidinma Eze",
    phone: "+234 812 909 3344",
    city: "GRA, Port Harcourt",
    orders: 1,
    spend: 516000,
    joined: "Jun 2025",
  },
  {
    name: "Fatima Yusuf",
    phone: "+234 809 220 1188",
    city: "Kano",
    orders: 3,
    spend: 940000,
    joined: "Feb 2025",
  },
  {
    name: "Emeka Okonkwo",
    phone: "+234 701 445 6622",
    city: "Enugu",
    orders: 2,
    spend: 625000,
    joined: "May 2025",
  },
];

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
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null | undefined>(
    undefined,
  );
  const [editingService, setEditingService] = useState<Partial<Service> | null | undefined>(
    undefined,
  );
  const [productSearch, setProductSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
            <Badge variant="outline" className="hidden border-amber-300 bg-amber-50 text-amber-700 sm:inline-flex">
              Demo mode
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
                    label: "Revenue (30 days)",
                    value: naira(14_850_000),
                    change: "+12.4%",
                    up: true,
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: ShoppingBag,
                    label: "Orders this month",
                    value: "184",
                    change: "+8.1%",
                    up: true,
                    color: "bg-emerald-500/10 text-emerald-600",
                  },
                  {
                    icon: Wrench,
                    label: "Open installations",
                    value: "12",
                    change: "-3",
                    up: false,
                    color: "bg-amber-500/10 text-amber-600",
                  },
                  {
                    icon: Users,
                    label: "Total customers",
                    value: "486",
                    change: "+24",
                    up: true,
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
                        className={`flex items-center gap-1 text-xs font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {s.up ? (
                          <ArrowUpRight className="size-3.5" />
                        ) : (
                          <ArrowDownRight className="size-3.5" />
                        )}
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
                    <p className="text-xs text-muted-foreground">Last 6 months</p>
                  </div>
                  <BarChart3 className="size-5 text-muted-foreground" />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueData} barSize={32}>
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
                  <button
                    onClick={() => setTab("orders")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View all →
                  </button>
                </div>
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
                      {orders.slice(0, 4).map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.id}</TableCell>
                          <TableCell>{o.customer}</TableCell>
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
                        onClick={() => {
                          setProductsList((prev) => prev.filter((p) => p.slug !== deleteConfirm));
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
                                onClick={() =>
                                  setServicesList((prev) =>
                                    prev.filter((sv) => sv.slug !== s.slug),
                                  )
                                }
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
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.id}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell className="text-muted-foreground">{o.items} items</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold">
                          {naira(o.total)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {o.date}
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
            </div>
          )}

          {/* ── Customers ─────────────────────────────────────────────────── */}
          {tab === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
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
                    {customers.map((c) => (
                      <TableRow key={c.name}>
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
            </div>
          )}

          {/* ── Bookings ──────────────────────────────────────────────────── */}
          {tab === "bookings" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
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
                    {bookings.map((b) => (
                      <TableRow key={b.ref}>
                        <TableCell className="font-medium">{b.ref}</TableCell>
                        <TableCell>{b.customer}</TableCell>
                        <TableCell>{b.service}</TableCell>
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
          onSave={(updated) => {
            if (updated.slug) {
              setProductsList((prev) =>
                prev.map((p) => (p.slug === updated.slug ? { ...p, ...updated } : p)),
              );
            } else {
              const newSlug = (updated.name ?? "product")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              setProductsList((prev) => [
                ...prev,
                {
                  ...(updated as Product),
                  slug: newSlug,
                  rating: 0,
                  reviewCount: 0,
                },
              ]);
            }
            setEditingProduct(undefined);
          }}
        />
      )}
      {editingProduct === null && (
        <ProductModal
          product={{}}
          onClose={() => setEditingProduct(undefined)}
          onSave={(updated) => {
            const newSlug = (updated.name ?? "product")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            setProductsList((prev) => [
              ...prev,
              { ...(updated as Product), slug: newSlug, rating: 0, reviewCount: 0 },
            ]);
            setEditingProduct(undefined);
          }}
        />
      )}

      {/* Service modal */}
      {editingService !== undefined && (
        <ServiceModal
          service={editingService ?? {}}
          onClose={() => setEditingService(undefined)}
          onSave={(updated) => {
            if (updated.slug) {
              setServicesList((prev) =>
                prev.map((s) => (s.slug === updated.slug ? { ...s, ...updated } : s)),
              );
            } else {
              const newSlug = (updated.name ?? "service")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              setServicesList((prev) => [
                ...prev,
                { ...(updated as Service), slug: newSlug, includes: [] },
              ]);
            }
            setEditingService(undefined);
          }}
        />
      )}
    </div>
  );
}
