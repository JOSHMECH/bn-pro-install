import { Link } from "@tanstack/react-router";
import { AirVent, Hammer, Wrench, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { naira } from "@/lib/format";
import type { Product } from "@/lib/catalog";

const icons = {
  "home-appliances": AirVent,
  "electrical-materials": Zap,
  "building-materials": Hammer,
} as const;

export function ProductThumb({ product, className = "" }: { product: Product; className?: string }) {
  const Icon = icons[product.category];
  return (
    <div
      className={`relative grid place-items-center overflow-hidden bg-surface ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.4_0.13_258/0.12),transparent_60%),radial-gradient(circle_at_75%_80%,oklch(0.79_0.13_84/0.18),transparent_55%)]" />
      <Icon className="size-14 text-primary/35" strokeWidth={1.25} />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-gold/60"
    >
      <div className="relative">
        <ProductThumb product={product} className="aspect-4/3 w-full" />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-gold text-gold-foreground hover:bg-gold">
            {product.badge}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold">{naira(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {naira(product.oldPrice)}
            </span>
          )}
        </div>
        {product.installFee ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wrench className="size-3.5 text-gold" /> Installation from {naira(product.installFee)}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">Supply only · delivery nationwide</p>
        )}
      </div>
    </Link>
  );
}
