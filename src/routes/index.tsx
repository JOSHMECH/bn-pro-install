import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Hammer,
  Headphones,
  Home as HomeIcon,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
  Play,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { categories, products as fallbackProducts, services as fallbackServices } from "@/lib/catalog";
import { cresco } from "@/lib/cresco";
import { naira } from "@/lib/format";

const REAL_HERO_PHOTO =
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop&q=80";
const REAL_INSTALLER_PHOTO =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumora — Home Appliances, Electrical & Building Materials | Nigeria" },
      {
        name: "description",
        content:
          "Shop genuine home appliances, electrical materials, building materials and home solutions in Nigeria. Add professional installation at checkout, book your date, pay online.",
      },
      { property: "og:title", content: "Lumora — Illuminate Your Space. Build Your World." },
      {
        property: "og:description",
        content:
          "Nigeria's premium e-commerce store for appliances, electrical, building materials & home solutions with certified installation.",
      },
    ],
  }),
  component: Home,
});

const catIcons = {
  "home-appliances": AirVent,
  "electrical-materials": Zap,
  "building-materials": Hammer,
  "home-solutions": HomeIcon,
};

const catGradients: Record<string, string> = {
  "home-appliances": "from-blue-500/20 to-blue-500/5",
  "electrical-materials": "from-amber-500/20 to-amber-500/5",
  "building-materials": "from-violet-500/20 to-violet-500/5",
  "home-solutions": "from-emerald-500/20 to-emerald-500/5",
};

const catBorderHover: Record<string, string> = {
  "home-appliances": "hover:border-blue-400/60",
  "electrical-materials": "hover:border-amber-400/60",
  "building-materials": "hover:border-violet-400/60",
  "home-solutions": "hover:border-emerald-400/60",
};

const catTextColor: Record<string, string> = {
  "home-appliances": "text-blue-500",
  "electrical-materials": "text-amber-500",
  "building-materials": "text-violet-500",
  "home-solutions": "text-emerald-500",
};

