import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./catalog";

export type CartLine = {
  slug: string;
  qty: number;
  installation: boolean;
};

export type BookingDetails = {
  date: string;
  slot: string;
  notes: string;
};

type CartContextValue = {
  lines: CartLine[];
  add: (slug: string, opts?: { qty?: number; installation?: boolean }) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  toggleInstallation: (slug: string, value?: boolean) => void;
  clear: () => void;
  booking: BookingDetails;
  setBooking: (b: BookingDetails) => void;
  detailed: { product: Product; line: CartLine; lineTotal: number }[];
  count: number;
  productsTotal: number;
  installationTotal: number;
  needsInstallation: boolean;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bn-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [booking, setBooking] = useState<BookingDetails>({ date: "", slot: "", notes: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((line) => {
        const product = products.find((p) => p.slug === line.slug);
        if (!product) return null;
        const install = line.installation && product.installFee ? product.installFee * line.qty : 0;
        return { product, line, lineTotal: product.price * line.qty + install };
      })
      .filter(Boolean) as { product: Product; line: CartLine; lineTotal: number }[];

    const productsTotal = detailed.reduce((s, d) => s + d.product.price * d.line.qty, 0);
    const installationTotal = detailed.reduce(
      (s, d) =>
        s + (d.line.installation && d.product.installFee ? d.product.installFee * d.line.qty : 0),
      0,
    );

    return {
      lines,
      add: (slug, opts) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === slug);
          if (existing) {
            return prev.map((l) =>
              l.slug === slug
                ? {
                    ...l,
                    qty: l.qty + (opts?.qty ?? 1),
                    installation: opts?.installation ?? l.installation,
                  }
                : l,
            );
          }
          return [
            ...prev,
            { slug, qty: opts?.qty ?? 1, installation: opts?.installation ?? false },
          ];
        }),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      setQty: (slug, qty) =>
        setLines((prev) =>
          prev.flatMap((l) => (l.slug === slug ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l])),
        ),
      toggleInstallation: (slug, val) =>
        setLines((prev) =>
          prev.map((l) => (l.slug === slug ? { ...l, installation: val ?? !l.installation } : l)),
        ),
      clear: () => setLines([]),
      booking,
      setBooking,
      detailed,
      count: lines.reduce((s, l) => s + l.qty, 0),
      productsTotal,
      installationTotal,
      needsInstallation: installationTotal > 0,
      total: productsTotal + installationTotal,
    };
  }, [lines, booking]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
