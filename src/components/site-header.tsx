import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  Phone,
  ChevronDown,
  X,
  AirVent,
  Zap,
  Hammer,
  Home,
  Lightbulb,
  ShieldCheck,
  Wrench,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  MessageCircle,
  Clock,
  Truck,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { categories, products } from "@/lib/catalog";
import type { CategorySlug } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { whatsappLink } from "@/components/whatsapp";

const catIcons = {
  "home-appliances": AirVent,
  "electrical-materials": Zap,
  "building-materials": Hammer,
  "home-solutions": Home,
};

const catColors: Record<string, string> = {
  "home-appliances": "text-blue-500 bg-blue-500/10 border-blue-500/20",
  "electrical-materials": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "building-materials": "text-violet-500 bg-violet-500/10 border-violet-500/20",
  "home-solutions": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

export function SiteHeader() {
  const { count, total } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoriesOpen(false);
    setSearchFocused(false);
  }, [location.pathname]);

  // Click outside to close search popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for instant live search dropdown
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        if (selectedCat !== "all" && p.category !== selectedCat) return false;
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
        );
      })
      .slice(0, 5);
  }, [searchQuery, selectedCat]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchFocused(false);
    navigate({
      to: "/shop",
      search: {
        category: selectedCat !== "all" ? (selectedCat as CategorySlug) : undefined,
      },
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* ── 1. Top Utility / Announcement Strip ───────────────────────────── */}
      <div className="surface-navy border-b border-white/10 text-xs">
        <div className="container-page flex h-8 items-center justify-between">
          <div className="flex items-center gap-4 text-white/75">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="size-3 text-gold" />
              Nationwide Delivery Across 36 States
            </span>
            <span className="hidden text-white/30 sm:inline">|</span>
            <span className="hidden items-center gap-1.5 font-medium text-white/75 sm:flex">
              <ShieldCheck className="size-3 text-emerald-400" />
              Certified Professional Installation Available
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/75">
            <a
              href="tel:+2348167054402"
              className="hidden items-center gap-1 hover:text-gold transition-colors md:flex"
            >
              <Phone className="size-3 text-gold" />
              <span>+234 816 705 4402</span>
            </a>
            <span className="hidden text-white/30 md:inline">|</span>
            <a
              href={whatsappLink("Hello Lumora, I need assistance with my order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="size-3" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Main E-Commerce Header ─────────────────────────────────────── */}
      <div
        className={`border-b border-border/80 bg-card transition-shadow duration-200 ${
          scrolled ? "shadow-md shadow-black/5" : ""
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500 shadow-glow-gold">
              <Lightbulb className="size-5 text-white" />
            </span>
            <div>
              <span className="font-display text-2xl font-black tracking-tight text-foreground">
                lumora
              </span>
              <span className="block text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                Nigeria&apos;s Store
              </span>
            </div>
          </Link>

          {/* Center Search Bar with Instant Results */}
          <div ref={searchRef} className="relative hidden max-w-2xl flex-1 md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center overflow-hidden rounded-xl border border-input bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              {/* Category Selector */}
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="h-11 border-r border-border bg-secondary/50 px-3 text-xs font-medium text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Search Input */}
              <div className="relative flex flex-1 items-center">
                <input
                  type="text"
                  placeholder="Search genuine appliances, inverters, cables, fixtures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="h-11 w-full bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-muted-foreground hover:text-foreground mr-1"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex h-11 items-center justify-center bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Search className="size-4" />
              </button>
            </form>

            {/* Live Search Instant Results Popover */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  <span>Product Suggestions</span>
                  <span>{searchResults.length} Results</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((p) => (
                      <Link
                        key={p.slug}
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
                      >
                        <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-secondary">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="size-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {p.brand} · <span className="font-semibold text-primary">{naira(p.price)}</span>
                          </p>
                        </div>
                        {p.installFee && (
                          <span className="hidden rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 sm:inline-block">
                            + Installation
                          </span>
                        )}
                      </Link>
                    ))}

                    <div className="mt-2 border-t border-border pt-2">
                      <Link
                        to="/shop"
                        search={{ category: selectedCat !== "all" ? (selectedCat as CategorySlug) : undefined }}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                      >
                        View all results in Store →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No products found for &ldquo;{searchQuery}&rdquo;. Try browsing by category.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Technician Booking CTA */}
            <Link
              to="/booking"
              className="hidden items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary xl:flex"
            >
              <Wrench className="size-3.5 text-primary" />
              <span>Book Technician</span>
            </Link>

            {/* Account */}
            <Link
              to="/account"
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:px-3"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                <User className="size-4.5" />
              </div>
              <div className="hidden text-left lg:block">
                <span className="block text-[10px] font-semibold text-muted-foreground leading-tight">
                  Welcome
                </span>
                <span className="block text-xs font-bold text-foreground leading-tight">
                  My Account
                </span>
              </div>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 rounded-xl bg-primary/10 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:px-3.5"
            >
              <div className="relative">
                <ShoppingCart className="size-5" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-[10px] font-semibold opacity-80 leading-tight">
                  Cart
                </span>
                <span className="block text-xs font-extrabold leading-tight">
                  {total > 0 ? naira(total) : "₦0"}
                </span>
              </div>
            </Link>

            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[85vw] max-w-sm flex-col p-0">
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 shadow-glow-gold">
                    <Lightbulb className="size-4 text-white" />
                  </span>
                  <SheetTitle className="font-display text-lg font-extrabold">lumora</SheetTitle>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {/* Mobile Search */}
                  <form
                    onSubmit={(e) => {
                      handleSearchSubmit(e);
                      setMobileOpen(false);
                    }}
                    className="mb-6 flex items-center overflow-hidden rounded-xl border border-input bg-background"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 flex-1 px-3 text-sm outline-none"
                    />
                    <button type="submit" className="bg-primary p-2.5 text-white">
                      <Search className="size-4" />
                    </button>
                  </form>

                  <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Browse Categories
                  </p>
                  <div className="mb-6 grid grid-cols-2 gap-2">
                    {categories.map((c) => {
                      const Icon = catIcons[c.slug as keyof typeof catIcons];
                      return (
                        <Link
                          key={c.slug}
                          to="/shop"
                          search={{ category: c.slug }}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-xl border border-border p-2.5 text-xs font-semibold transition-colors hover:bg-secondary"
                        >
                          <Icon className="size-4 shrink-0 text-primary" />
                          <span className="truncate">{c.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                    Store Navigation
                  </p>
                  <nav className="flex flex-col gap-1">
                    {[
                      { to: "/shop", label: "Shop All Products" },
                      { to: "/services", label: "Installation Services" },
                      { to: "/booking", label: "Book a Technician" },
                      { to: "/account", label: "My Account / Orders" },
                      { to: "/contact", label: "Customer Support" },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                        activeProps={{ className: "bg-secondary text-foreground font-semibold" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-border p-5">
                  <a
                    href="tel:+2348167054402"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-gold-foreground"
                  >
                    <Phone className="size-4" /> +234 816 705 4402
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ── 3. Category & Navigation Bar ──────────────────────────────────── */}
      <nav className="hidden border-b border-border/60 bg-surface md:block">
        <div className="container-page flex h-11 items-center justify-between gap-6">
          {/* All Categories Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen((p) => !p)}
              className="flex items-center gap-2.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <LayoutGrid className="size-3.5" />
              <span>All Categories</span>
              <ChevronDown
                className={`size-3 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {categoriesOpen && (
              <div className="absolute top-full left-0 z-50 mt-1.5 w-72 rounded-2xl border border-border bg-card p-3 shadow-xl">
                {categories.map((c) => {
                  const Icon = catIcons[c.slug as keyof typeof catIcons];
                  return (
                    <Link
                      key={c.slug}
                      to="/shop"
                      search={{ category: c.slug }}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-secondary"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.blurb}</p>
                      </div>
                    </Link>
                  );
                })}
                <div className="mt-2 border-t border-border pt-2">
                  <Link
                    to="/shop"
                    onClick={() => setCategoriesOpen(false)}
                    className="flex items-center justify-center gap-1 text-xs font-bold text-primary hover:underline py-1"
                  >
                    View entire catalogue <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Category Links */}
          <div className="flex flex-1 items-center gap-1 overflow-x-auto text-xs font-semibold text-foreground/80">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground whitespace-nowrap"
                activeProps={{ className: "bg-secondary text-primary font-bold" }}
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/services"
              className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground whitespace-nowrap"
            >
              Installation Services
            </Link>
            <Link
              to="/booking"
              className="rounded-lg px-3 py-1.5 transition-colors hover:bg-secondary hover:text-foreground whitespace-nowrap"
            >
              Book Technician
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 rounded-lg px-3 py-1.5 hover:bg-amber-500/10 whitespace-nowrap"
            >
              <Sparkles className="size-3" /> Special Offers
            </Link>
          </div>

          {/* Right Highlight Badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
            <span className="flex size-2 rounded-full bg-emerald-500" />
            <span>Store Open · Nationwide Dispatch</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
