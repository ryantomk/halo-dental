import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Root layout — applies to both the localized public site and /admin.
// Per-locale <html lang> is set one level down in app/[locale]/layout.tsx;
// /admin sets it directly since it isn't localized.

export const metadata: Metadata = {
  title: "Halo Dental Cosmetic & Orthodontic Centre",
  description:
    "Premium cosmetic and orthodontic dental care in Angadipuram, Malappuram, Kerala.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