function Home() {
  const { data: dbProducts = fallbackProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => cresco.products.list(),
    initialData: fallbackProducts,
  });

  const { data: dbServices = fallbackServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => cresco.services.list(),
    initialData: fallbackServices,
  });

  const featured = dbProducts.slice(0, 8);
  const onSale = dbProducts.filter((p) => p.oldPrice);

  return (
    <>
      {/* ─── Modern E-Commerce Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-background pt-6 pb-10">
        <div className="container-page space-y-6">
          {/* Main Hero Grid */}
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            {/* Primary Main Showcase Billboard (8 Cols) */}
            <div className="relative overflow-hidden rounded-3xl surface-navy p-8 lg:col-span-8 lg:p-12 shadow-premium flex flex-col justify-between min-h-[460px]">
              {/* Background photography with overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={REAL_HERO_PHOTO}
                  alt="Modern appliances showroom"
                  className="size-full object-cover opacity-25 mix-blend-luminosity scale-105 transition-transform duration-700 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              </div>

              {/* Top pill & brands */}
              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-extrabold tracking-wide text-gold uppercase shadow-sm">
                    <BadgeCheck className="size-3.5" /> 100% Genuine · Certified Installation
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    Official Brands: LG · Samsung · Felicity · Schneider
                  </span>
                </div>

                <h1 className="max-w-2xl font-display text-3xl font-black leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                  Nigeria&apos;s Store for <span className="text-gradient-hero">Genuine Appliances</span> & Home Solutions
                </h1>

                <p className="max-w-xl text-sm sm:text-base leading-relaxed text-white/75">
                  Get authentic cooling, kitchen appliances, solar systems and building supplies delivered across all 36 states — with certified technician installation at checkout.
                </p>
              </div>

              {/* CTA and Value Tickers */}
              <div className="relative z-10 pt-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gold font-bold text-gold-foreground shadow-glow-gold hover:-translate-y-0.5 hover:bg-gold/90 transition-all text-sm px-6 h-12"
                  >
                    <Link to="/shop">
                      Explore All Products <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/25 bg-white/5 font-semibold text-white hover:bg-white/15 hover:text-white text-sm h-12"
                  >
                    <Link to="/booking">
                      <Wrench className="size-4 text-gold" /> Book a Technician
                    </Link>
                  </Button>
                </div>

                {/* Capability Badges */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/15 pt-5 max-w-xl text-white/85">
                  <div>
                    <p className="font-display text-lg sm:text-xl font-black text-gold">Lagos</p>
                    <p className="text-[11px] text-white/60">Same-Day Dispatch</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-xl font-black text-gold">36 States</p>
                    <p className="text-[11px] text-white/60">Nationwide Delivery</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-xl font-black text-gold">12 Months</p>
                    <p className="text-[11px] text-white/60">Workmanship Warranty</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Double Feature Banners (4 Cols) */}
            <div className="flex flex-col gap-4 lg:col-span-4 lg:gap-6 justify-between">
              {/* Promo Tile 1: Solar & Inverter Backup */}
              <Link
                to="/shop"
                search={{ category: "home-solutions" }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-xl flex-1 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 h-full w-2/5 overflow-hidden opacity-30 group-hover:opacity-45 transition-opacity">
                  <img
                    src="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80"
                    alt="Solar & Inverter System"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Zap className="size-3" /> Zero Blackouts
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Solar & Inverter Power Kits
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Hybrid inverters & lithium storage packages with full setup.
                  </p>
                </div>

                <div className="relative z-10 mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="text-xs font-extrabold text-primary">From {naira(585000)}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-foreground group-hover:translate-x-1 transition-transform">
                    Shop Solar <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>

              {/* Promo Tile 2: Certified Professional Installation */}
              <Link
                to="/booking"
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-xl flex-1 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 h-full w-2/5 overflow-hidden opacity-30 group-hover:opacity-45 transition-opacity">
                  <img
                    src={REAL_INSTALLER_PHOTO}
                    alt="Certified Technician"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent" />
                </div>

                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3" /> Vetted Technicians
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Professional Installation
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    AC fitting, solar wiring & CCTV mounting with upfront pricing.
                  </p>
                </div>

                <div className="relative z-10 mt-5 flex items-center justify-between border-t border-border/70 pt-3">
                  <span className="text-xs font-semibold text-muted-foreground">12-Mo Warranty</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-foreground group-hover:translate-x-1 transition-transform">
                    Book Service <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── E-Commerce Trust & Guarantee Strip ───────────────────────────── */}
      <section className="border-y border-border bg-card/60">
        <div className="container-page grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Nationwide Express Delivery", d: "Lagos same-day, other states 2–4 days" },
            { icon: BadgeCheck, t: "100% Genuine Guaranteed", d: "Direct authorized manufacturer supply" },
            { icon: Wrench, t: "Certified Fitters & Warranty", d: "12-month workmanship coverage on every job" },
            { icon: CreditCard, t: "Secure & Flexible Payments", d: "Card, bank transfer or instant USSD" },
          ].map((i) => (
            <div key={i.t} className="flex items-center gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <i.icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground leading-snug">{i.t}</p>
                <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">What we sell</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Shop by category
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = catIcons[c.slug as keyof typeof catIcons] ?? Home;
            const borderHover = catBorderHover[c.slug] ?? "hover:border-primary/60";
            const textColor = catTextColor[c.slug] ?? "text-primary";
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover ${borderHover}`}
              >
                <div className="relative z-10">
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl bg-secondary shadow-sm ${textColor}`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{c.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.blurb}</p>
                </div>
                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${textColor}`}>
                    Explore products
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Flash sale ───────────────────────────────────────────────────── */}
      {onSale.length > 0 && (
        <section className="surface-lumora py-14">
          <div className="container-page">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Special Offers
                </span>
                <h2 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Limited-time price drops
                </h2>
              </div>
              <Link
                to="/shop"
                className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                All sale items →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {onSale.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured products ────────────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase">
                Curated picks
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                Featured this week
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Installation can be added to any of these at checkout.
              </p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
              View all products →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Lumora ───────────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">
            Why customers choose us
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            The Lumora difference
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BadgeCheck,
              title: "Genuine products",
              desc: "Every item sourced directly from authorised distributors. SON-certified where required.",
              color: "bg-blue-500/10 text-blue-600",
            },
            {
              icon: ShieldCheck,
              title: "Full warranty",
              desc: "Manufacturer warranty on products plus 12-month workmanship warranty on all installations.",
              color: "bg-emerald-500/10 text-emerald-600",
            },
            {
              icon: Wrench,
              title: "Expert installation",
              desc: "Our vetted technicians install everything correctly, first time. Uniformed, insured, punctual.",
              color: "bg-amber-500/10 text-amber-600",
            },
            {
              icon: Truck,
              title: "Fast delivery",
              desc: "Same-day delivery in Lagos, 2–4 day delivery to all 36 states. Track your order live.",
              color: "bg-violet-500/10 text-violet-600",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className={`flex size-12 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Installation CTA ─────────────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src={REAL_INSTALLER_PHOTO}
              alt="Lumora certified technician installing electrical and cooling equipment"
              width={1200}
              height={800}
              loading="lazy"
              className="w-full rounded-2xl border border-border shadow-card object-cover max-h-[420px]"
            />
            <div className="glass-card absolute -bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl p-4 shadow-xl sm:right-auto sm:min-w-72">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
                <ShieldCheck className="size-5 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold">Installation guaranteed</p>
                <p className="text-xs text-muted-foreground">
                  12-month workmanship warranty on every job
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">
              Professional installation
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Buy the product, or let us fit it right
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every installable product shows its fee, estimated time on site and warranty cover.
              Choose your preferred date — our team confirms on WhatsApp before arrival.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {dbServices.slice(0, 6).map((s) => {
                const price = s.from ?? (s as any).startingPrice ?? 0;
                return (
                  <li key={s.slug} className="flex items-start gap-2.5 text-sm">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                    <span>
                      {s.name}
                      <span className="block text-xs text-muted-foreground">
                        From {naira(price)} · {s.duration || "1 – 2 hours"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/booking">
                  <CalendarClock className="size-4" /> Book an installation
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/services">See all services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">Simple process</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            How ordering works
          </h2>
        </div>
        <ol className="relative mt-12 grid gap-5 md:grid-cols-4">
          {[
            {
              t: "Pick your products",
              d: "Browse the catalogue, filter by category, compare prices and add items to your cart.",
            },
            {
              t: "Add installation",
              d: "Optional — fee and duration shown upfront. Choose any installable product.",
            },
            {
              t: "Choose a date",
              d: "Select your preferred installation date and time slot. We confirm on WhatsApp.",
            },
            {
              t: "Pay & relax",
              d: "Pay securely online — we deliver, install and clean up. You just enjoy.",
            },
          ].map((s, i) => (
            <li key={s.t} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="font-display text-4xl font-black text-primary/15 select-none">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-base font-bold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Newsletter CTA ───────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-3xl surface-lumora p-10 text-center shadow-premium lg:p-16">
          <div className="pointer-events-none absolute inset-0 mesh-bg" />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-white uppercase">
            <Mail className="size-3.5" /> Exclusive deals
          </span>
          <h2 className="relative mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Don&apos;t miss a deal
          </h2>
          <p className="relative mt-3 text-white/70">
            Subscribe to get weekly price drops, new product arrivals and certified installation tips.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative mx-auto mt-8 flex max-w-md gap-2"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-gold-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
            >
              Subscribe
            </button>
          </form>
          <p className="relative mt-4 text-xs text-white/45">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
