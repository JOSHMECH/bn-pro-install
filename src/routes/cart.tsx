import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ProductThumb } from "@/components/product-card";
import { useCart } from "@/lib/cart";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Lumora" },
      {
        name: "description",
        content:
          "Review your appliances and materials, add professional installation, then checkout securely.",
      },
      { property: "og:title", content: "Your Cart | Lumora" },
      {
        property: "og:description",
        content: "Products plus optional installation, priced clearly before checkout.",
      },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { detailed, setQty, remove, toggleInstallation, productsTotal, installationTotal, total } =
    useCart();

  if (detailed.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingCart className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse appliances, electrical and building materials to get started.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <ul className="space-y-4">
          {detailed.map(({ product, line, lineTotal }) => (
            <li
              key={product.slug}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4">
                <ProductThumb product={product} className="size-20 shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="line-clamp-2 text-sm font-semibold hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {naira(product.price)} each · {product.warranty}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(product.slug)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQty(product.slug, line.qty - 1)}
                        aria-label="Decrease"
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-9 text-center text-sm font-semibold">{line.qty}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQty(product.slug, line.qty + 1)}
                        aria-label="Increase"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <span className="font-display text-base font-bold">{naira(lineTotal)}</span>
                  </div>

                  {product.installFee ? (
                    <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-3">
                      <Checkbox
                        checked={line.installation}
                        onCheckedChange={(v) => toggleInstallation(product.slug, Boolean(v))}
                        className="mt-0.5"
                      />
                      <span className="text-xs">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Wrench className="size-3.5 text-gold" /> Add professional installation +
                          {naira(product.installFee)} {line.qty > 1 ? `× ${line.qty}` : ""}
                        </span>
                        <span className="mt-0.5 block text-muted-foreground">
                          {product.installTime} on site · workmanship warranty included
                        </span>
                      </span>
                    </label>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Products</dt>
              <dd className="font-medium">{naira(productsTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Installation</dt>
              <dd className="font-medium">{installationTotal ? naira(installationTotal) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-medium">Calculated at checkout</dd>
            </div>
          </dl>
          <Separator className="my-4" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="font-display text-2xl font-extrabold">{naira(total)}</span>
          </div>
          <Button
            asChild
            size="lg"
            className="mt-5 w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
