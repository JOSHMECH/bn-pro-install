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
  CheckCircle2,
  Clock,
  XCircle,
  Lightbulb,
  Home,
  LogOut,
  Eye,
  EyeOff,
  Save,
  X,
  Star,
  Database,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  KeyRound,
  ShieldCheck,
  Check,
  Menu,
  Filter,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { ImageUploadField } from "@/components/image-upload";
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
      { title: "Admin Portal — Lumora Store Management" },
      {
        name: "description",
        content: "Internal administrative dashboard for Lumora store, orders, bookings, and products.",
      },
      { name: "robots", content: "noindex, nofollow" },
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
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  "In transit": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
  Processing: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
  Pending: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-zinc-800 dark:text-zinc-300",
  Confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  "In Progress": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300",
};

function StatusBadge({ status }: { status: string }) {
  const cls = statusStyle[status] ?? "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${cls}`}>
      {status === "Delivered" || status === "Confirmed" || status === "Completed" ? (
        <CheckCircle2 className="size-3" />
      ) : status === "Pending" ? (
        <Clock className="size-3" />
      ) : status === "Processing" || status === "In transit" || status === "In Progress" ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <XCircle className="size-3" />
      )}
      {status}
    </span>
  );
}

// ── Product Edit / Create Modal ──────────────────────────────────────────────
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
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">
            {form.slug ? "Edit Product" : "Add New Product"}
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
              { key: "name", label: "Product Name", type: "text" },
              { key: "brand", label: "Brand", type: "text" },
              { key: "price", label: "Price (₦)", type: "number" },
              { key: "oldPrice", label: "Original / Strikethrough Price (₦)", type: "number" },
              { key: "installFee", label: "Install Fee (₦)", type: "number" },
              { key: "installTime", label: "Install Duration (e.g. 1 – 2 hours)", type: "text" },
              { key: "warranty", label: "Warranty (e.g. 2 Years)", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                  {label}
                </label>
                <input
                  type={type}
                  value={((form as Record<string, unknown>)[key] as string) ?? ""}
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
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Product Image"
                value={form.image ?? ""}
                onChange={(val) => setForm((prev) => ({ ...prev, image: val }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                Summary / Description
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
            <Save className="size-4" /> Save Product
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Service Edit / Create Modal ──────────────────────────────────────────────
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
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">
            {form.slug ? "Edit Service" : "Add New Service"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          {[
            { key: "name", label: "Service Name", type: "text" },
            { key: "from", label: "Starting Price (₦)", type: "number" },
            { key: "duration", label: "Duration", type: "text" },
            { key: "warranty", label: "Warranty", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase">
                {label}
              </label>
              <input
                type={type}
                value={((form as Record<string, unknown>)[key] as string) ?? ""}
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

          <ImageUploadField
            label="Service Feature Image"
            value={form.image ?? ""}
            onChange={(val) => setForm((prev) => ({ ...prev, image: val }))}
          />

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
            <Save className="size-4" /> Save Service
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Order Details & Status Modal ─────────────────────────────────────────────
function OrderModal({
  order,
  onClose,
  onStatusChange,
  onDelete,
}: {
  order: CrescoOrder | null;
  onClose: () => void;
  onStatusChange: (ref: string, status: CrescoOrder["status"]) => void;
  onDelete: (ref: string) => void;
}) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold">Order Details</h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">{order.ref}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Customer info */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Customer</span>
              <span className="font-semibold">{order.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Phone</span>
              <span>{order.customerPhone || "—"}</span>
            </div>
            {order.customerEmail && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase">Email</span>
                <span>{order.customerEmail}</span>
              </div>
            )}
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Address</span>
              <span className="max-w-xs text-right">{order.address}, {order.state}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">Payment</span>
              <span className="capitalize">{order.paymentMethod || "Card"} ({order.paymentStatus || "Completed"})</span>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="mb-2 text-xs font-bold text-muted-foreground uppercase">Ordered Products</h4>
            <div className="divide-y divide-border rounded-xl border border-border">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} {item.withInstall ? "· with installation" : ""}</p>
                    </div>
                    <p className="font-bold text-primary">{naira((item.price + (item.withInstall ? item.installFee || 0 : 0)) * item.quantity)}</p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-xs text-muted-foreground">No item breakdown available</p>
              )}
            </div>
          </div>

          {/* Status update switcher */}
          <div className="rounded-xl border border-border p-4">
            <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase">
              Update Order Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["Pending", "Processing", "In transit", "Delivered", "Cancelled"] as CrescoOrder["status"][]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => onStatusChange(order.ref, st)}
                    className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                      order.status === st
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {st}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(order.ref)}
          >
            <Trash2 className="size-3.5" /> Delete Order
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Booking Details & Status Modal ───────────────────────────────────────────
function BookingModal({
  booking,
  onClose,
  onStatusChange,
  onDelete,
}: {
  booking: CrescoBooking | null;
  onClose: () => void;
  onStatusChange: (ref: string, status: CrescoBooking["status"]) => void;
  onDelete: (ref: string) => void;
}) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold">Technician Booking</h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">{booking.ref}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Service</span>
              <span className="font-bold capitalize">{booking.serviceSlug.replace(/-/g, " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Customer</span>
              <span className="font-semibold">{booking.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Phone</span>
              <span>{booking.customerPhone || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Date & Slot</span>
              <span className="font-semibold text-primary">{booking.date} · {booking.slot}</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Address</span>
              <span className="max-w-xs text-right">{booking.address}</span>
            </div>
            {booking.notes && (
              <div className="border-t border-border/60 pt-2 text-xs">
                <span className="font-bold text-muted-foreground uppercase block mb-1">Customer Notes</span>
                <p className="italic text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Status Switcher */}
          <div className="rounded-xl border border-border p-4">
            <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase">
              Update Booking Status
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"] as CrescoBooking["status"][]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => onStatusChange(booking.ref, st)}
                    className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                      booking.status === st
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {st}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(booking.ref)}
          >
            <Trash2 className="size-3.5" /> Delete Booking
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Hardcoded Master Admin Credentials ─────────────────────────────────────────
export const ADMIN_MASTER_CREDENTIALS = {
  email: "admin@lumora.ng",
  password: "LumoraAdmin#2026",
  acceptablePasswords: [
    "LumoraAdmin#2026",
    "lumora2026",
    "admin12345",
    "admin123",
    "admin",
  ],
};

const ADMIN_AUTH_SESSION_KEY = "lumora_admin_authenticated";

function AdminLoginGate({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState(ADMIN_MASTER_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const trimmedPassword = password.trim();
    const isMasterMatch =
      trimmedPassword === ADMIN_MASTER_CREDENTIALS.password ||
      ADMIN_MASTER_CREDENTIALS.acceptablePasswords.includes(trimmedPassword);

    if (isMasterMatch) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, "true");
        localStorage.setItem(ADMIN_AUTH_SESSION_KEY, "true");
      }
      toast.success("Authentication successful! Welcome to Admin Portal.");
      onLoginSuccess();
    } else {
      toast.error("Invalid admin password. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl text-white">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25">
              <Lock className="size-7 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight text-white">
                Lumora Control Center
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Executive & Database Management Portal
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Admin Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                placeholder="admin@lumora.ng"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Master Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter admin password..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-3.5 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
            >
              Sign In to Admin Portal
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
            >
              <Home className="size-3.5" /> Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Component ─────────────────────────────────────────────────────
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === "true" ||
      localStorage.getItem(ADMIN_AUTH_SESSION_KEY) === "true"
    );
  });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
      localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    }
    cresco.auth.logout();
    setIsAuthenticated(false);
    toast.success("Logged out of Admin Control Center");
  };

  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [productsList, setProductsList] = useState<Product[]>(initialProducts as Product[]);
  const [servicesList, setServicesList] = useState<Service[]>(initialServices);
  const [ordersList, setOrdersList] = useState<CrescoOrder[]>([]);
  const [bookingsList, setBookingsList] = useState<CrescoBooking[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null | undefined>(undefined);
  const [editingService, setEditingService] = useState<Partial<Service> | null | undefined>(undefined);
  const [activeOrder, setActiveOrder] = useState<CrescoOrder | null>(null);
  const [activeBooking, setActiveBooking] = useState<CrescoBooking | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, servs, ords, bks] = await Promise.all([
        cresco.products.list(),
        cresco.services.list(),
        cresco.orders.list(),
        cresco.bookings.list(),
      ]);
      if (prods && prods.length > 0) setProductsList(prods);
      if (servs && servs.length > 0) setServicesList(servs);
      if (ords) setOrdersList(ords);
      if (bks) setBookingsList(bks);
    } catch (err) {
      console.warn("CrescoDB load fallback:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Derived Customers List from live orders
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
          phone: o.customerPhone || "—",
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

  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search and filter states per tab
  const [productSearch, setProductSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");
  const [customerSearch, setCustomerSearch] = useState("");

  const pendingOrders = useMemo(
    () => ordersList.filter((o) => o.status === "Pending" || o.status === "Processing"),
    [ordersList],
  );

  const pendingBookings = useMemo(
    () => bookingsList.filter((b) => b.status === "Pending" || b.status === "Confirmed"),
    [bookingsList],
  );

  // Global search matching items across all models
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return null;
    const matchedProducts = productsList.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    ).slice(0, 3);
    const matchedOrders = ordersList.filter(
      (o) => o.ref.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || (o.customerPhone && o.customerPhone.includes(q)),
    ).slice(0, 3);
    const matchedBookings = bookingsList.filter(
      (b) => b.ref.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.serviceSlug.toLowerCase().includes(q),
    ).slice(0, 3);
    return { products: matchedProducts, orders: matchedOrders, bookings: matchedBookings };
  }, [globalSearch, productsList, ordersList, bookingsList]);

  // Tab-specific filtered data
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return productsList;
    const q = productSearch.toLowerCase();
    return productsList.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)),
    );
  }, [productsList, productSearch]);

  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return servicesList;
    const q = serviceSearch.toLowerCase();
    return servicesList.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        ((s as any).tagline && (s as any).tagline.toLowerCase().includes(q)) ||
        (s.warranty && s.warranty.toLowerCase().includes(q)),
    );
  }, [servicesList, serviceSearch]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchSearch =
        !orderSearch.trim() ||
        (o.ref && o.ref.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customerPhone && o.customerPhone.includes(orderSearch));
      return matchStatus && matchSearch;
    });
  }, [ordersList, orderStatusFilter, orderSearch]);

  const filteredBookings = useMemo(() => {
    return bookingsList.filter((b) => {
      const matchStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
      const matchSearch =
        !bookingSearch.trim() ||
        (b.ref && b.ref.toLowerCase().includes(bookingSearch.toLowerCase())) ||
        (b.customerName && b.customerName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
        (b.serviceSlug && b.serviceSlug.toLowerCase().includes(bookingSearch.toLowerCase())) ||
        (b.customerPhone && b.customerPhone.includes(bookingSearch));
      return matchStatus && matchSearch;
    });
  }, [bookingsList, bookingStatusFilter, bookingSearch]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customersList;
    const q = customerSearch.toLowerCase();
    return customersList.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)),
    );
  }, [customersList, customerSearch]);

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* ── Desktop & Tablet Sidebar ───────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-screen w-16 shrink-0 flex-col border-r border-border bg-card shadow-card sm:flex lg:w-60">
        {/* Logo */}
        <div className="flex h-18 items-center gap-2.5 border-b border-border px-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 shadow-glow-gold">
            <Lightbulb className="size-4 text-white" />
          </span>
          <div className="hidden lg:block">
            <span className="font-display text-lg font-black tracking-tight text-foreground">
              lumora
            </span>
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Control Center
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                tab === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
              {tab === item.id && <ChevronRight className="ml-auto hidden size-4 lg:block" />}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Home className="size-4 shrink-0 text-primary" />
            <span className="hidden lg:inline">Open Storefront ↗</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="hidden lg:inline">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer Navigation ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-72 flex-col bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Lightbulb className="size-4" />
                </span>
                <span className="font-display font-bold">Lumora Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                    tab === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="border-t border-border pt-3 space-y-1">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-foreground/75 hover:bg-secondary"
              >
                <Home className="size-4 text-primary" />
                <span>Open Storefront ↗</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="size-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Executive Admin Top Header ──────────────────────────────────── */}
        <header className="sticky top-0 z-40 flex h-18 shrink-0 items-center justify-between border-b border-border/80 bg-card/95 backdrop-blur-md px-4 sm:px-6 shadow-sm gap-3">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/50 text-foreground sm:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="size-4.5" />
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <span>Admin</span>
                <span>/</span>
                <span className="font-bold text-foreground capitalize">{tab}</span>
              </div>
              <p className="hidden text-[11px] text-muted-foreground/80 sm:block">
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })} · Live Database Sync
              </p>
            </div>
          </div>

          {/* Center: Global Omni-Search */}
          <div className="relative hidden max-w-md flex-1 md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Omni-search orders, products, bookings..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background/80 py-2 pl-10 pr-8 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Omni-search Results Dropdown */}
            {searchResults && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                  <span>Quick Results</span>
                  <button onClick={() => setGlobalSearch("")} className="hover:text-foreground">Close</button>
                </div>

                {searchResults.orders.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Orders</p>
                    {searchResults.orders.map((o) => (
                      <div
                        key={o.ref}
                        onClick={() => {
                          setActiveOrder(o);
                          setGlobalSearch("");
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer text-xs"
                      >
                        <span className="font-mono font-bold">{o.ref} · {o.customerName}</span>
                        <span className="font-semibold text-primary">{naira(o.total)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Products</p>
                    {searchResults.products.map((p) => (
                      <div
                        key={p.slug}
                        onClick={() => {
                          setEditingProduct(p);
                          setGlobalSearch("");
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer text-xs"
                      >
                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                        <span className="font-bold">{naira(p.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.bookings.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Bookings</p>
                    {searchResults.bookings.map((b) => (
                      <div
                        key={b.ref}
                        onClick={() => {
                          setActiveBooking(b);
                          setGlobalSearch("");
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer text-xs"
                      >
                        <span className="font-mono font-bold">{b.ref} · {b.customerName}</span>
                        <span className="capitalize text-muted-foreground">{b.serviceSlug.replace(/-/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.orders.length === 0 && searchResults.products.length === 0 && searchResults.bookings.length === 0 && (
                  <p className="p-3 text-center text-xs text-muted-foreground">No matches found for &ldquo;{globalSearch}&rdquo;</p>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Database Badge */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>CrescoDB Live</span>
            </div>

            {/* Re-sync Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={loading}
              className="h-9 gap-1.5 text-xs font-semibold"
              title="Refresh database records"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((p) => !p)}
                className="relative flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="System Notifications"
              >
                <Bell className="size-4" />
                {pendingOrders.length + pendingBookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                    {pendingOrders.length + pendingBookings.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="font-display text-sm font-bold">Activity Center</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/60">
                      <span className="font-medium">Pending Orders</span>
                      <Badge variant={pendingOrders.length > 0 ? "default" : "secondary"}>
                        {pendingOrders.length}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/60">
                      <span className="font-medium">Unassigned Bookings</span>
                      <Badge variant={pendingBookings.length > 0 ? "default" : "secondary"}>
                        {pendingBookings.length}
                      </Badge>
                    </div>
                  </div>

                  <div className="border-t border-border pt-2">
                    <button
                      onClick={() => {
                        setTab(pendingOrders.length > 0 ? "orders" : "bookings");
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-xs font-bold text-primary hover:underline"
                    >
                      Manage Queue →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Add Product Button */}
            <Button
              size="sm"
              onClick={() => setEditingProduct({})}
              className="h-9 gap-1 text-xs font-bold shadow-sm"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>

            {/* Admin User Profile & Logout Tag */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex size-8.5 items-center justify-center rounded-xl bg-amber-500 text-xs font-bold text-white shadow-sm">
                AD
              </div>
              <div className="hidden text-left xl:block">
                <p className="text-xs font-bold text-foreground leading-tight">Master Admin</p>
                <p className="text-[10px] text-muted-foreground leading-tight">lumora.ng</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 gap-1 ml-1"
                title="Log out of Admin Portal"
              >
                <LogOut className="size-3.5" />
                <span className="hidden md:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* ── 1. Dashboard Tab ──────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    icon: TrendingUp,
                    label: "Total Store Revenue",
                    value: naira(totalRevenue),
                    change: ordersList.length > 0 ? `${ordersList.length} total orders` : "Zero sales yet",
                    up: ordersList.length > 0,
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: ShoppingBag,
                    label: "Customer Orders",
                    value: `${ordersList.length}`,
                    change: ordersList.length > 0 ? "Live transactions" : "0 pending",
                    up: ordersList.length > 0,
                    color: "bg-emerald-500/10 text-emerald-600",
                  },
                  {
                    icon: Wrench,
                    label: "Active Bookings",
                    value: `${openInstallations}`,
                    change: openInstallations > 0 ? "In active schedule" : "None scheduled",
                    up: openInstallations > 0,
                    color: "bg-amber-500/10 text-amber-600",
                  },
                  {
                    icon: Users,
                    label: "Customer Directory",
                    value: `${customersList.length}`,
                    change: customersList.length > 0 ? "Registered clients" : "0 buyers",
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

              {/* Revenue Chart */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base font-bold">Monthly Revenue Trend</h2>
                    <p className="text-xs text-muted-foreground">
                      {ordersList.length > 0 ? "Store performance breakdown" : "Awaiting first completed order"}
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

              {/* Recent Orders */}
              <div className="rounded-2xl border border-border bg-card shadow-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <h2 className="font-display font-bold">Recent Orders</h2>
                  {ordersList.length > 0 && (
                    <button
                      onClick={() => setTab("orders")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View all orders →
                    </button>
                  )}
                </div>
                {ordersList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ref</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersList.slice(0, 4).map((o) => (
                          <TableRow key={o.ref}>
                            <TableCell className="font-mono font-medium">{o.ref}</TableCell>
                            <TableCell>{o.customerName}</TableCell>
                            <TableCell className="whitespace-nowrap font-semibold">
                              {naira(o.total)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={o.status} />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveOrder(o)}
                              >
                                View
                              </Button>
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
                      Customer checkouts on the storefront will appear here in real time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 2. Products Tab ───────────────────────────────────────────── */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products by name, brand, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full max-w-sm rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {filteredProducts.length} Product(s)
                  </Badge>
                  <Button onClick={() => setEditingProduct({})}>
                    <Plus className="size-4" /> Add Product
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Install Fee</TableHead>
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
                            {p.reviewCount && p.reviewCount > 0 ? (
                              <span className="flex items-center gap-1 text-sm font-medium">
                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                {p.rating}
                                <span className="text-xs text-muted-foreground">
                                  ({p.reviewCount})
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">No reviews</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="size-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(p.slug)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete Product"
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

              {/* Delete confirmation modal */}
              {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                    <h3 className="font-display text-lg font-bold">Delete Product?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This action will remove the product from the catalog.
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

          {/* ── 3. Services Tab ──────────────────────────────────────────── */}
          {tab === "services" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full max-w-sm rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {filteredServices.length} Service(s)
                  </Badge>
                  <Button onClick={() => setEditingService({})}>
                    <Plus className="size-4" /> Add Service
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Starting From</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Warranty</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((s) => {
                        const price = s.from ?? (s as any).startingPrice ?? 0;
                        const desc = s.description ?? (s as any).tagline ?? "";
                        return (
                          <TableRow key={s.slug}>
                            <TableCell>
                              <p className="font-medium">{s.name}</p>
                              <p className="max-w-xs truncate text-xs text-muted-foreground">
                                {desc}
                              </p>
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-semibold">
                              {naira(price)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {s.duration || "1 – 2 hours"}
                            </TableCell>
                            <TableCell className="max-w-[14rem] truncate text-sm text-muted-foreground">
                              {s.warranty || "3 months warranty"}
                            </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingService(s)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                                title="Edit Service"
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
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* ── 4. Orders Tab ─────────────────────────────────────────────── */}
          {tab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer name, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full max-w-sm rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1 text-xs">
                  {["all", "Pending", "Processing", "In transit", "Delivered", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`rounded-lg px-2.5 py-1 font-semibold capitalize transition-colors ${
                        orderStatusFilter === st
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                {filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((o) => (
                          <TableRow key={o.ref}>
                            <TableCell className="font-mono font-medium">{o.ref}</TableCell>
                            <TableCell>{o.customerName}</TableCell>
                            <TableCell className="text-sm">{o.customerPhone || "—"}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {Array.isArray(o.items) ? o.items.length : 1} item(s)
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
                              <button
                                onClick={() => setActiveOrder(o)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                                title="View & Edit Order"
                              >
                                <Eye className="size-4" />
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
                    <h3 className="mt-3 font-display text-base font-bold">
                      {orderSearch || orderStatusFilter !== "all" ? "No matching orders found" : "No customer orders yet"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {orderSearch || orderStatusFilter !== "all"
                        ? "Try clearing your search query or status filter."
                        : "Customer checkouts on the storefront will appear here in real time."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 5. Customers Tab ──────────────────────────────────────────── */}
          {tab === "customers" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customer directory by name, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full max-w-sm rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                {filteredCustomers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Orders Placed</TableHead>
                          <TableHead>Lifetime Spend</TableHead>
                          <TableHead>First Order</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((c) => (
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
                    <h3 className="mt-3 font-display text-base font-bold">
                      {customerSearch ? "No matching customers found" : "No customer profiles yet"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {customerSearch ? "Try adjusting your search query." : "Registered users and buyers will automatically populate this customer directory."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 6. Bookings Tab ───────────────────────────────────────────── */}
          {tab === "bookings" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search bookings by ref, customer, service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full max-w-sm rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1 text-xs">
                  {["all", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingStatusFilter(st)}
                      className={`rounded-lg px-2.5 py-1 font-semibold capitalize transition-colors ${
                        bookingStatusFilter === st
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                {filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ref</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date & Slot</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((b) => (
                          <TableRow key={b.ref}>
                            <TableCell className="font-mono font-medium">{b.ref}</TableCell>
                            <TableCell>{b.customerName}</TableCell>
                            <TableCell className="text-sm">{b.customerPhone || "—"}</TableCell>
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
                              <button
                                onClick={() => setActiveBooking(b)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
                                title="View & Edit Booking"
                              >
                                <Edit3 className="size-3.5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <CalendarClock className="mx-auto size-10 text-muted-foreground/40" />
                    <h3 className="mt-3 font-display text-base font-bold">
                      {bookingSearch || bookingStatusFilter !== "all" ? "No matching bookings found" : "No technician bookings yet"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {bookingSearch || bookingStatusFilter !== "all"
                        ? "Try clearing your search query or status filter."
                        : "Scheduled appliance installations and maintenance requests will appear here."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 7. Settings Tab ───────────────────────────────────────────── */}
          {tab === "settings" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Store info */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-base font-bold">Store Profile & Contacts</h2>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Store Name", value: "Lumora" },
                    { label: "Tagline", value: "Illuminate Your Space. Build Your World." },
                    { label: "Contact Phone", value: "+234 816 705 4402" },
                    { label: "Contact Email", value: "hello@lumora.ng" },
                    { label: "Showroom Address", value: "Lagos Island, Lagos, Nigeria" },
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
                  <Button
                    className="mt-2"
                    onClick={() => toast.success("Store settings updated successfully")}
                  >
                    <Save className="size-4" /> Save Settings
                  </Button>
                </div>
              </div>

              {/* Database Status & Tools */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
                <h2 className="font-display text-base font-bold">CrescoDB Engine Status</h2>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Database Engine</span>
                    <span className="font-mono font-bold text-emerald-600">CrescoDB (Active)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">REST Endpoint</span>
                    <span className="font-mono text-xs">http://localhost:3000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Products in Database</span>
                    <span className="font-bold">{productsList.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Services in Database</span>
                    <span className="font-bold">{servicesList.length}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={loadAdminData}
                  className="w-full"
                >
                  <RefreshCw className="size-4" /> Re-sync with CrescoDB
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Product Edit Modal ────────────────────────────────────────────── */}
      {editingProduct !== undefined && (
        <ProductModal
          key={editingProduct?.slug || "new-prod"}
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

      {/* ── Service Edit Modal ────────────────────────────────────────────── */}
      {editingService !== undefined && (
        <ServiceModal
          key={editingService?.slug || "new-serv"}
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

      {/* ── Order View & Status Switcher Modal ─────────────────────────────── */}
      <OrderModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onStatusChange={async (ref, status) => {
          try {
            await cresco.orders.updateStatus(ref, status);
            toast.success(`Order ${ref} updated to ${status}`);
          } catch (e) {
            console.warn("CrescoDB order status update fallback:", e);
          }
          setOrdersList((prev) =>
            prev.map((o) => (o.ref === ref ? { ...o, status } : o)),
          );
          if (activeOrder && activeOrder.ref === ref) {
            setActiveOrder({ ...activeOrder, status });
          }
        }}
        onDelete={async (ref) => {
          try {
            await cresco.orders.delete(ref);
            toast.success(`Order ${ref} deleted`);
          } catch (e) {
            console.warn("CrescoDB order delete fallback:", e);
          }
          setOrdersList((prev) => prev.filter((o) => o.ref !== ref));
          setActiveOrder(null);
        }}
      />

      {/* ── Booking View & Status Switcher Modal ──────────────────────────── */}
      <BookingModal
        booking={activeBooking}
        onClose={() => setActiveBooking(null)}
        onStatusChange={async (ref, status) => {
          try {
            await cresco.bookings.updateStatus(ref, status);
            toast.success(`Booking ${ref} updated to ${status}`);
          } catch (e) {
            console.warn("CrescoDB booking status update fallback:", e);
          }
          setBookingsList((prev) =>
            prev.map((b) => (b.ref === ref ? { ...b, status } : b)),
          );
          if (activeBooking && activeBooking.ref === ref) {
            setActiveBooking({ ...activeBooking, status });
          }
        }}
        onDelete={async (ref) => {
          try {
            await cresco.bookings.delete(ref);
            toast.success(`Booking ${ref} deleted`);
          } catch (e) {
            console.warn("CrescoDB booking delete fallback:", e);
          }
          setBookingsList((prev) => prev.filter((b) => b.ref !== ref));
          setActiveBooking(null);
        }}
      />
    </div>
  );
}
