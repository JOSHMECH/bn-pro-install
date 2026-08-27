import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Lock, Smartphone, Banknote, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { naira } from "@/lib/format";
import { whatsappLink } from "@/components/whatsapp";

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

const STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Ogun",
  "Oyo",
  "Rivers",
  "Kano",
  "Kaduna",
  "Enugu",
  "Anambra",
  "Delta",
  "Other state",
];

const DELIVERY: Record<string, number> = { Lagos: 8000, "Abuja (FCT)": 15000 };
const DEFAULT_DELIVERY = 22000;

const PAYMENTS = [
  { id: "card", label: "Debit / credit card", icon: CreditCard, note: "Verve, Mastercard, Visa" },
  { id: "transfer", label: "Bank transfer", icon: Banknote, note: "Instant account confirmation" },
  { id: "ussd", label: "USSD", icon: Smartphone, note: "Pay from your bank app or *code#" },
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | BN Electricals and Home Appliances" },
      {
        name: "description",
        content:
          "Pay securely by card, bank transfer or USSD. Choose nationwide delivery and schedule your installation date and time slot.",
      },
      { property: "og:title", content: "Secure Checkout | BN Electricals" },
      {
        property: "og:description",
        content: "Card, transfer and USSD payments with scheduled installation.",
      },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { detailed, productsTotal, installationTotal, needsInstallation, total, clear } = useCart();
  const [placed, setPlaced] = useState<{ ref: string; amount: number } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    date: "",
    slot: TIME_SLOTS[0]!,
    notes: "",
    payment: "card",
  });

  const delivery = DELIVERY[form.state] ?? DEFAULT_DELIVERY;
  const grandTotal = total + delivery;
  const today = new Date().toISOString().slice(0, 10);

  if (placed) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto size-12 text-gold" />
          <h1 className="mt-4 font-display text-2xl font-bold">Order placed</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Reference <strong className="text-foreground">{placed.ref}</strong> · Amount{" "}
            <strong className="text-foreground">{naira(placed.amount)}</strong>. We've sent the
            details to your phone and email. Our team will call to confirm delivery
            {needsInstallation ? " and your installation slot" : ""}.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <a
                href={whatsappLink(`Hello BN Electricals, my order reference is ${placed.ref}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Track on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Keep shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a product to your cart first.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Payments are encrypted. You only pay once your order summary looks right.
      </p>

      <form
        className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.phone || !form.address || !form.city) {
            toast.error("Please complete your delivery details.");
            return;
          }
          if (needsInstallation && !form.date) {
            toast.error("Choose an installation date and time slot.");
            return;
          }
          const ref = "BN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
          setPlaced({ ref, amount: grandTotal });
          clear();
        }}
      >
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  maxLength={120}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  className="mt-2"
                  maxLength={160}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City / town</Label>
                <Input
                  id="city"
                  className="mt-2"
                  maxLength={60}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                  <SelectTrigger id="state" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="size-3.5 text-gold" /> Delivery to {form.state}: {naira(delivery)}
            </p>
          </section>

          {needsInstallation && (
            <section className="rounded-xl border border-gold/50 bg-accent/40 p-6">
              <h2 className="font-display text-lg font-bold">Installation booking</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your order includes installation. Pick a date and slot — we confirm within an hour.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date">Installation date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    className="mt-2 bg-background"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slot">Time slot</Label>
                  <Select value={form.slot} onValueChange={(v) => setForm({ ...form, slot: v })}>
                    <SelectTrigger id="slot" className="mt-2 w-full bg-background">
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
                  <Label htmlFor="notes">Site notes (optional)</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    maxLength={600}
                    className="mt-2 bg-background"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
            </section>
          )}

          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Payment method</h2>
            <div className="mt-4 grid gap-3">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm({ ...form, payment: p.id })}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    form.payment === p.id
                      ? "border-gold bg-accent/50"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <p.icon className="size-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.note}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-gold" /> Secured checkout — your details are never
              shared.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {detailed.map(({ product, line, lineTotal }) => (
              <li key={product.slug} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Qty {line.qty}
                    {line.installation ? " · with installation" : ""}
                  </span>
                </span>
                <span className="shrink-0 font-medium">{naira(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Products</dt>
              <dd>{naira(productsTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Installation</dt>
              <dd>{installationTotal ? naira(installationTotal) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{naira(delivery)}</dd>
            </div>
          </dl>
          <Separator className="my-4" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Total due</span>
            <span className="font-display text-2xl font-extrabold">{naira(grandTotal)}</span>
          </div>
          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >
            Pay {naira(grandTotal)}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/cart">Back to cart</Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
