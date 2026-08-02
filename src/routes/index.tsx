import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  Hammer,
  Headphones,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import heroImg from "@/assets/hero-appliances.jpg";
import installerImg from "@/assets/installer.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, products, services } from "@/lib/catalog";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BN Electricals & Home Appliances | Buy with Expert Installation" },
      {
        name: "description",
        content:
          "Shop genuine home appliances, electrical materials and building supplies in Nigeria. Add professional installation at checkout, book your date, pay online.",
      },
      { property: "og:title", content: "BN Electricals & Home Appliances" },
      {
        property: "og:description",
        content:
          "Appliances, electrical and building materials with certified installation and nationwide delivery.",
      },
    ],
  }),
  component: Home,
});

const catIcons = { "home-appliances": AirVent, "electrical-materials": Zap, "building-materials": Hammer };

function Home() {
  const featured = products.filter((p) => ["lg-1-5hp-dual-inverter-ac", "hisense-55-inch-4k-smart-tv", "felicity-3-5kva-hybrid-inverter", "schneider-8-way-distribution-board"].includes(p.slug));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden surface-navy">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-gold uppercase">
              <BadgeCheck className="size-3.5" /> Trusted since 2014
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
              Quality appliances,
              <span className="block text-gradient-gold">fitted by professionals.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/75">
              BN Electricals and Home Appliances supplies genuine home appliances, electrical
              materials and building materials across Nigeria — and our certified technicians install
              them properly, with warranty.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/shop">
                  Shop products <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
              >
                <Link to="/services">Installation services</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-navy-foreground/15 pt-6">
              {[
                { k: "4,800+", v: "Orders delivered" },
                { k: "36", v: "States covered" },
                { k: "12mo", v: "Workmanship warranty" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-bold text-gold">{s.k}</dt>
                  <dd className="mt-1 text-xs text-navy-foreground/65">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Modern Nigerian living room with split air conditioner and wall-mounted television"
              width={1600}
              height={1104}
              className="w-full rounded-xl border border-navy-foreground/15 shadow-premium"
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Nationwide delivery", d: "Lagos same-day, states in 2–4 days" },
            { icon: Wrench, t: "Certified installers", d: "Vetted, uniformed technicians" },
            { icon: CreditCard, t: "Secure online payment", d: "Card, transfer, USSD" },
            { icon: Headphones, t: "WhatsApp support", d: "Real answers, fast" },
          ].map((i) => (
            <div key={i.t} className="flex gap-3">
              <i.icon className="mt-0.5 size-5 shrink-0 text-gold" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{i.t}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop by category</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Everything for a finished home or site — supplied from stock, priced transparently.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((c) => {
            const Icon = catIcons[c.slug];
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-gold/60"
              >
                <span className="grid size-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured this week</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Installation can be added to any of these at checkout.
              </p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
              View all products
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <img
            src={installerImg}
            alt="BN Electricals technician installing a split air conditioner"
            width={1408}
            height={1008}
            loading="lazy"
            className="w-full rounded-xl border border-border shadow-card"
          />
          <div>
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
              Professional installation
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Buy the product only, or let us fit it properly
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every installable product shows its installation fee, estimated time on site and
              warranty cover. Choose your preferred date and time slot and our team confirms on
              WhatsApp.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
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
                <Link to="/services">See service details</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How ordering works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              { t: "Pick your products", d: "Browse the catalogue and add items to your cart." },
              { t: "Add installation", d: "Optional — fee and duration shown upfront." },
              { t: "Choose a date", d: "Select your preferred installation date and time slot." },
              { t: "Pay & relax", d: "Pay securely online, we deliver and install." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <span className="font-display text-sm font-bold text-gold">0{i + 1}</span>
                <h3 className="mt-2 font-display text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
