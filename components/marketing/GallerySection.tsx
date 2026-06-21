import Image from "next/image";

interface GalleryItem {
  image: string;
  alt: string;
  category: string;
  caption: string;
}

// Placeholder image paths — drop the real files into /public/images using
// these exact names and the gallery is fully wired, no code changes needed.
const GALLERY_ITEMS: GalleryItem[] = [
  {
    image: "/images/gallery-1.jpg",
    alt: "Patient's smile after a smile makeover",
    category: "Smile makeovers",
    caption: "A complete smile transformation.",
  },
  {
    image: "/images/gallery-2.jpg",
    alt: "Patient's teeth after a professional whitening treatment",
    category: "Teeth whitening",
    caption: "Several shades brighter in one visit.",
  },
  {
    image: "/images/gallery-3.jpg",
    alt: "Patient's smile after porcelain veneers",
    category: "Veneers",
    caption: "Natural-looking, perfectly even veneers.",
  },
  {
    image: "/images/gallery-4.jpg",
    alt: "Patient's teeth after clear aligner treatment",
    category: "Clear aligners",
    caption: "Straighter teeth, virtually invisible along the way.",
  },
  {
    image: "/images/gallery-5.jpg",
    alt: "Patient's smile after metal braces treatment",
    category: "Metal braces",
    caption: "A confident new smile after treatment.",
  },
  {
    image: "/images/gallery-6.jpg",
    alt: "Patient's smile after a dental implant procedure",
    category: "Dental implants",
    caption: "A secure, natural-looking replacement tooth.",
  },
];

export default function GallerySection() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="gallery-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
            Smiles we&rsquo;ve helped create
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            A look at real treatments and the results they helped achieve.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <li key={item.image}>
              <figure className="overflow-hidden rounded-lg border border-brand-charcoal/10 bg-brand-ivory shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-brand-midnight/85 px-3 py-1 text-xs font-medium text-white">
                    {item.category}
                  </span>
                </div>
                <figcaption className="p-4 text-[15px] leading-relaxed text-brand-charcoal/80 sm:p-5">
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}