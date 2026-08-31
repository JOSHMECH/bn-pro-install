import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Clock,
  ShieldCheck,
  Truck,
  Wrench,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/product-card";
import { whatsappLink } from "@/components/whatsapp";
import { getProduct, products, type Product } from "@/lib/catalog";
import { cresco } from "@/lib/cresco";
import { naira } from "@/lib/format";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await cresco.products.getBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
        { title: `Product unavailable | Lumora` },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} | Lumora` },
        { name: "description", content: product.summary.slice(0, 155) },
        { property: "og:title", content: `${product.name} — ${naira(product.price)}` },
        { property: "og:description", content: product.summary.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [withInstall, setWithInstall] = useState(false);

  const installFee = product.installFee ?? 0;
  const total = product.price * qty + (withInstall ? installFee * qty : 0);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="container-page py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link to="/shop" search={{ category: product.category }} className="hover:text-primary">
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight className="size-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
        {/* Product image area */}
        <div
          className={`relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${
            product.category === "home-appliances"
              ? "from-blue-500/10 to-blue-600/5"
              : product.category === "electrical-materials"
                ? "from-amber-500/10 to-amber-600/5"
                : product.category === "building-materials"
                  ? "from-violet-500/10 to-violet-600/5"
                  : "from-emerald-500/10 to-emerald-600/5"
          }`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="font-display text-[7rem] font-black text-foreground/8 select-none leading-none">
                {product.brand[0]}
              </span>
              <span className="rounded-full border border-border/60 bg-white/70 px-4 py-1.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm">
                {product.brand}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="rounded-lg border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
              {product.brand}
            </span>
          </div>
        </div>
        {/* Rating row */}
        {product.reviewCount && product.reviewCount > 0 ? (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-4 ${
                    s <= Math.round(product.rating ?? 5)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {product.rating} ({product.reviewCount} customer reviews)
            </span>
          </div>
        ) : null}
      </div>

        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          {product.badge && (
            <Badge className="mt-3 bg-gold text-gold-foreground hover:bg-gold">
              {product.badge}
            </Badge>
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-3xl font-extrabold">{naira(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {naira(product.oldPrice)}
              </span>
            )}
          </div>

          <dl className="mt-6 grid gap-3 rounded-xl border border-border bg-surface p-4 text-sm sm:grid-cols-2">
            <div className="flex gap-2.5">
              <Wrench className="mt-0.5 size-4 shrink-0 text-gold" />
              <div>
                <dt className="font-semibold">Installation fee</dt>
                <dd className="text-muted-foreground">
                  {installFee ? `${naira(installFee)} (optional)` : "Not required"}
                </dd>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
              <div>
                <dt className="font-semibold">Installation time</dt>
                <dd className="text-muted-foreground">{product.installTime ?? "—"}</dd>
              </div>
            </div>
            <div className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
              <div>
                <dt className="font-semibold">Warranty</dt>
                <dd className="text-muted-foreground">{product.warranty}</dd>
              </div>
            </div>
            <div className="flex gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-gold" />
              <div>
                <dt className="font-semibold">Delivery</dt>
                <dd className="text-muted-foreground">Nationwide, 1–4 working days</dd>
              </div>
            </div>
          </dl>

          {installFee > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="text-sm font-semibold">Choose an option</p>
              {[
                { v: false, t: "Product only", d: "We deliver, you arrange fitting" },
                {
                  v: true,
                  t: `Product + professional installation (+${naira(installFee)})`,
                  d: `Certified technician · ${product.installTime}`,
                },
              ].map((opt) => (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => setWithInstall(opt.v)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                    withInstall === opt.v
                      ? "border-gold bg-accent/50"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                      withInstall === opt.v ? "border-gold bg-gold" : "border-input"
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{opt.t}</span>
                    <span className="block text-xs text-muted-foreground">{opt.d}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
              onClick={() => {
                add({ slug: product.slug, name: product.name, price: product.price });
                toast.success("Added to cart", {
                  description: `${product.name} · ${naira(total)}`,
                });
              }}
            >
              Add to cart — {naira(total)}
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={whatsappLink(`Hello Lumora, I'd like to ask about: ${product.name}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" /> Ask on WhatsApp
              </a>
            </Button>
          </div>

          <Separator className="my-8" />
          <h2 className="font-display text-lg font-bold">Specifications</h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 py-3"
              >
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold">You may also need</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
