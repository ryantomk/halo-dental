import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn-style classname helper — merges conditional Tailwind
// classes without specificity conflicts. Used throughout components/ui.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
