import type { NextConfig } from "next";
import { redirects } from "./content/redirects";

const indexing = process.env.SITE_INDEXING === "on";
const canonicalHost = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://highlandcabinetry.com").hostname;
const hostPattern = `(${canonicalHost.replace(/\./g, "\\.")}|localhost|127\\.0\\.0\\.1)`;

// STATIC_EXPORT=1 builds the portable fallback (scripts/build-static-fallback.mjs): plain files that any static
// host can serve. Redirects, headers and the lead API are then provided by the host config the script writes.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const, distDir: ".next-static" } : {}),
  // The previous site used trailing slashes on every path; keep them so URLs are preserved exactly.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [48, 96, 160, 240, 360],
  },
  ...(staticExport ? {} : { headers, redirects: async () => redirects }),
};

async function headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    // Staging protection: every response carries noindex unless SITE_INDEXING=on.
    const robots = indexing ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }];
    // Production: only the canonical host is indexable. The same build served from *.vercel.app or any
    // other host answers noindex, so deployment URLs never compete with the real domain.
    const otherHosts = indexing
      ? [{ source: "/:path*", missing: [{ type: "host" as const, value: hostPattern }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
      : [];
    return [
      { source: "/:path*", headers: [...security, ...robots] },
      ...otherHosts,
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
}

export default nextConfig;
