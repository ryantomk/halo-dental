import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, Clock, Languages, ListChecks, type LucideIcon } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

const HIGHLIGHTS = ["Modern digital dentistry", "Cosmetic dentistry", "Orthodontics", "Patient-first approach"];

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

// Grounded in what the practice actually offers (sitemap + hours), rather
// than experience/patient-count figures nobody's confirmed yet.
const STATS: Stat[] = [
  { icon: Clock, value: "7", label: "Days a week — 9 AM to 8 PM" },
  { icon: ListChecks, value: "11", label: "Specialised treatments under one roof" },
  { icon: Languages, value: "2", label: "Languages spoken: English & Malayalam" },
];

export default async function AboutSection() {
  // Server Component — same locale-derivation approach as ServiceGrid.tsx.
  const locale = await getLocale();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return (
    <section aria-labelledby="about-heading" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Professional image area — placeholder treatment until real
              clinic/Dr. Haseeb photography is available; swap the panel
              below for a Next.js <Image> once that exists. */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-midnight to-[#10161c] sm:aspect-[5/6]">
              <svg
                viewBox="0 0 200 200"
                aria-hidden="true"
                focusable="false"
                className="absolute inset-0 h-full w-full opacity-20"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#C9A96E"
                  strokeWidth="1.5"
                  strokeDasharray="430 90"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-midnight/95 to-transparent p-6 sm:p-8">
                <p className="font-display text-xl text-white">Dr. Haseeb</p>
                <p className="mt-1 text-sm text-white/70">Chief Dental Surgeon</p>
              </div>
            </div>

            <div className="absolute -bottom-6 right-4 hidden max-w-[15rem] items-start gap-3 rounded-xl border border-brand-charcoal/10 bg-brand-ivory p-4 shadow-lg sm:flex">
              <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold/15">
                <CheckCircle2 className="h-5 w-5 text-brand-gold" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-brand-charcoal">Modern digital dentistry, every visit</p>
            </div>
          </div>

          {/* About content */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-brand-charcoal/70">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
              About the clinic
            </div>

            <h2 id="about-heading" className="mt-3 font-display text-3xl text-brand-charcoal sm:text-4xl">
              Care led by Dr. Haseeb
            </h2>

            <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
              Dr. Haseeb leads every treatment plan at Halo Dental, pairing modern digital dentistry
              with a calm, patient-first approach — so every visit feels considered, never rushed.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[15px] text-brand-charcoal">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={`${prefix}/about`}
              className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Learn more about Dr. Haseeb
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:mt-20">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 text-center sm:text-left"
            >
              <stat.icon className="mx-auto h-6 w-6 text-brand-gold sm:mx-0" aria-hidden="true" />
              <p className="mt-3 font-display text-3xl text-brand-charcoal">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-charcoal/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}