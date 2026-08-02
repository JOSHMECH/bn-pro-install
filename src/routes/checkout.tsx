import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Banknote, CheckCircle2, CreditCard, Lock, Smartphone, Truck } from "lucide-react";
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
import { TIME_SLOTS } from "./booking";

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
      { property: "og:description", content: "Card, transfer and USSD payments with scheduled installation." },
    ],
  }),
  component: Checkout;
});

function Checkout() {
  return null;
}
