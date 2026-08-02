import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, Phone, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Installation" },
  { to: "/booking", label: "Book a Visit" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="surface-navy hidden text-xs md:block">
        <div className="container-page flex h-9 items-center justify-between">
          <p className="text-navy-foreground/80">
            Nationwide delivery · Certified technicians · Genuine products
          </p>
          <a href="tel:+2348030000000" className="flex items-center gap-2 text-gold">
            <Phone className="size-3.5" /> +234 803 000 0000
          </a>
        </div>
      </div>

      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md surface-navy font-display text-sm font-bold text-gold">
            BN
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight font-bold">
              BN Electricals
            </span>
            <span className="block truncate text-[11px] tracking-wide text-muted-foreground uppercase">
              & Home Appliances
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link to="/account" aria-label="Customer account">
              <User className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs">
              <SheetTitle className="font-display">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {[...nav, { to: "/account", label: "My Account" }, { to: "/admin", label: "Admin" }].map(
                  (item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-3 text-sm font-medium hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
              <Button asChild className="mt-6 w-full">
                <a href="tel:+2348030000000">Call us</a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
