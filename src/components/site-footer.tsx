import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CreditCard,
  Lightbulb,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
} from "lucide-react";
import { categories, services } from "@/lib/catalog";

const footerLinks = {
  company: [
    { label: "About Lumora", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Partners", href: "#" },
  ],
  help: [
    { label: "FAQ", href: "#" },
    { label: "Track your order", href: "#" },
    { label: "Returns & refunds", href: "#" },
    { label: "Warranty claims", href: "#" },
    { label: "Contact us", href: "/contact" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-24 surface-dark">
      {/* Newsletter banner */}
      <div className="border-b border-white/10">
        <div className="container-page py-10">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center lg:p-8">
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                Get exclusive deals & product drops
              </h3>
              <p className="mt-1 text-sm text-white/65">
                Join 12,000+ Nigerians who get our weekly deals newsletter.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md gap-2 sm:shrink-0"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand col */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500 shadow-glow-gold">
              <Lightbulb className="size-4 text-white" />
            </span>
            <span className="font-display text-xl font-extrabold text-white">lumora</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Nigeria&apos;s premium destination for home appliances, electrical materials, building
            materials and smart home solutions — with certified installation nationwide.
          </p>

          {/* Contact */}
          <div className="mt-5 space-y-2 text-sm text-white/70">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              Head office & showroom, Lagos Island, Nigeria
            </p>
            <a href="tel:+2348167054402" className="flex items-center gap-2 hover:text-gold">
              <Phone className="size-4 shrink-0 text-gold" />
              +234 803 000 0000
            </a>
            <a
              href="mailto:bnelectricalandhomeappliances@gmail.com"
              className="flex items-center gap-2 hover:text-gold"
            >
              <Mail className="size-4 shrink-0 text-gold" />
              hello@lumora.ng
            </a>
          </div>

          {/* Social */}
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/60 transition-colors hover:border-gold/40 hover:bg-white/10 hover:text-gold"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop col */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gold uppercase">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/shop"
                  search={{ category: c.slug }}
                  className="flex items-center gap-1.5 hover:text-gold"
                >
                  <ArrowRight className="size-3" />
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="flex items-center gap-1.5 hover:text-gold">
                <ArrowRight className="size-3" />
                All products
              </Link>
            </li>
            <li>
              <Link to="/shop" className="flex items-center gap-1.5 hover:text-gold">
                <ArrowRight className="size-3" />
                Flash sales
              </Link>
            </li>
          </ul>
        </div>

        {/* Services col */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gold uppercase">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="flex items-center gap-1.5 hover:text-gold"
                >
                  <ArrowRight className="size-3" />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company col */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gold uppercase">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            {footerLinks.company.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="flex items-center gap-1.5 hover:text-gold">
                  <ArrowRight className="size-3" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help col */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gold uppercase">Help</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            {footerLinks.help.map((l) => (
              <li key={l.label}>
                {l.href.startsWith("/") ? (
                  <Link to={l.href} className="flex items-center gap-1.5 hover:text-gold">
                    <ArrowRight className="size-3" />
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} className="flex items-center gap-1.5 hover:text-gold">
                    <ArrowRight className="size-3" />
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Why Lumora */}
          <div className="mt-8 space-y-3 text-sm text-white/65">
            <h3 className="text-xs font-bold tracking-widest text-gold uppercase">
              Why Lumora
            </h3>
            <p className="flex gap-2.5">
              <Truck className="size-4 shrink-0 text-gold" /> Nationwide delivery · all 36 states
            </p>
            <p className="flex gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-gold" /> Warranty on every product & job
            </p>
            <p className="flex gap-2.5">
              <CreditCard className="size-4 shrink-0 text-gold" /> Secure card, transfer & USSD
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lumora. All rights reserved. RC registered business · Lagos, Nigeria.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-white/70">Privacy Policy</a>
            <a href="#" className="hover:text-white/70">Terms of Service</a>
            <a href="#" className="hover:text-white/70">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
