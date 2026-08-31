import { createFileRoute, Link } from "@tanstack/react-router";
import {
  SlidersHorizontal,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Star,
  AirVent,
  Zap,
  Hammer,
  Home,
  SortAsc,
} from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, products, type CategorySlug } from "@/lib/catalog";
import { naira } from "@/lib/format";

type ShopSearch = {
  category?: CategorySlug;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "rating" | "newest";
  installable?: boolean;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const c = search["category"];
    const valid = categories.some((cat) => cat.slug === c);
    return {
      category: valid ? (c as CategorySlug) : undefined,
      brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
      sort: (["price-asc", "price-desc", "rating", "newest"] as const).includes(
        search["sort"] as "price-asc" | "price-desc" | "rating" | "newest",
      )
        ? (search["sort"] as ShopSearch["sort"])
        : undefined,
      installable: search["installable"] === true || search["installable"] === "true",
    };
  },
  head: () => ({
    meta: [
      { title: "Store — Shop Appliances, Electrical & Building Materials | Lumora" },
      {
        name: "description",
        content:
          "Browse home appliances, electrical materials, building materials and home solutions at Lumora. Filter by category, brand and price. Professional installation available.",
      },
      { property: "og:title", content: "Store | Lumora" },
    ],
  }),
  component: Shop,
});

const catIcons = {
  "home-appliances": AirVent,
  "electrical-materials": Zap,
  "building-materials": Hammer,
  "home-solutions": Home,
};

const catColors: Record<string, string> = {
  "home-appliances": "border-blue-400 bg-blue-50 text-blue-700",
  "electrical-materials": "border-amber-400 bg-amber-50 text-amber-700",
  "building-materials": "border-violet-400 bg-violet-50 text-violet-700",
  "home-solutions": "border-emerald-400 bg-emerald-50 text-emerald-700",
};

const allBrands = [...new Set(products.map((p) => p.brand))].sort();

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
] as const;

