import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products, type CategorySlug } from "@/lib/catalog";

type ShopSearch = { category?: CategorySlug };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const c = search["category"];
    const valid = categories.some((cat) => cat.slug === c);
    return valid ? { category: c as CategorySlug } : {};
  },
  head: () => ({
    meta: [
      { title: "Shop Appliances, Electrical & Building Materials | BN Electricals" },
      {
        name: "description",
        content:
          "Browse air conditioners, TVs, inverters, generators, cables, distribution boards, tiles, roofing and cement with optional professional installation.",
      },
      { property: "og:title", content: "Shop | BN Electricals and Home Appliances" },
      {
        property: "og:description",
        content: "Genuine products at transparent prices, with installation and nationwide delivery.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const list = category ? products.filter((p) => p.category === category) : products;
  const active = categories.find((c) => c.slug === category);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
        {active ? active.name : "All products"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {active ? active.blurb : "Every item in stock, priced in naira, with installation options where relevant."}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <SlidersHorizontal className="size-3.5" /> Filter
        </span>
        <Link
          to="/shop"
          search={{}}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !category ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              category === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">{list.length} products</p>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
