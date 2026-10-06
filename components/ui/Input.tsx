/**
 * Design System Input Primitive
 *
 * WHAT THIS FILE DOES:
 * Standardized text/number/email/tel input with label, error message, and focus states.
 *
 * WHY THIS FILE EXISTS:
 * Ensures consistent form field styling and accessible error messaging across all forms.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * BookingForm, ContactForm, Admin editors, and Auth login forms.
 *
 * SAFE TO CHANGE:
 * Border radius, input padding, placeholder color, ring styles.
 *
 * BE CAREFUL:
 * Preserving the ref forwarding for React Hook Form integration.
 */

import React, { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type = "text", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-brand-charcoal/80"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "w-full rounded-xl border border-brand-charcoal/20 bg-white px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/40 transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:bg-brand-linen/40 disabled:opacity-60",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-brand-charcoal/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