function PriceRangeFilter({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  const MAX = 2_000_000;

  return (
    <div className="space-y-3">
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute h-1.5 rounded-full bg-primary"
          style={{ left: `${(localMin / MAX) * 100}%`, right: `${100 - (localMax / MAX) * 100}%` }}
        />
        <input
          type="range"
          min={0}
          max={MAX}
          step={10000}
          value={localMin}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < localMax) {
              setLocalMin(v);
              onChange(v, localMax);
            }
          }}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
        />
        <input
          type="range"
          min={0}
          max={MAX}
          step={10000}
          value={localMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > localMin) {
              setLocalMax(v);
              onChange(localMin, v);
            }
          }}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{naira(localMin)}</span>
        <span>{naira(localMax)}</span>
      </div>
    </div>
  );
}

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2_000_000]);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [installableOnly, setInstallableOnly] = useState(false);

  const activeCategory = categories.find((c) => c.slug === search.category);

  // Filter products
  let list = products.filter((p) => {
    if (search.category && p.category !== search.category) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (installableOnly && !p.installFee) return false;
    return true;
  });

  // Sort
  switch (search.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  const activeFiltersCount =
    (search.category ? 1 : 0) +
    (selectedBrands.size > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 2_000_000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (installableOnly ? 1 : 0);

  function clearFilters() {
    setPriceRange([0, 2_000_000]);
    setSelectedBrands(new Set());
    setMinRating(0);
    setInstallableOnly(false);
    navigate({ search: {} });
  }

  const FilterPanel = () => (
    <aside className="space-y-6">
      {/* Category filter */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Category
        </p>
        <div className="space-y-1">
          <button
            onClick={() => navigate({ search: {} })}
            className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
              !search.category
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => {
            const Icon = catIcons[c.slug as keyof typeof catIcons] ?? Home;
            const colorCls = catColors[c.slug] ?? "";
            return (
              <button
                key={c.slug}
                onClick={() => navigate({ search: { category: c.slug } })}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  search.category === c.slug
                    ? `border ${colorCls}`
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Price range
        </p>
        <PriceRangeFilter
          min={priceRange[0]}
          max={priceRange[1]}
          onChange={(min, max) => setPriceRange([min, max])}
        />
      </div>

      {/* Brand filter */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Brand
        </p>
        <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 py-1">
              <input
                type="checkbox"
                checked={selectedBrands.has(b)}
                onChange={() => {
                  setSelectedBrands((prev) => {
                    const next = new Set(prev);
                    next.has(b) ? next.delete(b) : next.add(b);
                    return next;
                  });
                }}
                className="size-4 rounded border-border accent-primary"
              />
              <span className="text-sm">{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <p className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Min. rating
        </p>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                minRating === r ? "bg-amber-50 text-amber-700" : "hover:bg-secondary"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`size-3 ${s <= r ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Installable toggle */}
      <div>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium">Installation available</span>
          <button
            onClick={() => setInstallableOnly((p) => !p)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              installableOnly ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${
                installableOnly ? "translate-x-4.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">Show only products with install option</p>
      </div>

      {/* Clear */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <X className="size-4" /> Clear all filters ({activeFiltersCount})
        </button>
      )}
    </aside>
  );

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          {activeCategory ? (
            <>
              <Link to="/shop" className="hover:text-primary">
                Store
              </Link>
              <span>/</span>
              <span className="text-foreground">{activeCategory.name}</span>
            </>
          ) : (
            <span className="text-foreground">Store</span>
          )}
        </nav>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {activeCategory ? activeCategory.name : "All products"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {activeCategory
            ? activeCategory.blurb
            : "Every item in stock — priced in naira, with installation options where relevant."}
        </p>
      </div>

      {/* Category pill chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          to="/shop"
          search={{}}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            !search.category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:bg-secondary"
          }`}
        >
          All
        </Link>
        {categories.map((c) => {
          const Icon = catIcons[c.slug as keyof typeof catIcons] ?? Home;
          return (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                search.category === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <Icon className="size-3.5" />
              {c.name}
            </Link>
          );
        })}
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <div className="hidden w-60 shrink-0 lg:block">
          <FilterPanel />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{list.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen((p) => !p)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary lg:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                  <SortAsc className="size-4 text-muted-foreground" />
                  <select
                    value={search.sort ?? "newest"}
                    onChange={(e) =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          sort: e.target.value as ShopSearch["sort"],
                        }),
                      })
                    }
                    className="appearance-none bg-transparent outline-none cursor-pointer"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </label>
              </div>

              {/* View toggle */}
              <div className="flex overflow-hidden rounded-xl border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile filters panel */}
          {filterOpen && (
            <div className="mb-6 rounded-2xl border border-border bg-card p-5 lg:hidden">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Filters</p>
                <button onClick={() => setFilterOpen(false)}>
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4">
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Product grid / list */}
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <Search className="size-12 text-muted-foreground/40" />
              <h3 className="font-display text-lg font-bold">No products found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or browse all categories.
              </p>
              <button
                onClick={clearFilters}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((p) => (
                <div
                  key={p.slug}
                  className="flex gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-card"
                >
                  <div
                    className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${
                      p.category === "home-appliances"
                        ? "from-blue-500/10 to-blue-600/5"
                        : p.category === "electrical-materials"
                          ? "from-amber-500/10 to-amber-600/5"
                          : p.category === "building-materials"
                            ? "from-violet-500/10 to-violet-600/5"
                            : "from-emerald-500/10 to-emerald-600/5"
                    }`}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-display text-3xl font-black text-foreground/10 select-none">
                        {p.brand[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>
                      <h3 className="line-clamp-1 font-semibold">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.summary}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <span className="font-display text-base font-bold">
                        {naira(p.price)}
                      </span>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        className="rounded-xl bg-primary/8 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
