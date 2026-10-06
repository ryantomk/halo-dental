/**
 * Design System Badge Primitive
 *
 * WHAT THIS FILE DOES:
 * Renders small status badges (e.g. "Pending", "Confirmed", "Cancelled") with semantic colors.
 *
 * WHY THIS FILE EXISTS:
 * Used across the dashboard and booking summaries to display appointment and moderation statuses.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Admin BookingsTable, BookingDetailModal, TestimonialModerationRow, and Service Cards.
 *
 * SAFE TO CHANGE:
 * Color shades, font sizes, padding.
 *
 * BE CAREFUL:
 * Preserving the status mapping keys matching the database enums.
 */

import React, { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "pending" | "confirmed" | "cancelled" | "completed" | "no_show" | "gold";
}

export default function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-brand-charcoal/10 text-brand-charcoal border-brand-charcoal/15",
    pending: "bg-amber-50 text-amber-800 border-amber-300",
    confirmed: "bg-emerald-50 text-emerald-800 border-emerald-300",
    cancelled: "bg-red-50 text-red-800 border-red-300",
    completed: "bg-blue-50 text-blue-800 border-blue-300",
    no_show: "bg-gray-100 text-gray-700 border-gray-300",
    gold: "bg-brand-gold/15 text-brand-charcoal border-brand-gold/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
