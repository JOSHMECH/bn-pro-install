import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Check, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import installerImg from "@/assets/installer.jpg";
import { services } from "@/lib/catalog";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Installation Services — AC, TV, Wiring, Inverter | BN Electricals" },
      {
        name: "description",
        content:
          "Professional AC installation, TV wall mounting, ceiling fans, house wiring, lighting, inverter systems and generator setup with workmanship warranty.",
      },
      { property: "og:title", content: "Professional Installation Services | BN Electricals" },
      {
        property: "og:description",
        content:
          "Certified Nigerian technicians for AC, TV, wiring, lighting, inverter and generator installation.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="surface-navy">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-wider text-gold uppercase">Our services</p>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Installation done right, the first time
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
              Our in-house technicians are vetted, uniformed and insured. Every job carries a
              workmanship warranty, and we clean up before we leave.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 bg-gold text-gold-foreground hover:bg-gold/90"
            >
              <Link to="/booking">
                <CalendarClock className="size-4" /> Book a technician
              </Link>
            </Button>
          </div>
          <img
            src={installerImg}
            alt="Technician installing an air conditioner"
            width={1408}
            height={1008}
            loading="lazy"
            className="w-full rounded-xl border border-navy-foreground/15 shadow-premium"
          />
        </div>
      </section>

      <div className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              className="scroll-mt-28 rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-display text-lg font-bold">{s.name}</h2>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  From {naira(s.from)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {s.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {i}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-gold" /> {s.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-gold" /> {s.warranty}
                </span>
              </div>
              <Button asChild variant="outline" className="mt-5 w-full sm:w-auto">
                <Link to="/booking" search={{ service: s.slug }}>
                  Book {s.name.toLowerCase()}
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
