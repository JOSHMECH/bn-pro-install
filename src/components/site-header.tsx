import { Link, useLocation } from "@tanstack/react-router";
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  Heart,
  Phone,
  ChevronDown,
  X,
  AirVent,
  Zap,
  Hammer,
  Home,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/catalog";

const catIcons = {
  "home-appliances": AirVent,
  "electrical-materials": Zap,
  "building-materials": Hammer,
  "home-solutions": Home,
};

const catColors: Record<string, string> = {
  "home-appliances": "text-blue-500",
  "electrical-materials": "text-amber-500",
  "building-materials": "text-violet-500",
  "home-solutions": "text-emerald-500",
};

const nav = [
  { to: "/shop", label: "Store" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Book Installation" },
  { to: "/contact", label: "Contact" },
];

const announcements = [
  "Same-day delivery in Lagos",
  "Certified technicians nationwide",
  "12-month workmanship warranty",
  "4,800+ orders delivered",
  "Pay by card, transfer or USSD",
  "Trusted since 2014",
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md shadow-black/5 backdrop-blur-xl"
          : "bg-white/90 backdrop-blur-lg"
      } border-b border-border/60`}
    >
      {/* Announcement bar */}
      <div className="surface-navy overflow-hidden py-2">
        <div className="flex">
          <div className="animate-marquee flex shrink-0 items-center gap-0">
            {[...announcements, ...announcements].map((a, i) => (
              <span
                key={i}
                className="mx-8 flex shrink-0 items-center gap-2 text-xs font-medium text-navy-foreground/90"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-page flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 shadow-glow-gold">
            <Lightbulb className="size-4 text-white" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            lumora
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {/* Shop with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground">
              Shop
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}
              />
            </button>

            {shopOpen && (
              <div className="absolute top-full left-1/2 z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-border bg-white p-3 shadow-xl">
                <p className="mb-2 px-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Categories
                </p>
                {categories.map((c) => {
                  const Icon = catIcons[c.slug as keyof typeof catIcons];
                  return (
                    <Link
                      key={c.slug}
                      to="/shop"
                      search={{ category: c.slug }}
                      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-secondary"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Icon
                          className={`size-4 ${catColors[c.slug as keyof typeof catColors]}`}
                        />
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
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/8 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                  >
                    View all products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {nav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden text-foreground/70 sm:inline-flex">
            <Search className="size-5" />
          </Button>

          {/* Admin link */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-xs font-semibold text-foreground/60 lg:inline-flex"
          >
            <Link to="/admin">Admin</Link>
          </Button>

          {/* Account */}
          <Button asChild variant="ghost" size="icon" className="hidden text-foreground/70 sm:inline-flex">
            <Link to="/account" aria-label="Customer account">
              <User className="size-5" />
            </Link>
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="hidden text-foreground/70 sm:inline-flex">
            <Heart className="size-5" />
          </Button>

          {/* Cart */}
          <Button asChild variant="ghost" size="icon" className="relative text-foreground/70">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </Button>

          {/* Call CTA (desktop) */}
          <a
            href="tel:+2348030000000"
            className="ml-2 hidden items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground transition-all hover:-translate-y-0.5 hover:shadow-md lg:flex"
          >
            <Phone className="size-3.5" />
            Call us
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-1 lg:hidden"
                aria-label="Open menu"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[85vw] max-w-sm flex-col p-0">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 shadow-glow-gold">
                  <Lightbulb className="size-3.5 text-white" />
                </span>
                <SheetTitle className="font-display text-lg font-extrabold">lumora</SheetTitle>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Shop by category
                </p>
                <div className="mb-6 grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const Icon = catIcons[c.slug as keyof typeof catIcons];
                    return (
                      <Link
                        key={c.slug}
                        to="/shop"
                        search={{ category: c.slug }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl border border-border p-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                      >
                        <Icon
                          className={`size-4 shrink-0 ${catColors[c.slug as keyof typeof catColors]}`}
                        />
                        <span className="line-clamp-1 text-xs">{c.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  Navigation
                </p>
                <nav className="flex flex-col gap-1">
                  {[
                    ...nav,
                    { to: "/account", label: "My Account" },
                    { to: "/admin", label: "Admin Dashboard" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
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
                  href="tel:+2348030000000"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-bold text-gold-foreground"
                >
                  <Phone className="size-4" /> +234 803 000 0000
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category pills bar */}
      <div className="hidden border-t border-border/50 bg-surface/80 backdrop-blur-sm lg:block">
        <div className="container-page flex h-10 items-center gap-4 overflow-x-auto">
          {categories.map((c) => {
            const Icon = catIcons[c.slug as keyof typeof catIcons];
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-foreground/65 transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                <Icon className={`size-3 ${catColors[c.slug as keyof typeof catColors]}`} />
                {c.name}
              </Link>
            );
          })}
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" /> In stock
            </span>
            <span>·</span>
            <span>Free delivery Lagos</span>
          </div>
        </div>
      </div>
    </header>
  );
}
