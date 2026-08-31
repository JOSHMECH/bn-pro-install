import { Link } from "@tanstack/react-router";
import { ShoppingCart, Heart, Star, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { naira } from "@/lib/format";

const catGradients: Record<string, string> = {
  "home-appliances": "from-blue-500/10 to-blue-600/5",
  "electrical-materials": "from-amber-500/10 to-amber-600/5",
  "building-materials": "from-violet-500/10 to-violet-600/5",
  "home-solutions": "from-emerald-500/10 to-emerald-600/5",
};

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-amber-600 text-white",
  Popular: "bg-primary text-primary-foreground",
  New: "bg-emerald-600 text-white",
  Sale: "bg-red-600 text-white",
};

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-3 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground">({count})</span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const gradient = catGradients[product.category] ?? "from-primary/10 to-transparent";

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    add({ slug: product.slug, name: product.name, price: product.price });
    setTimeout(() => setAdding(false), 1200);
  }

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-card-hover"
    >
      {/* Image area */}
      <div
        className={`relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} sm:h-56`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}

        {/* Brand tag overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="rounded-md border border-white/40 bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground shadow-sm backdrop-blur-sm">
            {product.brand}
          </span>
        </div>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              badgeColors[product.badge] ?? "bg-primary text-white"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-2.5 right-11 z-10 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted((p) => !p);
          }}
          className={`absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-full transition-all ${
            wishlisted
              ? "bg-red-500 text-white shadow-md"
              : "bg-white/90 text-foreground/60 opacity-0 shadow-sm backdrop-blur-sm group-hover:opacity-100 hover:bg-white hover:text-red-500"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`size-3.5 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <StarRating rating={product.rating} count={product.reviewCount} />

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
          <span className="font-display text-base font-bold text-foreground">
            {naira(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {naira(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Install fee note */}
        {product.installFee && (
          <p className="text-[11px] font-medium text-primary">
            Installation available from {naira(product.installFee)}
          </p>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
            adding
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {adding ? (
            <>
              <Check className="size-3.5" /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCart className="size-3.5" /> Add to cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}

export function ProductThumb({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const gradient = catGradients[product.category] ?? "from-primary/10 to-transparent";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${gradient} border border-border/50 ${className}`}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="font-display text-xs font-bold text-muted-foreground/80">
          {product.brand}
        </span>
      )}
    </div>
  );
}
