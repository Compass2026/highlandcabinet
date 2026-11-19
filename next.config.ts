import type { NextConfig } from "next";
import { redirects } from "./content/redirects";

const indexing = process.env.SITE_INDEXING === "on";

const nextConfig: NextConfig = {
  // The previous site used trailing slashes on every path; keep them so URLs are preserved exactly.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [48, 96, 160, 240, 360],
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    // Staging protection: every response carries noindex unless SITE_INDEXING=on.
    const robots = indexing ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    return [
      { source: "/:path*", headers: [...security, ...robots] },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
