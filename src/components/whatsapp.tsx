import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "2348030000000";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hello BN Electricals, I'd like to make an enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[oklch(0.62_0.16_150)] px-4 py-3 text-sm font-semibold text-white shadow-premium transition-transform hover:scale-105"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp support</span>
    </a>
  );
}
