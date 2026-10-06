/**
 * Design System Select Primitive
 *
 * WHAT THIS FILE DOES:
 * Standardized dropdown select field with label, error display, and chevron styling.
 *
 * WHY THIS FILE EXISTS:
 * Ensures dropdown menus (service selection, doctor selection) follow brand styling.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * BookingForm (Service dropdown), Admin filtering, and Service category filters.
 *
 * SAFE TO CHANGE:
 * Border radius, padding, chevron icon sizing.
 *
 * BE CAREFUL:
 * Ref forwarding is required for form state management.
 */

import React, { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-brand-charcoal/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              "w-full appearance-none rounded-xl border border-brand-charcoal/20 bg-white px-4 py-2.5 pr-10 text-sm text-brand-charcoal transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:bg-brand-linen/40 disabled:opacity-60",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-brand-charcoal/50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
