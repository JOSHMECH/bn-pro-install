import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Package, TrendingUp, Users, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { products } from "@/lib/catalog";
import { naira } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | BN Electricals" },
      {
        name: "description",
        content:
          "Internal dashboard for managing BN Electricals products, installation requests and customer records.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const requests = [
  { ref: "BK-2291", customer: "Adaeze Okafor", service: "AC Installation", date: "18 Aug 2026", slot: "10:00 AM – 12:00 PM", status: "Confirmed" },
  { ref: "BK-2293", customer: "Musa Bello", service: "Inverter Setup", date: "19 Aug 2026", slot: "8:00 AM – 10:00 AM", status: "Pending" },
  { ref: "BK-2295", customer: "Chuka Eze", service: "TV Wall Mounting", date: "20 Aug 2026", slot: "2:00 PM – 4:00 PM", status: "Assigned" },
  { ref: "BK-2298", customer: "Fatima Yusuf", service: "House Wiring", date: "22 Aug 2026", slot: "8:00 AM – 10:00 AM", status: "Pending" },
];

const customers = [
  { name: "Adaeze Okafor", phone: "+234 803 111 2233", city: "Lekki, Lagos", orders: 4, spend: 1860000 },
  { name: "Musa Bello", phone: "+234 806 555 7788", city: "Wuse, Abuja", orders: 2, spend: 1620000 },
  { name: "Chuka Eze", phone: "+234 812 909 3344", city: "GRA, Port Harcourt", orders: 1, spend: 516000 },
  { name: "Fatima Yusuf", phone: "+234 809 220 1188", city: "Kano", orders: 3, spend: 940000 },
];

function Admin() {
  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Products, installation requests and customer records
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 border-gold text-gold-foreground">
          Preview data
        </Badge>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: TrendingUp, label: "Revenue (30 days)", value: naira(14_850_000) },
          { icon: Package, label: "Products listed", value: String(products.length) },
          { icon: Wrench, label: "Open installations", value: "12" },
          { icon: Users, label: "Customers", value: "486" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <s.icon className="size-5 text-gold" />
            <p className="mt-3 font-display text-xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="requests" className="mt-8">
        <TabsList>
          <TabsTrigger value="requests">Installations</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & slot</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.ref}>
                    <TableCell className="font-medium">{r.ref}</TableCell>
                    <TableCell>{r.customer}</TableCell>
                    <TableCell>{r.service}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarClock className="size-3.5 text-gold" /> {r.date} · {r.slot}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Pending" ? "secondary" : "default"}>{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Install fee</TableHead>
                  <TableHead>Warranty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.slug}>
                    <TableCell className="max-w-[16rem] truncate font-medium">{p.name}</TableCell>
                    <TableCell className="whitespace-nowrap capitalize text-muted-foreground">
                      {p.category.replace(/-/g, " ")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{naira(p.price)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.installFee ? naira(p.installFee) : "—"}
                    </TableCell>
                    <TableCell className="max-w-[14rem] truncate text-muted-foreground">
                      {p.warranty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="mt-4">Add new product</Button>
        </TabsContent>

        <TabsContent value="customers" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Lifetime spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{c.city}</TableCell>
                    <TableCell>{c.orders}</TableCell>
                    <TableCell className="whitespace-nowrap">{naira(c.spend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
