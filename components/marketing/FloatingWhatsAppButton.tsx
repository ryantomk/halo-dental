"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "918547085403";
const DEFAULT_MESSAGE = "Hi, I would like to book an appointment at Halo Dental.";

export default function FloatingWhatsAppButton() {
  const t = useTranslations("floating");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <aside aria-label={t("whatsappAria")} className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappAria")}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-[#20ba5c] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-12" aria-hidden="true" />
        {/* Tooltip for desktop */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-brand-midnight/90 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hidden sm:inline-block">
          {t("whatsappTooltip")}
        </span>
      </a>
    </aside>
  );
}
