import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n-request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Supabase Storage public bucket URLs — tighten to the exact
        // project hostname once the Supabase project is created.
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
