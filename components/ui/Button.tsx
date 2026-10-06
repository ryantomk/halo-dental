/**
 * Design System Button Primitive
 *
 * WHAT THIS FILE DOES:
 * Provides a standardized button component with Primary (gold fill), Secondary (outline),
 * and Ghost variants, plus loading spinner and disabled state handling.
 *
 * WHY THIS FILE EXISTS:
 * Enforces unified styling, focus states, and accessibility across all CTA buttons.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Used across the entire site (Hero, Header, BookingForm, Service Cards, Admin actions).
 *
 * SAFE TO CHANGE:
 * Padding, radius, transition speeds, hover color shades.
 *
 * BE CAREFUL:
 * Changing the variant names or omitting the button type attribute.
 */

import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variantStyles = {
      primary:
        "bg-brand-gold text-brand-charcoal hover:bg-brand-gold-dark shadow-sm focus-visible:ring-brand-gold",
      secondary:
        "border border-brand-charcoal/20 bg-transparent text-brand-charcoal hover:bg-brand-linen/60 hover:border-brand-gold focus-visible:ring-brand-gold",
      ghost:
        "bg-transparent text-brand-charcoal hover:bg-brand-linen/50 focus-visible:ring-brand-charcoal/30",
      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-600",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-xl gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
