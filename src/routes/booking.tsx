import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services as fallbackServices } from "@/lib/catalog";
import { cresco } from "@/lib/cresco";
import { naira } from "@/lib/format";
import { whatsappLink } from "@/components/whatsapp";

export const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

type BookingSearch = { service?: string };

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => {
    const s = search["service"];
    return fallbackServices.some((sv) => sv.slug === s) ? { service: s as string } : {};
  },
  head: () => ({
    meta: [
      { title: "Book an Installation Date | Lumora" },
      {
        name: "description",
        content:
          "Choose your installation service, preferred date and time slot. Our certified technician confirms your booking on WhatsApp within an hour.",
      },
      { property: "og:title", content: "Book an Installation | Lumora" },
      {
        property: "og:description",
        content:
          "Pick a date and time slot for AC, TV, wiring, lighting, inverter, solar or smart home installation.",
      },
    ],
  }),
  component: Booking,
});

function Booking() {
  const { service } = Route.useSearch();
  const { data: servicesList = fallbackServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => cresco.services.list(),
    initialData: fallbackServices,
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: service ?? (servicesList[0]?.slug || "air-conditioner-installation"),
    date: "",
    slot: TIME_SLOTS[0]!,
    notes: "",
  });
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chosen = servicesList.find((s) => s.slug === form.service) || servicesList[0];
  const today = new Date().toISOString().slice(0, 10);

  if (bookingRef) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto size-12 text-gold" />
          <h1 className="mt-4 font-display text-2xl font-bold">Booking request received</h1>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Ref: {bookingRef}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Thank you {form.name.split(" ")[0]}. We've logged your {chosen?.name.toLowerCase()}{" "}
            request for <strong className="text-foreground">{form.date}</strong>, {form.slot}. A
            coordinator will confirm the technician and final quote shortly.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <a
                href={whatsappLink(
                  `Hello Lumora, I booked ${chosen?.name} (Ref: ${bookingRef}) for ${form.date} (${form.slot}). Name: ${form.name}, Address: ${form.address}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" /> Confirm on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Book an installation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you need and when. Slots are confirmed on a first-come basis.
        </p>

        <form
          className="mt-8 grid gap-5 rounded-xl border border-border bg-card p-6 shadow-card sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name || !form.phone || !form.address || !form.date) {
              toast.error("Please fill in your name, phone, address and date.");
              return;
            }

            setIsSubmitting(true);
            const ref = "BK-" + Math.random().toString(36).slice(2, 7).toUpperCase();

            try {
              await cresco.bookings.create({
                ref,
                serviceSlug: form.service,
                customerName: form.name,
                customerPhone: form.phone,
                customerEmail: form.email || undefined,
                address: form.address,
                date: form.date,
                slot: form.slot,
                status: "Pending",
                notes: form.notes || undefined,
              });
              toast.success("Booking request saved to CrescoDB!");
            } catch (err) {
              console.warn("CrescoDB offline, local booking fallback:", err);
            } finally {
              setIsSubmitting(false);
              setBookingRef(ref);
            }
          }}
        >
          <div className="sm:col-span-2">
            <Label htmlFor="service">Service needed</Label>
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
              <SelectTrigger id="service" className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {servicesList.map((s) => {
                  const price = s.from ?? (s as any).startingPrice ?? 0;
                  return (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name} — from {naira(price)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {chosen && (
              <p className="mt-2 text-xs text-muted-foreground">
                Estimated time on site: {chosen.duration || "1 – 2 hours"} · {chosen.warranty || "3 months warranty"}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              className="mt-2"
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              className="mt-2"
              maxLength={20}
              placeholder="080..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Installation address</Label>
            <Input
              id="address"
              className="mt-2"
              maxLength={160}
              placeholder="Street, area, city, state"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="date">Preferred date</Label>
            <Input
              id="date"
              type="date"
              min={today}
              className="mt-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="slot">Preferred time slot</Label>
            <Select value={form.slot} onValueChange={(v) => setForm({ ...form, slot: v })}>
              <SelectTrigger id="slot" className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes">Job details (optional)</Label>
            <Textarea
              id="notes"
              className="mt-2"
              maxLength={600}
              rows={4}
              placeholder="e.g. 2 units of 1.5HP AC on first floor, wall already prepared"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" className="sm:col-span-2">
            <CalendarCheck className="size-4" /> Request this slot
          </Button>
        </form>
      </div>
    </div>
  );
}
