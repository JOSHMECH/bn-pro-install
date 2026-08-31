import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/components/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Lumora — Lagos Showroom & WhatsApp Support" },
      {
        name: "description",
        content:
          "Call, email or WhatsApp Lumora for quotes on home appliances, electrical materials, building supplies, home solutions and professional installation.",
      },
      { property: "og:title", content: "Contact Lumora" },
      {
        property: "og:description",
        content: "Reach Lumora's Lagos showroom, sales line or WhatsApp support team.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Talk to us</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Need a quote for a full house, a site order, or advice on the right AC size? Our sales
            team responds fast — WhatsApp is usually quickest.
          </p>

          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                <span className="block font-semibold">Sales line</span>
                <a href="tel:+2348030000000" className="text-muted-foreground hover:text-primary">
                  +234 803 000 0000
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                <span className="block font-semibold">Email</span>
                <a
                  href="mailto:hello@lumora.ng"
                  className="text-muted-foreground hover:text-primary"
                >
                  hello@lumora.ng
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                <span className="block font-semibold">Showroom</span>
                <span className="text-muted-foreground">
                  Head office & showroom, Lagos, Nigeria
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                <span className="block font-semibold">Opening hours</span>
                <span className="text-muted-foreground">Mon – Sat, 8:00 AM – 6:00 PM</span>
              </span>
            </li>
          </ul>

          <Button asChild size="lg" className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90">
            <a
              href={whatsappLink("Hello Lumora, I need a quote.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </Button>
        </div>

        <form
          className="rounded-xl border border-border bg-card p-6 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.email || !form.message) {
              toast.error("Please fill in all fields.");
              return;
            }
            toast.success("Message sent", { description: "We'll reply within one business day." });
            setForm({ name: "", email: "", message: "" });
          }}
        >
          <h2 className="font-display text-lg font-bold">Send an enquiry</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="c-name">Full name</Label>
              <Input
                id="c-name"
                className="mt-2"
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-email">Email address</Label>
              <Input
                id="c-email"
                type="email"
                className="mt-2"
                maxLength={120}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-msg">How can we help?</Label>
              <Textarea
                id="c-msg"
                rows={6}
                maxLength={1000}
                className="mt-2"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
