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
  Star,
  Truck,
  Wrench,
  Zap,
  Play,
  Quote,
  Mail,
} from "lucide-react";
import heroImg from "@/assets/hero-appliances.jpg";
import installerImg from "@/assets/installer.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, products, services } from "@/lib/catalog";
import { naira } from "@/lib/format";
import { useState, useEffect } from "react";

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

const testimonials = [
  {
    name: "Adaeze Okafor",
    city: "Lekki, Lagos",
    text: "Lumora delivered my AC and had technicians install it the same day. Everything was professional and the warranty process was seamless. Never going back to local markets.",
    rating: 5,
    initials: "AO",
    color: "bg-blue-500",
  },
  {
    name: "Musa Bello",
    city: "Wuse, Abuja",
    text: "Ordered the Felicity inverter system. Installation took 2 days as promised, and the team was uniformed and thorough. My home now runs perfectly during NEPA outages.",
    rating: 5,
    initials: "MB",
    color: "bg-amber-500",
  },
  {
    name: "Chidinma Eze",
    city: "GRA, Port Harcourt",
    text: "Bought CCTV cameras for my compound from the Home Solutions category. Setup was incredible — I can now monitor remotely on my phone. Highly recommend Lumora!",
    rating: 5,
    initials: "CE",
    color: "bg-emerald-500",
  },
  {
    name: "Fatima Yusuf",
    city: "Kano",
    text: "Amazing prices for Dangote cement and floor tiles. Delivery was on time to Kano which shocked me. The bulk pricing saved my construction project a lot of money.",
    rating: 4,
    initials: "FY",
    color: "bg-violet-500",
  },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2">
      {[
        { v: timeLeft.h, l: "HRS" },
        { v: timeLeft.m, l: "MIN" },
        { v: timeLeft.s, l: "SEC" },
      ].map(({ v, l }, i) => (
        <span key={l} className="flex items-center gap-2">
          <span className="flex flex-col items-center">
            <span className="min-w-[2.5rem] rounded-lg bg-white/15 px-2 py-1 text-center font-display text-lg font-bold text-white tabular-nums backdrop-blur-sm">
              {String(v).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[9px] font-bold tracking-wider text-white/60 uppercase">
              {l}
            </span>
          </span>
          {i < 2 && <span className="mb-3 font-bold text-white/60">:</span>}
        </span>
      ))}
    </div>
  );
}

const saleEnd = new Date(Date.now() + 12 * 3600000 + 37 * 60000);

function Home() {
  const featured = products.filter((p) =>
    [
      "lg-1-5hp-dual-inverter-ac",
      "hisense-55-inch-4k-smart-tv",
      "felicity-3-5kva-hybrid-inverter",
      "hikvision-4ch-cctv-kit",
    ].includes(p.slug),
  );

  const onSale = products.filter((p) => p.oldPrice);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden surface-navy">
        {/* Mesh background overlay */}
        <div className="pointer-events-none absolute inset-0 mesh-bg" />

        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-xs font-bold tracking-wide text-gold uppercase">
              <BadgeCheck className="size-3.5" /> Trusted since 2014 · 4,800+ orders
            </span>

            <h1 className="mt-6 font-display text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem]">
              <span className="text-white">Illuminate your space.</span>
              <span className="block text-gradient-hero">Build your world.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Lumora is Nigeria&apos;s premium destination for genuine home appliances, electrical
              materials, building materials and smart home solutions — with certified installation
              by our expert technicians.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold font-semibold text-gold-foreground shadow-glow-gold hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-glow-gold transition-all"
              >
                <Link to="/shop">
                  Shop all products <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/services">
                  <Play className="size-4" /> Installation services
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-8">
              {[
                { k: "4,800+", v: "Orders delivered" },
                { k: "36", v: "States covered" },
                { k: "12mo", v: "Workmanship warranty" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-extrabold text-gold">{s.k}</dt>
                  <dd className="mt-1 text-xs text-white/55">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero image */}
          <div className="relative animate-float">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 to-primary/20 blur-2xl" />
            <img
              src={heroImg}
              alt="Modern Nigerian living room with premium appliances"
              width={1600}
              height={1104}
              className="relative w-full rounded-2xl border border-white/15 shadow-premium"
            />
            {/* Floating badges */}
            <div className="glass-card absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500">
                <ShieldCheck className="size-4 text-white" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">Certified Installation</p>
                <p className="text-[10px] text-muted-foreground">12-month warranty on all work</p>
              </div>
            </div>
            <div className="glass-card absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-xl">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-foreground">4.9 / 5.0</p>
                <p className="text-[10px] text-muted-foreground">from 1,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ──────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface">
        <div className="container-page grid grid-cols-2 gap-5 py-7 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Nationwide delivery", d: "Lagos same-day, states 2–4 days" },
            { icon: Wrench, t: "Certified installers", d: "Vetted, uniformed technicians" },
            { icon: CreditCard, t: "Secure payments", d: "Card, transfer, USSD" },
            { icon: Headphones, t: "WhatsApp support", d: "Real answers, fast response" },
          ].map((i) => (
            <div key={i.t} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                <i.icon className="size-5 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold">{i.t}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{i.d}</p>
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
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Flash Sale
                  </span>
                  <CountdownTimer targetDate={saleEnd} />
                </div>
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
              src={installerImg}
              alt="Lumora certified technician installing a split air conditioner"
              width={1408}
              height={1008}
              loading="lazy"
              className="w-full rounded-2xl border border-border shadow-card"
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
              {services.slice(0, 6).map((s) => (
                <li key={s.slug} className="flex items-start gap-2.5 text-sm">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>
                    {s.name}
                    <span className="block text-xs text-muted-foreground">
                      From {naira(s.from)} · {s.duration}
                    </span>
                  </span>
                </li>
              ))}
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

      {/* ─── Testimonials ─────────────────────────────────────────────────── */}
      <section className="surface-dark py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-widest text-gold uppercase">Customer stories</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
              What our customers say
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <Quote className="size-5 text-gold/60" />
                <p className="flex-1 text-sm leading-relaxed text-white/75">{t.text}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-3 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "fill-white/20 text-white/20"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${t.color} text-xs font-bold text-white`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            Join 12,000+ subscribers getting weekly deals, new arrivals and installation tips.
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
