import { useTranslations } from "next-intl";
import { Clock, ListChecks, UserCheck, Languages } from "lucide-react";

export default function TrustStrip() {
  const t = useTranslations("trustStrip");

  const pillars = [
    {
      icon: Clock,
      title: t("hoursTitle"),
      description: t("hoursDesc"),
    },
    {
      icon: ListChecks,
      title: t("treatmentsTitle"),
      description: t("treatmentsDesc"),
    },
    {
      icon: UserCheck,
      title: t("doctorTitle"),
      description: t("doctorDesc"),
    },
    {
      icon: Languages,
      title: t("bilingualTitle"),
      description: t("bilingualDesc"),
    },
  ];

  return (
    <section
      aria-label="Clinic highlights"
      className="border-y border-brand-charcoal/10 bg-brand-linen py-6 sm:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold">
                <pillar.icon className="h-5 w-5 text-brand-charcoal" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold text-brand-charcoal sm:text-base">
                  {pillar.title}
                </h3>
                <p className="mt-0.5 text-xs text-brand-charcoal/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
