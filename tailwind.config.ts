import type { Config } from "tailwindcss";

// Brand tokens transcribed directly from the project + technical
// specifications (Section 2 / Section 7). Do not introduce new colors
// here without updating the spec first.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: "#2C3E50", // Nav bar, hero background, footer, trust strip
          ivory: "#EAE6E0", // Card / section surfaces
          linen: "#F8F6F2", // Page background
          gold: "#C9A96E", // CTAs and accents only — never large fill areas
          charcoal: "#1A252F", // Body text on light surfaces
        },
        status: {
          pending: "#C9A96E",
          confirmed: "#3F7A57",
          cancelled: "#B3473A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"], // Playfair/Cormorant — headlines only
        sans: ["var(--font-sans)", "sans-serif"], // Inter/Manrope — body + UI
        malayalam: ["var(--font-malayalam)", "sans-serif"], // Noto Sans Malayalam
      },
      borderRadius: {
        md: "8px", // buttons / inputs
        lg: "16px", // cards / images
      },
    },
  },
  plugins: [],
};

export default config;
