/**
 * Design System Card Primitive
 *
 * WHAT THIS FILE DOES:
 * Card container with optional header, title, description, content, and footer subcomponents.
 *
 * WHY THIS FILE EXISTS:
 * Provides structured surface backgrounds (ivory/white with subtle brand borders) for panels.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * BookingForm, StatCards, TestimonialCard, and Admin widgets.
 *
 * SAFE TO CHANGE:
 * Background tint, border opacity, shadow intensity.
 *
 * BE CAREFUL:
 * Subcomponent composition hierarchy.
 */

import React, { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm transition-all",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col space-y-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-xl font-semibold leading-none tracking-tight text-brand-charcoal", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-brand-charcoal/60", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex items-center pt-4 border-t border-brand-charcoal/10", className)} {...props} />;
}

export default Card;
