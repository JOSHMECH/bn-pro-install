import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Check, Clock, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services as fallbackServices } from "@/lib/catalog";
import { cresco } from "@/lib/cresco";
import { naira } from "@/lib/format";

const REAL_TECHNICIAN_PHOTO =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Installation Services — AC, TV, Wiring, CCTV & More | Lumora" },
      {
        name: "description",
        content:
          "Professional AC installation, TV wall mounting, house wiring, CCTV, smart locks, water pumps, solar panels and more — with workmanship warranty by Lumora's certified technicians.",
      },
      { property: "og:title", content: "Professional Installation Services | Lumora" },
      {
        property: "og:description",
        content:
          "Lumora certified technicians for AC, TV, wiring, lighting, inverter, CCTV, solar and generator installation nationwide.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  const { data: servicesList = fallbackServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => cresco.services.list(),
    initialData: fallbackServices,
  });

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
              Lumora&apos;s in-house technicians are vetted, uniformed and insured. Every job carries a
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
            src={REAL_TECHNICIAN_PHOTO}
            alt="Certified Lumora electrical technician installing equipment"
            width={1200}
            height={800}
            loading="lazy"
            className="w-full rounded-xl border border-navy-foreground/15 shadow-premium object-cover max-h-[420px]"
          />
        </div>
      </section>

      <div className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {servicesList.map((s) => {
            const price = s.from ?? (s as any).startingPrice ?? 0;
            const desc = s.description ?? (s as any).tagline ?? "";
            const highlights = Array.isArray(s.includes) && s.includes.length > 0
              ? s.includes
              : Array.isArray((s as any).highlights)
              ? (s as any).highlights
              : [];

            return (
              <article
                key={s.slug}
                id={s.slug}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover"
              >
                {s.image && (
                  <div className="relative h-44 w-full overflow-hidden bg-secondary">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-sm">
                      From {naira(price)}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-display text-lg font-bold">{s.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  {highlights.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {highlights.map((i: string) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> {i}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" /> {s.duration || "1 – 2 hours"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" /> {s.warranty || "3 months warranty"}
                    </span>
                  </div>
                  <Button asChild className="mt-5 w-full sm:w-auto bg-primary hover:bg-primary/90">
                    <Link to="/booking" search={{ service: s.slug }}>
                      Book this service
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
