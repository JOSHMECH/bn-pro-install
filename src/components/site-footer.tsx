import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { categories, services } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-20 surface-navy">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-navy-foreground/10 font-display font-bold text-gold">
              BN
            </span>
            <span className="font-display font-bold">BN Electricals</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
            A trusted Nigerian supplier of home appliances, electrical materials and building
            materials — with certified installation teams nationwide.
          </p>
          <div className="mt-5 space-y-2 text-sm text-navy-foreground/80">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" /> Head office & showroom, Lagos,
              Nigeria
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-gold" /> +234 803 000 0000
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-gold" /> sales@bnelectricals.ng
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gold uppercase">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/shop" search={{ category: c.slug }} className="hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="hover:text-gold">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gold uppercase">Installation</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/75">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link to="/services" hash={s.slug} className="hover:text-gold">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gold uppercase">
            Why shop with us
          </h3>
          <ul className="mt-4 space-y-3.5 text-sm text-navy-foreground/75">
            <li className="flex gap-2.5">
              <Truck className="size-4 shrink-0 text-gold" /> Nationwide delivery to all 36 states
            </li>
            <li className="flex gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-gold" /> Warranty on every product & job
            </li>
            <li className="flex gap-2.5">
              <CreditCard className="size-4 shrink-0 text-gold" /> Secure card, transfer & USSD
              payments
            </li>
          </ul>
          <Link
            to="/booking"
            className="mt-5 inline-flex rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground"
          >
            Book an installation
          </Link>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy-foreground/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} BN Electricals and Home Appliances. All rights reserved.</p>
          <p>RC registered business · Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
