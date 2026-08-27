import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock, LogIn, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Customer Login & Orders | BN Electricals" },
      {
        name: "description",
        content:
          "Sign in to track your BN Electricals orders, view installation bookings and download warranty records.",
      },
      { property: "og:title", content: "Customer Account | BN Electricals" },
      {
        property: "og:description",
        content: "Track orders, bookings and warranties in one place.",
      },
    ],
  }),
  component: Account,
});

const demoOrders = [
  {
    ref: "BN-8F2K1A",
    date: "12 Jul 2026",
    items: "LG 1.5HP AC × 1 (with installation)",
    total: 628000,
    status: "Installed",
  },
  {
    ref: "BN-7QX9ZC",
    date: "28 Jun 2026",
    items: "Nocaco 4mm² Cable × 2",
    total: 304000,
    status: "Delivered",
  },
];

const demoBookings = [
  {
    ref: "BK-2291",
    service: "Air Conditioner Installation",
    date: "18 Aug 2026",
    slot: "10:00 AM – 12:00 PM",
    status: "Confirmed",
  },
  {
    ref: "BK-2264",
    service: "Lighting Installation",
    date: "02 Aug 2026",
    slot: "2:00 PM – 4:00 PM",
    status: "Completed",
  },
];

function Account() {
  const [signedIn, setSignedIn] = useState(false);

  if (!signedIn) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold">Customer area</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track orders, bookings and warranty records.
          </p>
          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="signin" className="flex-1">
                Sign in
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                Create account
              </TabsTrigger>
            </TabsList>
            {["signin", "signup"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSignedIn(true);
                    toast.success(tab === "signin" ? "Welcome back" : "Account created");
                  }}
                >
                  {tab === "signup" && (
                    <div>
                      <Label htmlFor="a-name">Full name</Label>
                      <Input id="a-name" className="mt-2" maxLength={80} />
                    </div>
                  )}
                  <div>
                    <Label htmlFor={`${tab}-email`}>Email address</Label>
                    <Input
                      id={`${tab}-email`}
                      type="email"
                      className="mt-2"
                      maxLength={120}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${tab}-pass`}>Password</Label>
                    <Input
                      id={`${tab}-pass`}
                      type="password"
                      className="mt-2"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <LogIn className="size-4" /> {tab === "signin" ? "Sign in" : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>
          <p className="mt-5 text-xs text-muted-foreground">
            Preview mode: accounts are demonstration only until the secure customer database is
            switched on.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-extrabold sm:text-3xl">My account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Orders, bookings and warranties</p>
        </div>
        <Button variant="outline" onClick={() => setSignedIn(false)}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <Package className="size-5 text-gold" /> Recent orders
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {demoOrders.map((o) => (
              <li key={o.ref} className="py-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{o.ref}</span>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{o.items}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {o.date} · {naira(o.total)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <CalendarClock className="size-5 text-gold" /> Installation bookings
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {demoBookings.map((b) => (
              <li key={b.ref} className="py-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{b.service}</span>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {b.ref} · {b.date} · {b.slot}
                </p>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/booking">Book another installation</Link>
          </Button>
        </section>
      </div>

      <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-gold" /> Warranty certificates are issued after every
        completed installation.
      </p>
    </div>
  );
}
