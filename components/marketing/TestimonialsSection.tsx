import { Quote, Star } from "lucide-react";

interface Testimonial {
  name: string;
  treatment: string;
  rating: number;
  quote: string;
}

// Realistic placeholder copy — swap for real, admin-approved rows from the
// `testimonials` table (see technical spec Section 10) once patients have
// submitted reviews. Names are first-name + last-initial only, matching
// how the admin moderation flow is expected to format attribution.
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Fathima K.",
    treatment: "Smile makeover",
    rating: 5,
    quote:
      "I'd put off fixing my smile for years out of nerves, but Dr. Haseeb walked me through every step before we started. The result still doesn't feel real — I catch myself smiling in photos again.",
  },
  {
    name: "Arjun M.",
    treatment: "Clear aligners",
    rating: 5,
    quote:
      "Barely anyone at work noticed I was wearing aligners, which is exactly what I wanted. Comfortable, easy to keep clean, and my teeth are visibly straighter after just a few months.",
  },
  {
    name: "Sarah T.",
    treatment: "Dental implant",
    rating: 5,
    quote:
      "I was anxious about the implant procedure, but the team made it painless and explained the healing process clearly. Eating and speaking normally again has been such a relief.",
  },
];

export default function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-brand-linen py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="testimonials-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
            What our patients say
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            A few words from people who&rsquo;ve trusted us with their smiles.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name}>
              <figure className="flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm sm:p-7">
                <Quote className="h-7 w-7 text-brand-gold/40" aria-hidden="true" />

                <div role="img" aria-label={`Rated ${testimonial.rating} out of 5 stars`} className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      className={
                        index < testimonial.rating
                          ? "h-4 w-4 fill-brand-gold text-brand-gold"
                          : "h-4 w-4 fill-transparent text-brand-charcoal/20"
                      }
                    />
                  ))}
                </div>

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-brand-charcoal/80">
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </blockquote>

                <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-brand-charcoal/10 pt-4">
                  <p className="font-medium text-brand-charcoal">{testimonial.name}</p>
                  <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-charcoal">
                    {testimonial.treatment}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}